// basic-spotify-test.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const querystring = require('querystring');
const cors = require('cors'); // jacky added this
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // jacky added this
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Your Spotify API credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID; // Replace with your client ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET; // Replace with your client secret

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
          'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
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
    const limit = req.query.limit || 20;
    
    if (!mood || !moodToGenres[mood]) {
      return res.status(400).json({ error: 'Invalid or unsupported mood' });
    }
  
    try {
      // Get access token
      const accessToken = await getClientCredentialsToken();
      
      // Use seed genres from the mood
      const seedGenres = moodToGenres[mood].slice(0, 5);
      
      // Get recommendations based on genres and audio features for the mood
      // const recommendations = await axios.get('https://api.spotify.com/v1/recommendations', { // original
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`
      //   },
      //   params: {
      //     seed_genres: seedGenres.join(','),
      //     limit: limit,
      //     ...getMoodAudioFeatures(mood)
      //   }
      // });
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

  app.post('/api/save-moods', (req, res) => { // jacky added this 
    const { moods } = req.body;
  
    if (!Array.isArray(moods) || moods.length === 0) {
      return res.status(400).json({ error: 'No moods provided' });
    }
  
    console.log('Received moods from frontend:', moods);
  
    res.status(200).json({ message: 'Moods received successfully' });
  });




  

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Try it out: http://localhost:' + port + '/api/mood-playlist/happy');
});