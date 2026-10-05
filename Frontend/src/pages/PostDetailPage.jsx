// src/pages/PostDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { postApi } from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import LikeButton from '../components/LikeButton';
import CommentList from '../components/CommentList';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function PostDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await postApi.getById(id);
        setPost(res.data.data);
      } catch {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This action cannot be undone.')) return;
    setDeleting(true);
    try {
      await postApi.remove(id);
      navigate('/');
    } catch {
      setError('Failed to delete post.');
      setDeleting(false);
    }
  };

  const isAuthor = user && post && user.id === post.author?.id;
  const isAdmin  = user?.role === 'ROLE_ADMIN';
  const canEdit  = isAuthor || isAdmin;

  if (loading) {
    return (
      <div className="page-container py-10 max-w-3xl">
        <div className="animate-pulse space-y-6">
          <div className="h-4 bg-white/5 rounded w-24" />
          <div className="h-10 bg-white/5 rounded w-3/4" />
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-full" />
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-32" />
              <div className="h-3 bg-white/5 rounded w-24" />
            </div>
          </div>
          {Array.from({length: 8}).map((_,i) => (
            <div key={i} className="h-4 bg-white/5 rounded w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="page-container py-20 text-center">
        <p className="text-rose-400 text-lg mb-4">{error || 'Post not found.'}</p>
        <Link to="/" className="btn-ghost">← Back to home</Link>
      </div>
    );
  }

  return (
    <div className="page-container py-10 max-w-3xl mx-auto">

      {/* ── Back button ─────────────────────────────────────────────────── */}
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-1.5 text-sm mb-8 px-0">
        <ArrowLeft size={15} />
        Back
      </button>

      {/* ── Title ───────────────────────────────────────────────────────── */}
      <h1 className="text-4xl font-extrabold text-white leading-tight mb-6 tracking-tight">
        {post.title}
      </h1>

      {/* ── Meta row ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-3">
          {post.author?.avatarUrl ? (
            <img
              src={post.author.avatarUrl}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center
                            text-white text-sm font-bold">
              {post.author?.username?.slice(0, 2).toUpperCase() ?? 'U'}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{post.author?.username}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Clock size={11} />
              {formatDate(post.createdAt)}
              {post.updatedAt !== post.createdAt && (
                <span className="ml-1">(edited {formatDate(post.updatedAt)})</span>
              )}
            </p>
          </div>
        </div>

        {/* Author actions */}
        {canEdit && (
          <div className="flex gap-2">
            <Link
              to={`/edit-post/${post.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl
                         bg-white/5 border border-white/10 text-slate-300
                         hover:bg-indigo-600/20 hover:border-indigo-500/30 hover:text-indigo-300
                         transition-all duration-200"
            >
              <Edit size={14} />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl
                         bg-white/5 border border-white/10 text-slate-300
                         hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400
                         transition-all duration-200 disabled:opacity-50"
            >
              <Trash2 size={14} />
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* ── Divider ─────────────────────────────────────────────────────── */}
      <div className="h-px bg-white/10 mb-8" />

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <article className="prose prose-invert max-w-none text-slate-300 leading-loose
                          text-base whitespace-pre-wrap">
        {post.content}
      </article>

      {/* ── Like Button ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mt-10 pt-6 border-t border-white/10">
        <LikeButton
          postId={post.id}
          initialCount={post.likeCount ?? 0}
          initialLiked={false}
        />
        <span className="text-sm text-slate-500">
          {user ? 'Did you enjoy this post?' : 'Sign in to like this post'}
        </span>
      </div>

      {/* ── Comments ────────────────────────────────────────────────────── */}
      <CommentList postId={post.id} />
    </div>
  );
}
