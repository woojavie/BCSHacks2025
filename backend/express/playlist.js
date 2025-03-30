import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import querystring from "querystring";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// OAuth - Get Spotify Access Token
app.post("/auth/spotify", async (req, res) => {
  const { code } = req.body;

  const tokenData = querystring.stringify({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await axios.post("https://accounts.spotify.com/api/token", tokenData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response.data });
  }
});

// Generate Playlist using OpenAI and Spotify API
app.post("/generate-playlist", async (req, res) => {
  const { mood, genre, era, accessToken } = req.body;

  // OpenAI prompt
  const openaiResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a music expert. Recommend 10 songs based on user preferences.",
        },
        {
          role: "user",
          content: `Recommend 10 songs that match the mood "${mood}", genre "${genre}", and era "${era}". Return only a period-separated list of song titles and artists.`,
        },
      ],
      temperature: 0.7,
    },
    {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    }
  );
  const songs = openaiResponse.data.choices[0].message.content.split(".");

  // Search for songs on Spotify and get track IDs
  const trackURIs = [];
  for (const song of songs) {
    try {
      const searchRes = await axios.get(`https://api.spotify.com/v1/search`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { q: song.trim(), type: "track", limit: 1 },
      });

      if (searchRes.data.tracks.items.length > 0) {
        trackURIs.push(searchRes.data.tracks.items[0].uri);
      }
    } catch (error) {
      console.error(`Error searching for song: ${song}`, error.response.data);
    }
  }

  // Create a new Spotify playlist
  const userRes = await axios.get("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const userId = userRes.data.id;
  const playlistRes = await axios.post(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    { name: `Mood: ${mood} - ${genre} (${era})`, public: false },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const playlistId = playlistRes.data.id;

  // Add tracks to playlist
  await axios.post(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    { uris: trackURIs },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  res.json({ message: "Playlist created!", playlistUrl: playlistRes.data.external_urls.spotify });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
