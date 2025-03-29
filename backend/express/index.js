// basic-spotify-test.js
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Your Spotify API credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID; // Replace with your client ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET; // Replace with your client secret

// Route to get an access token and make a simple API call
app.get('/test-spotify', async (req, res) => {
  try {
    // Step 1: Get an access token using client credentials flow (no user auth required)
    const tokenResponse = await axios({
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

    const access_token = tokenResponse.data.access_token;
    console.log('Access token obtained:', access_token);

    // Step 2: Make a simple API call (this example searches for tracks)
    const searchResponse = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      params: {
        q: 'despacito', // Example search term
        type: 'track',
        limit: 3
      }
    });

    // Return the API response
    res.json({
      success: true,
      data: searchResponse.data
    });
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    res.status(500).json({
      success: false,
      error: error.response ? error.response.data : error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Test the Spotify API by visiting: http://localhost:${port}/test-spotify`);
});