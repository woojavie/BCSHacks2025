import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Music, 
  Clock,
  Mic2,
  Plus,
} from 'lucide-react';

interface CategoryOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const GenreEraSelector: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [customGenre, setCustomGenre] = useState<string>('');
  const [customEra, setCustomEra] = useState<string>('');

  const genreOptions: CategoryOption[] = [
    { id: 'pop', name: 'Pop', icon: <Music className="h-5 w-5" /> },
    { id: 'hiphop', name: 'Hip Hop', icon: <Mic2 className="h-5 w-5" /> },
    { id: 'jazz', name: 'Jazz', icon: <Music className="h-5 w-5" /> },
    { id: 'rnb', name: 'R&B', icon: <Mic2 className="h-5 w-5" /> },
  ];

  const eraOptions: CategoryOption[] = [
    { id: '1990s', name: '1990s', icon: <Clock className="h-5 w-5" /> },
    { id: '2000s', name: '2000s', icon: <Clock className="h-5 w-5" /> },
    { id: '2010s', name: '2010s', icon: <Clock className="h-5 w-5" /> },
    { id: '2020s', name: '2020s', icon: <Clock className="h-5 w-5" /> },
  ];


const toggleGenre = (genreId: string) => {
    setSelectedGenres(prev => {
      const updated = prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId];
      console.log('Updated genres:', updated);  // Check state
      return updated;
    });
  };

const toggleEra = (eraId: string) => {
    setSelectedEras(prev => {
      const updated = prev.includes(eraId) ? prev.filter(id => id !== eraId) : [...prev, eraId];
      console.log('Updated eras:', updated);  // Check state
      return updated;
    });
  };

  const handleCustomGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomGenre(e.target.value);
  };

  const handleCustomEraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomEra(e.target.value);
  };

  const addCustomGenre = () => {
    if (customGenre.trim() !== '') {
      const customGenreId = `custom-${customGenre.trim()}`;
      if (!selectedGenres.includes(customGenreId)) {
        setSelectedGenres(prev => [...prev, customGenreId]);
      }
      setCustomGenre('');
    }
  };

  const addCustomEra = () => {
    if (customEra.trim() !== '') {
      const customEraId = `custom-${customEra.trim()}`;
      if (!selectedEras.includes(customEraId)) {
        setSelectedEras(prev => [...prev, customEraId]);
      }
      setCustomEra('');
    }
  };

  const handleGeneratePlaylist = async () => {
    // Store selected genres and eras
    localStorage.setItem('selectedGenres', JSON.stringify(selectedGenres));
    localStorage.setItem('selectedEras', JSON.stringify(selectedEras));
    
    const storedMoods = localStorage.getItem('selectedMoods');
    const moods = storedMoods ? JSON.parse(storedMoods) : [];
    const accessToken = localStorage.getItem('accessToken');
  
    if (!accessToken) {
      alert("Access token is missing. Please log in again.");
      return;
    }
  
    const payload = {
      moods,
      genres: selectedGenres,
      eras: selectedEras,
      accessToken,
    };
  
    try {
      const response = await fetch('http://localhost:5001/generate-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Backend response:", data);

  
      if (data.playlistUrl && data.songs) {
        // Store playlist URL and generated songs in localStorage
        console.log('Storing playlist data:', data);
        localStorage.setItem('playlistUrl', data.playlistUrl);
        localStorage.setItem('recommendedSongs', JSON.stringify(data.songs));        
        navigate('/recommended-songs');
      } else {
        alert('Failed to generate playlist');
      }
    } catch (error) {
      console.error('Error generating playlist:', error);
      alert('Server error');
    }
  };
  
      

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-3xl">
            <div className="bg-gradient-to-br from-[#1EAEDB] via-[#33C3F0] to-[#0FA0CE] rounded-3xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-8 text-center tracking-wide">
                Add to Your Vibe
            </h1>
            {/* Genre Selection */}
            <h2 className="text-2xl font-medium mb-4 text-center">Music Genre</h2>
            <p className="text-center opacity-80 mb-6">
                Select one genre you'd like to hear from
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {genreOptions.map((genre) => (
                <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl transition-all ${
                    selectedGenres.includes(genre.id)
                        ? 'bg-white/30 border-2 border-white scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                >
                    <div className={`rounded-full p-3 ${selectedGenres.includes(genre.id) ? 'bg-white/40' : 'bg-white/20'}`}>
                    {genre.icon}
                    </div>
                    <span className="mt-2 font-medium">{genre.name}</span>
                </button>
                ))}
            </div>
            
            {/* Genre Input */}
            <div className="mb-12">
                <p className="text-center text-white opacity-80 mb-4">
                or add your own genre:
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                <Input 
                    value={customGenre}
                    onChange={handleCustomGenreChange}
                    placeholder="Enter a genre..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-white"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomGenre()}
                />
                <Button 
                    onClick={addCustomGenre}
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white p-2"
                    disabled={!customGenre.trim()}
                >
                    <Plus className="h-5 w-5" />
                </Button>
                </div>
                
                {/* Display custom genres */}
                {selectedGenres.filter(genre => genre.startsWith('custom-')).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {selectedGenres
                    .filter(genre => genre.startsWith('custom-'))
                    .map(customId => (
                        <div 
                        key={customId}
                        className="bg-white/30 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                        <span>{customId.replace('custom-', '')}</span>
                        <button 
                            onClick={() => toggleGenre(customId)}
                            className="ml-1 rounded-full h-5 w-5 flex items-center justify-center bg-white/20 hover:bg-white/40 transition-colors"
                        >
                            ×
                        </button>
                        </div>
                    ))}
                </div>
                )}
            </div>
            
            {/* Era Selection */}
            <h2 className="text-2xl font-medium mb-4 text-center">Music Era</h2>
            <p className="text-center opacity-80 mb-6">
                Select one time period you'd like to hear from
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {eraOptions.map((era) => (
                <button
                    key={era.id}
                    onClick={() => toggleEra(era.id)}
                    className={`flex flex-col items-center justify-center p-5 rounded-xl transition-all ${
                    selectedEras.includes(era.id)
                        ? 'bg-white/30 border-2 border-white scale-105'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                >
                    <div className={`rounded-full p-3 ${selectedEras.includes(era.id) ? 'bg-white/40' : 'bg-white/20'}`}>
                    {era.icon}
                    </div>
                    <span className="mt-2 font-medium">{era.name}</span>
                </button>
                ))}
            </div>
            
            {/* Custom Era Input */}
            <div className="mb-12">
                <p className="text-center text-white opacity-80 mb-4">
                or add your own era:
                </p>
                <div className="flex gap-2 max-w-md mx-auto">
                <Input 
                    value={customEra}
                    onChange={handleCustomEraChange}
                    placeholder="Enter an era..."
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:border-white"
                    onKeyDown={(e) => e.key === 'Enter' && addCustomEra()}
                />
                <Button 
                    onClick={addCustomEra}
                    variant="ghost"
                    className="bg-white/20 hover:bg-white/30 text-white p-2"
                    disabled={!customEra.trim()}
                >
                    <Plus className="h-5 w-5" />
                </Button>
                </div>
                
                {/* Display custom eras */}
                {selectedEras.filter(era => era.startsWith('custom-')).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {selectedEras
                    .filter(era => era.startsWith('custom-'))
                    .map(customId => (
                        <div 
                        key={customId}
                        className="bg-white/30 px-3 py-1 rounded-full flex items-center gap-1"
                        >
                        <span>{customId.replace('custom-', '')}</span>
                        <button 
                            onClick={() => toggleEra(customId)}
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
                onClick={handleGeneratePlaylist}
                disabled={selectedGenres.length === 0 || selectedEras.length === 0}
                className={`px-8 py-6 rounded-full text-white transition-all ${
                    selectedGenres.length > 0 && selectedEras.length > 0
                    ? 'bg-white/30 hover:bg-white/40 hover:shadow-xl hover:scale-105'
                    : 'bg-white/10 cursor-not-allowed'
                }`}
                >
                Generate Playlist
                </Button>
            </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default GenreEraSelector;