import { useState } from 'react';
import { FiCheck, FiX, FiShield } from 'react-icons/fi';

const initialCreators = [
    { id: 1, name: 'Sarah Chen', channel: 'Tech Unplugged', email: 'sarah@example.com', podcasts: 48, subscribers: 12400, status: 'Approved' },
    { id: 2, name: 'David Park', channel: 'Mindful Mornings', email: 'david@example.com', podcasts: 120, subscribers: 45000, status: 'Approved' },
    { id: 3, name: 'Julia Ross', channel: 'Crime Files', email: 'julia@example.com', podcasts: 67, subscribers: 89000, status: 'Approved' },
    { id: 4, name: 'New Creator', channel: 'Future Talks', email: 'new@example.com', podcasts: 0, subscribers: 0, status: 'Pending' },
    { id: 5, name: 'Jake Torres', channel: 'Comedy Hour', email: 'jake@example.com', podcasts: 150, subscribers: 78000, status: 'Approved' },
    { id: 6, name: 'Flagged Creator', channel: 'Bad Content', email: 'flagged@example.com', podcasts: 5, subscribers: 200, status: 'Banned' },
];

export default function Creators() {
    const [creators, setCreators] = useState(initialCreators);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const updateStatus = (id, status) => setCreators(c => c.map(cr => cr.id === id ? { ...cr, status } : cr));
    const filtered = creators.filter(c => {
        const mq = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.channel.toLowerCase().includes(search.toLowerCase());
        const mf = filter === 'All' || c.status === filter;
        return mq && mf;
    });

    return (
        <>
            <style>{`
        .creators-page { padding:24px; }
        .creators-page h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .toolbar { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .tool-search { flex:1; min-width:200px; padding:12px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; }
        .tool-search::placeholder { color:var(--text-muted); }
        .filter-btns { display:flex; gap:6px; }
        .f-btn { padding:8px 16px; border-radius:20px; background:var(--bg-card); color:var(--text-muted); font-size:0.78rem; font-weight:600; border:1px solid var(--border); transition:var(--transition); }
        .f-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        .creator-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        .creator-card { padding:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); transition:var(--transition); }
        .creator-card:hover { border-color:var(--primary); }
        .cc-header { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
        .cc-avatar { width:48px; height:48px; border-radius:50%; background:var(--gradient-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:1.1rem; font-weight:700; }
        .cc-info h3 { font-size:0.95rem; font-weight:700; }
        .cc-info p { font-size:0.75rem; color:var(--text-muted); }
        .cc-stats { display:grid; grid-template-columns:repeat(2,1fr); gap:8px; margin-bottom:12px; }
        .cc-stat { text-align:center; padding:8px; background:var(--bg-input); border-radius:var(--radius-sm); }
        .cc-stat-val { font-size:0.95rem; font-weight:700; color:var(--accent); }
        .cc-stat-label { font-size:0.65rem; color:var(--text-muted); }
        .cc-status { display:flex; align-items:center; justify-content:space-between; }
        .status-badge { padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:600; }
        .status-badge.approved { background:rgba(74,222,128,0.15); color:var(--success); }
        .status-badge.pending { background:rgba(251,191,36,0.15); color:var(--warning); }
        .status-badge.banned { background:rgba(248,113,113,0.15); color:var(--danger); }
        .cc-actions { display:flex; gap:6px; }
        .cc-act { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:var(--transition); }
        .cc-act.approve { background:rgba(74,222,128,0.15); color:var(--success); }
        .cc-act.approve:hover { background:rgba(74,222,128,0.3); }
        .cc-act.reject { background:rgba(248,113,113,0.15); color:var(--danger); }
        .cc-act.reject:hover { background:rgba(248,113,113,0.3); }
        .cc-act.ban { background:rgba(251,191,36,0.15); color:var(--warning); }
        .cc-act.ban:hover { background:rgba(251,191,36,0.3); }
        .count-text { font-size:0.82rem; color:var(--text-muted); margin-bottom:16px; }
        @media(max-width:768px) { .creator-grid { grid-template-columns:1fr; } }
      `}</style>
            <div className="creators-page">
                <h1 className="fade-in">🎙️ Creator Management</h1>
                <div className="toolbar fade-in">
                    <input className="tool-search" placeholder="Search creators..." value={search} onChange={e => setSearch(e.target.value)} />
                    <div className="filter-btns">{['All', 'Approved', 'Pending', 'Banned'].map(f => <button key={f} className={`f-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
                </div>
                <p className="count-text">{filtered.length} creators found</p>
                <div className="creator-grid">
                    {filtered.map(c => (
                        <div key={c.id} className="creator-card fade-in">
                            <div className="cc-header"><div className="cc-avatar">{c.name[0]}</div><div className="cc-info"><h3>{c.channel}</h3><p>{c.name} • {c.email}</p></div></div>
                            <div className="cc-stats"><div className="cc-stat"><p className="cc-stat-val">{c.podcasts}</p><p className="cc-stat-label">Podcasts</p></div><div className="cc-stat"><p className="cc-stat-val">{c.subscribers.toLocaleString()}</p><p className="cc-stat-label">Subscribers</p></div></div>
                            <div className="cc-status">
                                <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                                <div className="cc-actions">
                                    {c.status === 'Pending' && <><button className="cc-act approve" onClick={() => updateStatus(c.id, 'Approved')} title="Approve"><FiCheck size={14} /></button><button className="cc-act reject" onClick={() => updateStatus(c.id, 'Banned')} title="Reject"><FiX size={14} /></button></>}
                                    {c.status === 'Approved' && <button className="cc-act ban" onClick={() => updateStatus(c.id, 'Banned')} title="Ban"><FiShield size={14} /></button>}
                                    {c.status === 'Banned' && <button className="cc-act approve" onClick={() => updateStatus(c.id, 'Approved')} title="Unban"><FiCheck size={14} /></button>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
