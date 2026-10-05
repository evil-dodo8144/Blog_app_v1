// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { User, Edit3, Save, Calendar, BookOpen, Heart } from 'lucide-react';
import { authApi } from '../api/authApi';
import { postApi } from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric',
  });
}

export default function ProfilePage() {
  const { id }                 = useParams();         // /profile/:id or /profile (own)
  const navigate               = useNavigate();
  const { user: currentUser, updateUser } = useAuth();

  const [profile,  setProfile]  = useState(null);
  const [posts,    setPosts]    = useState([]);
  const [tab,      setTab]      = useState('posts');
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [editForm, setEditForm] = useState({ username: '', bio: '', avatarUrl: '' });

  const isOwn = !id || (currentUser && String(currentUser.id) === String(id));

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res     = isOwn
          ? await authApi.getMe()
          : await authApi.getUserById(id);
        const profileData = res.data.data;
        setProfile(profileData);
        setEditForm({
          username:  profileData.username  ?? '',
          bio:       profileData.bio       ?? '',
          avatarUrl: profileData.avatarUrl ?? '',
        });
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, isOwn]);

  useEffect(() => {
    // Fetch all posts to filter by author  
    const fetchPosts = async () => {
      try {
        const res = await postApi.getAll({ page: 0, size: 50, sortBy: 'createdAt', sortDir: 'desc' });
        const allPosts = res.data.data?.content ?? [];
        const authorId = profile?.id;
        setPosts(allPosts.filter((p) => p.author?.id === authorId));
      } catch { /* ignore */ }
    };
    if (profile) fetchPosts();
  }, [profile]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const res = await authApi.updateMe(editForm);
      const updated = res.data.data;
      setProfile(updated);
      updateUser(updated);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container py-10 animate-pulse max-w-4xl mx-auto">
        <div className="flex gap-6 mb-8">
          <div className="w-24 h-24 rounded-2xl bg-white/5" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-white/5 rounded w-1/3" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-white/5 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="page-container py-10 max-w-4xl mx-auto">

      {/* ── Profile Header ─────────────────────────────────────────────── */}
      <div className="card p-8 mb-8 flex flex-col sm:flex-row gap-6 items-start">
        {profile?.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.username}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/30 shrink-0"
          />
        ) : (
          <div className="w-24 h-24 rounded-2xl bg-indigo-700 flex items-center justify-center
                          text-white text-3xl font-bold ring-4 ring-indigo-500/20 shrink-0">
            {profile?.username?.slice(0, 2).toUpperCase() ?? 'U'}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white mb-1">{profile?.username}</h1>
          <p className="text-slate-400 text-sm mb-3">{profile?.email}</p>

          {profile?.bio && (
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} />
              Joined {formatDate(profile?.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} />
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1.5">
              <User size={12} />
              {profile?.role?.replace('ROLE_', '')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      {isOwn && (
        <div className="flex gap-1 bg-white/5 border border-white/10 p-1 rounded-xl mb-6 w-fit">
          {['posts', 'edit'].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200
                          ${tab === t
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/30'
                            : 'text-slate-400 hover:text-white'
                          }`}
            >
              {t === 'posts' ? 'My Posts' : 'Edit Profile'}
            </button>
          ))}
        </div>
      )}

      {/* ── Posts Tab ──────────────────────────────────────────────────── */}
      {(tab === 'posts' || !isOwn) && (
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
              <p>{isOwn ? "You haven't written any posts yet." : 'No posts yet.'}</p>
              {isOwn && (
                <Link to="/create-post" className="btn-primary inline-flex mt-4 text-sm">
                  Write your first post
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => <PostCard key={post.id} post={post} />)}
            </div>
          )}
        </div>
      )}

      {/* ── Edit Profile Tab ───────────────────────────────────────────── */}
      {tab === 'edit' && isOwn && (
        <div className="card p-8 max-w-lg">
          {error   && <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm rounded-xl p-3 mb-5">⚠ {error}</div>}
          {success && <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl p-3 mb-5">✓ {success}</div>}

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Username</label>
              <input name="username" type="text" value={editForm.username} onChange={handleEditChange} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Bio</label>
              <textarea
                name="bio"
                rows={3}
                value={editForm.bio}
                onChange={handleEditChange}
                placeholder="Tell us about yourself…"
                className="input-field resize-none"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 font-medium block mb-1.5">Avatar URL</label>
              <input name="avatarUrl" type="url" value={editForm.avatarUrl} onChange={handleEditChange} placeholder="https://…" className="input-field" />
              {editForm.avatarUrl && (
                <img src={editForm.avatarUrl} alt="Preview" className="w-14 h-14 rounded-full object-cover mt-2 ring-2 ring-indigo-500/30" />
              )}
            </div>
            <div className="flex justify-end">
              <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
