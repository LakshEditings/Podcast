import { useState, useEffect } from 'react';
import { FiSearch, FiMic, FiTrendingUp, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PodcastCard from '../components/PodcastCard';

const API = 'http://localhost:5001/api';

export default function Home({ onPlay }) {
    const navigate = useNavigate();
    const h = new Date().getHours();
    const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API}/podcasts`)
            .then(r => r.json())
            .then(data => { setPodcasts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const trending = podcasts.slice(0, 4);
    const recent = [...podcasts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
    const popular = [...podcasts].sort((a, b) => b.subscribers - a.subscribers).slice(0, 4);

    return (
        <>
            <style>{`
        .page-container { max-width:1200px; margin:0 auto; padding:24px 20px 120px; }
        .home-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; }
        .home-greeting { font-size:0.85rem; color:var(--text-muted); margin-bottom:4px; }
        .home-header h1 { font-size:1.6rem; font-weight:800; }
        .home-search-bar { display:flex; align-items:center; gap:12px; padding:4px 6px 4px 18px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); margin-bottom:32px; transition:var(--transition); cursor:pointer; }
        .home-search-bar:focus-within { border-color:var(--primary); box-shadow:0 0 0 3px rgba(92,114,133,0.15); }
        .search-icon { color:var(--text-muted); flex-shrink:0; }
        .home-search-bar input { flex:1; background:transparent; color:var(--text-primary); padding:14px 0; font-size:0.9rem; }
        .home-search-bar input::placeholder { color:var(--text-muted); }
        .voice-btn { width:42px; height:42px; border-radius:50%; background:var(--gradient-primary); color:white; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:var(--transition); }
        .voice-btn:hover { transform:scale(1.08); box-shadow:0 0 16px rgba(92,114,133,0.4); }
        .home-section { margin-bottom:32px; }
        .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .section-title { font-size:1.3rem; font-weight:700; display:flex; align-items:center; gap:8px; }
        .podcast-scroll { display:flex; gap:16px; overflow-x:auto; padding-bottom:8px; scroll-snap-type:x mandatory; -ms-overflow-style:none; scrollbar-width:none; }
        .podcast-scroll::-webkit-scrollbar { display:none; }
        .scroll-item { min-width:200px; scroll-snap-align:start; flex-shrink:0; }
        .grid-2 { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        @media(max-width:480px) { .grid-2 { grid-template-columns:1fr; } }
        .loading-msg { text-align:center; padding:40px; color:var(--text-muted); font-size:0.9rem; }
      `}</style>
            <div className="page-container">
                <div className="home-header fade-in"><div><p className="home-greeting">{greeting} 👋</p><h1>Discover Podcasts</h1></div></div>
                <div className="home-search-bar fade-in" onClick={() => navigate('/search')}>
                    <FiSearch size={18} className="search-icon" />
                    <input type="text" placeholder="Search podcasts, creators, topics..." readOnly />
                    <button className="voice-btn" title="Voice Search"><FiMic size={18} /></button>
                </div>
                {loading ? <p className="loading-msg">Loading podcasts...</p> : (
                    <>
                        <section className="home-section">
                            <div className="section-header"><h2 className="section-title"><FiTrendingUp size={20} /> Trending Now</h2></div>
                            <div className="podcast-scroll">{trending.map(p => <div key={p._id} className="scroll-item"><PodcastCard podcast={p} onPlay={onPlay} /></div>)}</div>
                        </section>
                        <section className="home-section">
                            <div className="section-header"><h2 className="section-title"><FiClock size={20} /> Recently Added</h2></div>
                            <div className="podcast-scroll">{recent.map(p => <div key={p._id} className="scroll-item"><PodcastCard podcast={p} onPlay={onPlay} /></div>)}</div>
                        </section>
                        <section className="home-section">
                            <div className="section-header"><h2 className="section-title">🔥 Most Popular</h2></div>
                            <div className="grid-2">{popular.map(p => <PodcastCard key={p._id} podcast={p} onPlay={onPlay} />)}</div>
                        </section>
                    </>
                )}
            </div>
        </>
    );
}
