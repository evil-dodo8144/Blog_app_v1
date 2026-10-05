// src/components/CommentList.jsx
import { useState, useEffect, useCallback } from 'react';
import { Trash2, MessageCircle, Send, LogIn } from 'lucide-react';
import { commentApi } from '../api/commentApi';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export default function CommentList({ postId }) {
  const { user } = useAuth();
  const [comments, setComments]     = useState([]);
  const [content, setContent]       = useState('');
  const [page, setPage]             = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  const fetchComments = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const res = await commentApi.getByPost(postId, { page: p, size: 10 });
      const pg  = res.data.data;
      setComments(pg.content ?? []);
      setTotalPages(pg.totalPages ?? 1);
      setPage(p);
    } catch {
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => { fetchComments(0); }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await commentApi.add(postId, { content: content.trim() });
      setContent('');
      fetchComments(0);
    } catch {
      setError('Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await commentApi.remove(postId, commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch {
      setError('Failed to delete comment.');
    }
  };

  return (
    <section className="mt-12">
      <h3 className="section-title flex items-center gap-2 mb-6">
        <MessageCircle size={22} className="text-indigo-400" />
        Comments
        <span className="text-slate-500 text-base font-normal">({comments.length})</span>
      </h3>

      {/* Comment form */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-full bg-indigo-700 flex items-center justify-center
                            text-white text-xs font-bold shrink-0 mt-1">
              {user.username?.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment…"
                rows={3}
                className="input-field resize-none text-sm"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="btn-primary flex items-center gap-2 text-sm py-2"
                >
                  <Send size={14} />
                  {submitting ? 'Posting…' : 'Post Comment'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="card p-5 mb-8 flex items-center gap-3 text-slate-400">
          <LogIn size={18} className="text-indigo-400" />
          <span className="text-sm">
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
            {' '}to leave a comment.
          </span>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-xl p-3 mb-4">
          {error}
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map((i) => (
            <div key={i} className="card p-4 animate-pulse flex gap-3">
              <div className="w-9 h-9 bg-white/5 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-white/5 rounded w-1/4" />
                <div className="h-3 bg-white/5 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <MessageCircle size={32} className="mx-auto mb-2 opacity-30" />
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="card p-4 flex gap-3 group">
              <div className="w-9 h-9 rounded-full bg-indigo-700/50 flex items-center justify-center
                              text-indigo-200 text-xs font-bold shrink-0">
                {comment.author?.username?.slice(0, 2).toUpperCase() ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-white">{comment.author?.username}</span>
                    <span className="text-xs text-slate-500 ml-2">{formatDate(comment.createdAt)}</span>
                  </div>
                  {user && user.id === comment.author?.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400
                                 transition-all duration-200 p-1 rounded-lg hover:bg-rose-500/10"
                      title="Delete comment"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 0}
            onClick={() => fetchComments(page - 1)}
            className="btn-ghost text-sm disabled:opacity-30"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500 px-3 py-2">
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => fetchComments(page + 1)}
            className="btn-ghost text-sm disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
