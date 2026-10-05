// src/pages/CreatePostPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenLine, Send } from 'lucide-react';
import { postApi } from '../api/postApi';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ title: '', content: '' });
  const [errors, setErrors] = useState({});
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await postApi.create(form);
      navigate(`/posts/${res.data.data.id}`);
    } catch (err) {
      const data = err.response?.data;
      if (data?.data && typeof data.data === 'object') {
        setErrors(data.data);
      } else {
        setError(data?.message ?? 'Failed to create post.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <PenLine size={20} className="text-indigo-400" />
          <h1 className="text-3xl font-bold text-white">Write a Post</h1>
        </div>
        <p className="text-slate-400">Share your ideas with the community</p>
      </div>

      <div className="card p-8">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-xl p-3 mb-6">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-2">Title *</label>
            <input
              name="title"
              type="text"
              placeholder="Your post title…"
              value={form.title}
              onChange={handleChange}
              className={`input-field text-lg font-semibold ${errors.title ? 'border-rose-500/60' : ''}`}
            />
            {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="text-sm text-slate-300 font-medium block mb-2">Content *</label>
            <textarea
              name="content"
              rows={16}
              placeholder="Write your post content here…"
              value={form.content}
              onChange={handleChange}
              className={`input-field resize-none font-mono text-sm leading-relaxed ${errors.content ? 'border-rose-500/60' : ''}`}
            />
            {errors.content && <p className="text-xs text-rose-400 mt-1">{errors.content}</p>}
            <p className="text-xs text-slate-600 mt-1">{form.content.length} characters</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate(-1)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Send size={15} />
              }
              {loading ? 'Publishing…' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
