import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiHeart, FiClock, FiTrash2 } from 'react-icons/fi';

const initialSubscriptions = [
    { id: 1, title: 'Tech Unplugged', creator: 'Sarah Chen', emoji: '💻', lastEp: '2 days ago', newEps: 3 },
    { id: 3, title: 'Crime Files', creator: 'Julia Ross', emoji: '🔍', lastEp: '1 day ago', newEps: 1 },
    { id: 6, title: 'Comedy Hour', creator: 'Jake Torres', emoji: '😂', lastEp: '5 hours ago', newEps: 2 },
];
const initialDownloads = [
    { id: 1, title: 'The Future of AI in 2025', podcast: 'Tech Unplugged', duration: '42:15', size: '38 MB' },
    { id: 7, title: 'The Vanishing Hiker', podcast: 'Crime Files', duration: '48:33', size: '44 MB' },
];
const initialHistory = [
    { id: 1, title: 'Morning Breathing Techniques', podcast: 'Mindful Mornings', progress: 78, duration: '22:10' },
    { id: 2, title: 'From Garage to IPO', podcast: 'Startup Stories', progress: 45, duration: '45:00' },
    { id: 3, title: 'The Fall of Rome', podcast: 'History Rewind', progress: 100, duration: '58:22' },
];

export default function Library() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('subscriptions');
    const [subs] = useState(initialSubscriptions);
    const [downloads] = useState(initialDownloads);
    const [history] = useState(initialHistory);

    return (
        <>
            <style>{`
        .page-container { max-width:1200px; margin:0 auto; padding:24px 20px 120px; }
        .page-title { font-size:1.5rem; font-weight:800; margin-bottom:20px; }
        .lib-tabs { display:flex; gap:4px; margin-bottom:20px; background:var(--bg-card); border-radius:var(--radius-md); padding:4px; border:1px solid var(--border); }
        .lib-tab { flex:1; padding:10px; border-radius:var(--radius-sm); background:transparent; color:var(--text-muted); font-size:0.8rem; font-weight:600; transition:var(--transition); }
        .lib-tab.active { background:var(--primary); color:white; }
        .lib-list { display:flex; flex-direction:column; gap:8px; }
        .lib-item { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer; transition:var(--transition); }
        .lib-item:hover { border-color:var(--primary); background:var(--bg-card-hover); }
        .lib-thumb { width:44px; height:44px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0; background:var(--gradient-primary); }
        .lib-info { flex:1; min-width:0; }
        .lib-title { font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .lib-sub { font-size:0.72rem; color:var(--text-muted); margin-top:2px; }
        .lib-badge { background:var(--danger); color:white; padding:2px 8px; border-radius:10px; font-size:0.65rem; font-weight:700; }
        .lib-meta { font-size:0.72rem; color:var(--text-muted); text-align:right; white-space:nowrap; }
        .progress-mini { width:60px; height:4px; background:var(--bg-input); border-radius:2px; margin-top:4px; }
        .progress-mini-fill { height:100%; background:var(--gradient-primary); border-radius:2px; }
        .lib-del { width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-muted); border:none; transition:var(--transition); }
        .lib-del:hover { color:var(--danger); }
        .empty-state { text-align:center; padding:60px 20px; color:var(--text-muted); }
        .empty-state span { font-size:3rem; display:block; margin-bottom:12px; }
      `}</style>
            <div className="page-container">
                <h1 className="page-title fade-in">Your Library</h1>
                <div className="lib-tabs fade-in">
                    {['subscriptions', 'downloads', 'history'].map(t => <button key={t} className={`lib-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
                </div>
                {tab === 'subscriptions' && (
                    <div className="lib-list">{subs.map(s => (
                        <div key={s.id} className="lib-item fade-in" onClick={() => navigate(`/podcast/${s.id}`)}>
                            <div className="lib-thumb">{s.emoji}</div>
                            <div className="lib-info"><p className="lib-title">{s.title}</p><p className="lib-sub">{s.creator} • {s.lastEp}</p></div>
                            {s.newEps > 0 && <span className="lib-badge">{s.newEps} new</span>}
                        </div>
                    ))}</div>
                )}
                {tab === 'downloads' && (
                    <div className="lib-list">{downloads.map(d => (
                        <div key={d.id} className="lib-item fade-in">
                            <div className="lib-thumb"><FiDownload size={18} color="white" /></div>
                            <div className="lib-info"><p className="lib-title">{d.title}</p><p className="lib-sub">{d.podcast} • {d.duration}</p></div>
                            <div className="lib-meta"><span>{d.size}</span></div>
                            <button className="lib-del"><FiTrash2 size={14} /></button>
                        </div>
                    ))}</div>
                )}
                {tab === 'history' && (
                    <div className="lib-list">{history.map(h => (
                        <div key={h.id} className="lib-item fade-in">
                            <div className="lib-thumb"><FiClock size={18} color="white" /></div>
                            <div className="lib-info"><p className="lib-title">{h.title}</p><p className="lib-sub">{h.podcast}</p></div>
                            <div className="lib-meta"><span>{h.progress}%</span><div className="progress-mini"><div className="progress-mini-fill" style={{ width: `${h.progress}%` }} /></div></div>
                        </div>
                    ))}</div>
                )}
            </div>
        </>
    );
}
