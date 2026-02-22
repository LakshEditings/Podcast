import { useNavigate } from 'react-router-dom';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack } from 'react-icons/fi';

export default function PlayerBar({ currentPodcast, isPlaying, onTogglePlay }) {
    const navigate = useNavigate();
    if (!currentPodcast) return null;
    return (
        <>
            <style>{`
        .player-bar { position:fixed; bottom:68px; left:12px; right:12px; display:flex; align-items:center; gap:12px; padding:10px 16px; background:rgba(35,42,50,0.95); backdrop-filter:blur(20px); border-radius:16px; border:1px solid var(--border); z-index:999; cursor:pointer; box-shadow:var(--shadow-lg); animation:slideUp 0.3s ease-out; }
        .player-bar-thumb { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; font-weight:700; color:white; flex-shrink:0; background:var(--gradient-primary); }
        .player-bar-info { flex:1; min-width:0; }
        .player-bar-title { font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .player-bar-artist { font-size:0.72rem; color:var(--text-muted); margin-top:2px; }
        .player-bar-controls { display:flex; align-items:center; gap:4px; }
        .pb-btn { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-primary); border:none; transition:var(--transition); }
        .pb-btn.play { background:var(--gradient-primary); }
      `}</style>
            <div className="player-bar" onClick={() => navigate('/player')}>
                <div className="player-bar-thumb"><span>{currentPodcast.emoji || '🎧'}</span></div>
                <div className="player-bar-info">
                    <p className="player-bar-title">{currentPodcast.title}</p>
                    <p className="player-bar-artist">{currentPodcast.creator}</p>
                </div>
                <div className="player-bar-controls" onClick={e => e.stopPropagation()}>
                    <button className="pb-btn"><FiSkipBack size={16} /></button>
                    <button className="pb-btn play" onClick={onTogglePlay}>{isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}</button>
                    <button className="pb-btn"><FiSkipForward size={16} /></button>
                </div>
            </div>
        </>
    );
}
