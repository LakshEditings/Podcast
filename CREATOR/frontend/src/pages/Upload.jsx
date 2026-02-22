import { useState } from 'react';
import { FiUpload, FiPlus, FiX, FiCheck } from 'react-icons/fi';

const categories = ['Technology', 'Wellness', 'True Crime', 'Business', 'History', 'Comedy', 'Science', 'Music', 'Sports', 'Education'];

export default function Upload() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [episodes, setEpisodes] = useState([{ title: '', description: '' }]);
    const [quizzes, setQuizzes] = useState([]);
    const [polls, setPolls] = useState([]);
    const [captions, setCaptions] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const addEpisode = () => setEpisodes(e => [...e, { title: '', description: '' }]);
    const updateEp = (i, field, val) => setEpisodes(e => e.map((ep, idx) => idx === i ? { ...ep, [field]: val } : ep));
    const removeEp = (i) => setEpisodes(e => e.filter((_, idx) => idx !== i));

    const addQuiz = () => setQuizzes(q => [...q, { question: '', options: ['', '', '', ''], correct: 0 }]);
    const updateQuiz = (i, field, val) => setQuizzes(q => q.map((qz, idx) => idx === i ? { ...qz, [field]: val } : qz));
    const updateQuizOption = (qi, oi, val) => setQuizzes(q => q.map((qz, idx) => idx === qi ? { ...qz, options: qz.options.map((o, j) => j === oi ? val : o) } : qz));

    const addPoll = () => setPolls(p => [...p, { question: '', options: ['', ''] }]);
    const updatePoll = (i, val) => setPolls(p => p.map((pl, idx) => idx === i ? { ...pl, question: val } : pl));
    const addPollOption = (i) => setPolls(p => p.map((pl, idx) => idx === i ? { ...pl, options: [...pl.options, ''] } : pl));
    const updatePollOption = (pi, oi, val) => setPolls(p => p.map((pl, idx) => idx === pi ? { ...pl, options: pl.options.map((o, j) => j === oi ? val : o) } : pl));

    const handleSubmit = () => { setSubmitted(true); setTimeout(() => setSubmitted(false), 3000); };

    return (
        <>
            <style>{`
        .upload-page { padding:24px; max-width:800px; }
        .upload-page h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .form-section { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; margin-bottom:20px; }
        .form-section h3 { font-size:1rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .form-group { margin-bottom:16px; }
        .form-label { font-size:0.78rem; font-weight:600; color:var(--text-muted); margin-bottom:6px; display:block; }
        .form-input { width:100%; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; transition:var(--transition); }
        .form-input:focus { border-color:var(--primary); }
        .form-input::placeholder { color:var(--text-muted); }
        textarea.form-input { min-height:100px; resize:vertical; }
        .form-select { width:100%; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; }
        .ep-item { background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:12px; position:relative; }
        .ep-item .ep-num { font-size:0.72rem; color:var(--accent); font-weight:700; margin-bottom:8px; }
        .ep-remove { position:absolute; top:12px; right:12px; width:24px; height:24px; border-radius:50%; background:rgba(248,113,113,0.15); color:var(--danger); display:flex; align-items:center; justify-content:center; font-size:0.7rem; }
        .add-btn { display:flex; align-items:center; gap:8px; padding:10px 20px; background:transparent; border:1px dashed var(--border); border-radius:var(--radius-md); color:var(--text-muted); font-size:0.82rem; width:100%; justify-content:center; transition:var(--transition); }
        .add-btn:hover { border-color:var(--primary); color:var(--accent); }
        .quiz-item { background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:12px; }
        .quiz-options { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
        .quiz-opt-input { display:flex; align-items:center; gap:8px; }
        .quiz-opt-input input[type=radio] { accent-color:var(--accent); }
        .poll-item { background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; margin-bottom:12px; }
        .submit-btn { width:100%; padding:16px; background:var(--gradient-primary); color:white; border-radius:var(--radius-md); font-weight:700; font-size:1rem; transition:var(--transition); display:flex; align-items:center; justify-content:center; gap:8px; }
        .submit-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .success-msg { text-align:center; padding:16px; background:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.3); border-radius:var(--radius-md); color:var(--success); font-weight:600; margin-top:16px; }
      `}</style>
            <div className="upload-page">
                <h1 className="fade-in">📤 Upload Podcast</h1>
                <div className="form-section fade-in">
                    <h3>📋 Podcast Details</h3>
                    <div className="form-group"><label className="form-label">Podcast Title</label><input className="form-input" placeholder="Enter podcast title" value={title} onChange={e => setTitle(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" placeholder="Describe your podcast..." value={desc} onChange={e => setDesc(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={category} onChange={e => setCategory(e.target.value)}><option value="">Select category</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                </div>
                <div className="form-section fade-in">
                    <h3>🎙️ Episodes</h3>
                    {episodes.map((ep, i) => (
                        <div key={i} className="ep-item">
                            <p className="ep-num">Episode {i + 1}</p>
                            {episodes.length > 1 && <button className="ep-remove" onClick={() => removeEp(i)}><FiX size={12} /></button>}
                            <div className="form-group"><input className="form-input" placeholder="Episode title" value={ep.title} onChange={e => updateEp(i, 'title', e.target.value)} /></div>
                            <div className="form-group"><textarea className="form-input" placeholder="Episode description" value={ep.description} onChange={e => updateEp(i, 'description', e.target.value)} style={{ minHeight: '60px' }} /></div>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addEpisode}><FiPlus size={16} /> Add Episode</button>
                </div>
                <div className="form-section fade-in">
                    <h3>📝 Quizzes (Optional)</h3>
                    {quizzes.map((q, i) => (
                        <div key={i} className="quiz-item">
                            <div className="form-group"><input className="form-input" placeholder="Quiz question" value={q.question} onChange={e => updateQuiz(i, 'question', e.target.value)} /></div>
                            <div className="quiz-options">{q.options.map((opt, j) => (
                                <div key={j} className="quiz-opt-input"><input type="radio" name={`quiz-${i}`} checked={q.correct === j} onChange={() => updateQuiz(i, 'correct', j)} /><input className="form-input" placeholder={`Option ${j + 1}`} value={opt} onChange={e => updateQuizOption(i, j, e.target.value)} /></div>
                            ))}</div>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addQuiz}><FiPlus size={16} /> Add Quiz Question</button>
                </div>
                <div className="form-section fade-in">
                    <h3>📊 Polls (Optional)</h3>
                    {polls.map((p, i) => (
                        <div key={i} className="poll-item">
                            <div className="form-group"><input className="form-input" placeholder="Poll question" value={p.question} onChange={e => updatePoll(i, e.target.value)} /></div>
                            {p.options.map((opt, j) => <div key={j} className="form-group"><input className="form-input" placeholder={`Option ${j + 1}`} value={opt} onChange={e => updatePollOption(i, j, e.target.value)} /></div>)}
                            <button className="add-btn" onClick={() => addPollOption(i)} style={{ marginTop: 8 }}><FiPlus size={14} /> Add Option</button>
                        </div>
                    ))}
                    <button className="add-btn" onClick={addPoll}><FiPlus size={16} /> Add Poll</button>
                </div>
                <div className="form-section fade-in">
                    <h3>💬 Captions</h3>
                    <div className="form-group"><textarea className="form-input" placeholder="Paste or type captions here... (timestamp: text format)" value={captions} onChange={e => setCaptions(e.target.value)} /></div>
                </div>
                <button className="submit-btn" onClick={handleSubmit}><FiUpload size={18} /> Publish Podcast</button>
                {submitted && <div className="success-msg fade-in"><FiCheck size={16} /> Podcast published successfully! 🎉</div>}
            </div>
        </>
    );
}
