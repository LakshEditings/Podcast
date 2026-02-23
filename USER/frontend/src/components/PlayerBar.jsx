import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiPause, FiSkipForward, FiSkipBack } from 'react-icons/fi';

export default function PlayerBar({ currentPodcast, isPlaying, onTogglePlay }) {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) audioRef.current.play().catch(() => { });
        else audioRef.current.pause();
    }, [isPlaying, currentPodcast?.audioUrl]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const update = () => {
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };
        audio.addEventListener('timeupdate', update);
        return () => audio.removeEventListener('timeupdate', update);
    }, [currentPodcast?.audioUrl]);

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
        .pb-btn { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-primary); border:none; transition:var(--transition); cursor:pointer; }
        .pb-btn.play { background:var(--gradient-primary); }
        .player-progress { position:absolute; bottom:0; left:16px; right:16px; height:3px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden; }
        .player-progress-fill { height:100%; background:var(--accent); border-radius:2px; transition:width 0.3s ease; }
        .no-audio-tag { font-size:0.6rem; background:rgba(248,113,113,0.15); color:var(--danger); padding:1px 6px; border-radius:6px; margin-left:4px; }
      `}</style>
            {currentPodcast.audioUrl && <audio ref={audioRef} src={currentPodcast.audioUrl} preload="auto" />}
            <div className="player-bar" onClick={() => navigate('/player')}>
                <div className="player-bar-thumb"><span>{currentPodcast.emoji || '🎧'}</span></div>
                <div className="player-bar-info">
                    <p className="player-bar-title">{currentPodcast.episodeTitle || currentPodcast.title}</p>
                    <p className="player-bar-artist">{currentPodcast.creatorName || currentPodcast.creator}
                        {!currentPodcast.audioUrl && <span className="no-audio-tag">No audio</span>}
                    </p>
                </div>
                <div className="player-bar-controls" onClick={e => e.stopPropagation()}>
                    <button className="pb-btn"><FiSkipBack size={16} /></button>
                    <button className="pb-btn play" onClick={onTogglePlay}>{isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}</button>
                    <button className="pb-btn"><FiSkipForward size={16} /></button>
                </div>
                {currentPodcast.audioUrl && <div className="player-progress"><div className="player-progress-fill" style={{ width: `${progress}%` }} /></div>}
            </div>
        </>
    );
}
