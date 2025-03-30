
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

  // Placeholder song data
  const songs: Song[] = [
    { id: '1', title: 'Dreamy Nights', artist: 'Luna Wave' },
    { id: '2', title: 'Pastel Skies', artist: 'The Gradients' },
    { id: '3', title: 'Emotional Motion', artist: 'Echo Chamber' },
    { id: '4', title: 'Floating Through', artist: 'Ambient Dreams' },
    { id: '5', title: 'Sunset Feelings', artist: 'Chill Collective' },
    { id: '6', title: 'Soft Petals', artist: 'Flower Child' },
    { id: '7', title: 'Gentle Rain', artist: 'Nature Sounds' },
    { id: '8', title: 'Twilight Hour', artist: 'Midnight Band' },
    { id: '9', title: 'Rainbow Haze', artist: 'Color Theory' },
    { id: '10', title: 'Daydreamer', artist: 'Mind Escape' },
  ];

  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="glass rounded-3xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-purple-900 mb-2 text-center tracking-wide">
            Here's your Vibeify!
          </h1>
          
          <p className="text-center text-purple-800/80 mb-8">
            We've curated these songs based on your mood selection.
          </p>
          
          <div className="space-y-3 mb-8">
            {songs.map((song) => (
              <div 
                key={song.id}
                className="bg-white/40 hover:bg-white/60 p-4 rounded-xl flex items-center transition-all hover:scale-[1.02]"
              >
                <div className="bg-purple-100 rounded-full p-2 mr-4">
                  <Music className="h-5 w-5 text-purple-800" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-purple-900">{song.title}</h3>
                  <p className="text-sm text-purple-800/80">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate('/mood-selector')}
              variant="outline"
              className="flex items-center gap-2 bg-white/50 border-purple-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Mood Selection
            </Button>
            
            <Button
              onClick={() => {
                // Generate a new playlist - in a real app this would hit an API
                // For now we'll just refresh the page
                window.scrollTo(0, 0);
              }}
              className="bg-purple-700 hover:bg-purple-800 text-white"
            >
              Generate Another
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RecommendedSongs;
