import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, fileUrl } from '../utils/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { id } = useParams();
  const { user: me, refreshMe } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const isMe = String(id) === String(me._id);

  const load = async () => {
    const [u, p] = await Promise.all([
      api.get(`/api/users/${id}`),
      api.get(`/api/posts/user/${id}`)
    ]);
    setUser(u.data.user);
    setPosts(p.data.posts);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  const follow = async () => {
    await api.post(`/api/users/${id}/follow`);
    await refreshMe();
    await load();
  };

  if (!user) return <div className="center muted">Loading…</div>;

  const following = me.following.some((u) => String(u) === String(user._id));

  return (
    <div className="profile">
      <div className="card profile-head">
        {user.avatar
          ? <img src={fileUrl(user.avatar)} alt="" className="avatar avatar-xl" />
          : <span className="avatar avatar-xl avatar-fallback">{user.name?.[0]?.toUpperCase()}</span>}
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p className="muted">{user.bio || 'No bio yet.'}</p>
          <div className="profile-stats">
            <span><strong>{posts.length}</strong> posts</span>
            <span><strong>{user.followers.length}</strong> followers</span>
            <span><strong>{user.following.length}</strong> following</span>
          </div>
        </div>
        <div>
          {isMe
            ? <Link to="/profile/edit" className="btn primary">Edit profile</Link>
            : <button className={`btn ${following ? 'ghost' : 'primary'}`} onClick={follow}>{following ? 'Unfollow' : 'Follow'}</button>}
        </div>
      </div>
      <div className="feed">
        {posts.map((p) => <PostCard key={p._id} post={p} onChange={load} />)}
        {posts.length === 0 && <div className="card empty muted">No posts yet.</div>}
      </div>
    </div>
  );
}
