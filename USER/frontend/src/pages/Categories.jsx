import { useNavigate } from 'react-router-dom';
import { mockCategories, mockPodcasts } from '../data/mockData';
import PodcastCard from '../components/PodcastCard';
import { useState } from 'react';

export default function Categories({ onPlay }) {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(null);
    const filtered = selected ? mockPodcasts.filter(p => p.category === selected) : [];

    return (
        <>
            <style>{`
        .page-container { max-width:1200px; margin:0 auto; padding:24px 20px 120px; }
        .page-title { font-size:1.5rem; font-weight:800; margin-bottom:20px; }
        .cat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
        .cat-card { display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 12px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); cursor:pointer; transition:var(--transition); }
        .cat-card:hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .cat-card.active { border-color:var(--accent); background:rgba(167,180,158,0.1); }
        .cat-emoji { font-size:2rem; }
        .cat-name { font-size:0.78rem; font-weight:600; text-align:center; }
        .cat-count { font-size:0.65rem; color:var(--text-muted); }
        .cat-results { margin-top:8px; }
        .cat-results-title { font-size:1.1rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; }
        .cat-clear { font-size:0.78rem; color:var(--accent); background:none; font-weight:600; }
        .results-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .empty-msg { text-align:center; padding:40px; color:var(--text-muted); font-size:0.85rem; }
        @media(max-width:480px) { .cat-grid { grid-template-columns:repeat(2,1fr); } .results-grid { grid-template-columns:1fr; } }
      `}</style>
            <div className="page-container">
                <h1 className="page-title fade-in">Browse Categories</h1>
                <div className="cat-grid">
                    {mockCategories.map((c, i) => (
                        <div key={c.name} className={`cat-card fade-in ${selected === c.name ? 'active' : ''}`} style={{ animationDelay: `${i * 0.04}s` }} onClick={() => setSelected(selected === c.name ? null : c.name)}>
                            <span className="cat-emoji">{c.emoji}</span>
                            <span className="cat-name">{c.name}</span>
                            <span className="cat-count">{c.count} podcasts</span>
                        </div>
                    ))}
                </div>
                {selected && (
                    <div className="cat-results fade-in">
                        <div className="cat-results-title"><span>{selected} Podcasts</span><button className="cat-clear" onClick={() => setSelected(null)}>Clear</button></div>
                        {filtered.length > 0 ? <div className="results-grid">{filtered.map(p => <PodcastCard key={p.id} podcast={p} onPlay={onPlay} />)}</div> : <p className="empty-msg">No podcasts in this category yet</p>}
                    </div>
                )}
            </div>
        </>
    );
}
