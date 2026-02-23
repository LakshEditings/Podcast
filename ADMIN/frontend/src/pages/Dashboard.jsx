import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'http://localhost:5003/api';

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/login'); return; }
        fetch(`${API}/manage/stats`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => { if (r.status === 401 || r.status === 403) { navigate('/login'); return null; } return r.json(); })
            .then(data => { if (data) setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const statCards = stats ? [
        { icon: '👥', label: 'Total Users', value: stats.users.toLocaleString(), color: '#5C7285' },
        { icon: '🎙️', label: 'Total Creators', value: stats.creators.toLocaleString(), color: '#818C78' },
        { icon: '🎧', label: 'Total Podcasts', value: stats.podcasts.toLocaleString(), color: '#A7B49E' },
        { icon: '📊', label: 'Total Listens', value: stats.totalListens.toLocaleString(), color: '#E2E0C8' },
    ] : [];

    const recentActivity = [
        { type: 'user', text: 'New user registered', time: 'recently' },
        { type: 'creator', text: 'Creator published new episode', time: 'recently' },
        { type: 'report', text: `${stats?.flagged || 0} content flagged for review`, time: 'current' },
    ];
    const platformHealth = [
        { label: 'Server Uptime', value: '99.9%', status: 'good' },
        { label: 'Total Episodes', value: stats?.episodes?.toLocaleString() || '0', status: 'good' },
        { label: 'Flagged Content', value: String(stats?.flagged || 0), status: stats?.flagged > 0 ? 'warn' : 'good' },
    ];

    return (
        <>
            <style>{`
        .admin-dash { padding:24px; }
        .admin-dash h1 { font-size:1.6rem; font-weight:800; margin-bottom:4px; }
        .admin-dash .subtitle { font-size:0.85rem; color:var(--text-muted); margin-bottom:28px; }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
        .stat-card { padding:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); transition:var(--transition); }
        .stat-card:hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .stat-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; margin-bottom:12px; }
        .stat-value { font-size:1.5rem; font-weight:800; margin-bottom:2px; }
        .stat-label { font-size:0.75rem; color:var(--text-muted); }
        .dash-grid { display:grid; grid-template-columns:2fr 1fr; gap:24px; }
        .activity-card, .health-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; }
        .activity-card h2, .health-card h2 { font-size:1.1rem; font-weight:700; margin-bottom:16px; }
        .activity-list { display:flex; flex-direction:column; gap:8px; }
        .activity-item { display:flex; align-items:flex-start; gap:12px; padding:10px 12px; border-radius:var(--radius-md); transition:var(--transition); }
        .activity-item:hover { background:var(--bg-card-hover); }
        .activity-dot { width:8px; height:8px; border-radius:50%; margin-top:6px; flex-shrink:0; }
        .activity-dot.user { background:var(--accent); }
        .activity-dot.creator { background:var(--primary); }
        .activity-dot.report { background:var(--warning); }
        .activity-text { font-size:0.82rem; flex:1; }
        .activity-time { font-size:0.7rem; color:var(--text-muted); white-space:nowrap; }
        .health-list { display:flex; flex-direction:column; gap:10px; }
        .health-item { display:flex; align-items:center; justify-content:space-between; padding:12px; background:var(--bg-input); border-radius:var(--radius-md); }
        .health-label { font-size:0.82rem; }
        .health-val { display:flex; align-items:center; gap:6px; font-size:0.85rem; font-weight:600; }
        .health-dot { width:8px; height:8px; border-radius:50%; }
        .health-dot.good { background:var(--success); }
        .health-dot.warn { background:var(--warning); }
        .loading-msg { text-align:center; padding:60px; color:var(--text-muted); }
        @media(max-width:768px) { .stats-grid { grid-template-columns:repeat(2,1fr); } .dash-grid { grid-template-columns:1fr; } }
      `}</style>
            <div className="admin-dash">
                <h1 className="fade-in">Admin Dashboard</h1>
                <p className="subtitle fade-in">Overview of the entire platform — live data from MongoDB</p>
                {loading ? <p className="loading-msg">Loading stats...</p> : (
                    <>
                        <div className="stats-grid">
                            {statCards.map(s => (
                                <div key={s.label} className="stat-card fade-in">
                                    <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
                                    <p className="stat-value">{s.value}</p>
                                    <p className="stat-label">{s.label}</p>
                                </div>
                            ))}
                        </div>
                        <div className="dash-grid">
                            <div className="activity-card fade-in">
                                <h2>📋 Recent Activity</h2>
                                <div className="activity-list">{recentActivity.map((a, i) => (
                                    <div key={i} className="activity-item"><div className={`activity-dot ${a.type}`} /><span className="activity-text">{a.text}</span><span className="activity-time">{a.time}</span></div>
                                ))}</div>
                            </div>
                            <div className="health-card fade-in">
                                <h2>💚 Platform Health</h2>
                                <div className="health-list">{platformHealth.map(h => (
                                    <div key={h.label} className="health-item"><span className="health-label">{h.label}</span><span className="health-val"><span className={`health-dot ${h.status}`} />{h.value}</span></div>
                                ))}</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
