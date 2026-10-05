// src/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PenLine, LogOut, User, ChevronDown, BookOpen, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const avatarUrl = user?.avatarUrl;
  const initials  = user?.username?.slice(0, 2).toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Brand ─────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">BlogApp</span>
          </Link>

          {/* ── Search bar ────────────────────────── */}
          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search posts…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2
                           text-sm text-white placeholder-slate-500
                           focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500
                           transition-all duration-200"
              />
            </div>
          </form>

          {/* ── Right side ────────────────────────── */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                {/* Write Post */}
                <Link
                  to="/create-post"
                  className="btn-primary flex items-center gap-1.5 text-sm py-2 px-4 hidden sm:flex"
                >
                  <PenLine size={15} />
                  Write
                </Link>

                {/* Avatar + Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl
                               hover:bg-white/5 transition-all duration-200"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center
                                      text-white text-xs font-bold ring-2 ring-indigo-500/40">
                        {initials}
                      </div>
                    )}
                    <span className="text-sm text-slate-300 hidden sm:block">{user.username}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 card shadow-2xl shadow-black/50
                                    overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white">{user.username}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300
                                     hover:bg-white/5 hover:text-white rounded-lg transition-colors"
                        >
                          <User size={15} />
                          My Profile
                        </Link>
                        <Link
                          to="/create-post"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-300
                                     hover:bg-white/5 hover:text-white rounded-lg transition-colors sm:hidden"
                        >
                          <PenLine size={15} />
                          Write Post
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-400
                                     hover:bg-rose-500/10 rounded-lg transition-colors"
                        >
                          <LogOut size={15} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login"    className="btn-ghost text-sm">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
