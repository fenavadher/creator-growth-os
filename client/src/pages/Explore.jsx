import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, fileUrl } from '../utils/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

export default function Explore() {
  const { user, refreshMe } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');

  const load = async () => {
    const [p, u] = await Promise.all([
      api.get('/api/posts/explore'),
      api.get('/api/users/explore')
    ]);
    setPosts(p.data.posts);
    setUsers(u.data.users);
  };

  useEffect(() => { load(); }, []);

  const search = async (e) => {
    e.preventDefault();
    if (!q.trim()) return load();
    const { data } = await api.get('/api/users/search', { params: { q } });
    setUsers(data.users);
  };

  const follow = async (id) => {
    await api.post(`/api/users/${id}/follow`);
    await refreshMe();
    await load();
  };

  return (
    <div className="explore">
      <aside className="side">
        <form className="card" onSubmit={search}>
          <h3>Discover creators</h3>
          <input placeholder="Search by name…" value={q} onChange={(e) => setQ(e.target.value)} />
        </form>
        <div className="card">
          <h3>Suggested</h3>
          <ul className="user-list">
            {users.map((u) => {
              const following = user.following.some((id) => String(id) === String(u._id));
              return (
                <li key={u._id}>
                  <Link to={`/profile/${u._id}`} className="post-author">
                    {u.avatar
                      ? <img src={fileUrl(u.avatar)} alt="" className="avatar" />
                      : <span className="avatar avatar-fallback">{u.name?.[0]?.toUpperCase()}</span>}
                    <div>
                      <div className="name">{u.name}</div>
                      <div className="muted small">{u.bio || 'Creator'}</div>
                    </div>
                  </Link>
                  <button className={`btn ${following ? 'ghost' : 'primary'}`} onClick={() => follow(u._id)}>
                    {following ? 'Following' : 'Follow'}
                  </button>
                </li>
              );
            })}
            {users.length === 0 && <div className="muted">No users yet.</div>}
          </ul>
        </div>
      </aside>
      <section className="feed">
        <h2>Latest posts</h2>
        {posts.map((p) => <PostCard key={p._id} post={p} onChange={load} />)}
        {posts.length === 0 && <div className="card empty muted">Nothing posted yet — be the first.</div>}
      </section>
    </div>
  );
}
