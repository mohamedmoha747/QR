import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="bg-slate-900 text-white px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-semibold">QR SaaS</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-sky-300">Home</Link>
          {user && <Link to="/dashboard" className="hover:text-sky-300">Dashboard</Link>}
          {user && <Link to="/generate" className="hover:text-sky-300">Generate</Link>}
          {user && <Link to="/my-qrs" className="hover:text-sky-300">My QR</Link>}
          {!user && <Link to="/login" className="hover:text-sky-300">Login</Link>}
          {!user && <Link to="/register" className="hover:text-sky-300">Register</Link>}
          {user && <button onClick={logout} className="hover:text-sky-300">Logout</button>}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
