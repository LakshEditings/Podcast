import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiHeart, FiBell, FiShare2, FiDownload } from 'react-icons/fi';
import EpisodeCard from '../components/EpisodeCard';
import PollCard from '../components/PollCard';
import CommentSection from '../components/CommentSection';
import QuizModal from '../components/QuizModal';
import { mockPodcasts, mockEpisodes, mockQuiz, mockPolls } from '../data/mockData';

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
        .pd-tabs { display:flex; gap:4px; margin-bottom:20px; background:var(--bg-card); border-radius:var(--radius-md); padding:4px; border:1px solid var(--border); }
        .pd-tab { flex:1; padding:10px; border-radius:var(--radius-sm); background:transparent; color:var(--text-muted); font-size:0.82rem; font-weight:600; transition:var(--transition); }
        .pd-tab.active { background:var(--primary); color:white; }
        .pd-episodes { display:flex; flex-direction:column; gap:8px; }
        .quiz-promo { display:flex; align-items:center; gap:16px; padding:24px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border); }
        .quiz-promo-icon { font-size:2.5rem; }
        .quiz-promo h3 { font-size:1rem; margin-bottom:4px; }
        .quiz-promo p { font-size:0.8rem; color:var(--text-muted); }
        .qp-btn { margin-left:auto; white-space:nowrap; background:var(--gradient-primary); color:white; padding:12px 28px; border-radius:var(--radius-md); font-weight:600; transition:var(--transition); }
        .qp-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
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
                    {['episodes', 'community', 'quizzes'].map(t => <button key={t} className={`pd-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
                </div>
                {tab === 'episodes' && <div className="pd-episodes">{displayEps.map((ep, i) => <EpisodeCard key={ep.id} episode={ep} index={i} onPlay={() => onPlay({ ...podcast, episodeTitle: ep.title, duration: ep.duration })} />)}</div>}
                {tab === 'community' && <div>{mockPolls.map(p => <PollCard key={p.id} poll={p} />)}<CommentSection /></div>}
                {tab === 'quizzes' && <div className="quiz-promo"><div className="quiz-promo-icon">📝</div><div><h3>{mockQuiz.title}</h3><p>Score {mockQuiz.passScore}+ to earn ₹{mockQuiz.reward}!</p></div><button className="qp-btn" onClick={() => setShowQuiz(true)}>Take Quiz</button></div>}
                {showQuiz && <QuizModal quiz={mockQuiz} onClose={() => setShowQuiz(false)} />}
            </div>
        </>
    );
}
