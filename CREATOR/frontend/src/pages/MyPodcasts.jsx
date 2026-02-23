import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEdit3, FiClock, FiTrash2, FiCheck, FiX, FiUpload } from 'react-icons/fi';

const API = 'http://localhost:5002/api';

export default function MyPodcasts() {
    const navigate = useNavigate();
    const [podcasts, setPodcasts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null); // podcast id being edited
    const [editForm, setEditForm] = useState({});
    const [episodes, setEpisodes] = useState([]);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) { navigate('/login'); return; }
        fetchPodcasts();
    }, []);

    const fetchPodcasts = async () => {
        try {
            const res = await fetch(`${API}/podcasts`, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 401) { navigate('/login'); return; }
            const data = await res.json();
            setPodcasts(data);
        } catch { } finally { setLoading(false); }
    };

    const getTimeRemaining = (createdAt) => {
        const elapsed = Date.now() - new Date(createdAt).getTime();
        const remaining = (24 * 60 * 60 * 1000) - elapsed;
        if (remaining <= 0) return null;
        const hrs = Math.floor(remaining / (1000 * 60 * 60));
        const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        return `${hrs}h ${mins}m`;
    };

    const canEdit = (createdAt) => {
        return (Date.now() - new Date(createdAt).getTime()) < (24 * 60 * 60 * 1000);
    };

    const startEdit = async (podcast) => {
        setEditing(podcast._id);
        setEditForm({ title: podcast.title, description: podcast.description, category: podcast.category, language: podcast.language });
        // Fetch episodes for this podcast
        try {
            const res = await fetch(`${API}/podcasts/${podcast._id}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setEpisodes((data.episodes || []).map(ep => ({ ...ep, newAudioFile: null })));
        } catch { setEpisodes([]); }
    };

    const cancelEdit = () => { setEditing(null); setEditForm({}); setEpisodes([]); setMsg(''); };

    const handleAudioChange = (idx, file) => {
        setEpisodes(prev => prev.map((ep, i) => i === idx ? { ...ep, newAudioFile: file } : ep));
    };

    const handleEpChange = (idx, field, value) => {
        setEpisodes(prev => prev.map((ep, i) => i === idx ? { ...ep, [field]: value } : ep));
    };

    const saveEdit = async () => {
        setSaving(true); setMsg('');
        try {
            const formData = new FormData();
            formData.append('title', editForm.title);
            formData.append('description', editForm.description);
            formData.append('category', editForm.category);
            formData.append('language', editForm.language);
            formData.append('episodes', JSON.stringify(episodes.map(ep => ({
                title: ep.title, description: ep.description, duration: ep.duration,
            }))));
            episodes.forEach((ep, i) => {
                if (ep.newAudioFile) formData.append(`audioFile_${i}`, ep.newAudioFile);
            });
            const res = await fetch(`${API}/podcasts/${editing}`, {
                method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setMsg('✅ Saved successfully!');
            fetchPodcasts();
            setTimeout(() => cancelEdit(), 1500);
        } catch (err) { setMsg(`❌ ${err.message}`); } finally { setSaving(false); }
    };

    const categories = ['Technology', 'Wellness', 'True Crime', 'Business', 'History', 'Comedy', 'Science', 'Music', 'Sports', 'Education'];

    return (
        <>
            <style>{`
        .mypod { padding:24px; max-width:900px; }
        .mypod h1 { font-size:1.6rem; font-weight:800; margin-bottom:4px; }
        .mypod .subtitle { font-size:0.85rem; color:var(--text-muted); margin-bottom:28px; }
        .pod-list { display:flex; flex-direction:column; gap:12px; }
        .pod-item { padding:20px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); transition:var(--transition); }
        .pod-item:hover { border-color:var(--primary); }
        .pod-top { display:flex; align-items:center; gap:14px; margin-bottom:8px; }
        .pod-emoji { font-size:2rem; }
        .pod-title { font-size:1.05rem; font-weight:700; flex:1; }
        .pod-meta { display:flex; gap:16px; font-size:0.75rem; color:var(--text-muted); margin-bottom:10px; }
        .pod-actions { display:flex; gap:8px; align-items:center; }
        .edit-btn { display:flex; align-items:center; gap:6px; padding:8px 16px; border-radius:var(--radius-md); font-size:0.8rem; font-weight:600; border:none; cursor:pointer; transition:var(--transition); }
        .edit-btn.primary { background:var(--gradient-primary); color:white; }
        .edit-btn.primary:hover { transform:translateY(-1px); box-shadow:var(--shadow-md); }
        .edit-btn.secondary { background:var(--bg-input); color:var(--text-primary); border:1px solid var(--border); }
        .edit-btn:disabled { opacity:0.5; cursor:not-allowed; }
        .time-badge { display:inline-flex; align-items:center; gap:4px; padding:4px 10px; border-radius:12px; font-size:0.7rem; font-weight:600; }
        .time-badge.active { background:rgba(74,222,128,0.15); color:var(--success); }
        .time-badge.expired { background:rgba(248,113,113,0.1); color:var(--danger); }

        .edit-form { margin-top:16px; padding:20px; background:var(--bg-input); border-radius:var(--radius-md); border:1px solid var(--border); animation:fadeIn 0.3s ease-out; }
        .ef-group { margin-bottom:14px; }
        .ef-label { font-size:0.75rem; font-weight:600; color:var(--text-muted); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px; }
        .ef-input { width:100%; padding:10px 14px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.85rem; }
        .ef-input:focus { border-color:var(--primary); outline:none; }
        .ef-select { width:100%; padding:10px 14px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.85rem; }
        .ef-ep-section { margin-top:16px; padding-top:16px; border-top:1px solid var(--border); }
        .ef-ep-title { font-size:0.9rem; font-weight:700; margin-bottom:12px; }
        .ef-ep-item { padding:14px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:10px; }
        .ef-ep-item h4 { font-size:0.85rem; font-weight:600; margin-bottom:8px; color:var(--accent); }
        .ef-audio-zone { display:flex; align-items:center; gap:10px; padding:10px; background:var(--bg-input); border:1px dashed var(--border); border-radius:var(--radius-sm); margin-top:8px; cursor:pointer; transition:var(--transition); }
        .ef-audio-zone:hover { border-color:var(--primary); background:rgba(92,114,133,0.1); }
        .ef-audio-current { font-size:0.72rem; color:var(--text-muted); }
        .ef-audio-new { font-size:0.72rem; color:var(--success); font-weight:600; }
        .ef-actions { display:flex; gap:8px; margin-top:16px; }
        .ef-msg { padding:10px; border-radius:var(--radius-sm); font-size:0.82rem; margin-top:8px; text-align:center; }
        .edit-history { margin-top:8px; }
        .eh-title { font-size:0.75rem; font-weight:600; color:var(--text-muted); margin-bottom:6px; }
        .eh-item { display:flex; gap:8px; align-items:center; padding:6px 10px; background:rgba(251,191,36,0.08); border-radius:var(--radius-sm); margin-bottom:4px; font-size:0.72rem; }
        .eh-field { font-weight:700; color:var(--warning); min-width:70px; }
        .eh-old { color:var(--danger); text-decoration:line-through; }
        .eh-new { color:var(--success); }
        .eh-time { color:var(--text-muted); margin-left:auto; font-size:0.65rem; }
        .loading-msg { text-align:center; padding:60px; color:var(--text-muted); }
        @media(max-width:480px) { .pod-meta { flex-wrap:wrap; } }
      `}</style>
            <div className="mypod">
                <h1 className="fade-in">📂 My Podcasts</h1>
                <p className="subtitle fade-in">Manage your uploads — edit within 24 hours of creation</p>
                {loading ? <p className="loading-msg">Loading...</p> : podcasts.length === 0 ? (
                    <p className="loading-msg">No podcasts yet. <a href="/creator/upload" style={{ color: 'var(--accent)' }}>Upload one!</a></p>
                ) : (
                    <div className="pod-list">
                        {podcasts.map(p => (
                            <div key={p._id} className="pod-item fade-in">
                                <div className="pod-top">
                                    <span className="pod-emoji">{p.emoji || '🎧'}</span>
                                    <span className="pod-title">{p.title}</span>
                                    <span className={`time-badge ${canEdit(p.createdAt) ? 'active' : 'expired'}`}>
                                        <FiClock size={12} /> {canEdit(p.createdAt) ? `${getTimeRemaining(p.createdAt)} left` : 'Edit expired'}
                                    </span>
                                </div>
                                <div className="pod-meta">
                                    <span>📁 {p.category}</span>
                                    <span>🌐 {p.language}</span>
                                    <span>🎧 {p.episodeCount} episodes</span>
                                    <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                                {/* Edit History */}
                                {p.editHistory?.length > 0 && (
                                    <div className="edit-history">
                                        <p className="eh-title">📝 Edit History</p>
                                        {p.editHistory.map((h, i) => (
                                            <div key={i} className="eh-item">
                                                <span className="eh-field">{h.field}</span>
                                                <span className="eh-old">{h.oldValue?.substring(0, 40)}</span>
                                                <span>→</span>
                                                <span className="eh-new">{h.newValue?.substring(0, 40)}</span>
                                                <span className="eh-time">{new Date(h.editedAt).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="pod-actions">
                                    <button className="edit-btn primary" disabled={!canEdit(p.createdAt)} onClick={() => editing === p._id ? cancelEdit() : startEdit(p)}>
                                        <FiEdit3 size={14} /> {editing === p._id ? 'Cancel' : 'Edit'}
                                    </button>
                                </div>
                                {/* Edit Form */}
                                {editing === p._id && (
                                    <div className="edit-form">
                                        <div className="ef-group"><label className="ef-label">Podcast Title</label><input className="ef-input" value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} /></div>
                                        <div className="ef-group"><label className="ef-label">Description</label><textarea className="ef-input" rows={3} value={editForm.description || ''} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} /></div>
                                        <div className="ef-group"><label className="ef-label">Category</label>
                                            <select className="ef-select" value={editForm.category || ''} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="ef-group"><label className="ef-label">Language</label><input className="ef-input" value={editForm.language || ''} onChange={e => setEditForm(f => ({ ...f, language: e.target.value }))} /></div>

                                        <div className="ef-ep-section">
                                            <p className="ef-ep-title">🎵 Episodes ({episodes.length})</p>
                                            {episodes.map((ep, i) => (
                                                <div key={ep._id} className="ef-ep-item">
                                                    <h4>Episode {i + 1}</h4>
                                                    <div className="ef-group"><label className="ef-label">Title</label><input className="ef-input" value={ep.title} onChange={e => handleEpChange(i, 'title', e.target.value)} /></div>
                                                    <div className="ef-group"><label className="ef-label">Description</label><input className="ef-input" value={ep.description || ''} onChange={e => handleEpChange(i, 'description', e.target.value)} /></div>
                                                    <label className="ef-audio-zone">
                                                        <FiUpload size={16} />
                                                        {ep.newAudioFile ? <span className="ef-audio-new">New: {ep.newAudioFile.name}</span> : <span className="ef-audio-current">{ep.audioFile ? `Current: ${ep.audioFile.split('/').pop()}` : 'No audio — click to upload'}</span>}
                                                        <input type="file" accept="audio/*" style={{ display: 'none' }} onChange={e => handleAudioChange(i, e.target.files[0])} />
                                                    </label>
                                                    {/* Episode edit history */}
                                                    {ep.editHistory?.length > 0 && (
                                                        <div className="edit-history" style={{ marginTop: 8 }}>
                                                            {ep.editHistory.map((h, j) => (
                                                                <div key={j} className="eh-item">
                                                                    <span className="eh-field">{h.field}</span>
                                                                    <span className="eh-old">{h.oldValue?.substring(0, 30)}</span>
                                                                    <span>→</span>
                                                                    <span className="eh-new">{h.newValue?.substring(0, 30)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="ef-actions">
                                            <button className="edit-btn primary" onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : '✅ Save Changes'}</button>
                                            <button className="edit-btn secondary" onClick={cancelEdit}><FiX size={14} /> Cancel</button>
                                        </div>
                                        {msg && <p className="ef-msg">{msg}</p>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
