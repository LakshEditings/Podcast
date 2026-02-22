import { FiPlay } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function PodcastCard({ podcast, onPlay }) {
    const navigate = useNavigate();
    const colors = ['#5C7285', '#818C78', '#A7B49E', '#7a6b5d', '#6b7a8a'];
    const color = colors[podcast.id % colors.length];
    return (
        <>
            <style>{`
        .podcast-card { overflow:hidden; cursor:pointer; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border); transition:var(--transition); }
        .podcast-card:hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .podcast-card-cover { position:relative; height:140px; display:flex; align-items:center; justify-content:center; border-radius:var(--radius-lg) var(--radius-lg) 0 0; }
        .podcast-card-emoji { font-size:2.8rem; filter:drop-shadow(0 4px 12px rgba(0,0,0,0.3)); }
        .podcast-card-play { position:absolute; bottom:10px; right:10px; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.2); backdrop-filter:blur(10px); color:white; display:flex; align-items:center; justify-content:center; opacity:0; transform:translateY(8px); transition:var(--transition); border:none; }
        .podcast-card:hover .podcast-card-play { opacity:1; transform:translateY(0); }
        .podcast-card-body { padding:12px; }
        .podcast-card-title { font-size:0.85rem; font-weight:600; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .podcast-card-creator { font-size:0.75rem; color:var(--text-muted); margin-bottom:8px; }
        .podcast-card-meta { display:flex; align-items:center; justify-content:space-between; }
        .pc-badge { display:inline-flex; padding:4px 12px; border-radius:20px; font-size:0.72rem; font-weight:600; background:rgba(92,114,133,0.2); color:var(--accent); }
        .podcast-card-eps { font-size:0.7rem; color:var(--text-secondary); }
      `}</style>
            <div className="podcast-card fade-in" onClick={() => navigate(`/podcast/${podcast.id}`)}>
                <div className="podcast-card-cover" style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                    <span className="podcast-card-emoji">{podcast.emoji || '🎙️'}</span>
                    <button className="podcast-card-play" onClick={e => { e.stopPropagation(); onPlay(podcast); }}><FiPlay size={18} /></button>
                </div>
                <div className="podcast-card-body">
                    <h4 className="podcast-card-title">{podcast.title}</h4>
                    <p className="podcast-card-creator">{podcast.creator}</p>
                    <div className="podcast-card-meta">
                        <span className="pc-badge">{podcast.category}</span>
                        <span className="podcast-card-eps">{podcast.episodes} eps</span>
                    </div>
                </div>
            </div>
        </>
    );
}
