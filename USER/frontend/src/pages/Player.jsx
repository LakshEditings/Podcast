import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSkipBack, FiSkipForward, FiPlay, FiPause, FiVolume2, FiRepeat, FiShuffle, FiHeart, FiDownload, FiMoon, FiShare2, FiClock, FiFileText, FiStar, FiChevronDown, FiChevronUp, FiX, FiAward, FiZap } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

export default function Player({ currentPodcast, isPlaying, onTogglePlay }) {
    const navigate = useNavigate();
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [speed, setSpeed] = useState(1);
    const [showSleep, setShowSleep] = useState(false);
    const [sleepTimer, setSleepTimer] = useState(null);
    const [showCaptions, setShowCaptions] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeMoments, setLikeMoments] = useState([]);
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const sleepOptions = [5, 10, 15, 30, 45, 60];
    const pod = currentPodcast || { title: 'Select a Podcast', creator: 'No podcast playing', emoji: '🎧' };

    // Quiz state
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizIdx, setQuizIdx] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState([]);
    const [quizStartTime, setQuizStartTime] = useState(null);
    const [quizDone, setQuizDone] = useState(false);
    const [quizScore, setQuizScore] = useState(0);
    const [quizTriggered, setQuizTriggered] = useState(false);
    const [questions, setQuestions] = useState([]);

    // Poll state
    const [pollFlags, setPollFlags] = useState([]);
    const [activePoll, setActivePoll] = useState(null);
    const [pollCountdown, setPollCountdown] = useState(30);
    const [pollVoted, setPollVoted] = useState(false);
    const [pollResults, setPollResults] = useState(null);
    const [pollToast, setPollToast] = useState(null);
    const triggeredPolls = useRef(new Set());
    const triggeredToasts = useRef(new Set());
    const pollTimerRef = useRef(null);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${String(sec).padStart(2, '0')}`;
    };

    // Fetch quiz and poll data for the episode
    useEffect(() => {
        if (!currentPodcast?.episodeId) return;
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        // Fetch quiz
        fetch(`${API}/quizPolls/quiz/${currentPodcast.episodeId}`, { headers })
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.questions) setQuestions(data.questions); })
            .catch(() => { });
        // Fetch polls
        fetch(`${API}/quizPolls/polls/${currentPodcast.episodeId}`, { headers })
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data?.flags) setPollFlags(data.flags.map((f, i) => ({ ...f, id: i }))); })
            .catch(() => { });
    }, [currentPodcast?.episodeId]);

    // Audio playback control
    useEffect(() => {
        if (!audioRef.current) return;
        audioRef.current.playbackRate = speed;
    }, [speed]);

    useEffect(() => {
        if (!audioRef.current || !currentPodcast?.audioUrl) return;
        if (isPlaying) audioRef.current.play().catch(() => { });
        else audioRef.current.pause();
    }, [isPlaying, currentPodcast?.audioUrl]);

    // Audio time update
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
        };
        const onLoadedMetadata = () => { setDuration(audio.duration || 0); };
        const onEnded = () => { setProgress(100); };
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);
        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, [currentPodcast?.audioUrl]);

    // Pop sound
    const playPopSound = useCallback(() => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.frequency.value = 880; osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.3);
        } catch (e) { }
    }, []);

    // Check poll flags
    useEffect(() => {
        if (!isPlaying || !pollFlags.length) return;
        pollFlags.forEach(flag => {
            const toastPct = flag.percentage - 0.4;
            if (progress >= toastPct && progress < flag.percentage && !triggeredToasts.current.has(flag.id)) {
                triggeredToasts.current.add(flag.id);
                playPopSound();
                setPollToast('📊 Poll incoming in 10 seconds!');
                setTimeout(() => setPollToast(null), 4000);
            }
            if (progress >= flag.percentage && !triggeredPolls.current.has(flag.id) && !activePoll) {
                triggeredPolls.current.add(flag.id);
                setActivePoll(flag);
                setPollCountdown(30);
                setPollVoted(false);
                setPollResults(null);
            }
        });
    }, [progress, isPlaying, pollFlags, activePoll, playPopSound]);

    // Poll countdown
    useEffect(() => {
        if (!activePoll || pollVoted) return;
        pollTimerRef.current = setInterval(() => {
            setPollCountdown(c => {
                if (c <= 1) { clearInterval(pollTimerRef.current); showPollResultsFn(activePoll); return 0; }
                return c - 1;
            });
        }, 1000);
        return () => clearInterval(pollTimerRef.current);
    }, [activePoll, pollVoted]);

    const showPollResultsFn = (poll) => { setPollResults(poll); setPollVoted(true); clearInterval(pollTimerRef.current); };
    const handlePollVote = (optIdx) => {
        if (pollVoted) return;
        const updated = { ...activePoll, options: activePoll.options.map((o, i) => i === optIdx ? { ...o, votes: o.votes + 1 } : o), votedIdx: optIdx };
        showPollResultsFn(updated);
    };
    const closePoll = () => { setActivePoll(null); setPollResults(null); setPollVoted(false); };

    // End of episode quiz trigger
    useEffect(() => {
        if (progress >= 99.5 && !quizTriggered && questions.length > 0) {
            setQuizTriggered(true);
            setTimeout(() => { setShowQuiz(true); setQuizIdx(0); setQuizAnswers([]); setQuizDone(false); setQuizScore(0); setQuizStartTime(Date.now()); }, 500);
        }
    }, [progress, quizTriggered, questions.length]);

    const handleQuizAnswer = (optIdx) => {
        const q = questions[quizIdx];
        const timeTaken = (Date.now() - quizStartTime) / 1000;
        const isCorrect = optIdx === q.correct;
        const pts = isCorrect ? Math.max(10, Math.round(100 - timeTaken * 9)) : 0;
        const answer = { questionIdx: quizIdx, selected: optIdx, correct: isCorrect, points: pts, time: timeTaken };
        const newAnswers = [...quizAnswers, answer];
        setQuizAnswers(newAnswers);
        if (quizIdx < questions.length - 1) {
            setTimeout(() => { setQuizIdx(quizIdx + 1); setQuizStartTime(Date.now()); }, 600);
        } else {
            const totalPts = newAnswers.reduce((sum, a) => sum + a.points, 0);
            setQuizScore(totalPts);
            setTimeout(() => setQuizDone(true), 600);
        }
    };

    const handleLikeMoment = () => setLikeMoments(m => [...m, formatTime(currentTime)]);

    const seekTo = (pct) => {
        if (audioRef.current && duration) {
            audioRef.current.currentTime = (pct / 100) * duration;
        }
        setProgress(pct);
    };

    const seekRelative = (seconds) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
        }
    };

    const noAudio = !currentPodcast?.audioUrl;

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
        .no-audio-msg { text-align:center; padding:8px 16px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.2); border-radius:var(--radius-md); color:var(--danger); font-size:0.8rem; margin-bottom:16px; }
        .progress-bar { margin-bottom:8px; }
        .progress-track { width:100%; height:6px; background:var(--bg-card); border-radius:3px; cursor:pointer; position:relative; }
        .progress-fill { height:100%; background:var(--gradient-primary); border-radius:3px; transition:width 0.1s; position:relative; }
        .progress-thumb { position:absolute; right:-6px; top:50%; transform:translateY(-50%); width:14px; height:14px; border-radius:50%; background:white; box-shadow:0 2px 6px rgba(0,0,0,0.3); }
        .like-markers { position:absolute; top:0; left:0; right:0; bottom:0; }
        .like-marker { position:absolute; top:-4px; width:3px; height:14px; background:var(--danger); border-radius:2px; transform:translateX(-50%); }
        .poll-markers { position:absolute; top:0; left:0; right:0; bottom:0; pointer-events:none; }
        .poll-marker { position:absolute; top:-6px; font-size:0.6rem; transform:translateX(-50%); }
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
        .poll-toast { position:fixed; top:20px; left:50%; transform:translateX(-50%); background:rgba(251,191,36,0.95); color:#000; padding:12px 24px; border-radius:var(--radius-md); font-weight:700; font-size:0.85rem; z-index:1000; animation:slideDown 0.4s ease-out; box-shadow:0 8px 32px rgba(0,0,0,0.3); }
        @keyframes slideDown { from { transform:translateX(-50%) translateY(-40px); opacity:0; } to { transform:translateX(-50%) translateY(0); opacity:1; } }
        .poll-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(8px); z-index:999; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.3s ease-out; }
        .poll-modal { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); padding:28px; width:90%; max-width:440px; animation:slideUp 0.4s ease-out; position:relative; }
        .poll-modal-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .poll-modal-header h3 { font-size:1.1rem; font-weight:700; display:flex; align-items:center; gap:8px; }
        .poll-countdown { display:flex; align-items:center; gap:6px; padding:6px 14px; border-radius:20px; font-size:0.8rem; font-weight:700; }
        .poll-countdown.warning { background:rgba(248,113,113,0.15); color:#f87171; }
        .poll-countdown.normal { background:rgba(251,191,36,0.15); color:var(--warning); }
        .poll-question { font-size:0.95rem; font-weight:600; margin-bottom:16px; line-height:1.5; }
        .poll-option-btn { width:100%; padding:14px 18px; margin-bottom:8px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.88rem; text-align:left; transition:all 0.3s ease; cursor:pointer; display:flex; align-items:center; justify-content:space-between; }
        .poll-option-btn:hover { border-color:var(--primary); background:rgba(92,114,133,0.1); }
        .poll-result-bar { width:100%; padding:12px 18px; margin-bottom:8px; border-radius:var(--radius-md); position:relative; overflow:hidden; border:1px solid var(--border); }
        .poll-result-fill { position:absolute; inset:0; border-radius:var(--radius-md); transition:width 0.8s ease; }
        .poll-result-fill.user-vote { background:rgba(167,180,158,0.3); }
        .poll-result-fill.other { background:rgba(92,114,133,0.15); }
        .poll-result-content { position:relative; z-index:1; display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; }
        .poll-result-pct { font-weight:700; color:var(--accent); }
        .poll-result-note { text-align:center; margin-top:12px; font-size:0.75rem; color:var(--text-muted); }
        .quiz-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); z-index:1000; display:flex; align-items:center; justify-content:center; animation:fadeIn 0.3s ease-out; }
        .quiz-modal { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); padding:32px; width:92%; max-width:480px; animation:slideUp 0.4s ease-out; position:relative; }
        .quiz-modal-close { position:absolute; top:16px; right:16px; width:32px; height:32px; border-radius:50%; background:var(--bg-input); color:var(--text-muted); display:flex; align-items:center; justify-content:center; border:none; cursor:pointer; }
        .quiz-modal h2 { font-size:1.2rem; font-weight:800; margin-bottom:4px; display:flex; align-items:center; gap:8px; }
        .quiz-progress { display:flex; gap:4px; margin:12px 0 20px; }
        .quiz-dot { flex:1; height:4px; border-radius:2px; background:var(--bg-input); transition:background 0.3s; }
        .quiz-dot.done { background:var(--success); }
        .quiz-dot.wrong { background:var(--danger); }
        .quiz-dot.current { background:var(--accent); }
        .quiz-q-text { font-size:0.95rem; font-weight:600; margin-bottom:20px; line-height:1.5; }
        .quiz-q-num { font-size:0.72rem; color:var(--text-muted); margin-bottom:6px; }
        .quiz-opt { width:100%; padding:14px 18px; margin-bottom:8px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.88rem; text-align:left; transition:all 0.3s ease; cursor:pointer; }
        .quiz-opt:hover { border-color:var(--primary); transform:translateX(4px); }
        .quiz-opt.selected-correct { border-color:var(--success); background:rgba(74,222,128,0.15); color:var(--success); }
        .quiz-opt.selected-wrong { border-color:var(--danger); background:rgba(248,113,113,0.15); color:var(--danger); }
        .quiz-results { text-align:center; }
        .quiz-results .trophy { font-size:3rem; margin-bottom:12px; }
        .quiz-results h2 { font-size:1.3rem; font-weight:800; margin-bottom:4px; }
        .quiz-results .total-pts { font-size:2rem; font-weight:900; color:var(--accent); margin:12px 0; }
        .quiz-results .breakdown { display:flex; justify-content:center; gap:24px; margin:16px 0; }
        .quiz-results .breakdown div { text-align:center; }
        .quiz-results .breakdown .num { font-size:1.2rem; font-weight:800; }
        .quiz-results .breakdown .label { font-size:0.7rem; color:var(--text-muted); }
        .quiz-close-btn { padding:12px 32px; background:var(--gradient-primary); color:white; border-radius:var(--radius-md); font-weight:600; font-size:0.9rem; margin-top:16px; transition:var(--transition); border:none; cursor:pointer; }
        .quiz-close-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .quiz-no-pts-note { font-size:0.72rem; color:var(--text-muted); margin-top:8px; font-style:italic; }
      `}</style>
            {currentPodcast?.audioUrl && <audio ref={audioRef} src={currentPodcast.audioUrl} preload="auto" />}
            <div className="player-page">
                <div className="player-top">
                    <button className="p-back" onClick={() => navigate(-1)}><FiArrowLeft size={20} /></button>
                    <span className="p-np">Now Playing</span>
                    <div style={{ width: 40 }} />
                </div>
                <div className="player-art fade-in" style={{ background: `linear-gradient(135deg, #5C7285, #818C78)` }}>{pod.emoji || '🎧'}</div>
                <div className="player-info fade-in">
                    <h1>{pod.episodeTitle || pod.title}</h1>
                    <p>{pod.creatorName || pod.creator}</p>
                    {pod.episodeTitle && <p className="ep-title">{pod.title}</p>}
                </div>
                {noAudio && <div className="no-audio-msg">⚠️ No audio file available for this episode</div>}
                <div className="progress-bar">
                    <div className="progress-track" onClick={e => { const r = e.currentTarget.getBoundingClientRect(); seekTo(((e.clientX - r.left) / r.width) * 100); }}>
                        <div className="progress-fill" style={{ width: `${progress}%` }}>
                            <div className="progress-thumb" />
                        </div>
                        <div className="like-markers">{likeMoments.map((m, i) => { const [min, sec] = m.split(':').map(Number); const pct = duration > 0 ? ((min * 60 + sec) / duration) * 100 : 0; return <div key={i} className="like-marker" style={{ left: `${pct}%` }} />; })}</div>
                        <div className="poll-markers">{pollFlags.map(f => <span key={f.id} className="poll-marker" style={{ left: `${f.percentage}%` }}>🚩</span>)}</div>
                    </div>
                    <div className="progress-times"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
                </div>
                <div className="main-controls">
                    <button className="ctrl-btn" title="Shuffle"><FiShuffle size={20} /></button>
                    <button className="ctrl-btn" onClick={() => seekRelative(-10)} title="Rewind 10s"><FiSkipBack size={22} /><span className="seek-label">-10</span></button>
                    <button className="ctrl-btn main-play" onClick={onTogglePlay}>{isPlaying ? <FiPause size={28} /> : <FiPlay size={28} />}</button>
                    <button className="ctrl-btn" onClick={() => seekRelative(10)} title="Forward 10s"><FiSkipForward size={22} /><span className="seek-label">+10</span></button>
                    <button className="ctrl-btn" title="Repeat"><FiRepeat size={20} /></button>
                </div>
                <div className="speed-control">{speeds.map(s => <button key={s} className={`speed-btn ${speed === s ? 'active' : ''}`} onClick={() => setSpeed(s)}>{s}x</button>)}</div>
                <div className="extra-controls">
                    <button className={`extra-btn ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}><FiHeart size={18} /><span>Like</span></button>
                    <button className="extra-btn" onClick={handleLikeMoment}><FiStar size={18} /><span>Moment</span></button>
                    <button className={`extra-btn ${showSleep ? 'active' : ''}`} onClick={() => setShowSleep(!showSleep)}><FiMoon size={18} /><span>Sleep</span></button>
                    <button className="extra-btn"><FiDownload size={18} /><span>Download</span></button>
                    <button className="extra-btn"><FiShare2 size={18} /><span>Share</span></button>
                </div>
                {showSleep && <div className="sleep-dropdown fade-in">{sleepOptions.map(m => <button key={m} className={`sleep-opt ${sleepTimer === m ? 'active' : ''}`} onClick={() => setSleepTimer(m)}>{m} min</button>)}{sleepTimer && <button className="sleep-opt" onClick={() => setSleepTimer(null)} style={{ color: 'var(--danger)' }}>Cancel</button>}</div>}
                {likeMoments.length > 0 && <div className="moments-list fade-in"><h4>❤️ Liked Moments</h4>{likeMoments.map((m, i) => <span key={i} className="moment-chip">⏱ {m}</span>)}</div>}
            </div>

            {/* Poll Toast */}
            {pollToast && <div className="poll-toast">{pollToast}</div>}

            {/* Poll Popup */}
            {activePoll && !pollResults && (
                <div className="poll-overlay">
                    <div className="poll-modal">
                        <div className="poll-modal-header">
                            <h3>📊 Live Poll</h3>
                            <span className={`poll-countdown ${pollCountdown <= 10 ? 'warning' : 'normal'}`}><FiClock size={14} /> {pollCountdown}s</span>
                        </div>
                        <p className="poll-question">{activePoll.question}</p>
                        {activePoll.options.map((opt, i) => (
                            <button key={i} className="poll-option-btn" onClick={() => handlePollVote(i)}>{opt.text}</button>
                        ))}
                        <p className="quiz-no-pts-note">Polls don't award points — they're just for fun!</p>
                    </div>
                </div>
            )}

            {/* Poll Results */}
            {pollResults && (
                <div className="poll-overlay" onClick={closePoll}>
                    <div className="poll-modal" onClick={e => e.stopPropagation()}>
                        <div className="poll-modal-header">
                            <h3>📊 Poll Results</h3>
                            <button className="quiz-modal-close" onClick={closePoll}><FiX size={16} /></button>
                        </div>
                        <p className="poll-question">{pollResults.question}</p>
                        {(() => {
                            const totalVotes = pollResults.options.reduce((s, o) => s + o.votes, 0);
                            return pollResults.options.map((opt, i) => {
                                const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                                return (
                                    <div key={i} className="poll-result-bar">
                                        <div className={`poll-result-fill ${pollResults.votedIdx === i ? 'user-vote' : 'other'}`} style={{ width: `${pct}%` }} />
                                        <div className="poll-result-content">
                                            <span>{opt.text} {pollResults.votedIdx === i && '✓'}</span>
                                            <span className="poll-result-pct">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                        <p className="poll-result-note">{pollResults.options.reduce((s, o) => s + o.votes, 0).toLocaleString()} total votes</p>
                    </div>
                </div>
            )}

            {/* End-of-Episode Quiz */}
            {showQuiz && !quizDone && questions.length > 0 && (
                <div className="quiz-overlay">
                    <div className="quiz-modal">
                        <button className="quiz-modal-close" onClick={() => setShowQuiz(false)}><FiX size={16} /></button>
                        <h2><FiAward size={20} /> Episode Quiz</h2>
                        <div className="quiz-progress">
                            {questions.map((_, i) => (
                                <div key={i} className={`quiz-dot ${i < quizIdx ? (quizAnswers[i]?.correct ? 'done' : 'wrong') : i === quizIdx ? 'current' : ''}`} />
                            ))}
                        </div>
                        <p className="quiz-q-num">Question {quizIdx + 1} of {questions.length}</p>
                        <p className="quiz-q-text">{questions[quizIdx].question}</p>
                        {questions[quizIdx].options.map((opt, i) => {
                            const answered = quizAnswers.length > quizIdx;
                            const isSelected = answered && quizAnswers[quizIdx]?.selected === i;
                            let cls = 'quiz-opt';
                            if (isSelected && quizAnswers[quizIdx]?.correct) cls += ' selected-correct';
                            if (isSelected && !quizAnswers[quizIdx]?.correct) cls += ' selected-wrong';
                            return <button key={i} className={cls} onClick={() => !answered && handleQuizAnswer(i)} disabled={answered}>{opt}</button>;
                        })}
                    </div>
                </div>
            )}

            {/* Quiz Results */}
            {showQuiz && quizDone && (
                <div className="quiz-overlay">
                    <div className="quiz-modal">
                        <div className="quiz-results fade-in">
                            <div className="trophy">{quizScore >= 400 ? '🏆' : quizScore >= 200 ? '🎉' : '👏'}</div>
                            <h2>Quiz Complete!</h2>
                            <div className="total-pts">{quizScore} pts</div>
                            <div className="breakdown">
                                <div><div className="num" style={{ color: 'var(--success)' }}>{quizAnswers.filter(a => a.correct).length}</div><div className="label">Correct</div></div>
                                <div><div className="num" style={{ color: 'var(--danger)' }}>{quizAnswers.filter(a => !a.correct).length}</div><div className="label">Wrong</div></div>
                                <div><div className="num">{questions.length}</div><div className="label">Total</div></div>
                                <div><div className="num" style={{ color: 'var(--accent)' }}><FiZap size={16} /></div><div className="label">Speed Bonus</div></div>
                            </div>
                            <p className="quiz-no-pts-note">Points added to leaderboard! Faster answers = more points.</p>
                            <button className="quiz-close-btn" onClick={() => setShowQuiz(false)}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
