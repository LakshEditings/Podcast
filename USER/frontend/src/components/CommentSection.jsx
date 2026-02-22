import { useState } from 'react';
import { FiSend, FiHeart, FiMessageCircle, FiBookmark } from 'react-icons/fi';

const initialComments = [
    { id: 1, user: 'Alex M.', text: 'This part was so insightful! Loved the explanation at 12:30.', time: '2h ago', likes: 14, isTag: false },
    { id: 2, user: 'Priya K.', text: '#8:15 Can someone explain the concept discussed here?', time: '4h ago', likes: 6, isTag: true },
    { id: 3, user: 'Jordan L.', text: 'Best episode yet! The quiz was fun too 🎉', time: '1d ago', likes: 23, isTag: false },
];

export default function CommentSection() {
    const [comments, setComments] = useState(initialComments);
    const [input, setInput] = useState('');
    const [filter, setFilter] = useState('all');

    const handleSubmit = () => {
        if (!input.trim()) return;
        setComments(c => [{ id: Date.now(), user: 'You', text: input, time: 'Just now', likes: 0, isTag: input.startsWith('#') }, ...c]);
        setInput('');
    };
    const toggleLike = (id) => setComments(c => c.map(cm => cm.id === id ? { ...cm, likes: cm.likes + 1 } : cm));
    const filtered = filter === 'tags' ? comments.filter(c => c.isTag) : comments;

    return (
        <>
            <style>{`
        .comment-section { margin-top:24px; }
        .comment-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
        .comment-header h3 { display:flex; align-items:center; gap:8px; font-size:1.1rem; }
        .comment-filters { display:flex; gap:8px; }
        .comment-filter { padding:6px 14px; border-radius:20px; background:var(--bg-card); color:var(--text-muted); font-size:0.75rem; font-weight:600; border:1px solid var(--border); transition:var(--transition); }
        .comment-filter.active { background:var(--primary); color:white; border-color:var(--primary); }
        .comment-input-box { display:flex; align-items:center; gap:8px; padding:4px 4px 4px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); margin-bottom:16px; }
        .comment-input-box input { flex:1; background:transparent; color:var(--text-primary); font-size:0.85rem; padding:12px 0; }
        .comment-input-box input::placeholder { color:var(--text-muted); }
        .ci-send { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:var(--gradient-primary); color:white; border:none; transition:var(--transition); }
        .comment-list { display:flex; flex-direction:column; gap:8px; }
        .comment-item { display:flex; gap:12px; padding:14px; background:var(--bg-card); border-radius:var(--radius-md); border:1px solid var(--border); }
        .comment-item.tagged { border-left:3px solid var(--accent); }
        .comment-avatar { width:32px; height:32px; border-radius:50%; background:var(--gradient-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; }
        .comment-body { flex:1; min-width:0; }
        .comment-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; }
        .comment-top strong { font-size:0.8rem; }
        .comment-top span { font-size:0.7rem; color:var(--text-muted); }
        .comment-body p { font-size:0.82rem; line-height:1.5; color:var(--text-secondary); }
        .comment-actions { display:flex; gap:16px; margin-top:8px; }
        .comment-actions button { display:flex; align-items:center; gap:4px; background:none; color:var(--text-muted); font-size:0.72rem; transition:var(--transition); border:none; cursor:pointer; }
        .comment-actions button:hover { color:var(--accent); }
      `}</style>
            <div className="comment-section">
                <div className="comment-header">
                    <h3><FiMessageCircle /> Discussion</h3>
                    <div className="comment-filters">
                        <button className={`comment-filter ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`comment-filter ${filter === 'tags' ? 'active' : ''}`} onClick={() => setFilter('tags')}>Tagged</button>
                    </div>
                </div>
                <div className="comment-input-box">
                    <input placeholder="Add a comment... (use # to tag a moment)" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
                    <button className="ci-send" onClick={handleSubmit}><FiSend size={16} /></button>
                </div>
                <div className="comment-list">
                    {filtered.map(c => (
                        <div key={c.id} className={`comment-item fade-in ${c.isTag ? 'tagged' : ''}`}>
                            <div className="comment-avatar">{c.user[0]}</div>
                            <div className="comment-body">
                                <div className="comment-top"><strong>{c.user}</strong><span>{c.time}</span></div>
                                <p>{c.text}</p>
                                <div className="comment-actions">
                                    <button onClick={() => toggleLike(c.id)}><FiHeart size={12} /> {c.likes}</button>
                                    <button><FiMessageCircle size={12} /> Reply</button>
                                    <button><FiBookmark size={12} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
