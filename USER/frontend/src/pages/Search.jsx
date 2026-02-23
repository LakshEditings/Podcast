import { useState, useEffect } from 'react';
import { FiSearch, FiMic, FiX } from 'react-icons/fi';
import PodcastCard from '../components/PodcastCard';

const API = 'http://localhost:5001/api';
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese'];

export default function Search({ onPlay }) {
    const [query, setQuery] = useState('');
    const [lang, setLang] = useState('All');
    const [listening, setListening] = useState(false);
    const [podcasts, setPodcasts] = useState([]);

    useEffect(() => {
        fetch(`${API}/podcasts`)
            .then(r => r.json())
            .then(data => setPodcasts(data))
            .catch(() => { });
    }, []);

    const filtered = podcasts.filter(p => {
        const mq = !query || p.title.toLowerCase().includes(query.toLowerCase()) || (p.creatorName || '').toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
        const ml = lang === 'All' || p.language === lang;
        return mq && ml;
    });

    const handleVoice = () => {
        setListening(l => !l);
        if (!listening) setTimeout(() => { setQuery('Tech'); setListening(false); }, 2000);
    };

    return (
        <>
            <style>{`
        .page-container { max-width:1200px; margin:0 auto; padding:24px 20px 120px; }
        .page-title { font-size:1.5rem; font-weight:800; margin-bottom:20px; }
        .search-bar-full { display:flex; align-items:center; gap:10px; padding:6px 8px 6px 18px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); margin-bottom:16px; transition:var(--transition); }
        .search-bar-full:focus-within { border-color:var(--primary); }
        .search-bar-full input { flex:1; background:transparent; color:var(--text-primary); padding:12px 0; font-size:0.9rem; }
        .search-bar-full input::placeholder { color:var(--text-muted); }
        .clear-btn { width:28px; height:28px; border-radius:50%; background:var(--bg-input); color:var(--text-muted); display:flex; align-items:center; justify-content:center; }
        .voice-btn-sm { width:36px; height:36px; border-radius:50%; background:var(--bg-input); color:var(--text-primary); display:flex; align-items:center; justify-content:center; transition:var(--transition); }
        .voice-btn-sm.active { background:var(--danger); color:white; animation:pulse 1s ease infinite; }
        .lang-filter { display:flex; gap:8px; overflow-x:auto; padding-bottom:8px; margin-bottom:20px; -ms-overflow-style:none; scrollbar-width:none; }
        .lang-filter::-webkit-scrollbar { display:none; }
        .lang-chip { padding:8px 16px; border-radius:20px; white-space:nowrap; background:var(--bg-card); color:var(--text-muted); font-size:0.78rem; font-weight:600; border:1px solid var(--border); transition:var(--transition); }
        .lang-chip.active { background:var(--primary); color:white; border-color:var(--primary); }
        .search-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .empty-state { text-align:center; padding:60px 20px; color:var(--text-muted); }
        .empty-state span { font-size:3rem; display:block; margin-bottom:12px; }
        @media(max-width:480px) { .search-grid { grid-template-columns:1fr; } }
      `}</style>
            <div className="page-container">
                <h1 className="page-title fade-in">Search</h1>
                <div className="search-bar-full fade-in">
                    <FiSearch size={18} />
                    <input placeholder="Search podcasts, creators..." value={query} onChange={e => setQuery(e.target.value)} />
                    {query && <button className="clear-btn" onClick={() => setQuery('')}><FiX size={16} /></button>}
                    <button className={`voice-btn-sm ${listening ? 'active' : ''}`} onClick={handleVoice}><FiMic size={16} /></button>
                </div>
                <div className="lang-filter fade-in">
                    <button className={`lang-chip ${lang === 'All' ? 'active' : ''}`} onClick={() => setLang('All')}>All</button>
                    {languages.map(l => <button key={l} className={`lang-chip ${lang === l ? 'active' : ''}`} onClick={() => setLang(l)}>{l}</button>)}
                </div>
                <div className="search-grid">{filtered.map(p => <PodcastCard key={p._id} podcast={p} onPlay={onPlay} />)}</div>
                {filtered.length === 0 && <div className="empty-state fade-in"><span>🔍</span><p>No podcasts found</p></div>}
            </div>
        </>
    );
}
