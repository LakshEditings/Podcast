import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiBell, FiShare2, FiDownload, FiAward, FiZap, FiClock, FiTrendingUp } from 'react-icons/fi';
import EpisodeCard from '../components/EpisodeCard';
import PollCard from '../components/PollCard';
import CommentSection from '../components/CommentSection';
import QuizModal from '../components/QuizModal';

const API = 'http://localhost:5001/api';
const CREATOR_API = 'http://localhost:5002';

export default function PodcastDetail({ onPlay }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribed, setSubscribed] = useState(false);
    const [notif, setNotif] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showQuiz, setShowQuiz] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [selectedEpForQuiz, setSelectedEpForQuiz] = useState(null);
    const [tab, setTab] = useState('episodes');
    const colors = ['#5C7285', '#818C78', '#A7B49E', '#7a6b5d', '#6b7a8a'];

    useEffect(() => {
        fetch(`${API}/podcasts/${id}`)
            .then(r => r.json())
            .then(data => {
                setPodcast(data.podcast);
                setEpisodes(data.episodes || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    const handlePlayEpisode = (ep) => {
        const audioUrl = ep.audioFile ? `${CREATOR_API}${ep.audioFile}` : null;
        onPlay({
            ...podcast,
            episodeTitle: ep.title,
            episodeId: ep._id,
            duration: ep.duration,
            audioUrl,
            creatorName: podcast.creatorName,
        });
    };

    const handleTakeQuiz = async (ep) => {
        try {
            const res = await fetch(`${API}/quizPolls/quiz/${ep._id}`);
            if (res.ok) {
                const quiz = await res.json();
                setQuizData(quiz);
                setSelectedEpForQuiz(ep);
                setShowQuiz(true);
            } else {
                alert('No quiz available for this episode yet!');
            }
        } catch { alert('Could not load quiz'); }
    };

    if (loading) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Loading podcast...</div>;
    if (!podcast) return <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>Podcast not found</div>;

    const idx = podcast._id ? podcast._id.charCodeAt(podcast._id.length - 1) : 0;
    const color = colors[idx % colors.length];

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
        .quiz-promo { display:flex; align-items:center; gap:16px; padding:24px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border); margin-bottom:12px; }
        .quiz-promo-icon { font-size:2.5rem; }
        .quiz-promo h3 { font-size:1rem; margin-bottom:4px; }
        .quiz-promo p { font-size:0.8rem; color:var(--text-muted); }
        .qp-btn { margin-left:auto; white-space:nowrap; background:var(--gradient-primary); color:white; padding:12px 28px; border-radius:var(--radius-md); font-weight:600; transition:var(--transition); border:none; cursor:pointer; }
        .qp-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .no-data { text-align:center; padding:40px; color:var(--text-muted); font-size:0.85rem; }

        .lb-container { animation:fadeIn 0.4s ease-out; }
        .lb-header-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; margin-bottom:16px; display:flex; align-items:center; gap:16px; }
        .lb-trophy { font-size:2.5rem; }
        .lb-header-info h3 { font-size:1.1rem; font-weight:700; margin-bottom:4px; }
        .lb-header-info p { font-size:0.8rem; color:var(--text-muted); line-height:1.5; }
        .lb-scoring { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .lb-score-chip { display:flex; align-items:center; gap:6px; padding:8px 14px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); font-size:0.75rem; color:var(--text-secondary); }
        .lb-score-chip svg { color:var(--accent); }
        .lb-cta { display:flex; align-items:center; justify-content:center; gap:10px; margin-top:16px; padding:16px; background:var(--bg-card); border:1px dashed var(--border); border-radius:var(--radius-md); }
        .lb-cta p { font-size:0.85rem; color:var(--text-muted); }
        .lb-cta-btn { background:var(--gradient-primary); color:white; padding:10px 22px; border-radius:var(--radius-md); font-weight:600; font-size:0.85rem; transition:var(--transition); border:none; cursor:pointer; }
        .lb-cta-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        @media(max-width:480px) { .lb-scoring { flex-direction:column; } }
      `}</style>
            <div className="page-container">
                <button className="back-btn" onClick={() => navigate(-1)}><FiArrowLeft size={20} /></button>
                <div className="pd-hero fade-in" style={{ background: `linear-gradient(135deg, ${color}, ${color}66)` }}>
                    <span className="pd-emoji">{podcast.emoji || '🎙️'}</span>
                    <div className="pd-info">
                        <h1>{podcast.title}</h1>
                        <p className="pd-creator">{podcast.creatorName}</p>
                        <div className="pd-stats">
                            <span>{(podcast.subscribers || 0).toLocaleString()} subscribers</span><span>•</span>
                            <span>{episodes.length} episode{episodes.length !== 1 ? 's' : ''}</span><span>•</span>
                            <span>{podcast.language}</span>
                        </div>
                    </div>
                </div>
                <p className="pd-desc fade-in">{podcast.description}</p>
                <div className="pd-actions fade-in">
                    <button className={`pd-sub-btn ${subscribed ? 'active' : ''}`} onClick={() => setSubscribed(!subscribed)}>{subscribed ? '✓ Subscribed' : 'Subscribe'}</button>
                    <button className={`pd-act-btn ${liked ? 'liked' : ''}`} onClick={() => setLiked(!liked)}><FiHeart size={18} /></button>
                    <button className={`pd-act-btn ${notif ? 'notif-on' : ''}`} onClick={() => setNotif(!notif)}><FiBell size={18} /></button>
                    <button className="pd-act-btn"><FiShare2 size={18} /></button>
                </div>
                <div className="pd-tabs fade-in">
                    {['episodes', 'quizzes', 'community', 'leaderboard'].map(t => <button key={t} className={`pd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t === 'leaderboard' ? '🏆 Leaderboard' : t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
                </div>
                {tab === 'episodes' && (
                    <div className="pd-episodes">
                        {episodes.length > 0 ? episodes.map((ep, i) => (
                            <EpisodeCard key={ep._id} episode={ep} index={i} onPlay={() => handlePlayEpisode(ep)} onQuiz={() => handleTakeQuiz(ep)} />
                        )) : <p className="no-data">No episodes yet</p>}
                    </div>
                )}
                {tab === 'quizzes' && (
                    <div>
                        {episodes.length > 0 ? episodes.map((ep) => (
                            <div key={ep._id} className="quiz-promo fade-in">
                                <div className="quiz-promo-icon">📝</div>
                                <div><h3>{ep.title} Quiz</h3><p>Test your knowledge after listening!</p></div>
                                <button className="qp-btn" onClick={() => handleTakeQuiz(ep)}>Take Quiz</button>
                            </div>
                        )) : <p className="no-data">No quizzes available</p>}
                    </div>
                )}
                {tab === 'community' && <div><CommentSection /></div>}
                {tab === 'leaderboard' && (
                    <div className="lb-container">
                        <div className="lb-header-card">
                            <span className="lb-trophy">🏆</span>
                            <div className="lb-header-info">
                                <h3>Quiz Leaderboard</h3>
                                <p>Take quizzes to earn points and climb the leaderboard!</p>
                            </div>
                        </div>
                        <div className="lb-scoring">
                            <div className="lb-score-chip"><FiZap size={14} /> Faster answer = More points</div>
                            <div className="lb-score-chip"><FiClock size={14} /> Points = 100 − (seconds × 9), min 10</div>
                            <div className="lb-score-chip"><FiTrendingUp size={14} /> Streak bonus for daily quizzers</div>
                        </div>
                        <div className="lb-cta">
                            <p>Take a quiz to appear on the leaderboard!</p>
                            <button className="lb-cta-btn" onClick={() => setTab('quizzes')}>Take Quiz →</button>
                        </div>
                    </div>
                )}
                {showQuiz && quizData && (
                    <QuizModal quiz={{
                        title: `${selectedEpForQuiz?.title} Quiz`,
                        questions: quizData.questions || [],
                        passScore: Math.ceil((quizData.questions?.length || 5) * 0.6),
                        reward: 50,
                    }} onClose={() => setShowQuiz(false)} />
                )}
            </div>
        </>
    );
}
