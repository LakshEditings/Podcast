import { useState, useRef } from 'react';
import { FiUpload, FiPlus, FiX, FiCheck, FiFlag, FiChevronDown, FiChevronUp, FiTrash2, FiMusic } from 'react-icons/fi';

const API = 'http://localhost:5002/api';
const categories = ['Technology', 'Wellness', 'True Crime', 'Business', 'History', 'Comedy', 'Science', 'Music', 'Sports', 'Education'];

export default function Upload() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('');
    const [episodes, setEpisodes] = useState([{
        title: '', description: '', duration: '30:00',
        quizzes: Array.from({ length: 5 }, () => ({ question: '', options: ['', '', '', ''], correct: 0 })),
        showQuiz: false,
        pollFlags: [],
        audioFile: null,
        captions: '',
    }]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const fileInputRefs = useRef({});

    const addEpisode = () => setEpisodes(e => [...e, {
        title: '', description: '', duration: '30:00',
        quizzes: Array.from({ length: 5 }, () => ({ question: '', options: ['', '', '', ''], correct: 0 })),
        showQuiz: false, pollFlags: [], audioFile: null, captions: '',
    }]);
    const updateEp = (i, field, val) => setEpisodes(e => e.map((ep, idx) => idx === i ? { ...ep, [field]: val } : ep));
    const removeEp = (i) => setEpisodes(e => e.filter((_, idx) => idx !== i));

    const updateQuiz = (ei, qi, field, val) => setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
        ...ep, quizzes: ep.quizzes.map((q, j) => j !== qi ? q : { ...q, [field]: val })
    }));
    const updateQuizOption = (ei, qi, oi, val) => setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
        ...ep, quizzes: ep.quizzes.map((q, j) => j !== qi ? q : { ...q, options: q.options.map((o, k) => k === oi ? val : o) })
    }));

    const addPollFlag = (ei, percentage) => {
        setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
            ...ep, pollFlags: [...ep.pollFlags, { id: Date.now(), percentage: Math.round(percentage), question: '', options: ['', ''] }]
                .sort((a, b) => a.percentage - b.percentage)
        }));
    };
    const updatePollFlag = (ei, flagId, field, val) => {
        setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
            ...ep, pollFlags: ep.pollFlags.map(f => f.id !== flagId ? f : { ...f, [field]: val })
        }));
    };
    const updatePollFlagOption = (ei, flagId, oi, val) => {
        setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
            ...ep, pollFlags: ep.pollFlags.map(f => f.id !== flagId ? f : { ...f, options: f.options.map((o, j) => j === oi ? val : o) })
        }));
    };
    const addPollFlagOption = (ei, flagId) => {
        setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
            ...ep, pollFlags: ep.pollFlags.map(f => f.id !== flagId ? f : { ...f, options: [...f.options, ''] })
        }));
    };
    const removePollFlag = (ei, flagId) => {
        setEpisodes(eps => eps.map((ep, i) => i !== ei ? ep : {
            ...ep, pollFlags: ep.pollFlags.filter(f => f.id !== flagId)
        }));
    };

    const handleSliderClick = (ei, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const pct = ((e.clientX - rect.left) / rect.width) * 100;
        if (pct >= 2 && pct <= 98) addPollFlag(ei, pct);
    };

    const formatPct = (pct, duration) => {
        const parts = duration.split(':').map(Number);
        const totalSec = (parts[0] || 0) * 60 + (parts[1] || 0);
        const sec = Math.round((pct / 100) * totalSec);
        return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
    };

    const filledQuizCount = (quizzes) => quizzes.filter(q => q.question.trim() !== '').length;

    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const handleSubmit = async () => {
        setError('');
        if (!title.trim() || !category) { setError('Please fill podcast title and category'); return; }
        if (episodes.some(ep => !ep.title.trim())) { setError('All episodes need a title'); return; }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', desc);
            formData.append('category', category);
            formData.append('language', 'English');
            formData.append('creatorName', 'Creator');

            // Add episode data as JSON (without audioFile objects)
            const episodeData = episodes.map(ep => ({
                title: ep.title, description: ep.description, duration: ep.duration,
                captions: ep.captions,
                quizzes: ep.quizzes.filter(q => q.question.trim()),
                pollFlags: ep.pollFlags.filter(f => f.question.trim()),
            }));
            formData.append('episodes', JSON.stringify(episodeData));

            // Add audio files separately (audioFile_0, audioFile_1, etc.)
            episodes.forEach((ep, i) => {
                if (ep.audioFile) formData.append(`audioFile_${i}`, ep.audioFile);
            });

            const res = await fetch(`${API}/podcasts`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Upload failed');
            }

            setSubmitted(true);
            // Reset form
            setTitle(''); setDesc(''); setCategory('');
            setEpisodes([{
                title: '', description: '', duration: '30:00',
                quizzes: Array.from({ length: 5 }, () => ({ question: '', options: ['', '', '', ''], correct: 0 })),
                showQuiz: false, pollFlags: [], audioFile: null, captions: '',
            }]);
            setTimeout(() => setSubmitted(false), 4000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

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
        .ep-remove { position:absolute; top:12px; right:12px; width:24px; height:24px; border-radius:50%; background:rgba(248,113,113,0.15); color:var(--danger); display:flex; align-items:center; justify-content:center; font-size:0.7rem; cursor:pointer; border:none; }
        .add-btn { display:flex; align-items:center; gap:8px; padding:10px 20px; background:transparent; border:1px dashed var(--border); border-radius:var(--radius-md); color:var(--text-muted); font-size:0.82rem; width:100%; justify-content:center; transition:var(--transition); cursor:pointer; }
        .add-btn:hover { border-color:var(--primary); color:var(--accent); }

        /* Audio file upload */
        .audio-upload { margin-bottom:16px; }
        .audio-drop-zone { border:2px dashed var(--border); border-radius:var(--radius-md); padding:20px; text-align:center; cursor:pointer; transition:var(--transition); }
        .audio-drop-zone:hover { border-color:var(--primary); background:rgba(167,180,158,0.05); }
        .audio-drop-zone.has-file { border-color:var(--success); background:rgba(74,222,128,0.05); }
        .audio-drop-icon { font-size:1.5rem; margin-bottom:8px; }
        .audio-drop-text { font-size:0.82rem; color:var(--text-muted); }
        .audio-file-info { display:flex; align-items:center; gap:10px; padding:10px 14px; background:rgba(74,222,128,0.08); border:1px solid rgba(74,222,128,0.2); border-radius:var(--radius-md); margin-top:8px; }
        .audio-file-name { font-size:0.8rem; font-weight:600; color:var(--text-primary); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .audio-file-size { font-size:0.72rem; color:var(--text-muted); }
        .audio-file-remove { width:20px; height:20px; border-radius:50%; background:rgba(248,113,113,0.15); color:var(--danger); display:flex; align-items:center; justify-content:center; font-size:0.65rem; cursor:pointer; border:none; flex-shrink:0; }

        /* Quiz section per episode */
        .quiz-toggle { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; margin-top:12px; background:rgba(92,114,133,0.1); border:1px solid var(--border); border-radius:var(--radius-md); cursor:pointer; transition:var(--transition); }
        .quiz-toggle:hover { border-color:var(--primary); }
        .quiz-toggle-left { display:flex; align-items:center; gap:8px; font-size:0.82rem; font-weight:600; }
        .quiz-counter { font-size:0.7rem; padding:2px 8px; border-radius:10px; font-weight:700; }
        .quiz-counter.complete { background:rgba(74,222,128,0.15); color:var(--success); }
        .quiz-counter.incomplete { background:rgba(251,191,36,0.15); color:var(--warning); }
        .quiz-block { margin-top:12px; }
        .quiz-item { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; margin-bottom:10px; }
        .quiz-item-header { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
        .quiz-num { font-size:0.7rem; font-weight:700; color:var(--accent); background:rgba(167,180,158,0.15); padding:2px 8px; border-radius:8px; }
        .quiz-options { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:8px; }
        .quiz-opt-input { display:flex; align-items:center; gap:8px; }
        .quiz-opt-input input[type=radio] { accent-color:var(--accent); flex-shrink:0; }

        /* Timeline poll flags */
        .poll-section { margin-top:16px; }
        .poll-section-title { font-size:0.82rem; font-weight:600; color:var(--text-primary); margin-bottom:8px; display:flex; align-items:center; gap:8px; }
        .poll-section-hint { font-size:0.7rem; color:var(--text-muted); margin-bottom:12px; }
        .timeline-container { position:relative; padding:16px 0; }
        .timeline-bar { width:100%; height:8px; background:var(--bg-card); border:1px solid var(--border); border-radius:4px; cursor:crosshair; position:relative; }
        .timeline-bar:hover { border-color:var(--primary); }
        .timeline-flag { position:absolute; top:-10px; transform:translateX(-50%); cursor:pointer; font-size:1.1rem; z-index:2; transition:transform 0.2s ease; filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
        .timeline-flag:hover { transform:translateX(-50%) scale(1.3); }
        .timeline-flag-line { position:absolute; top:0; bottom:0; width:2px; background:var(--warning); transform:translateX(-50%); border-radius:1px; }
        .timeline-labels { display:flex; justify-content:space-between; font-size:0.65rem; color:var(--text-muted); margin-top:4px; }
        .flag-count { font-size:0.72rem; color:var(--text-muted); margin-top:8px; }
        .poll-flag-item { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); padding:14px; margin-top:10px; position:relative; }
        .poll-flag-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
        .poll-flag-time { font-size:0.72rem; font-weight:700; color:var(--warning); background:rgba(251,191,36,0.15); padding:2px 10px; border-radius:8px; display:flex; align-items:center; gap:4px; }
        .poll-flag-remove { width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(248,113,113,0.1); color:var(--danger); font-size:0.7rem; cursor:pointer; border:none; }

        .submit-btn { width:100%; padding:16px; background:var(--gradient-primary); color:white; border-radius:var(--radius-md); font-weight:700; font-size:1rem; transition:var(--transition); display:flex; align-items:center; justify-content:center; gap:8px; border:none; cursor:pointer; }
        .submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .submit-btn:disabled { opacity:0.6; cursor:not-allowed; }
        .success-msg { text-align:center; padding:16px; background:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.3); border-radius:var(--radius-md); color:var(--success); font-weight:600; margin-top:16px; }
        .error-msg { text-align:center; padding:12px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.3); border-radius:var(--radius-md); color:var(--danger); font-weight:600; margin-top:16px; font-size:0.85rem; }
      `}</style>
            <div className="upload-page">
                <h1 className="fade-in">📤 Upload Podcast</h1>

                {/* Podcast Details */}
                <div className="form-section fade-in">
                    <h3>📋 Podcast Details</h3>
                    <div className="form-group"><label className="form-label">Podcast Title</label><input className="form-input" placeholder="Enter podcast title" value={title} onChange={e => setTitle(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" placeholder="Describe your podcast..." value={desc} onChange={e => setDesc(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={category} onChange={e => setCategory(e.target.value)}><option value="">Select category</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
                </div>

                {/* Episodes with Audio, Quizzes & Poll Flags */}
                {episodes.map((ep, ei) => (
                    <div key={ei} className="form-section fade-in">
                        <h3>🎙️ Episode {ei + 1}</h3>
                        <div className="ep-item">
                            {episodes.length > 1 && <button className="ep-remove" onClick={() => removeEp(ei)}><FiX size={12} /></button>}
                            <div className="form-group"><label className="form-label">Episode Title</label><input className="form-input" placeholder="Episode title" value={ep.title} onChange={e => updateEp(ei, 'title', e.target.value)} /></div>
                            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" placeholder="Episode description" value={ep.description} onChange={e => updateEp(ei, 'description', e.target.value)} style={{ minHeight: '60px' }} /></div>
                            <div className="form-group"><label className="form-label">Duration (mm:ss)</label><input className="form-input" placeholder="30:00" value={ep.duration} onChange={e => updateEp(ei, 'duration', e.target.value)} style={{ maxWidth: 160 }} /></div>

                            {/* Audio File Upload */}
                            <div className="audio-upload">
                                <label className="form-label">🎵 Audio File</label>
                                <input
                                    type="file"
                                    accept=".mp3,.wav,.m4a,.ogg,.aac,.flac"
                                    ref={el => fileInputRefs.current[ei] = el}
                                    style={{ display: 'none' }}
                                    onChange={e => { if (e.target.files[0]) updateEp(ei, 'audioFile', e.target.files[0]); }}
                                />
                                {!ep.audioFile ? (
                                    <div className="audio-drop-zone" onClick={() => fileInputRefs.current[ei]?.click()}>
                                        <div className="audio-drop-icon"><FiMusic size={28} /></div>
                                        <div className="audio-drop-text">Click to select audio file<br /><span style={{ fontSize: '0.7rem' }}>MP3, WAV, M4A, OGG, AAC, FLAC (max 100MB)</span></div>
                                    </div>
                                ) : (
                                    <div className="audio-file-info">
                                        <FiMusic size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                                        <span className="audio-file-name">{ep.audioFile.name}</span>
                                        <span className="audio-file-size">{formatFileSize(ep.audioFile.size)}</span>
                                        <button className="audio-file-remove" onClick={() => { updateEp(ei, 'audioFile', null); if (fileInputRefs.current[ei]) fileInputRefs.current[ei].value = ''; }}><FiX size={10} /></button>
                                    </div>
                                )}
                            </div>

                            {/* Captions per episode */}
                            <div className="form-group"><label className="form-label">💬 Captions</label><textarea className="form-input" placeholder="Paste or type captions (timestamp: text)" value={ep.captions} onChange={e => updateEp(ei, 'captions', e.target.value)} style={{ minHeight: '60px' }} /></div>

                            {/* Quiz Section */}
                            <div className="quiz-toggle" onClick={() => updateEp(ei, 'showQuiz', !ep.showQuiz)}>
                                <div className="quiz-toggle-left">
                                    <span>📝</span>
                                    <span>Episode Quiz (5 Questions)</span>
                                    <span className={`quiz-counter ${filledQuizCount(ep.quizzes) === 5 ? 'complete' : 'incomplete'}`}>
                                        {filledQuizCount(ep.quizzes)}/5
                                    </span>
                                </div>
                                {ep.showQuiz ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                            </div>
                            {ep.showQuiz && (
                                <div className="quiz-block fade-in">
                                    {ep.quizzes.map((q, qi) => (
                                        <div key={qi} className="quiz-item">
                                            <div className="quiz-item-header"><span className="quiz-num">Q{qi + 1}</span></div>
                                            <div className="form-group"><input className="form-input" placeholder={`Question ${qi + 1}`} value={q.question} onChange={e => updateQuiz(ei, qi, 'question', e.target.value)} /></div>
                                            <div className="quiz-options">{q.options.map((opt, oi) => (
                                                <div key={oi} className="quiz-opt-input">
                                                    <input type="radio" name={`ep${ei}-quiz${qi}`} checked={q.correct === oi} onChange={() => updateQuiz(ei, qi, 'correct', oi)} />
                                                    <input className="form-input" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updateQuizOption(ei, qi, oi, e.target.value)} />
                                                </div>
                                            ))}</div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Poll Timeline Flags */}
                            <div className="poll-section">
                                <div className="poll-section-title"><FiFlag size={14} /> Poll Flags</div>
                                <p className="poll-section-hint">Click on the timeline to place poll flags. Each flag = 1 poll shown to listeners at that point.</p>
                                <div className="timeline-container">
                                    <div className="timeline-bar" onClick={(e) => handleSliderClick(ei, e)}>
                                        {ep.pollFlags.map(flag => (
                                            <span key={flag.id}>
                                                <div className="timeline-flag-line" style={{ left: `${flag.percentage}%` }} />
                                                <span className="timeline-flag" style={{ left: `${flag.percentage}%` }} title={`Poll at ${formatPct(flag.percentage, ep.duration)}`}>🚩</span>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="timeline-labels"><span>0:00</span><span>{ep.duration}</span></div>
                                </div>
                                <p className="flag-count">{ep.pollFlags.length} poll{ep.pollFlags.length !== 1 ? 's' : ''} placed</p>

                                {ep.pollFlags.map(flag => (
                                    <div key={flag.id} className="poll-flag-item fade-in">
                                        <div className="poll-flag-header">
                                            <span className="poll-flag-time"><FiFlag size={12} /> {formatPct(flag.percentage, ep.duration)}</span>
                                            <button className="poll-flag-remove" onClick={() => removePollFlag(ei, flag.id)}><FiTrash2 size={12} /></button>
                                        </div>
                                        <div className="form-group"><input className="form-input" placeholder="Poll question" value={flag.question} onChange={e => updatePollFlag(ei, flag.id, 'question', e.target.value)} /></div>
                                        {flag.options.map((opt, oi) => (
                                            <div key={oi} className="form-group" style={{ marginBottom: 8 }}>
                                                <input className="form-input" placeholder={`Option ${oi + 1}`} value={opt} onChange={e => updatePollFlagOption(ei, flag.id, oi, e.target.value)} />
                                            </div>
                                        ))}
                                        {flag.options.length < 4 && <button className="add-btn" onClick={() => addPollFlagOption(ei, flag.id)} style={{ marginTop: 4, padding: '6px 12px', fontSize: '0.75rem' }}><FiPlus size={12} /> Add Option</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <button className="add-btn" onClick={addEpisode} style={{ marginBottom: 20 }}><FiPlus size={16} /> Add Episode</button>

                <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? '⏳ Uploading...' : <><FiUpload size={18} /> Publish Podcast</>}
                </button>
                {submitted && <div className="success-msg fade-in"><FiCheck size={16} /> Podcast published successfully! 🎉</div>}
                {error && <div className="error-msg fade-in">❌ {error}</div>}
            </div>
        </>
    );
}
