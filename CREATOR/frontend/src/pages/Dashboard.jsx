import StatsCard from '../components/StatsCard';
import { FiTrendingUp, FiUsers, FiHeadphones, FiStar } from 'react-icons/fi';

const recentEps = [
    { id: 1, title: 'The Future of AI in 2025', date: 'Feb 20', listens: 8500, status: 'Published' },
    { id: 2, title: 'Web3 Reality Check', date: 'Feb 13', listens: 6200, status: 'Published' },
    { id: 3, title: 'Quantum Computing Explained', date: 'Feb 6', listens: 12000, status: 'Published' },
    { id: 4, title: 'Edge Computing Deep Dive', date: 'Draft', listens: 0, status: 'Draft' },
];

const topMinutes = [
    { minute: '12:30', views: 4500 },
    { minute: '8:15', views: 3800 },
    { minute: '25:42', views: 3200 },
    { minute: '5:00', views: 2900 },
    { minute: '38:20', views: 2100 },
];

export default function Dashboard() {
    return (
        <>
            <style>{`
        .dashboard { padding:24px; }
        .dash-header { margin-bottom:28px; }
        .dash-header h1 { font-size:1.6rem; font-weight:800; margin-bottom:4px; }
        .dash-header p { font-size:0.85rem; color:var(--text-muted); }
        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
        .dash-section { margin-bottom:32px; }
        .dash-section h2 { font-size:1.1rem; font-weight:700; margin-bottom:16px; }
        .ep-table { width:100%; border-collapse:collapse; }
        .ep-table th { text-align:left; padding:12px 16px; font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid var(--border); }
        .ep-table td { padding:14px 16px; font-size:0.85rem; border-bottom:1px solid var(--border); }
        .ep-table tr:hover td { background:var(--bg-card-hover); }
        .ep-status { padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:600; }
        .ep-status.published { background:rgba(74,222,128,0.15); color:var(--success); }
        .ep-status.draft { background:rgba(251,191,36,0.15); color:var(--warning); }
        .minutes-list { display:flex; flex-direction:column; gap:8px; }
        .minute-item { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); }
        .minute-time { font-size:0.9rem; font-weight:700; color:var(--accent); min-width:50px; }
        .minute-bar-bg { flex:1; height:8px; background:var(--bg-input); border-radius:4px; overflow:hidden; }
        .minute-bar { height:100%; background:var(--gradient-primary); border-radius:4px; }
        .minute-views { font-size:0.75rem; color:var(--text-muted); min-width:60px; text-align:right; }
        @media(max-width:768px) { .stats-grid { grid-template-columns:repeat(2,1fr); } }
        .dash-row { display:grid; grid-template-columns:2fr 1fr; gap:24px; }
        @media(max-width:768px) { .dash-row { grid-template-columns:1fr; } }
      `}</style>
            <div className="dashboard">
                <div className="dash-header fade-in"><h1>Creator Dashboard</h1><p>Welcome back, Sarah! Here's your channel overview.</p></div>
                <div className="stats-grid">
                    <StatsCard icon="🎧" label="Total Listens" value="42.7K" change={12.5} color="#5C7285" />
                    <StatsCard icon="👥" label="Subscribers" value="12,400" change={8.2} color="#818C78" />
                    <StatsCard icon="📈" label="Avg. Listen Time" value="28 min" change={-3.1} color="#A7B49E" />
                    <StatsCard icon="⭐" label="Rating" value="4.8" change={2.0} color="#E2E0C8" />
                </div>
                <div className="dash-row">
                    <div className="dash-section fade-in">
                        <h2>Recent Episodes</h2>
                        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', overflow: 'hidden' }}>
                            <table className="ep-table">
                                <thead><tr><th>Title</th><th>Date</th><th>Listens</th><th>Status</th></tr></thead>
                                <tbody>{recentEps.map(ep => (
                                    <tr key={ep.id}><td style={{ fontWeight: 600 }}>{ep.title}</td><td>{ep.date}</td><td>{ep.listens.toLocaleString()}</td><td><span className={`ep-status ${ep.status.toLowerCase()}`}>{ep.status}</span></td></tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="dash-section fade-in">
                        <h2>🔥 Most Viewed Minutes</h2>
                        <div className="minutes-list">
                            {topMinutes.map((m, i) => (
                                <div key={i} className="minute-item">
                                    <span className="minute-time">{m.minute}</span>
                                    <div className="minute-bar-bg"><div className="minute-bar" style={{ width: `${(m.views / topMinutes[0].views) * 100}%` }} /></div>
                                    <span className="minute-views">{m.views.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
