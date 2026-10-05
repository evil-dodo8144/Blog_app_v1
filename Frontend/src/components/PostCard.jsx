// src/components/PostCard.jsx
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Clock, User } from 'lucide-react';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

function excerpt(text, len = 120) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len) + '…' : text;
}

export default function PostCard({ post }) {
  const { id, title, slug, content, author, likeCount, createdAt } = post;

  return (
    <article className="card p-6 flex flex-col gap-4 group hover:shadow-xl hover:shadow-black/40 transition-all duration-300">

      {/* Author row */}
      <div className="flex items-center gap-3">
        {author?.avatarUrl ? (
          <img
            src={author.avatarUrl}
            alt={author.username}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-700/60 flex items-center justify-center text-indigo-200 text-xs font-bold">
            {author?.username?.slice(0, 2).toUpperCase() ?? 'U'}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-slate-200">{author?.username ?? 'Unknown'}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Clock size={11} />
            {formatDate(createdAt)}
          </p>
        </div>
      </div>

      {/* Title + excerpt */}
      <div className="flex-1">
        <Link to={`/posts/${id}`}>
          <h2 className="text-lg font-bold text-white leading-snug mb-2
                         group-hover:text-indigo-400 transition-colors duration-200 line-clamp-2">
            {title}
          </h2>
        </Link>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
          {excerpt(content)}
        </p>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="tag-pill">{slug?.split('-')[0] ?? 'post'}</span>
        <div className="flex items-center gap-4 text-slate-500 text-xs">
          <span className="flex items-center gap-1">
            <Heart size={13} className="text-rose-400" />
            {likeCount ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={13} className="text-indigo-400" />
            —
          </span>
        </div>
      </div>
    </article>
  );
}
