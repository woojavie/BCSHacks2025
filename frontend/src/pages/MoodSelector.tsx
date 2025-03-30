
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { 
  Smile, 
  Frown, 
  Music, 
  Heart, 
  Headphones 
} from 'lucide-react';

interface MoodOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const MoodSelector: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);

  const moodOptions: MoodOption[] = [
    { id: 'chill', name: 'Chill', icon: <Music className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'happy', name: 'Happy', icon: <Smile className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'sad', name: 'Sad', icon: <Frown className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'energetic', name: 'Energetic', icon: <Music className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'romantic', name: 'Romantic', icon: <Heart className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
    { id: 'focused', name: 'Focused', icon: <Headphones className="h-5 w-5" />, color: 'bg-blue-100 text-blue-800' },
  ];

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId) 
        : [...prev, moodId]
    );
  };

  const handleGeneratePlaylist = () => {
    navigate('/recommended-songs');
  };

  return (
    <Layout>
      <div className="w-full max-w-3xl">
        <div className="bg-gradient-to-br from-[#1EAEDB] via-[#33C3F0] to-[#0FA0CE] rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-8 text-center tracking-wide">
            What's your vibe today?
          </h1>
          
          <p className="text-center opacity-80 mb-8">
            Select one or more moods that match how you're feeling right now.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {moodOptions.map((mood) => (
              <button
                key={mood.id}
                onClick={() => toggleMood(mood.id)}
                className={`flex flex-col items-center justify-center p-5 rounded-xl transition-all ${
                  selectedMoods.includes(mood.id)
                    ? 'bg-white/30 border-2 border-white scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <div className={`rounded-full p-3 ${selectedMoods.includes(mood.id) ? 'bg-white/40' : 'bg-white/20'}`}>
                  {mood.icon}
                </div>
                <span className="mt-2 font-medium">{mood.name}</span>
              </button>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleGeneratePlaylist}
              disabled={selectedMoods.length === 0}
              className={`px-8 py-6 rounded-full text-white transition-all ${
                selectedMoods.length > 0
                  ? 'bg-white/30 hover:bg-white/40 hover:shadow-xl hover:scale-105'
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              Generate Playlist
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MoodSelector;
