import * as React from "react";
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Music, ArrowLeft } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
}

const RecommendedSongs: React.FC = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = React.useState<Song[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('recommendedSongs');
    if (stored) {
      setSongs(JSON.parse(stored));
    }
  }, []);

  const playlistUrl = localStorage.getItem('playlistUrl');

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
          <div className="glass rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-white mb-2 text-center tracking-wide">
          Your Vibeify!
            </h1>
            
            <p className="text-center text-white mb-8">
            We've curated these songs based on your mood selection.
            </p>
            
            <div className="space-y-3 mb-8">
              {songs.map((song) => (
                <div 
                  key={song.id}
                  className="bg-white/40 hover:bg-white/60 p-4 rounded-xl flex items-center transition-all hover:scale-[1.02]"
                >
                  <div className="bg-white rounded-full p-2 mr-4">
                    <Music className="h-5 w-5 text-white-800" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{song.title}</h3>
                    <p className="text-sm text-white/80">{song.artist}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => navigate('/mood-selector')}
                variant="outline"
                className="flex items-center gap-2 bg-white/50 border-purple-300 text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Mood Selection
              </Button>
              
              <Button
  onClick={() => {
    console.log('Attempting to open:', playlistUrl);
    if (playlistUrl) window.open(playlistUrl, '_blank');
  }}
  variant="outline"
  className="flex items-center gap-2 bg-white/50 border-purple-300 text-white"
>
  Open Spotify
</Button>
            </div>
          </div>
        </div> 
      </div>   
    </Layout>
  );
};

export default RecommendedSongs;
