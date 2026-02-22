export default function Dashboard() {
    const stats = [
        { icon: '👥', label: 'Total Users', value: '24,580', change: 12.4, color: '#5C7285' },
        { icon: '🎙️', label: 'Total Creators', value: '1,245', change: 8.7, color: '#818C78' },
        { icon: '🎧', label: 'Total Podcasts', value: '4,890', change: 15.2, color: '#A7B49E' },
        { icon: '📊', label: 'Total Listens', value: '2.4M', change: 22.1, color: '#E2E0C8' },
    ];
    const recentActivity = [
        { type: 'user', text: 'New user "Alex Morgan" registered', time: '2 min ago' },
        { type: 'creator', text: 'Creator "Sarah Chen" published new episode', time: '15 min ago' },
        { type: 'report', text: 'Content flagged for review: "Episode #45"', time: '1 hr ago' },
        { type: 'user', text: 'User "Jordan Lee" earned quiz reward', time: '2 hrs ago' },
        { type: 'creator', text: 'New creator "Mike Johnson" approved', time: '3 hrs ago' },
    ];
    const platformHealth = [
        { label: 'Server Uptime', value: '99.9%', status: 'good' },
        { label: 'Avg Response Time', value: '120ms', status: 'good' },
        { label: 'Active Users (24h)', value: '3,421', status: 'good' },
        { label: 'Pending Reviews', value: '12', status: 'warn' },
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
        .stat-change { font-size:0.72rem; font-weight:600; margin-top:8px; color:var(--success); }
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
        @media(max-width:768px) { .stats-grid { grid-template-columns:repeat(2,1fr); } .dash-grid { grid-template-columns:1fr; } }
      `}</style>
            <div className="admin-dash">
                <h1 className="fade-in">Admin Dashboard</h1>
                <p className="subtitle fade-in">Overview of the entire platform</p>
                <div className="stats-grid">
                    {stats.map(s => (
                        <div key={s.label} className="stat-card fade-in">
                            <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color }}>{s.icon}</div>
                            <p className="stat-value">{s.value}</p>
                            <p className="stat-label">{s.label}</p>
                            <p className="stat-change">↑ {s.change}% this month</p>
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
            </div>
        </>
    );
}
