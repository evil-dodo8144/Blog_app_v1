// src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ── Field extracted OUTSIDE the component so React keeps a stable
      reference across renders (prevents unmount/remount on every keystroke) ── */
function Field({ name, label, type = 'text', placeholder, extra, value, onChange, error }) {
  return (
    <div>
      <label className="text-sm text-slate-300 font-medium block mb-1.5">{label}</label>
      <div className="relative">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={name}
          className={`input-field ${type === 'password' ? 'pr-11' : ''} ${error ? 'border-rose-500/60' : ''}`}
        />
        {extra}
      </div>
      {error && (
        <p className="text-xs text-rose-400 mt-1">{error}</p>
      )}
    </div>
  );
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.username || form.username.length < 3)
      errs.username = 'Username must be at least 3 characters.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Please enter a valid email address.';
    if (!form.password || form.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message;
      const data = err.response?.data?.data;
      if (data && typeof data === 'object') {
        setErrors(data);           // Backend field-level validation errors
      } else {
        setError(msg ?? 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-slate-400">Join the BlogApp community</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400
                            text-sm rounded-xl p-3 mb-5">
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field name="username" label="Username" placeholder="johndoe"
                   value={form.username} onChange={handleChange} error={errors.username} />
            <Field name="email" label="Email" type="email" placeholder="you@example.com"
                   value={form.email} onChange={handleChange} error={errors.email} />
            <Field
              name="password"
              label="Password"
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              extra={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3"
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <UserPlus size={16} />
              }
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
