
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


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
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: error.response?.data || error.message });
  }
});


app.post("/generate-playlist", async (req, res) => {
  const { moods = [], genres = [], eras = [], accessToken } = req.body;

  // Build strings from arrays
  const mood = moods.join(", ") || "any";
  const genre = genres.join(", ") || "any";
  const era = eras.join(", ") || "any";

  console.log("Received access token:", accessToken);

  try {

    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a music expert. Recommend 10 songs based on user preferences.",
          },
          {
            role: "user",
            content: `
Recommend 10 songs on Spotify that match the mood "${mood}", genre "${genre}", and era "${era}".
Return ONLY one song per line, in the exact format: "Song Title" by Artist
(no numbers, no extra punctuation). Additionally, if there are multiple artists, use "&" instead of "and".
            `
          },
        ],
        temperature: 0.7,
      },
      {
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      }
    );

    const rawGPT = openaiResponse.data.choices[0].message.content;
    console.log("Raw GPT output:\n", rawGPT);

    const songs = rawGPT
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean);

    const removeQuotes = (str) => str.replace(/"/g, "").trim();


    const trackURIs = [];
    for (const line of songs) {

      let [rawTitle, rawArtist] = line.split(" by ");
      if (!rawTitle || !rawArtist) {
        console.log("Skipping invalid line:", line);
        continue;
      }

      let title = removeQuotes(rawTitle);
      let artist = removeQuotes(rawArtist);


      artist = artist.replace(/\(?(ft\.|feat\.|featuring)\)?\.?\s.*$/i, "").trim();

      artist = artist.replace(/[.,!?]+$/, "").trim();

      const searchQuery = `track:"${title}" artist:"${artist}"`;
      console.log("searchQuery:", searchQuery);

      const searchRes = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          q: searchQuery,
          type: "track",
          limit: 1,
        },
      });

      if (searchRes.data.tracks.items.length > 0) {
        trackURIs.push(searchRes.data.tracks.items[0].uri);
      }
    }


    const userRes = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const userId = userRes.data.id;

    const playlistRes = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      { name: `Mood: ${mood} - ${genre} (${era})`, public: false },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );


    if (trackURIs.length > 0) {
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistRes.data.id}/tracks`,
        { uris: trackURIs },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    }


    const finalSongs = songs.map((line, index) => {
      const [rawTitle, rawArtist] = line.split(" by ");
      return {
        id: index + 1,
        title: removeQuotes(rawTitle || `Track ${index + 1}`),
        artist: removeQuotes(rawArtist || "Unknown Artist"),
      };
    });

    res.json({
      message: "Playlist created!",
      playlistUrl: playlistRes.data.external_urls.spotify,
      songs: finalSongs,
    });

  } catch (error) {
    console.error("🎯 Full Error:", error);
    console.error("🛑 Axios Error Response:", error.response?.data);
    res.status(500).json({ error: error.response?.data || "Something went wrong generating the playlist" });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
