// src/pages/EditPostPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit, Save } from 'lucide-react';
import { postApi } from '../api/postApi';
import { useAuth } from '../context/AuthContext';

export default function EditPostPage() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm]     = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [error, setError]   = useState('');
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res  = await postApi.getById(id);
        const post = res.data.data;

        // Only author or admin can edit
        if (user && user.id !== post.author?.id && user.role !== 'ROLE_ADMIN') {
          navigate(`/posts/${id}`);
          return;
        }

        setForm({ title: post.title, content: post.content });
      } catch {
        setError('Post not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title || form.title.length < 3) errs.title = 'Title must be at least 3 characters.';
    if (!form.content)                        errs.content = 'Content is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await postApi.update(id, form);
      navigate(`/posts/${id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.data && typeof data.data === 'object') {
        setErrors(data.data);
      } else {
        setError(data?.message ?? 'Failed to update post.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-10 max-w-3xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-white/5 rounded w-1/3" />
        <div className="card p-8 space-y-4">
          <div className="h-12 bg-white/5 rounded" />
          <div className="h-64 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 max-w-3xl mx-auto">
      <div className="mb-8 flex items-center gap-2">
        <Edit size={20} className="text-indigo-400" />
        <h1 className="text-3xl font-bold text-white">Edit Post</h1>
      </div>

      <div className="card p-8">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-xl p-3 mb-6">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-2">Title *</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className={`input-field text-lg font-semibold ${errors.title ? 'border-rose-500/60' : ''}`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="text-sm text-slate-300 font-medium block mb-2">Content *</label>
            <textarea
              name="content"
              rows={16}
              value={form.content}
              onChange={handleChange}
              className={`input-field resize-none font-mono text-sm leading-relaxed ${errors.content ? 'border-rose-500/60' : ''}`}
            />
            {errors.content && <p className="text-xs text-rose-400 mt-1">{errors.content}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save size={15} />
              }
              {submitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
