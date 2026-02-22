import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Creators from './pages/Creators';
import Content from './pages/Content';
import Categories from './pages/Categories';
import Reports from './pages/Reports';

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/login';
  return (
    <>
      <style>{`
        .app-main{flex:1;margin-left:220px;min-height:100vh}
        @media(max-width:768px){.app-main{margin-left:0;padding-bottom:80px}}
      `}</style>
      {!hideNav && <Sidebar />}
      <main className={hideNav ? '' : 'app-main'}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/creators" element={<Creators />} />
          <Route path="/content" element={<Content />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (<BrowserRouter><AppContent /></BrowserRouter>);
}
