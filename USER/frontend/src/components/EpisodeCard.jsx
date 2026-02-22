import { FiPlay, FiDownload, FiClock } from 'react-icons/fi';

export default function EpisodeCard({ episode, index, onPlay }) {
    return (
        <>
            <style>{`
        .episode-card { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border); transition:var(--transition); }
        .episode-card:hover { border-color:var(--primary); background:var(--bg-card-hover); }
        .episode-number { width:28px; height:28px; border-radius:50%; background:rgba(92,114,133,0.2); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; }
        .episode-info { flex:1; min-width:0; }
        .episode-title { font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .episode-meta { display:flex; gap:12px; margin-top:4px; font-size:0.72rem; color:var(--text-muted); }
        .episode-meta span { display:flex; align-items:center; gap:4px; }
        .episode-actions { display:flex; gap:6px; flex-shrink:0; }
        .ep-btn { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-primary); border:none; transition:var(--transition); }
        .ep-btn.play { background:var(--gradient-primary); }
        .ep-btn:hover { background:var(--primary); }
      `}</style>
            <div className="episode-card fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="episode-number">{index + 1}</div>
                <div className="episode-info">
                    <h4 className="episode-title">{episode.title}</h4>
                    <div className="episode-meta">
                        <span><FiClock size={12} /> {episode.duration}</span>
                        <span>{episode.date}</span>
                    </div>
                </div>
                <div className="episode-actions">
                    <button className="ep-btn" title="Download"><FiDownload size={14} /></button>
                    <button className="ep-btn play" onClick={() => onPlay(episode)} title="Play"><FiPlay size={14} /></button>
                </div>
            </div>
        </>
    );
}
