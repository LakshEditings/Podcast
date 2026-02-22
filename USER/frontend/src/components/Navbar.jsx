import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiSearch, FiBookmark, FiUser, FiGrid } from 'react-icons/fi';

const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/search', icon: FiSearch, label: 'Search' },
    { path: '/categories', icon: FiGrid, label: 'Browse' },
    { path: '/library', icon: FiBookmark, label: 'Library' },
    { path: '/profile', icon: FiUser, label: 'Profile' },
];

export default function Navbar() {
    const location = useLocation();
    return (
        <>
            <style>{`
        .bottom-nav { position:fixed; bottom:0; left:0; right:0; display:flex; justify-content:space-around; align-items:center; background:rgba(26,31,37,0.95); backdrop-filter:blur(20px); border-top:1px solid var(--border); padding:8px 0 12px; z-index:1000; }
        .nav-item { display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px 16px; border-radius:12px; color:var(--text-muted); font-size:0.7rem; font-weight:500; transition:var(--transition); text-decoration:none; }
        .nav-item:hover { color:var(--accent); }
        .nav-item.active { color:var(--accent); }
        .nav-item.active svg { filter:drop-shadow(0 0 8px rgba(167,180,158,0.4)); }
      `}</style>
            <nav className="bottom-nav">
                {navItems.map(item => (
                    <Link key={item.path} to={item.path} className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}>
                        <item.icon size={22} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>
        </>
    );
}
