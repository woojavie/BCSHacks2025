import * as React from "react";
import { Link } from 'react-router-dom';
import Layout from "../components/Layout";
import { Button } from '../components/ui/button';

const LandingPage: React.FC = () => {
  const handleLogin = () => {
    const clientId = "9f6846269fd8466aa22093a8d0e0c018";
    const redirectUri = "http://localhost:8080/callback";
    const scope = "playlist-modify-private user-read-private";
  
    const authUrl = `https://accounts.spotify.com/authorize` +
      `?client_id=${encodeURIComponent(clientId)}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scope)}` +
      `&show_dialog=true`;
  
    window.location.href = authUrl;
  };

  return (
    <Layout>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Center title */}
        <div className="centered-title">
          <h1 className="text-8xl sm:text-9xl md:text-[10rem] lg:text-[12rem] xl:text-[15rem] font-serif font-bold text-white tracking-tighter">
            Vibeify
          </h1>
        </div>

        {/* Bottom left corner - Get Started button */}
        <div className="bottom-corner-left">
          <Link to="/mood-selector">
            <Button 
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-6 text-xl rounded-full shadow-lg transition-all hover:shadow-xl"
            >
              Signup
            </Button>
          </Link>
        </div>

        {/* Bottom right corner - Login button */}
        <div className="bottom-corner-right">
          <Button 
            variant="ghost"
            onClick={handleLogin}
            className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-6 text-xl rounded-full shadow-lg transition-all hover:shadow-xl"
          >
            Login
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default LandingPage;
