import { useState } from 'react';
import StatsCard from '../components/StatsCard';

const weeklyData = [
    { day: 'Mon', listens: 1200 }, { day: 'Tue', listens: 1800 }, { day: 'Wed', listens: 1500 },
    { day: 'Thu', listens: 2100 }, { day: 'Fri', listens: 2800 }, { day: 'Sat', listens: 3200 }, { day: 'Sun', listens: 2600 },
];
const demographics = [
    { label: '18-24', pct: 28 }, { label: '25-34', pct: 35 }, { label: '35-44', pct: 22 },
    { label: '45-54', pct: 10 }, { label: '55+', pct: 5 },
];
const topEps = [
    { title: 'Quantum Computing Explained', listens: 12000 },
    { title: 'The Future of AI in 2025', listens: 8500 },
    { title: 'Web3 Reality Check', listens: 6200 },
    { title: 'The Rise of Edge Computing', listens: 4300 },
];

export default function Analytics() {
    const maxL = Math.max(...weeklyData.map(d => d.listens));
    return (
        <>
            <style>{`
        .analytics { padding:24px; }
        .analytics h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:28px; }
        .chart-section { margin-bottom:28px; }
        .chart-section h2 { font-size:1.1rem; font-weight:700; margin-bottom:16px; }
        .chart { display:flex; align-items:flex-end; gap:12px; height:200px; padding:16px 20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); }
        .chart-bar-wrap { flex:1; display:flex; flex-direction:column; align-items:center; gap:8px; }
        .chart-bar { width:100%; background:var(--gradient-primary); border-radius:6px 6px 0 0; transition:height 0.6s ease; min-height:4px; }
        .chart-bar:hover { filter:brightness(1.2); }
        .chart-label { font-size:0.7rem; color:var(--text-muted); }
        .chart-value { font-size:0.65rem; color:var(--accent); font-weight:600; }
        .demo-section { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .demo-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:20px; }
        .demo-card h3 { font-size:0.95rem; font-weight:700; margin-bottom:16px; }
        .demo-bars { display:flex; flex-direction:column; gap:10px; }
        .demo-bar-item { display:flex; align-items:center; gap:12px; }
        .demo-label { font-size:0.8rem; min-width:50px; color:var(--text-secondary); }
        .demo-bar-bg { flex:1; height:10px; background:var(--bg-input); border-radius:5px; overflow:hidden; }
        .demo-bar-fill { height:100%; background:var(--gradient-primary); border-radius:5px; transition:width 0.6s ease; }
        .demo-pct { font-size:0.75rem; font-weight:600; color:var(--accent); min-width:30px; text-align:right; }
        .top-ep-list { display:flex; flex-direction:column; gap:8px; }
        .top-ep { display:flex; align-items:center; gap:12px; padding:12px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); }
        .top-ep-rank { width:28px; height:28px; border-radius:50%; background:rgba(92,114,133,0.2); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:0.75rem; font-weight:700; flex-shrink:0; }
        .top-ep-info { flex:1; }
        .top-ep-title { font-size:0.85rem; font-weight:600; }
        .top-ep-listens { font-size:0.72rem; color:var(--text-muted); }
        @media(max-width:768px) { .stats-row { grid-template-columns:1fr; } .demo-section { grid-template-columns:1fr; } }
      `}</style>
            <div className="analytics">
                <h1 className="fade-in">📊 Analytics</h1>
                <div className="stats-row">
                    <StatsCard icon="👁️" label="Views This Week" value="15.2K" change={18.5} color="#5C7285" />
                    <StatsCard icon="⏱️" label="Avg. Listen Duration" value="32 min" change={5.2} color="#818C78" />
                    <StatsCard icon="📈" label="Completion Rate" value="72%" change={-2.1} color="#A7B49E" />
                </div>
                <div className="chart-section fade-in">
                    <h2>Weekly Listens</h2>
                    <div className="chart">
                        {weeklyData.map(d => (
                            <div key={d.day} className="chart-bar-wrap">
                                <span className="chart-value">{(d.listens / 1000).toFixed(1)}K</span>
                                <div className="chart-bar" style={{ height: `${(d.listens / maxL) * 150}px` }} />
                                <span className="chart-label">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="demo-section">
                    <div className="demo-card fade-in">
                        <h3>👥 Audience Demographics</h3>
                        <div className="demo-bars">{demographics.map(d => (
                            <div key={d.label} className="demo-bar-item"><span className="demo-label">{d.label}</span><div className="demo-bar-bg"><div className="demo-bar-fill" style={{ width: `${d.pct}%` }} /></div><span className="demo-pct">{d.pct}%</span></div>
                        ))}</div>
                    </div>
                    <div className="demo-card fade-in">
                        <h3>🏆 Top Episodes</h3>
                        <div className="top-ep-list">{topEps.map((ep, i) => (
                            <div key={i} className="top-ep"><div className="top-ep-rank">{i + 1}</div><div className="top-ep-info"><p className="top-ep-title">{ep.title}</p><p className="top-ep-listens">{ep.listens.toLocaleString()} listens</p></div></div>
                        ))}</div>
                    </div>
                </div>
            </div>
        </>
    );
}
