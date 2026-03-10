import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiUsers, FiMic, FiFileText, FiGrid, FiBarChart2, FiSun, FiMoon } from 'react-icons/fi';

const items = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/users', icon: FiUsers, label: 'Users' },
    { path: '/creators', icon: FiMic, label: 'Creators' },
    { path: '/content', icon: FiFileText, label: 'Content' },
    { path: '/categories', icon: FiGrid, label: 'Categories' },
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
];

export default function Sidebar() {
    const location = useLocation();
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem('podcast-theme');
        return saved ? saved === 'dark' : true;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
        localStorage.setItem('podcast-theme', dark ? 'dark' : 'light');
    }, [dark]);

    return (
        <>
            <style>{`
        .sidebar { position:fixed; left:0; top:0; bottom:0; width:220px; background:var(--bg-card); border-right:1px solid var(--border); padding:24px 12px; display:flex; flex-direction:column; z-index:100; }
        .sidebar-logo { display:flex; align-items:center; gap:10px; padding:8px 12px; margin-bottom:32px; }
        .sidebar-logo span { font-size:1.5rem; }
        .sidebar-logo h2 { font-size:1.1rem; font-weight:800; }
        .sidebar-nav { display:flex; flex-direction:column; gap:4px; flex:1; }
        .sidebar-item { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:var(--radius-md); color:var(--text-muted); font-size:0.85rem; font-weight:500; transition:var(--transition); text-decoration:none; }
        .sidebar-item:hover { background:var(--bg-card-hover); color:var(--text-primary); }
        .sidebar-item.active { background:var(--sidebar-active-bg); color:var(--ASecondary1); }
        .theme-btn { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:var(--radius-md); color:var(--text-muted); font-size:0.85rem; font-weight:500; transition:var(--transition); background:none; border:1px solid var(--border); cursor:pointer; width:100%; margin-top:8px; }
        .theme-btn:hover { background:var(--bg-card-hover); color:var(--warning); border-color:var(--warning); }
        @media(max-width:768px) {
          .sidebar { position:fixed; bottom:0; top:auto; left:0; right:0; width:100%; height:auto; flex-direction:row; padding:8px; border-right:none; border-top:1px solid var(--border); }
          .sidebar-logo { display:none; }
          .sidebar-nav { flex-direction:row; justify-content:space-around; }
          .sidebar-item { flex-direction:column; gap:4px; padding:8px; font-size:0.6rem; }
          .theme-btn { padding:8px; font-size:0.6rem; flex-direction:column; gap:4px; border:none; margin-top:0; justify-content:center; min-width:auto; }
        }
      `}</style>
            <aside className="sidebar">
                <div className="sidebar-logo"><span>🛡️</span><h2>Admin Panel</h2></div>
                <nav className="sidebar-nav">
                    {items.map(i => (
                        <Link key={i.path} to={i.path} className={`sidebar-item ${location.pathname === i.path ? 'active' : ''}`}>
                            <i.icon size={20} /><span>{i.label}</span>
                        </Link>
                    ))}
                </nav>
                <button className="theme-btn" onClick={() => setDark(d => !d)} title={dark ? 'Light Mode' : 'Dark Mode'}>
                    {dark ? <FiSun size={20} /> : <FiMoon size={20} />}
                    <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>
            </aside>
        </>
    );
}
