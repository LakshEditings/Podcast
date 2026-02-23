import { FiPlay, FiDownload, FiClock, FiFileText } from 'react-icons/fi';

export default function EpisodeCard({ episode, index, onPlay, onQuiz }) {
    const date = episode.createdAt ? new Date(episode.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
    const hasAudio = !!episode.audioFile;
    return (
        <>
            <style>{`
        .episode-card { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border); transition:var(--transition); }
        .episode-card:hover { border-color:var(--primary); background:var(--bg-card-hover); }
        .episode-number { width:28px; height:28px; border-radius:50%; background:rgba(92,114,133,0.2); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; }
        .episode-info { flex:1; min-width:0; }
        .episode-title { font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .episode-desc { font-size:0.72rem; color:var(--text-muted); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .episode-meta { display:flex; gap:12px; margin-top:4px; font-size:0.72rem; color:var(--text-muted); }
        .episode-meta span { display:flex; align-items:center; gap:4px; }
        .audio-badge { display:inline-flex; align-items:center; gap:3px; padding:2px 6px; border-radius:8px; font-size:0.62rem; font-weight:700; }
        .audio-badge.has { background:rgba(74,222,128,0.15); color:var(--success); }
        .audio-badge.none { background:rgba(248,113,113,0.1); color:var(--danger); }
        .episode-actions { display:flex; gap:6px; flex-shrink:0; }
        .ep-btn { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-primary); border:none; transition:var(--transition); cursor:pointer; }
        .ep-btn.play { background:var(--gradient-primary); color:white; }
        .ep-btn.quiz { background:rgba(251,191,36,0.15); color:var(--warning); }
        .ep-btn:hover { opacity:0.8; transform:scale(1.1); }
      `}</style>
            <div className="episode-card fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="episode-number">{index + 1}</div>
                <div className="episode-info">
                    <h4 className="episode-title">{episode.title}</h4>
                    {episode.description && <p className="episode-desc">{episode.description}</p>}
                    <div className="episode-meta">
                        <span><FiClock size={12} /> {episode.duration || '—'}</span>
                        {date && <span>{date}</span>}
                        <span className={`audio-badge ${hasAudio ? 'has' : 'none'}`}>{hasAudio ? '🔊 Audio' : 'No audio'}</span>
                    </div>
                </div>
                <div className="episode-actions">
                    {onQuiz && <button className="ep-btn quiz" onClick={(e) => { e.stopPropagation(); onQuiz(episode); }} title="Take Quiz"><FiFileText size={14} /></button>}
                    <button className="ep-btn play" onClick={() => onPlay(episode)} title={hasAudio ? 'Play' : 'No audio'}><FiPlay size={14} /></button>
                </div>
            </div>
        </>
    );
}
