export default function StatsCard({ icon, label, value, change, color }) {
    return (
        <>
            <style>{`
        .stats-card { padding:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); transition:var(--transition); }
        .stats-card:hover { border-color:var(--primary); transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .stats-icon { width:44px; height:44px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.3rem; margin-bottom:12px; }
        .stats-value { font-size:1.5rem; font-weight:800; margin-bottom:2px; }
        .stats-label { font-size:0.75rem; color:var(--text-muted); }
        .stats-change { font-size:0.72rem; font-weight:600; margin-top:8px; }
        .stats-change.up { color:var(--success); }
        .stats-change.down { color:var(--danger); }
      `}</style>
            <div className="stats-card fade-in">
                <div className="stats-icon" style={{ background: `${color}22`, color }}>{icon}</div>
                <p className="stats-value">{value}</p>
                <p className="stats-label">{label}</p>
                {change && <p className={`stats-change ${change > 0 ? 'up' : 'down'}`}>{change > 0 ? '↑' : '↓'} {Math.abs(change)}% this week</p>}
            </div>
        </>
    );
}
