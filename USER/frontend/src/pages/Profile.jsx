import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiGlobe, FiBell, FiMoon, FiStar, FiAward } from 'react-icons/fi';

export default function Profile() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('English');

    const stats = [
        { label: 'Listened', value: '142 hrs' },
        { label: 'Subscribed', value: '12' },
        { label: 'Quizzes Won', value: '8' },
        { label: 'Rewards', value: '₹400' },
    ];

    return (
        <>
            <style>{`
        .page-container { max-width:1200px; margin:0 auto; padding:24px 20px 120px; }
        .profile-header { display:flex; flex-direction:column; align-items:center; gap:16px; margin-bottom:32px; }
        .profile-avatar { width:80px; height:80px; border-radius:50%; background:var(--gradient-primary); display:flex; align-items:center; justify-content:center; font-size:2rem; color:white; box-shadow:var(--shadow-md); }
        .profile-name { font-size:1.3rem; font-weight:700; }
        .profile-email { font-size:0.8rem; color:var(--text-muted); }
        .profile-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:28px; }
        .stat-card { text-align:center; padding:16px 8px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); transition:var(--transition); }
        .stat-card:hover { border-color:var(--primary); }
        .stat-value { font-size:1.1rem; font-weight:800; color:var(--accent); }
        .stat-label { font-size:0.65rem; color:var(--text-muted); margin-top:4px; }
        .settings-section { margin-bottom:24px; }
        .settings-title { font-size:0.75rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; }
        .setting-item { display:flex; align-items:center; gap:12px; padding:14px 16px; background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-md); margin-bottom:8px; transition:var(--transition); cursor:pointer; }
        .setting-item:hover { border-color:var(--primary); }
        .setting-icon { width:36px; height:36px; border-radius:10px; background:rgba(92,114,133,0.15); color:var(--accent); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .setting-info { flex:1; }
        .setting-name { font-size:0.85rem; font-weight:600; }
        .setting-desc { font-size:0.72rem; color:var(--text-muted); margin-top:2px; }
        .toggle { width:44px; height:24px; border-radius:12px; background:var(--bg-input); border:1px solid var(--border); position:relative; cursor:pointer; transition:var(--transition); }
        .toggle.on { background:var(--primary); border-color:var(--primary); }
        .toggle-knob { width:18px; height:18px; border-radius:50%; background:white; position:absolute; top:2px; left:2px; transition:var(--transition); }
        .toggle.on .toggle-knob { left:22px; }
        .lang-select { padding:6px 12px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-sm); color:var(--text-primary); font-size:0.8rem; }
        .logout-btn { width:100%; padding:14px; background:transparent; border:1px solid var(--danger); color:var(--danger); border-radius:var(--radius-md); font-weight:600; font-size:0.9rem; display:flex; align-items:center; justify-content:center; gap:8px; transition:var(--transition); }
        .logout-btn:hover { background:rgba(248,113,113,0.1); }
      `}</style>
            <div className="page-container">
                <div className="profile-header fade-in">
                    <div className="profile-avatar"><FiUser size={32} /></div>
                    <p className="profile-name">John Doe</p>
                    <p className="profile-email">john@example.com</p>
                </div>
                <div className="profile-stats fade-in">
                    {stats.map(s => <div key={s.label} className="stat-card"><p className="stat-value">{s.value}</p><p className="stat-label">{s.label}</p></div>)}
                </div>
                <div className="settings-section fade-in">
                    <p className="settings-title">Preferences</p>
                    <div className="setting-item">
                        <div className="setting-icon"><FiBell size={18} /></div>
                        <div className="setting-info"><p className="setting-name">Notifications</p><p className="setting-desc">Get notified for new episodes</p></div>
                        <div className={`toggle ${notifications ? 'on' : ''}`} onClick={() => setNotifications(!notifications)}><div className="toggle-knob" /></div>
                    </div>
                    <div className="setting-item">
                        <div className="setting-icon"><FiMoon size={18} /></div>
                        <div className="setting-info"><p className="setting-name">Dark Mode</p><p className="setting-desc">Toggle dark theme</p></div>
                        <div className={`toggle ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(!darkMode)}><div className="toggle-knob" /></div>
                    </div>
                    <div className="setting-item">
                        <div className="setting-icon"><FiGlobe size={18} /></div>
                        <div className="setting-info"><p className="setting-name">Language</p><p className="setting-desc">App display language</p></div>
                        <select className="lang-select" value={language} onChange={e => setLanguage(e.target.value)}>
                            {['English', 'Hindi', 'Spanish', 'French', 'Tamil', 'Telugu'].map(l => <option key={l}>{l}</option>)}
                        </select>
                    </div>
                </div>
                <div className="settings-section fade-in">
                    <p className="settings-title">Account</p>
                    <div className="setting-item"><div className="setting-icon"><FiAward size={18} /></div><div className="setting-info"><p className="setting-name">Rewards</p><p className="setting-desc">View your earned rewards</p></div></div>
                    <div className="setting-item"><div className="setting-icon"><FiStar size={18} /></div><div className="setting-info"><p className="setting-name">Premium</p><p className="setting-desc">Unlock AI summaries & more</p></div></div>
                    <div className="setting-item"><div className="setting-icon"><FiSettings size={18} /></div><div className="setting-info"><p className="setting-name">Settings</p><p className="setting-desc">Advanced app settings</p></div></div>
                </div>
                <button className="logout-btn" onClick={() => navigate('/login')}><FiLogOut size={18} /> Sign Out</button>
            </div>
        </>
    );
}
