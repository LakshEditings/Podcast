import { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiShield } from 'react-icons/fi';

const initialUsers = [
    { id: 1, name: 'Alex Morgan', email: 'alex@example.com', joined: 'Feb 10, 2025', podcasts: 0, status: 'Active' },
    { id: 2, name: 'Priya Kumar', email: 'priya@example.com', joined: 'Jan 22, 2025', podcasts: 0, status: 'Active' },
    { id: 3, name: 'Jordan Lee', email: 'jordan@example.com', joined: 'Dec 15, 2024', podcasts: 0, status: 'Banned' },
    { id: 4, name: 'Sam Wilson', email: 'sam@example.com', joined: 'Feb 18, 2025', podcasts: 0, status: 'Active' },
    { id: 5, name: 'Taylor Davis', email: 'taylor@example.com', joined: 'Nov 3, 2024', podcasts: 0, status: 'Active' },
    { id: 6, name: 'Mike Chen', email: 'mike@example.com', joined: 'Jan 5, 2025', podcasts: 0, status: 'Suspended' },
];

export default function Users() {
    const [users, setUsers] = useState(initialUsers);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const toggleBan = (id) => setUsers(u => u.map(user => user.id === id ? { ...user, status: user.status === 'Banned' ? 'Active' : 'Banned' } : user));
    const filtered = users.filter(u => {
        const mq = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const mf = filter === 'All' || u.status === filter;
        return mq && mf;
    });

    return (
        <>
            <style>{`
        .users-page { padding:24px; }
        .users-page h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .toolbar { display:flex; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
        .tool-search { flex:1; min-width:200px; padding:12px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; }
        .tool-search::placeholder { color:var(--text-muted); }
        .filter-btns { display:flex; gap:6px; }
        .f-btn { padding:8px 16px; border-radius:20px; background:var(--bg-card); color:var(--text-muted); font-size:0.78rem; font-weight:600; border:1px solid var(--border); transition:var(--transition); }
        .f-btn.active { background:var(--primary); color:white; border-color:var(--primary); }
        .data-table { width:100%; border-collapse:collapse; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); overflow:hidden; }
        .data-table th { text-align:left; padding:14px 16px; font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--border); }
        .data-table td { padding:14px 16px; font-size:0.85rem; border-bottom:1px solid var(--border); }
        .data-table tr:hover td { background:var(--bg-card-hover); }
        .user-cell { display:flex; align-items:center; gap:10px; }
        .user-avatar { width:32px; height:32px; border-radius:50%; background:var(--gradient-primary); color:white; display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; }
        .status-badge { padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:600; }
        .status-badge.active { background:rgba(74,222,128,0.15); color:var(--success); }
        .status-badge.banned { background:rgba(248,113,113,0.15); color:var(--danger); }
        .status-badge.suspended { background:rgba(251,191,36,0.15); color:var(--warning); }
        .action-btns { display:flex; gap:6px; }
        .act-btn { width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-muted); transition:var(--transition); }
        .act-btn:hover { color:var(--accent); background:var(--bg-card-hover); }
        .act-btn.danger:hover { color:var(--danger); }
        .count-text { font-size:0.82rem; color:var(--text-muted); margin-bottom:12px; }
      `}</style>
            <div className="users-page">
                <h1 className="fade-in">👥 User Management</h1>
                <div className="toolbar fade-in">
                    <input className="tool-search" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
                    <div className="filter-btns">{['All', 'Active', 'Banned', 'Suspended'].map(f => <button key={f} className={`f-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}</div>
                </div>
                <p className="count-text">{filtered.length} users found</p>
                <table className="data-table fade-in">
                    <thead><tr><th>User</th><th>Email</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>{filtered.map(u => (
                        <tr key={u.id}>
                            <td><div className="user-cell"><div className="user-avatar">{u.name[0]}</div>{u.name}</div></td>
                            <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                            <td>{u.joined}</td>
                            <td><span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span></td>
                            <td><div className="action-btns"><button className="act-btn" title="Edit"><FiEdit2 size={14} /></button><button className="act-btn" onClick={() => toggleBan(u.id)} title={u.status === 'Banned' ? 'Unban' : 'Ban'}><FiShield size={14} /></button></div></td>
                        </tr>
                    ))}</tbody>
                </table>
            </div>
        </>
    );
}
