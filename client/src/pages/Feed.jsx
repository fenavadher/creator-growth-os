import { useEffect, useState } from 'react';
import { api } from '../utils/api';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/posts/feed');
      setPosts(data.posts);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="feed">
      <CreatePost onCreated={load} />
      {loading && <div className="muted center">Loading feed…</div>}
      {!loading && posts.length === 0 && (
        <div className="card empty">
          <h3>Your feed is quiet</h3>
          <p className="muted">Follow other creators on the Explore page, or create your first post above.</p>
        </div>
      )}
      {posts.map((p) => <PostCard key={p._id} post={p} onChange={load} />)}
    </div>
  );
}
