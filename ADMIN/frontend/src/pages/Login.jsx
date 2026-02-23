import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5003/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');
            localStorage.setItem('token', data.token);
            localStorage.setItem('admin', JSON.stringify(data.user));
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login failed. Try admin@test.com / 123456');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
        .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; padding:20px; }
        .auth-bg { position:absolute; inset:0; pointer-events:none; }
        .circle { position:absolute; border-radius:50%; opacity:0.15; animation:float 8s ease-in-out infinite; }
        .c1 { width:300px; height:300px; background:var(--primary); top:-80px; left:-60px; }
        .c2 { width:200px; height:200px; background:var(--accent); bottom:-40px; right:-40px; animation-delay:2s; }
        .c3 { width:150px; height:150px; background:var(--secondary); top:40%; right:20%; animation-delay:4s; }
        .auth-container { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-xl); padding:48px 36px; width:100%; max-width:420px; text-align:center; position:relative; z-index:1; }
        .auth-logo { font-size:3rem; margin-bottom:16px; }
        .auth-container h1 { font-size:1.6rem; margin-bottom:6px; }
        .auth-subtitle { color:var(--text-muted); font-size:0.85rem; margin-bottom:32px; }
        .input-group { position:relative; margin-bottom:16px; }
        .input-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:var(--text-muted); }
        .input-group input { width:100%; padding:14px 16px 14px 44px; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.9rem; transition:var(--transition); }
        .input-group input:focus { border-color:var(--primary); }
        .input-group input::placeholder { color:var(--text-muted); }
        .input-toggle { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:none; color:var(--text-muted); }
        .auth-btn { width:100%; padding:14px; margin-top:8px; background:var(--gradient-primary); color:white; border-radius:var(--radius-md); font-weight:600; font-size:1rem; display:flex; align-items:center; justify-content:center; transition:var(--transition); }
        .auth-btn:hover { transform:translateY(-2px); box-shadow:var(--shadow-md); }
        .auth-btn:disabled { opacity:0.7; }
        .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.3); border-top-color:white; border-radius:50%; animation:spin 0.6s linear infinite; }
        .auth-error { background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.3); color:#f87171; padding:10px 16px; border-radius:var(--radius-md); font-size:0.8rem; margin-bottom:16px; animation:fadeIn 0.3s ease-out; }
      `}</style>
            <div className="auth-page">
                <div className="auth-bg"><div className="circle c1" /><div className="circle c2" /><div className="circle c3" /></div>
                <div className="auth-container fade-in">
                    <div className="auth-logo">🛡️</div>
                    <h1>Admin Login</h1>
                    <p className="auth-subtitle">Access the admin dashboard</p>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="input-group"><FiMail className="input-icon" /><input type="email" placeholder="Admin email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
                        <div className="input-group"><FiLock className="input-icon" /><input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required /><button type="button" className="input-toggle" onClick={() => setShowPass(!showPass)}>{showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}</button></div>
                        <button type="submit" className="auth-btn" disabled={loading}>{loading ? <span className="spinner" /> : 'Sign In'}</button>
                    </form>
                </div>
            </div>
        </>
    );
}
