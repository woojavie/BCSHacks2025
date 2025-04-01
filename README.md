Requirements:
- Ensure that you have the required .env files in both backend and frontend:
  Frontend: CHOKIDAR_USEPOLLING=true
            SPOTIFY_CLIENT_ID="Your Spotify Client ID"
            SPOTIFY_CLIENT_SECRET="Your Spotify Client Secret"
            OPENAI_API_KEY="OPEN AI KEY"
  Backend:  OPENAI_API_KEY="OPEN AI KEY"
            SPOTIFY_CLIENT_ID="Your Spotify Client ID"
            SPOTIFY_CLIENT_SECRET="Your Spotify Client Secret"
            REDIRECT_URI=http://localhost:8080/callback

- Ensure that your Spotify Development Page has the required ports:
            http://localhost:8080/callback
            http://127.0.0.1:5000/api/spotify/callback
            http://localhost:5000/callback

- Currently, you need to be whitelisted by Jacky's Spotify Development to get past the login page

How to Run:

1. Install the necessary packages
2. Run: node server.js in backend/express
   Run: npm start in frontend/
3. Open http://localhost:8080/

