import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="bg-slate-900 text-white px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-semibold">QR Generator</Link>
        <nav className="flex items-center gap-4">
          <Link to="/" className="hover:text-sky-300">Home</Link>
          <Link to="/generate" className="hover:text-sky-300">Generate</Link>
          <Link to="/dashboard" className="hover:text-sky-300">Dashboard</Link>
          <Link to="/my-qrs" className="hover:text-sky-300">QR Library</Link>
          <Link to="/analytics" className="hover:text-sky-300">Analytics</Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
