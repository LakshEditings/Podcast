import { useState } from 'react';
import { FiPlus, FiTrash2, FiX } from 'react-icons/fi';

const initialCats = [
    { id: 1, name: 'Technology', emoji: '💻', podcasts: 245 },
    { id: 2, name: 'Wellness', emoji: '🧘', podcasts: 180 },
    { id: 3, name: 'True Crime', emoji: '🔍', podcasts: 320 },
    { id: 4, name: 'Business', emoji: '🚀', podcasts: 156 },
    { id: 5, name: 'History', emoji: '📜', podcasts: 210 },
    { id: 6, name: 'Comedy', emoji: '😂', podcasts: 290 },
    { id: 7, name: 'Science', emoji: '🔬', podcasts: 175 },
    { id: 8, name: 'Music', emoji: '🎵', podcasts: 130 },
    { id: 9, name: 'Sports', emoji: '⚽', podcasts: 200 },
    { id: 10, name: 'Education', emoji: '📚', podcasts: 165 },
];

export default function Categories() {
    const [cats, setCats] = useState(initialCats);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newEmoji, setNewEmoji] = useState('');

    const addCat = () => {
        if (!newName.trim()) return;
        setCats(c => [...c, { id: Date.now(), name: newName, emoji: newEmoji || '📂', podcasts: 0 }]);
        setNewName(''); setNewEmoji(''); setShowAdd(false);
    };
    const deleteCat = (id) => setCats(c => c.filter(x => x.id !== id));

    return (
        <>
            <style>{`
        .cats-page{padding:24px}.cats-page h1{font-size:1.6rem;font-weight:800;margin-bottom:24px}
        .cats-toolbar{display:flex;justify-content:flex-end;margin-bottom:20px}
        .add-cat-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;background:var(--gradient-primary);color:white;border-radius:var(--radius-md);font-weight:600;font-size:.85rem;transition:var(--transition)}
        .add-cat-btn:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}
        .cats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        .cat-card{display:flex;align-items:center;gap:16px;padding:20px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);transition:var(--transition)}
        .cat-card:hover{border-color:var(--primary)}
        .cat-icon{width:50px;height:50px;border-radius:14px;background:rgba(92,114,133,.15);display:flex;align-items:center;justify-content:center;font-size:1.6rem}
        .cat-info{flex:1}.cat-name{font-size:.95rem;font-weight:700}.cat-count{font-size:.72rem;color:var(--text-muted);margin-top:2px}
        .cat-act{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:transparent;color:var(--text-muted);transition:var(--transition)}
        .cat-act:hover{color:var(--danger);background:rgba(248,113,113,.1)}
        .add-form{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-lg);padding:20px;margin-bottom:20px;display:flex;gap:12px;align-items:flex-end}
        .add-form .fg{flex:1}.add-form label{font-size:.75rem;font-weight:600;color:var(--text-muted);display:block;margin-bottom:6px}
        .add-form input{width:100%;padding:10px 14px;background:var(--bg-input);border:1px solid var(--border);border-radius:var(--radius-md);color:var(--text-primary);font-size:.85rem}
        .add-form input:focus{border-color:var(--primary)}
        .add-submit{padding:10px 20px;background:var(--gradient-primary);color:white;border-radius:var(--radius-md);font-weight:600;font-size:.85rem;height:42px}
        .add-cancel{padding:10px 16px;background:transparent;border:1px solid var(--border);color:var(--text-muted);border-radius:var(--radius-md);font-size:.85rem;height:42px}
        @media(max-width:768px){.cats-grid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:480px){.cats-grid{grid-template-columns:1fr}}
      `}</style>
            <div className="cats-page">
                <h1 className="fade-in">🏷️ Categories</h1>
                <div className="cats-toolbar"><button className="add-cat-btn" onClick={() => setShowAdd(!showAdd)}><FiPlus size={16} />Add Category</button></div>
                {showAdd && <div className="add-form fade-in"><div className="fg"><label>Emoji</label><input placeholder="📂" value={newEmoji} onChange={e => setNewEmoji(e.target.value)} style={{ maxWidth: 80 }} /></div><div className="fg"><label>Name</label><input placeholder="Category name" value={newName} onChange={e => setNewName(e.target.value)} /></div><button className="add-submit" onClick={addCat}>Add</button><button className="add-cancel" onClick={() => setShowAdd(false)}><FiX size={16} /></button></div>}
                <div className="cats-grid">{cats.map(c => <div key={c.id} className="cat-card fade-in"><div className="cat-icon">{c.emoji}</div><div className="cat-info"><p className="cat-name">{c.name}</p><p className="cat-count">{c.podcasts} podcasts</p></div><button className="cat-act" onClick={() => deleteCat(c.id)}><FiTrash2 size={14} /></button></div>)}</div>
            </div>
        </>
    );
}
