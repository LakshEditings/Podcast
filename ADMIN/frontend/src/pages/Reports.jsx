export default function Reports() {
    const monthly = [
        { month: 'Jan', users: 1800, listens: 180000 }, { month: 'Feb', users: 2200, listens: 220000 },
        { month: 'Mar', users: 1900, listens: 195000 }, { month: 'Apr', users: 2600, listens: 260000 },
        { month: 'May', users: 2400, listens: 240000 }, { month: 'Jun', users: 3100, listens: 310000 },
    ];
    const maxL = Math.max(...monthly.map(m => m.listens));
    const topCats = [
        { name: 'True Crime', pct: 28 }, { name: 'Comedy', pct: 24 }, { name: 'Technology', pct: 18 },
        { name: 'History', pct: 16 }, { name: 'Wellness', pct: 14 },
    ];

    return (
        <>
            <style>{`
        .reports{padding:24px}.reports h1{font-size:1.6rem;font-weight:800;margin-bottom:24px}
        .report-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}
        .report-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px}
        .report-card h2{font-size:1rem;font-weight:700;margin-bottom:16px}
        .chart{display:flex;align-items:flex-end;gap:12px;height:180px}
        .bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px}
        .bar{width:100%;background:var(--gradient-primary);border-radius:6px 6px 0 0;min-height:4px;transition:height .6s}
        .bar:hover{filter:brightness(1.2)}
        .bar-label{font-size:.65rem;color:var(--text-muted)}
        .bar-val{font-size:.6rem;color:var(--accent);font-weight:600}
        .h-bars{display:flex;flex-direction:column;gap:10px}
        .h-bar-item{display:flex;align-items:center;gap:12px}
        .h-bar-lbl{font-size:.82rem;min-width:90px}
        .h-bar-bg{flex:1;height:12px;background:var(--bg-input);border-radius:6px;overflow:hidden}
        .h-bar-fill{height:100%;background:var(--gradient-primary);border-radius:6px;transition:width .6s}
        .h-bar-pct{font-size:.78rem;font-weight:600;color:var(--accent);min-width:36px;text-align:right}
        .summary-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:24px}
        .sum-card{padding:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);text-align:center}
        .sum-val{font-size:1.4rem;font-weight:800;color:var(--accent)}
        .sum-lbl{font-size:.75rem;color:var(--text-muted);margin-top:4px}
        @media(max-width:768px){.report-grid{grid-template-columns:1fr}.summary-cards{grid-template-columns:1fr}}
      `}</style>
            <div className="reports">
                <h1 className="fade-in">📊 Platform Reports</h1>
                <div className="report-grid">
                    <div className="report-card fade-in">
                        <h2>Monthly Listens</h2>
                        <div className="chart">{monthly.map(m => <div key={m.month} className="bar-wrap"><span className="bar-val">{(m.listens / 1000).toFixed(0)}K</span><div className="bar" style={{ height: `${(m.listens / maxL) * 140}px` }} /><span className="bar-label">{m.month}</span></div>)}</div>
                    </div>
                    <div className="report-card fade-in">
                        <h2>Top Categories</h2>
                        <div className="h-bars">{topCats.map(c => <div key={c.name} className="h-bar-item"><span className="h-bar-lbl">{c.name}</span><div className="h-bar-bg"><div className="h-bar-fill" style={{ width: `${c.pct}%` }} /></div><span className="h-bar-pct">{c.pct}%</span></div>)}</div>
                    </div>
                </div>
                <div className="summary-cards">
                    <div className="sum-card fade-in"><p className="sum-val">₹24,500</p><p className="sum-lbl">Revenue This Month</p></div>
                    <div className="sum-card fade-in"><p className="sum-val">1,245</p><p className="sum-lbl">New Users This Month</p></div>
                    <div className="sum-card fade-in"><p className="sum-val">89%</p><p className="sum-lbl">User Retention</p></div>
                </div>
            </div>
        </>
    );
}
