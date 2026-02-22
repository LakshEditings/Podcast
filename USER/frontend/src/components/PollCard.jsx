import { useState } from 'react';

export default function PollCard({ poll }) {
    const [voted, setVoted] = useState(null);
    const [votes, setVotes] = useState(poll.options.map(o => o.votes));
    const total = votes.reduce((a, b) => a + b, 0) + (voted !== null ? 1 : 0);

    const handleVote = (idx) => {
        if (voted !== null) return;
        setVoted(idx);
        setVotes(v => v.map((val, i) => i === idx ? val + 1 : val));
    };

    return (
        <>
            <style>{`
        .poll-card { padding:20px; background:var(--bg-card); border-radius:var(--radius-lg); border:1px solid var(--border); margin-bottom:12px; }
        .poll-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
        .poll-header h4 { font-size:0.95rem; }
        .poll-options { display:flex; flex-direction:column; gap:8px; }
        .poll-option { position:relative; display:flex; align-items:center; justify-content:space-between; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer; overflow:hidden; transition:var(--transition); color:var(--text-primary); font-size:0.85rem; }
        .poll-option:hover:not(.voted) { border-color:var(--primary); }
        .poll-option-fill { position:absolute; left:0; top:0; bottom:0; background:rgba(92,114,133,0.15); border-radius:var(--radius-md); transition:width 0.6s ease; }
        .poll-option.selected .poll-option-fill { background:rgba(167,180,158,0.25); }
        .poll-option-text { position:relative; z-index:1; }
        .poll-option-pct { position:relative; z-index:1; font-weight:700; color:var(--accent); }
        .poll-total { font-size:0.72rem; color:var(--text-muted); margin-top:12px; text-align:right; }
      `}</style>
            <div className="poll-card fade-in">
                <div className="poll-header"><span style={{ fontSize: '1.3rem' }}>📊</span><h4>{poll.question}</h4></div>
                <div className="poll-options">
                    {poll.options.map((opt, i) => {
                        const pct = total > 0 ? Math.round((votes[i] / total) * 100) : 0;
                        return (
                            <button key={i} className={`poll-option ${voted !== null ? 'voted' : ''} ${voted === i ? 'selected' : ''}`} onClick={() => handleVote(i)}>
                                <div className="poll-option-fill" style={{ width: voted !== null ? `${pct}%` : '0%' }} />
                                <span className="poll-option-text">{opt.text}</span>
                                {voted !== null && <span className="poll-option-pct">{pct}%</span>}
                            </button>
                        );
                    })}
                </div>
                <p className="poll-total">{total} votes</p>
            </div>
        </>
    );
}
