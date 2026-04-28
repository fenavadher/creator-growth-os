import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fileUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function PostCard({ post, onChange }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.some((id) => String(id) === String(user._id)));
  const [likes, setLikes] = useState(post.likes.length);
  const [comments, setComments] = useState(post.comments);
  const [text, setText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const toggleLike = async () => {
    setLiked(!liked);
    setLikes((n) => n + (liked ? -1 : 1));
    try {
      const { data } = await api.post(`/api/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikes(data.likes);
    } catch {
      setLiked(liked);
      setLikes(post.likes.length);
    }
  };

  const sendComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const { data } = await api.post(`/api/posts/${post._id}/comment`, { text });
    setComments(data.comments);
    setText('');
    setShowComments(true);
    onChange?.();
  };

  return (
    <article className="card post">
      <header className="post-head">
        <Link to={`/profile/${post.author._id}`} className="post-author">
          {post.author.avatar
            ? <img src={fileUrl(post.author.avatar)} alt="" className="avatar" />
            : <span className="avatar avatar-fallback">{post.author.name?.[0]?.toUpperCase()}</span>}
          <div>
            <div className="name">{post.author.name}</div>
            <div className="muted small">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
        </Link>
        {post.predictedEngagement && (
          <span className={`pill pill-${post.predictedEngagement.toLowerCase()}`}>
            {post.predictedEngagement} engagement
          </span>
        )}
      </header>

      {post.text && <p className="post-text">{post.text}</p>}
      {post.image && <img src={fileUrl(post.image)} alt="" className="post-img" />}

      <footer className="post-actions">
        <button className={`btn ghost ${liked ? 'liked' : ''}`} onClick={toggleLike}>
          {liked ? '♥' : '♡'} {likes}
        </button>
        <button className="btn ghost" onClick={() => setShowComments((s) => !s)}>
          💬 {comments.length}
        </button>
      </footer>

      {showComments && (
        <div className="comments">
          {comments.map((c) => (
            <div key={c._id} className="comment">
              <strong>{c.user?.name || 'User'}</strong>
              <span>{c.text}</span>
            </div>
          ))}
          <form className="comment-form" onSubmit={sendComment}>
            <input
              type="text"
              placeholder="Add a comment…"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn primary" type="submit">Post</button>
          </form>
        </div>
      )}
    </article>
  );
}
