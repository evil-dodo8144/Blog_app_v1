// src/components/LikeButton.jsx
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { postApi } from '../api/postApi';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LikeButton({ postId, initialCount = 0, initialLiked = false }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [liked,   setLiked]   = useState(initialLiked);
  const [count,   setCount]   = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (loading) return;
    setLoading(true);

    // Optimistic update
    setLiked((l) => !l);
    setCount((c) => liked ? c - 1 : c + 1);

    try {
      const res = await postApi.toggleLike(postId);
      const data = res.data.data;
      setLiked(data.likedByCurrentUser);
      setCount(data.likeCount);
    } catch {
      // Revert on error
      setLiked((l) => !l);
      setCount((c) => liked ? c + 1 : c - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-medium text-sm
                  transition-all duration-200 active:scale-95
                  ${liked
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-500/25'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400'
                  }`}
    >
      <Heart
        size={17}
        className={`transition-all duration-200 ${liked ? 'fill-rose-400 text-rose-400' : ''}`}
      />
      <span>{count}</span>
    </button>
  );
}
