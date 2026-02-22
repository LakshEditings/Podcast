import { useState } from 'react';
import { FiCheck, FiX, FiEye, FiAlertTriangle } from 'react-icons/fi';

const initialContent = [
    { id: 1, title: 'The Future of AI in 2025', creator: 'Sarah Chen', type: 'Episode', date: 'Feb 20', reports: 0, status: 'Approved' },
    { id: 2, title: 'Offensive Content Report #45', creator: 'Unknown', type: 'Episode', date: 'Feb 19', reports: 5, status: 'Flagged' },
    { id: 3, title: 'Morning Breathing Techniques', creator: 'David Park', type: 'Episode', date: 'Feb 21', reports: 0, status: 'Approved' },
    { id: 4, title: 'Clickbait Podcast Title', creator: 'Spam Creator', type: 'Podcast', date: 'Feb 18', reports: 12, status: 'Flagged' },
    { id: 5, title: 'The Vanishing Hiker', creator: 'Julia Ross', type: 'Episode', date: 'Feb 19', reports: 0, status: 'Approved' },
    { id: 6, title: 'New Submission Pending', creator: 'New Creator', type: 'Podcast', date: 'Feb 22', reports: 0, status: 'Pending' },
];

export default function Content() {
    const [content, setContent] = useState(initialContent);
    const [filter, setFilter] = useState('All');
    const updateStatus = (id, status) => setContent(c => c.map(item => item.id === id ? { ...item, status } : item));
    const filtered = filter === 'All' ? content : content.filter(c => c.status === filter);

    return (
        <>
            <style>{`
        .content-page { padding:24px; }
        .content-page h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .toolbar { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .filter-btns { display:flex; gap:6px; }
        .f-btn { padding:8px 16px; border-radius:20px; background:var(--bg-card); color:var(--text-muted); font-size:0.78rem; font-weight:600; border:1px solid var(--border); transition:var(--transition); }
        .f-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        .data-table { width:100%; border-collapse:collapse; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; }
        .data-table th { text-align:left; padding:14px 16px; font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--border); }
        .data-table td { padding:14px 16px; font-size:0.85rem; border-bottom:1px solid var(--border); }
        .data-table tr:hover td { background:var(--bg-card-hover); }
        .status-badge { padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:600; }
        .status-badge.approved { background:rgba(74,222,128,0.15); color:var(--success); }
        .status-badge.flagged { background:rgba(248,113,113,0.15); color:var(--danger); }
        .status-badge.pending { background:rgba(251,191,36,0.15); color:var(--warning); }
        .status-badge.removed { background:rgba(107,114,128,0.15); color:var(--text-muted); }
        .reports-badge { display:flex; align-items:center; gap:4px; font-size:0.8rem; }
        .reports-badge.has-reports { color:var(--danger); font-weight:600; }
        .action-btns { display:flex; gap:6px; }
        .act-btn { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-muted); transition:var(--transition); }
        .act-btn.approve:hover { color:var(--success); background:rgba(74,222,128,0.1); }
        .act-btn.remove:hover { color:var(--danger); background:rgba(248,113,113,0.1); }
        .type-badge { padding:3px 8px; border-radius:8px; font-size:0.7rem; font-weight:600; background:rgba(92,114,133,0.15); color:var(--accent); }
      `}</style>
            <div className="content-page">
                <h1 className="fade-in">📄 Content Moderation</h1>
                <div className="toolbar fade-in">
                    <div className="filter-btns">{['All', 'Approved', 'Pending', 'Flagged', 'Removed'].map(f => <button key={f} className={`f-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
                </div>
                <table className="data-table fade-in">
                    <thead><tr><th>Content</th><th>Creator</th><th>Type</th><th>Date</th><th>Reports</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{filtered.map(c => (
                        <tr key={c.id}>
                            <td style={{ fontWeight: 600 }}>{c.title}</td>
                            <td style={{ color: 'var(--text-muted)' }}>{c.creator}</td>
                            <td><span className="type-badge">{c.type}</span></td>
                            <td>{c.date}</td>
                            <td><span className={`reports-badge ${c.reports > 0 ? 'has-reports' : ''}`}>{c.reports > 0 && <FiAlertTriangle size={12} />}{c.reports}</span></td>
                            <td><span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span></td>
                            <td><div className="action-btns">
                                {c.status !== 'Approved' && <button className="act-btn approve" onClick={() => updateStatus(c.id, 'Approved')} title="Approve"><FiCheck size={14} /></button>}
                                {c.status !== 'Removed' && <button className="act-btn remove" onClick={() => updateStatus(c.id, 'Removed')} title="Remove"><FiX size={14} /></button>}
                            </div></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}
