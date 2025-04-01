
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Smile, 
  Frown, 
  Music, 
  Heart, 
  Headphones, 
  Plus,
  ArrowRight
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
  const [customMood, setCustomMood] = useState<string>('');

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

  const handleCustomMoodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomMood(e.target.value);
  };

  const addCustomMood = () => {
    if (customMood.trim() !== '') {
      const customMoodId = `custom-${customMood.trim()}`;
      if (!selectedMoods.includes(customMoodId)) {
        setSelectedMoods(prev => [...prev, customMoodId]);
      }
      setCustomMood('');
    }
  };

  const handleNext = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/save-moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moods: selectedMoods }),
      });
  
      if (!response.ok) throw new Error('Failed to save moods');
  
      // Optionally store in localStorage too
      localStorage.setItem('selectedMoods', JSON.stringify(selectedMoods));
  
      navigate('/genre-era-selector');
    } catch (error) {
      console.error('Error saving moods:', error);
      alert('Failed to save mood data.');
    }
  };
  

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">  
        <div className="bg-gradient-to-br from-[#1EAEDB] via-[#33C3F0] to-[#0FA0CE] rounded-3xl p-8 md:p-12 text-white shadow-xl">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-8 text-center tracking-wide">
            What's your vibe today?
          </h1>
          
          <p className="text-center opacity-80 mb-8">
            Select one mood that match how you're feeling right now
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
          
          {/* Custom Mood Input Section */}
          <div className="mb-8">
            <p className="text-center text-white opacity-80 mb-4">
              or add your own mood:
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input 
                value={customMood}
                onChange={handleCustomMoodChange}
                placeholder="Enter your mood..."
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-white"
                onKeyDown={(e) => e.key === 'Enter' && addCustomMood()}
              />
              <Button 
                onClick={addCustomMood}
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white p-2"
                disabled={!customMood.trim()}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Display custom moods */}
            {selectedMoods.filter(mood => mood.startsWith('custom-')).length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {selectedMoods
                  .filter(mood => mood.startsWith('custom-'))
                  .map(customId => (
                    <div 
                      key={customId}
                      className="bg-white/30 px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{customId.replace('custom-', '')}</span>
                      <button 
                        onClick={() => toggleMood(customId)}
                        className="ml-1 rounded-full h-5 w-5 flex items-center justify-center bg-white/20 hover:bg-white/40 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={selectedMoods.length === 0}
              className={`px-8 py-6 rounded-full text-white transition-all ${
                selectedMoods.length > 0
                  ? 'bg-white/30 hover:bg-white/40 hover:shadow-xl hover:scale-105'
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div> {/* Close max-w-3xl */}
  </Layout>
  );
};

export default MoodSelector;
