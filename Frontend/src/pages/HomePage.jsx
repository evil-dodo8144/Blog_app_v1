// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TrendingUp, Flame, Clock, Search } from 'lucide-react';
import { postApi } from '../api/postApi';
import PostCard from '../components/PostCard';

const SORT_OPTIONS = [
  { label: 'Latest',   value: 'createdAt', icon: Clock },
  { label: 'Popular',  value: 'likeCount', icon: Flame },
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') ?? '';

  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [page,       setPage]       = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy,     setSortBy]     = useState('createdAt');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await postApi.getAll({
          page,
          size: 9,
          sortBy,
          sortDir: 'desc',
        });
        const pg = res.data.data;
        setPosts(pg.content ?? []);
        setTotalPages(pg.totalPages ?? 1);
      } catch {
        setError('Failed to load posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [page, sortBy]);

  const filtered = searchQuery
    ? posts.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.content?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : posts;

  const handleSort = (val) => {
    setSortBy(val);
    setPage(0);
  };

  return (
    <div className="page-container py-10">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20
                        rounded-full px-4 py-1.5 text-indigo-300 text-sm mb-4">
          <TrendingUp size={14} />
          Explore the latest stories
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          Ideas Worth
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
            {' '}Reading
          </span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Discover articles, tutorials, and stories from our community.
        </p>
      </div>

      {/* ── Controls row ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {searchQuery && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Search size={14} />
            Results for <span className="text-white font-medium">"{searchQuery}"</span>
            <button
              onClick={() => setSearchParams({})}
              className="text-indigo-400 hover:text-indigo-300 ml-1"
            >
              ✕ Clear
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {SORT_OPTIONS.map(({ label, value, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleSort(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${sortBy === value
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Post Grid ────────────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-6 animate-pulse space-y-4">
              <div className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-full bg-white/5" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-2.5 bg-white/5 rounded w-1/3" />
                </div>
              </div>
              <div className="h-5 bg-white/5 rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-white/5 rounded" />
                <div className="h-3 bg-white/5 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-rose-400">{error}</p>
          <button onClick={() => setPage(0)} className="btn-ghost mt-4">Retry</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg">No posts found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="btn-ghost disabled:opacity-30"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all
                            ${i === page
                              ? 'bg-indigo-600 text-white'
                              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                            }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="btn-ghost disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
