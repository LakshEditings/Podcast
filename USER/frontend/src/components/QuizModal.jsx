import { useState } from 'react';
import { FiX, FiAward, FiCheck } from 'react-icons/fi';

export default function QuizModal({ quiz, onClose }) {
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);

    const q = quiz.questions[current];
    const handleSelect = (idx) => {
        if (selected !== null) return;
        setSelected(idx);
        if (idx === q.correct) setScore(s => s + 1);
        setTimeout(() => {
            if (current + 1 < quiz.questions.length) { setCurrent(c => c + 1); setSelected(null); }
            else setDone(true);
        }, 800);
    };
    const passed = score >= quiz.passScore;

    return (
        <>
            <style>{`
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:2000; padding:20px; }
        .quiz-modal { background:var(--bg-card); border-radius:var(--radius-xl); border:1px solid var(--border); width:100%; max-width:500px; overflow:hidden; animation:slideUp 0.3s ease-out; }
        .quiz-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); }
        .quiz-header h3 { font-size:1.1rem; }
        .qh-close { width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:transparent; color:var(--text-primary); border:none; }
        .quiz-body { padding:24px; }
        .quiz-progress { height:4px; background:var(--bg-input); border-radius:2px; overflow:hidden; margin-bottom:16px; }
        .quiz-progress-bar { height:100%; background:var(--gradient-primary); border-radius:2px; transition:width 0.4s ease; }
        .quiz-counter { font-size:0.75rem; color:var(--text-muted); margin-bottom:12px; }
        .quiz-question { font-size:1rem; margin-bottom:20px; line-height:1.5; }
        .quiz-options { display:flex; flex-direction:column; gap:10px; }
        .quiz-option { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg-input); border:2px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.9rem; cursor:pointer; transition:var(--transition); text-align:left; }
        .quiz-option:hover { border-color:var(--primary); }
        .quiz-option.correct { border-color:var(--success); background:rgba(74,222,128,0.1); }
        .quiz-option.wrong { border-color:var(--danger); background:rgba(248,113,113,0.1); }
        .quiz-opt-letter { width:28px; height:28px; border-radius:50%; background:rgba(92,114,133,0.2); color:var(--accent); display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:700; flex-shrink:0; }
        .quiz-check { margin-left:auto; color:var(--success); }
        .quiz-result { padding:40px 24px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px; }
        .quiz-result-icon { width:80px; height:80px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; }
        .quiz-result-icon.pass { background:rgba(74,222,128,0.15); color:var(--success); }
        .quiz-result-icon.fail { background:rgba(248,113,113,0.15); }
        .quiz-score { font-size:1.2rem; font-weight:700; color:var(--accent); }
        .quiz-reward { display:flex; align-items:center; gap:8px; padding:12px 24px; background:rgba(251,191,36,0.1); border-radius:var(--radius-md); border:1px solid rgba(251,191,36,0.3); color:var(--warning); font-size:0.9rem; }
        .quiz-reward strong { font-size:1.2rem; }
        .qr-btn { background:var(--gradient-primary); color:white; padding:12px 28px; border-radius:var(--radius-md); font-weight:600; font-size:0.95rem; border:none; cursor:pointer; transition:var(--transition); }
        .qr-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
      `}</style>
            <div className="modal-overlay" onClick={onClose}>
                <div className="quiz-modal" onClick={e => e.stopPropagation()}>
                    <div className="quiz-header">
                        <h3>📝 {quiz.title}</h3>
                        <button className="qh-close" onClick={onClose}><FiX size={18} /></button>
                    </div>
                    {!done ? (
                        <div className="quiz-body fade-in" key={current}>
                            <div className="quiz-progress"><div className="quiz-progress-bar" style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }} /></div>
                            <p className="quiz-counter">Question {current + 1} of {quiz.questions.length}</p>
                            <h4 className="quiz-question">{q.question}</h4>
                            <div className="quiz-options">
                                {q.options.map((opt, i) => (
                                    <button key={i} className={`quiz-option ${selected === i ? (i === q.correct ? 'correct' : 'wrong') : ''} ${selected !== null && i === q.correct ? 'correct' : ''}`} onClick={() => handleSelect(i)}>
                                        <span className="quiz-opt-letter">{String.fromCharCode(65 + i)}</span>
                                        {opt}
                                        {selected !== null && i === q.correct && <FiCheck className="quiz-check" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="quiz-result fade-in">
                            <div className={`quiz-result-icon ${passed ? 'pass' : 'fail'}`}>{passed ? <FiAward size={48} /> : '😔'}</div>
                            <h3>{passed ? 'Congratulations!' : 'Better luck next time!'}</h3>
                            <p className="quiz-score">Score: {score}/{quiz.questions.length}</p>
                            {passed && <div className="quiz-reward"><span>🎉 You earned</span><strong>₹{quiz.reward}</strong><span>reward!</span></div>}
                            <button className="qr-btn" onClick={onClose}>Close</button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
