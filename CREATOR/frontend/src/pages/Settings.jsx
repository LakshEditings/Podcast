import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiGlobe, FiBell, FiLogOut } from 'react-icons/fi';

export default function Settings() {
    const navigate = useNavigate();
    const [channelName, setChannelName] = useState('Tech Unplugged');
    const [bio, setBio] = useState('Exploring the latest in tech, AI, and the digital future.');
    const [notifications, setNotifications] = useState(true);
    const [saved, setSaved] = useState(false);

    const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

    return (
        <>
            <style>{`
        .settings-page { padding:24px; max-width:700px; }
        .settings-page h1 { font-size:1.6rem; font-weight:800; margin-bottom:24px; }
        .settings-section { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-lg); padding:24px; margin-bottom:20px; }
        .settings-section h3 { font-size:1rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
        .form-group { margin-bottom:16px; }
        .form-label { font-size:0.78rem; font-weight:600; color:var(--text-muted); margin-bottom:6px; display:block; }
        .form-input { width:100%; padding:12px 16px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.85rem; transition:var(--transition); }
        .form-input:focus { border-color:var(--primary); }
        textarea.form-input { min-height:80px; resize:vertical; }
        .toggle-row { display:flex; align-items:center; justify-content:space-between; padding:12px 0; }
        .toggle-label { font-size:0.85rem; }
        .toggle { width:44px; height:24px; border-radius:12px; background:var(--bg-input); border:1px solid var(--border); position:relative; cursor:pointer; transition:var(--transition); }
        .toggle.on { background:var(--primary); border-color:var(--primary); }
        .toggle-knob { width:18px; height:18px; border-radius:50%; background:white; position:absolute; top:2px; left:2px; transition:var(--transition); }
        .toggle.on .toggle-knob { left:22px; }
        .save-btn { width:100%; padding:14px; background:var(--gradient-primary); color:white; border-radius:var(--radius-md); font-weight:600; font-size:0.95rem; transition:var(--transition); }
        .save-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .save-msg { text-align:center; padding:12px; background:rgba(74,222,128,0.1); border:1px solid rgba(74,222,128,0.3); border-radius:var(--radius-md); color:var(--success); font-weight:600; margin-top:12px; }
        .logout-btn { width:100%; padding:14px; background:transparent; border:1px solid var(--danger); color:var(--danger); border-radius:var(--radius-md); font-weight:600; font-size:0.9rem; display:flex; align-items:center; justify-content:center; gap:8px; transition:var(--transition); margin-top:12px; }
        .logout-btn:hover { background:rgba(248,113,113,0.1); }
      `}</style>
            <div className="settings-page">
                <h1 className="fade-in">⚙️ Settings</h1>
                <div className="settings-section fade-in">
                    <h3><FiUser size={18} /> Channel Profile</h3>
                    <div className="form-group"><label className="form-label">Channel Name</label><input className="form-input" value={channelName} onChange={e => setChannelName(e.target.value)} /></div>
                    <div className="form-group"><label className="form-label">Bio</label><textarea className="form-input" value={bio} onChange={e => setBio(e.target.value)} /></div>
                </div>
                <div className="settings-section fade-in">
                    <h3><FiBell size={18} /> Notifications</h3>
                    <div className="toggle-row"><span className="toggle-label">Email notifications for new subscribers</span><div className={`toggle ${notifications ? 'on' : ''}`} onClick={() => setNotifications(!notifications)}><div className="toggle-knob" /></div></div>
                </div>
                <button className="save-btn" onClick={handleSave}>Save Changes</button>
                {saved && <div className="save-msg fade-in">✓ Settings saved successfully!</div>}
                <button className="logout-btn" onClick={() => navigate('/login')}><FiLogOut size={18} /> Sign Out</button>
            </div>
        </>
    );
}
