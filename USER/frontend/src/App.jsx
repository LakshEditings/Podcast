import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import PlayerBar from './components/PlayerBar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Search from './pages/Search';
import PodcastDetail from './pages/PodcastDetail';
import Player from './pages/Player';
import Categories from './pages/Categories';
import Library from './pages/Library';
import Profile from './pages/Profile';

function AppContent() {
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const location = useLocation();
  const hideNav = ['/login', '/signup', '/player'].includes(location.pathname);

  const handlePlay = (podcast) => {
    setCurrentPodcast(podcast);
    setIsPlaying(true);
  };
  const togglePlay = () => setIsPlaying(p => !p);

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home onPlay={handlePlay} />} />
        <Route path="/search" element={<Search onPlay={handlePlay} />} />
        <Route path="/podcast/:id" element={<PodcastDetail onPlay={handlePlay} />} />
        <Route path="/player" element={<Player currentPodcast={currentPodcast} isPlaying={isPlaying} onTogglePlay={togglePlay} />} />
        <Route path="/categories" element={<Categories onPlay={handlePlay} />} />
        <Route path="/library" element={<Library />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {!hideNav && <PlayerBar currentPodcast={currentPodcast} isPlaying={isPlaying} onTogglePlay={togglePlay} />}
      {!hideNav && <Navbar />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
