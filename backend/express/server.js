const dotenv = require("dotenv");
dotenv.config()
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
const bodyParser = require("body-parser");
const app = express();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// previously index.js
// basic-spotify-test.js

// Middleware
app.use(express.static('public'));

// Your Spotify API credentials

// Mood to genre mapping
const moodToGenres = { 
    happy: ['pop', 'dance', 'electropop', 'indie-pop'], 
    sad: ['acoustic', 'piano', 'indie', 'singer-songwriter'], 
    energetic: ['edm', 'house', 'rock', 'work-out'], 
    chill: ['lo-fi', 'ambient', 'jazz', 'chill'], 
    romantic: ['r-n-b', 'soul', 'romance'], 
    angry: ['metal', 'hard-rock', 'punk', 'rock'], 
    focused: ['classical', 'ambient', 'piano', 'study'], 
    nostalgic: ['80s', 'classic-rock', 'retro', 'synth-pop'], 
    dreamy: ['dream-pop', 'shoegaze', 'indie', 'ambient'], 
    confident: ['hip-hop', 'rap', 'trap', 'r-n-b'], 
    mellow: ['soul', 'chill', 'jazz', 'indie-r&b'], 
    adventurous: ['indie', 'world-music', 'alternative', 'folk'], 
    anxious: ['ambient', 'acoustic', 'piano', 'lo-fi'], 
    peaceful: ['meditation', 'chill', 'instrumental', 'classical'], 
    flirty: ['r-n-b', 'pop', 'romance', 'dance'], 
    hype: ['trap', 'rap', 'hip-hop', 'edm'], 
    lonely: ['sad', 'acoustic', 'indie', 'piano'], 
    rebellious: ['punk', 'grunge', 'garage-rock', 'metal'], 
    party: ['dance', 'edm', 'pop', 'club']
  };

// Get client credentials token (app-only, no user auth required)
async function getClientCredentialsToken() {
    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
          grant_type: 'client_credentials'
        },
        headers: {
          'Authorization': 'Basic ' + Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting token:', error.response ? error.response.data : error.message);
      throw new Error('Failed to get access token');
    }
  }

// API endpoint to get recommendations based on mood only
app.get('/api/mood-playlist/:mood', async (req, res) => {
    const { mood } = req.params;
    
    if (!mood || !moodToGenres[mood]) {
      return res.status(400).json({ error: 'Invalid or unsupported mood' });
    }
  
    try {
      // Get access token
      const accessToken = await getClientCredentialsToken();
      
      // Use seed genres from the mood
      const seedGenres = moodToGenres[mood].slice(0, 5);
      
      const recommendations = await axios.get('https://api.spotify.com/v1/recommendations', { // jacky addeed this
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          seed_genres: seedGenres.join(','),
          limit: 20,
        },
      });
      
      // Log the response from Spotify
      console.log('Spotify recommendations response:', recommendations.data);
      
      
      // Extract track information for the response
      const tracks = recommendations.data.tracks.map(track => ({
        id: track.id,
        name: track.name,
        artists: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        popularity: track.popularity,
        preview_url: track.preview_url,
        uri: track.uri
      }));
      
      res.json({
        mood,
        seed_genres: seedGenres,
        tracks
      });
    } catch (error) {
      console.error('Error getting recommendations:', error.response ? error.response.data : error.message);
      console.error("Error in /generate-playlist:", error);
      res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to get recommendations' });
    }
  });

/**
 * Helper function to get audio features based on mood
 */
function getMoodAudioFeatures(mood) {
    switch(mood) {
      case 'happy':
        return {
          min_valence: 0.7,
          target_energy: 0.8
        };
      case 'sad':
        return {
          max_valence: 0.4,
          target_energy: 0.3,
          target_tempo: 100
        };
      case 'energetic':
        return {
          min_energy: 0.8,
          target_tempo: 150
        };
      case 'chill':
        return {
          max_energy: 0.4,
          target_acousticness: 0.6
        };
      case 'romantic':
        return {
          target_valence: 0.6,
          target_energy: 0.4,
          target_acousticness: 0.4
        };
      case 'angry':
        return {
          min_energy: 0.7,
          max_valence: 0.4,
          target_tempo: 140
        };
      case 'focused':
        return {
          max_energy: 0.5,
          min_instrumentalness: 0.5
        };
      case 'nostalgic':
        return {
          target_acousticness: 0.5,
          target_valence: 0.5
        };
      case 'dreamy':
        return {
          max_energy: 0.5,
          target_acousticness: 0.6,
          target_instrumentalness: 0.3
        };
      case 'confident':
        return {
          min_energy: 0.6,
          min_valence: 0.5
        };
      case 'mellow':
        return {
          max_energy: 0.5,
          target_acousticness: 0.7
        };
      case 'adventurous':
        return {
          target_energy: 0.7,
          target_valence: 0.6
        };
      case 'anxious':
        return {
          max_energy: 0.4,
          max_valence: 0.4
        };
      case 'peaceful':
        return {
          max_energy: 0.3,
          min_acousticness: 0.6,
          target_instrumentalness: 0.7
        };
      case 'flirty':
        return {
          target_energy: 0.6,
          target_valence: 0.7,
          target_danceability: 0.7
        };
      case 'hype':
        return {
          min_energy: 0.8,
          min_danceability: 0.7,
          target_tempo: 140
        };
      case 'lonely':
        return {
          max_energy: 0.4,
          max_valence: 0.3,
          target_acousticness: 0.7
        };
      case 'rebellious':
        return {
          min_energy: 0.7,
          target_loudness: 0,
          target_tempo: 130
        };
      case 'party':
        return {
          min_danceability: 0.7,
          min_energy: 0.7,
          target_tempo: 120
        };
      default:
        return {};
    }
  }


// mood storage
  app.post('/api/save-moods', (req, res) => { 
    const { moods } = req.body;
  
    if (!Array.isArray(moods) || moods.length === 0) {
      return res.status(400).json({ error: 'No moods provided' });
    }
  
    console.log('Received moods from frontend:', moods);
  
    res.status(200).json({ message: 'Moods received successfully' });
  });




  


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
    console.log("Playlist creation response:", playlistRes.data);



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
    // res.status(500).json({ error: error.response?.data || "Something went wrong generating the playlist" });
    console.error("Error in /generate-playlist:", error);

  // If Spotify sent a detailed error:
  if (error.response) {
    console.error("Error data:", error.response.data);
    console.error("Status code:", error.response.status);
    return res.status(error.response.status).json(error.response.data);
  } else {
    // If it's a lower-level error (no response from Spotify):
    console.error("Error message:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
});
  

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));