import { useState } from 'react';

const initialSubs = [
    { id: 1, name: 'Alex Morgan', email: 'alex@example.com', joined: 'Feb 10, 2025', listens: 142, status: 'Active' },
    { id: 2, name: 'Priya Kumar', email: 'priya@example.com', joined: 'Jan 22, 2025', listens: 98, status: 'Active' },
    { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', joined: 'Dec 15, 2024', listens: 234, status: 'Active' },
    { id: 4, name: 'Sam Wilson', email: 'sam@example.com', joined: 'Feb 18, 2025', listens: 45, status: 'New' },
    { id: 5, name: 'Taylor Swift', email: 'taylor@example.com', joined: 'Nov 3, 2024', listens: 312, status: 'Active' },
    { id: 6, name: 'Mike Chen', email: 'mike@example.com', joined: 'Jan 5, 2025', listens: 67, status: 'Inactive' },
];

export default function Subscribers() {
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const filtered = initialSubs.filter(s => {
        const mq = !search || s.name.toLowerCase().includes(search.toLowerCase());
        const mf = filter === 'All' || s.status === filter;
        return mq && mf;
    });

    return (
        <>
            <style>{`
        .subs-page { padding:24px; }
        .subs-page h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .subs-toolbar { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .subs-search { flex:1; min-width:200px; padding:12px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; }
        .subs-search::placeholder { color:var(--text-muted); }
        .subs-filter { display:flex; gap:6px; }
        .sf-btn { padding:8px 16px; border-radius:20px; background:var(--bg-card); color:var(--text-muted); font-size:0.78rem; font-weight:600; border:1px solid var(--border); transition:var(--transition); }
        .sf-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        .subs-table { width:100%; border-collapse:collapse; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; }
        .subs-table th { text-align:left; padding:14px 16px; font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--border); background:var(--bg-card); }
        .subs-table td { padding:14px 16px; font-size:0.85rem; border-bottom:1px solid var(--border); }
        .subs-table tr:hover td { background:var(--bg-card-hover); }
        .sub-avatar { width:32px; height:32px; border-radius:50%; background:var(--gradient-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; }
        .sub-name-cell { display:flex; align-items:center; gap:10px; }
        .sub-status { padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:600; }
        .sub-status.active { background:rgba(74,222,128,0.15); color:var(--success); }
        .sub-status.new { background:rgba(92,114,133,0.2); color:var(--accent); }
        .sub-status.inactive { background:rgba(248,113,113,0.15); color:var(--danger); }
        .subs-count { font-size:0.82rem; color:var(--text-muted); margin-bottom:16px; }
      `}</style>
            <div className="subs-page">
                <h1 className="fade-in">👥 Audience</h1>
                <div className="subs-toolbar fade-in">
                    <input className="subs-search" placeholder="Search subscribers..." value={search} onChange={e => setSearch(e.target.value)} />
                    <div className="subs-filter">{['All', 'Active', 'New', 'Inactive'].map(f => <button key={f} className={`sf-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
                </div>
                <p className="subs-count">{filtered.length} subscribers found</p>
                <table className="subs-table fade-in">
                    <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Total Listens</th><th>Status</th></tr></thead>
                    <tbody>{filtered.map(s => (
                        <tr key={s.id}>
                            <td><div className="sub-name-cell"><div className="sub-avatar">{s.name[0]}</div>{s.name}</div></td>
                            <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                            <td>{s.joined}</td>
                            <td>{s.listens}</td>
                            <td><span className={`sub-status ${s.status.toLowerCase()}`}>{s.status}</span></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}
