import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiBell, FiShare2, FiDownload, FiAward, FiZap, FiClock, FiTrendingUp } from 'react-icons/fi';
import EpisodeCard from '../components/EpisodeCard';
import PollCard from '../components/PollCard';
import CommentSection from '../components/CommentSection';
import QuizModal from '../components/QuizModal';
import { mockPodcasts, mockEpisodes, mockQuiz, mockPolls, mockLeaderboard } from '../data/mockData';

export default function PodcastDetail({ onPlay }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const podcast = mockPodcasts.find(p => p.id === parseInt(id)) || mockPodcasts[0];
    const episodes = mockEpisodes.filter(e => e.podcastId === podcast.id);
    const displayEps = episodes.length > 0 ? episodes : mockEpisodes.slice(0, 4);
    const [subscribed, setSubscribed] = useState(false);
    const [notif, setNotif] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [tab, setTab] = useState('episodes');
    const colors = ['#5C7285', '#818C78', '#A7B49E', '#7a6b5d', '#6b7a8a'];
    const color = colors[podcast.id % colors.length];
    const maxPts = Math.max(...mockLeaderboard.map(l => l.points), 1);

    return (
        <>
            <style>{`
        .page-container { max-width:1200px; margin:0 auto; padding:24px 20px 120px; }
        .back-btn { width:40px; height:40px; border-radius:50%; background:var(--bg-card); color:var(--text-primary); display:flex; align-items:center; justify-content:center; border:1px solid var(--border); margin-bottom:16px; transition:var(--transition); }
        .back-btn:hover { background:var(--bg-card-hover); }
        .pd-hero { display:flex; align-items:center; gap:20px; padding:28px; border-radius:var(--radius-xl); margin-bottom:20px; }
        .pd-emoji { font-size:4rem; filter:drop-shadow(0 4px 16px rgba(0,0,0,0.3)); }
        .pd-info h1 { font-size:1.5rem; font-weight:800; margin-bottom:4px; }
        .pd-creator { font-size:0.85rem; color:rgba(255,255,255,0.8); margin-bottom:8px; }
        .pd-stats { display:flex; gap:8px; font-size:0.75rem; color:rgba(255,255,255,0.6); flex-wrap:wrap; }
        .pd-desc { font-size:0.85rem; color:var(--text-secondary); line-height:1.6; margin-bottom:20px; }
        .pd-actions { display:flex; align-items:center; gap:10px; margin-bottom:24px; flex-wrap:wrap; }
        .pd-sub-btn { padding:10px 24px; border-radius:var(--radius-md); font-weight:600; font-size:0.85rem; border:1px solid var(--border); background:var(--bg-card); color:var(--text-primary); transition:var(--transition); }
        .pd-sub-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        .pd-act-btn { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--bg-card); color:var(--text-primary); border:1px solid var(--border); transition:var(--transition); }
        .pd-act-btn:hover { background:var(--bg-card-hover); }
        .pd-act-btn.liked { color:#f87171; background:rgba(248,113,113,0.1); border-color:rgba(248,113,113,0.3); }
        .pd-act-btn.notif-on { color:var(--warning); background:rgba(251,191,36,0.1); border-color:rgba(251,191,36,0.3); }
        .pd-tabs { display:flex; gap:4px; margin-bottom:20px; background:var(--bg-card); border-radius:var(--radius-md); padding:4px; border:1px solid var(--border); overflow-x:auto; }
        .pd-tab { flex:1; padding:10px; border-radius:var(--radius-sm); background:transparent; color:var(--text-muted); font-size:0.82rem; font-weight:600; transition:var(--transition); white-space:nowrap; min-width:fit-content; }
        .pd-tab.active { background:var(--primary); color:white; }
        .pd-episodes { display:flex; flex-direction:column; gap:8px; }
        .quiz-promo { display:flex; align-items:center; gap:16px; padding:24px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border); }
        .quiz-promo-icon { font-size:2.5rem; }
        .quiz-promo h3 { font-size:1rem; margin-bottom:4px; }
        .quiz-promo p { font-size:0.8rem; color:var(--text-muted); }
        .qp-btn { margin-left:auto; white-space:nowrap; background:var(--gradient-primary); color:white; padding:12px 28px; border-radius:var(--radius-md); font-weight:600; transition:var(--transition); }
        .qp-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }

        /* Leaderboard Styles */
        .lb-container { animation:fadeIn 0.4s ease-out; }
        .lb-header-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; margin-bottom:16px; display:flex; align-items:center; gap:16px; }
        .lb-trophy { font-size:2.5rem; }
        .lb-header-info h3 { font-size:1.1rem; font-weight:700; margin-bottom:4px; }
        .lb-header-info p { font-size:0.8rem; color:var(--text-muted); line-height:1.5; }
        .lb-scoring { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .lb-score-chip { display:flex; align-items:center; gap:6px; padding:8px 14px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); font-size:0.75rem; color:var(--text-secondary); }
        .lb-score-chip svg { color:var(--accent); }
        .lb-list { display:flex; flex-direction:column; gap:8px; }
        .lb-row { display:flex; align-items:center; gap:14px; padding:14px 18px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); transition:var(--transition); }
        .lb-row:hover { border-color:var(--primary); transform:translateX(4px); }
        .lb-row.top-1 { border-color:rgba(255,215,0,0.4); background:linear-gradient(135deg, rgba(255,215,0,0.08), var(--bg-card)); }
        .lb-row.top-2 { border-color:rgba(192,192,192,0.3); background:linear-gradient(135deg, rgba(192,192,192,0.06), var(--bg-card)); }
        .lb-row.top-3 { border-color:rgba(205,127,50,0.3); background:linear-gradient(135deg, rgba(205,127,50,0.06), var(--bg-card)); }
        .lb-row.is-user { border-color:var(--primary); background:linear-gradient(135deg, rgba(92,114,133,0.15), var(--bg-card)); box-shadow:0 0 20px rgba(92,114,133,0.1); }
        .lb-rank { width:28px; font-size:0.9rem; font-weight:800; color:var(--text-muted); text-align:center; flex-shrink:0; }
        .lb-row.top-1 .lb-rank { color:#FFD700; }
        .lb-row.top-2 .lb-rank { color:#C0C0C0; }
        .lb-row.top-3 .lb-rank { color:#CD7F32; }
        .lb-avatar { font-size:1.4rem; flex-shrink:0; }
        .lb-user-info { flex:1; min-width:0; }
        .lb-name { font-size:0.88rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .lb-row.is-user .lb-name { color:var(--accent); }
        .lb-meta { display:flex; gap:12px; margin-top:3px; font-size:0.7rem; color:var(--text-muted); }
        .lb-correct { color:var(--success); font-weight:600; }
        .lb-points-section { display:flex; flex-direction:column; align-items:flex-end; gap:4px; min-width:80px; }
        .lb-pts { font-size:1rem; font-weight:800; color:var(--accent); }
        .lb-row.top-1 .lb-pts { color:#FFD700; }
        .lb-bar-bg { width:80px; height:5px; background:var(--bg-input); border-radius:3px; overflow:hidden; }
        .lb-bar-fill { height:100%; border-radius:3px; background:var(--gradient-primary); transition:width 0.8s ease; }
        .lb-row.top-1 .lb-bar-fill { background:linear-gradient(90deg,#FFD700,#FFA500); }
        .lb-row.top-2 .lb-bar-fill { background:linear-gradient(90deg,#C0C0C0,#A0A0A0); }
        .lb-row.top-3 .lb-bar-fill { background:linear-gradient(90deg,#CD7F32,#A0522D); }
        .lb-streak { display:inline-flex; align-items:center; gap:3px; padding:2px 8px; border-radius:10px; font-size:0.65rem; font-weight:700; background:rgba(251,191,36,0.15); color:var(--warning); }
        .lb-cta { display:flex; align-items:center; justify-content:center; gap:10px; margin-top:16px; padding:16px; background:var(--bg-card); border:1px dashed var(--border); border-radius:var(--radius-md); }
        .lb-cta p { font-size:0.85rem; color:var(--text-muted); }
        .lb-cta-btn { background:var(--gradient-primary); color:white; padding:10px 22px; border-radius:var(--radius-md); font-weight:600; font-size:0.85rem; transition:var(--transition); }
        .lb-cta-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        @media(max-width:480px) { .lb-scoring { flex-direction:column; } .lb-row { gap:10px; padding:12px 14px; } .lb-bar-bg { width:50px; } }
      `}</style>
            <div className="page-container">
                <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft size={20} /></button>
                <div className="pd-hero fade-in" style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}>
                    <span className="pd-emoji">{podcast.emoji}</span>
                    <div className="pd-info">
                        <h1>{podcast.title}</h1>
                        <p className="pd-creator">{podcast.creator}</p>
                        <div className="pd-stats"><span>{podcast.subscribers?.toLocaleString()} subscribers</span><span>•</span><span>{podcast.episodes} episodes</span><span>•</span><span>{podcast.language}</span></div>
                    </div>
                </div>
                <p className="pd-desc fade-in">{podcast.description}</p>
                <div className="pd-actions fade-in">
                    <button className={`pd-sub-btn ${subscribed ? 'active' : ''}`} onClick={() => setSubscribed(!subscribed)}>{subscribed ? '✓ Subscribed' : 'Subscribe'}</button>
                    <button className={`pd-act-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}><FiHeart size={18} /></button>
                    <button className={`pd-act-btn ${notif ? 'notif-on' : ''}`} onClick={() => setNotif(!notif)}><FiBell size={18} /></button>
                    <button className="pd-act-btn"><FiShare2 size={18} /></button>
                    <button className="pd-act-btn"><FiDownload size={18} /></button>
                </div>
                <div className="pd-tabs fade-in">
                    {['episodes', 'community', 'quizzes', 'leaderboard'].map(t => <button key={t} className={`pd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t === 'leaderboard' ? '🏆 Leaderboard' : t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
                </div>
                {tab === 'episodes' && <div className="pd-episodes">{displayEps.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={() => onPlay({ ...podcast, episodeTitle: ep.title, duration: ep.duration })} />)}</div>}
                {tab === 'community' && <div>{mockPolls.map(p => <PollCard key={p.id} poll={p} />)}<CommentSection /></div>}
                {tab === 'quizzes' && <div className="quiz-promo"><div className="quiz-promo-icon">📝</div><div><h3>{mockQuiz.title}</h3><p>Score {mockQuiz.passScore}+ to earn ₹{mockQuiz.reward}!</p></div><button className="qp-btn" onClick={() => setShowQuiz(true)}>Take Quiz</button></div>}
                {tab === 'leaderboard' && (
                    <div className="lb-container">
                        <div className="lb-header-card">
                            <span className="lb-trophy">🏆</span>
                            <div className="lb-header-info">
                                <h3>Quiz Leaderboard</h3>
                                <p>Ranked by correct answers. Same correct count? Faster answers = more points!</p>
                            </div>
                        </div>
                        <div className="lb-scoring">
                            <div className="lb-score-chip"><FiZap size={14} /> Faster answer = More points (max 100/question)</div>
                            <div className="lb-score-chip"><FiClock size={14} /> Points = 100 − (seconds × 9), min 10</div>
                            <div className="lb-score-chip"><FiTrendingUp size={14} /> Streak bonus shown for daily quizzers</div>
                        </div>
                        <div className="lb-list">
                            {mockLeaderboard.map(entry => (
                                <div key={entry.rank} className={`lb-row ${entry.rank === 1 ? 'top-1' : ''} ${entry.rank === 2 ? 'top-2' : ''} ${entry.rank === 3 ? 'top-3' : ''} ${entry.isUser ? 'is-user' : ''} fade-in`} style={{ animationDelay: `${entry.rank * 0.05}s` }}>
                                    <span className="lb-rank">#{entry.rank}</span>
                                    <span className="lb-avatar">{entry.avatar}</span>
                                    <div className="lb-user-info">
                                        <p className="lb-name">{entry.name}</p>
                                        <div className="lb-meta">
                                            <span className="lb-correct">✓ {entry.correct}/{entry.totalQ} correct</span>
                                            <span>{entry.avgTime > 0 ? `⚡ ${entry.avgTime}s avg` : '—'}</span>
                                            {entry.streak > 0 && <span className="lb-streak">🔥 {entry.streak} day streak</span>}
                                        </div>
                                    </div>
                                    <div className="lb-points-section">
                                        <span className="lb-pts">{entry.points} pts</span>
                                        <div className="lb-bar-bg"><div className="lb-bar-fill" style={{ width: `${(entry.points / maxPts) * 100}%` }} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="lb-cta">
                            <p>Take the quiz to climb the leaderboard!</p>
                            <button className="lb-cta-btn" onClick={() => { setTab('quizzes'); }}>Take Quiz →</button>
                        </div>
                    </div>
                )}
                {showQuiz && <QuizModal quiz={mockQuiz} onClose={() => setShowQuiz(false)} />}
            </div>
        </>
    );
}
