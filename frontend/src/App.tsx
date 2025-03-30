import React from 'react';
import { Toaster } from "../src/components/ui/toaster";
import { Toaster as Sonner } from "../src/components/ui/sonner";
import { TooltipProvider } from "../src/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import MoodSelector from "./pages/MoodSelector";
import RecommendedSongs from "./pages/RecommendedSongs";
import NotFound from "./pages/NotFound";
import GenreEraSelector from './pages/GenreEraSelector';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/mood-selector" element={<MoodSelector />} />
          <Route path="/genre-era-selector" element={<GenreEraSelector />} />
          <Route path="/recommended-songs" element={<RecommendedSongs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
