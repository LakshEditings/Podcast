import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSkipBack, FiSkipForward, FiPlay, FiPause, FiVolume2, FiRepeat, FiShuffle, FiHeart, FiDownload, FiMoon, FiShare2, FiClock, FiFileText, FiStar, FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function Player({ currentPodcast, isPlaying, onTogglePlay }) {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(35);
    const [speed, setSpeed] = useState(1);
    const [showSleep, setShowSleep] = useState(false);
    const [sleepTimer, setSleepTimer] = useState(null);
    const [showCaptions, setShowCaptions] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeMoments, setLikeMoments] = useState([]);
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const sleepOptions = [5, 10, 15, 30, 45, 60];
    const pod = currentPodcast || { title: 'Select a Podcast', creator: 'No podcast playing', emoji: '🎧', duration: '00:00' };
    const currentTime = Math.floor((progress / 100) * 2535);
    const totalTime = 2535;
    const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    const handleLikeMoment = () => {
        const moment = formatTime(currentTime);
        setLikeMoments(m => [...m, moment]);
    };

    const captions = [
        { time: '0:00', text: 'Welcome to today\'s episode where we dive deep into the world of technology.' },
        { time: '0:15', text: 'Let\'s start by discussing the latest developments in artificial intelligence.' },
        { time: '0:30', text: 'Machine learning models have become increasingly sophisticated.' },
        { time: '0:45', text: 'The implications for society are profound and far-reaching.' },
        { time: '1:00', text: 'We\'ll explore both the opportunities and challenges ahead.' },
    ];

    const summary = "This episode explores cutting-edge developments in AI and machine learning, discussing how these technologies are reshaping industries from healthcare to finance. Key topics include transformer architectures, ethical considerations in AI deployment, and predictions for the next decade of innovation.";

    return (
        <>
            <style>{`
        .player-page { min-height:100vh; padding:20px; display:flex; flex-direction:column; background:linear-gradient(180deg, #2a333d 0%, var(--bg-dark) 50%); }
        .player-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
        .p-back { width:40px; height:40px; border-radius:50%; background:var(--bg-card); color:var(--text-primary); display:flex; align-items:center; justify-content:center; border:1px solid var(--border); }
        .p-np { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:2px; background:linear-gradient(90deg, var(--text-muted) 0%, var(--text-muted) 30%, #E2E0C8 50%, var(--text-muted) 70%, var(--text-muted) 100%); background-size:200% 100%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; animation:shine 2.5s ease-in-out infinite; }
        @keyframes shine { 0% { background-position:200% center; } 100% { background-position:-200% center; } }
        .player-art { width:240px; height:240px; border-radius:var(--radius-xl); margin:0 auto 32px; display:flex; align-items:center; justify-content:center; font-size:6rem; box-shadow:var(--shadow-lg); }
        .player-info { text-align:center; margin-bottom:24px; }
        .player-info h1 { font-size:1.4rem; font-weight:800; margin-bottom:4px; }
        .player-info p { font-size:0.85rem; color:var(--text-muted); }
        .player-info .ep-title { font-size:0.78rem; color:var(--accent); margin-top:4px; }
        .progress-bar { margin-bottom:8px; }
        .progress-track { width:100%; height:6px; background:var(--bg-card); border-radius:3px; cursor:pointer; position:relative; }
        .progress-fill { height:100%; background:var(--gradient-primary); border-radius:3px; transition:width 0.1s; position:relative; }
        .progress-thumb { position:absolute; right:-6px; top:50%; transform:translateY(-50%); width:14px; height:14px; border-radius:50%; background:white; box-shadow:0 2px 6px rgba(0,0,0,0.3); }
        .like-markers { position:absolute; top:0; left:0; right:0; bottom:0; }
        .like-marker { position:absolute; top:-4px; width:3px; height:14px; background:var(--danger); border-radius:2px; transform:translateX(-50%); }
        .progress-times { display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted); margin-top:6px; }
        .main-controls { display:flex; align-items:center; justify-content:center; gap:20px; margin:24px 0; }
        .ctrl-btn { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-primary); border:none; transition:var(--transition); font-size:0.75rem; position:relative; }
        .ctrl-btn:hover { color:var(--accent); }
        .ctrl-btn.main-play { width:64px; height:64px; background:var(--gradient-primary); border-radius:50%; color:white; }
        .ctrl-btn.main-play:hover { transform:scale(1.08); box-shadow:0 0 24px rgba(92,114,133,0.5); }
        .seek-label { position:absolute; bottom:-2px; font-size:0.55rem; color:var(--text-muted); }
        .speed-control { display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:20px; }
        .speed-btn { padding:6px 14px; border-radius:16px; font-size:0.75rem; font-weight:600; background:var(--bg-card); color:var(--text-muted); border:1px solid var(--border); transition:var(--transition); }
        .speed-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        .extra-controls { display:flex; justify-content:center; gap:12px; flex-wrap:wrap; margin-bottom:20px; }
        .extra-btn { display:flex; flex-direction:column; align-items:center; gap:4px; padding:10px 14px; border-radius:var(--radius-md); background:var(--bg-card); color:var(--text-muted); font-size:0.65rem; border:1px solid var(--border); transition:var(--transition); min-width:60px; }
        .extra-btn:hover { color:var(--accent); border-color:var(--primary); }
        .extra-btn.active { color:var(--accent); border-color:var(--accent); background:rgba(167,180,158,0.1); }
        .sleep-dropdown { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:12px; margin-bottom:16px; display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
        .sleep-opt { padding:8px 16px; border-radius:20px; background:var(--bg-input); color:var(--text-primary); font-size:0.8rem; border:1px solid var(--border); transition:var(--transition); }
        .sleep-opt.active { background:var(--primary); color:white; border-color:var(--primary); }
        .sleep-opt:hover { border-color:var(--primary); }
        .caption-box { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; max-height:200px; overflow-y:auto; }
        .caption-line { display:flex; gap:10px; padding:6px 0; font-size:0.8rem; }
        .caption-time { color:var(--accent); font-weight:600; white-space:nowrap; min-width:36px; }
        .caption-text { color:var(--text-secondary); line-height:1.4; }
        .summary-box { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:16px; }
        .summary-box h4 { font-size:0.85rem; margin-bottom:8px; display:flex; align-items:center; gap:6px; }
        .summary-box .premium-badge { padding:3px 8px; border-radius:10px; background:linear-gradient(135deg,#fbbf24,#f59e0b); color:#000; font-size:0.6rem; font-weight:700; }
        .summary-box p { font-size:0.82rem; color:var(--text-secondary); line-height:1.6; }
        .moments-list { margin-bottom:16px; }
        .moments-list h4 { font-size:0.85rem; margin-bottom:8px; }
        .moment-chip { display:inline-flex; align-items:center; gap:4px; padding:4px 12px; margin:0 6px 6px 0; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.3); border-radius:16px; font-size:0.75rem; color:#f87171; }
      `}</style>
            <div className="player-page">
                <div className="player-top">
                    <button className="p-back" onClick={() => navigate(-1)}><FiArrowLeft size={20} /></button>
                    <span className="p-np">Now Playing</span>
                    <div style={{ width: 40 }} />
                </div>
                <div className="player-art fade-in" style={{ background: `linear-gradient(135deg, #5C7285, #818C78)` }}>{pod.emoji}</div>
                <div className="player-info fade-in">
                    <h1>{pod.title}</h1>
                    <p>{pod.creator}</p>
                    {pod.episodeTitle && <p className="ep-title">{pod.episodeTitle}</p>}
                </div>
                <div className="progress-bar">
                    <div className="progress-track" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
                        <div className="progress-fill" style={{ width: `${progress}%` }}>
                            <div className="progress-thumb" />
                        </div>
                        <div className="like-markers">{likeMoments.map((m, i) => { const [min, sec] = m.split(':').map(Number); const pct = ((min * 60 + sec) / totalTime) * 100; return <div key={i} className="like-marker" style={{ left: `${pct}%` }} />; })}</div>
                    </div>
                    <div className="progress-times"><span>{formatTime(currentTime)}</span><span>{formatTime(totalTime)}</span></div>
                </div>
                <div className="main-controls">
                    <button className="ctrl-btn" title="Shuffle"><FiShuffle size={20} /></button>
                    <button className="ctrl-btn" onClick={() => setProgress(Math.max(0, progress - (10 / totalTime) * 100))} title="Rewind 10s"><FiSkipBack size={22} /><span className="seek-label">-10</span></button>
                    <button className="ctrl-btn main-play" onClick={onTogglePlay}>{isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}</button>
                    <button className="ctrl-btn" onClick={() => setProgress(Math.min(100, progress + (10 / totalTime) * 100))} title="Forward 10s"><FiSkipForward size={22} /><span className="seek-label">+10</span></button>
                    <button className="ctrl-btn" title="Repeat"><FiRepeat size={20} /></button>
                </div>
                <div className="speed-control">{speeds.map(s => <button key={s} className={`speed-btn ${speed === s ? 'active' : ''}`} onClick={() => setSpeed(s)}>{s}x</button>)}</div>
                <div className="extra-controls">
                    <button className={`extra-btn ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}><FiHeart size={18} /><span>Like</span></button>
                    <button className="extra-btn" onClick={handleLikeMoment}><FiStar size={18} /><span>Moment</span></button>
                    <button className={`extra-btn ${showSleep ? 'active' : ''}`} onClick={() => setShowSleep(!showSleep)}><FiMoon size={18} /><span>Sleep</span></button>
                    <button className="extra-btn"><FiDownload size={18} /><span>Download</span></button>
                    <button className="extra-btn"><FiShare2 size={18} /><span>Share</span></button>
                    <button className={`extra-btn ${showCaptions ? 'active' : ''}`} onClick={() => setShowCaptions(!showCaptions)}><FiFileText size={18} /><span>Captions</span></button>
                    <button className={`extra-btn ${showSummary ? 'active' : ''}`} onClick={() => setShowSummary(!showSummary)}><FiClock size={18} /><span>Summary</span></button>
                </div>
                {showSleep && <div className="sleep-dropdown fade-in">{sleepOptions.map(m => <button key={m} className={`sleep-opt ${sleepTimer === m ? 'active' : ''}`} onClick={() => setSleepTimer(m)}>{m} min</button>)}{sleepTimer && <button className="sleep-opt" onClick={() => setSleepTimer(null)} style={{ color: 'var(--danger)' }}>Cancel</button>}</div>}
                {showCaptions && <div className="caption-box fade-in">{captions.map((c, i) => <div key={i} className="caption-line"><span className="caption-time">{c.time}</span><span className="caption-text">{c.text}</span></div>)}</div>}
                {showSummary && <div className="summary-box fade-in"><h4>AI Summary <span className="premium-badge">PREMIUM</span></h4><p>{summary}</p></div>}
                {likeMoments.length > 0 && <div className="moments-list fade-in"><h4>❤️ Liked Moments</h4>{likeMoments.map((m, i) => <span key={i} className="moment-chip">⏱ {m}</span>)}</div>}
            </div>
        </>
    );
}
