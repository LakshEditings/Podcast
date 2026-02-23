import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Analytics from './pages/Analytics';
import Subscribers from './pages/Subscribers';
import Settings from './pages/Settings';
import MyPodcasts from './pages/MyPodcasts';

function AppContent() {
  const location = useLocation();
  const hideNav = ['/login', '/signup'].includes(location.pathname);

  return (
    <>
      <style>{`
        .app-layout { display:flex; min-height:100vh; }
        .app-main { flex:1; margin-left:220px; min-height:100vh; }
        @media(max-width:768px) { .app-main { margin-left:0; padding-bottom:80px; } }
      `}</style>
      {!hideNav && <Sidebar />}
      <main className={hideNav ? '' : 'app-main'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/my-podcasts" element={<MyPodcasts />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/creator">
      <AppContent />
    </BrowserRouter>
  );
}
