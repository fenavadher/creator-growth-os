import { useEffect, useState } from 'react';
import { api, fileUrl } from '../utils/api';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/api/dashboard').then((r) => setData(r.data));
  }, []);

  if (!data) return <div className="center muted">Loading dashboard…</div>;

  const max = Math.max(1, ...data.trend.map((d) => d.engagement));

  return (
    <div className="dashboard">
      <h1>Growth Dashboard</h1>
      <div className="stats">
        <Stat label="Posts" value={data.totals.posts} />
        <Stat label="Likes" value={data.totals.likes} />
        <Stat label="Comments" value={data.totals.comments} />
        <Stat label="Followers" value={data.totals.followers} />
        <Stat label="Engagement rate" value={`${data.engagementRate}%`} />
      </div>

      <div className="card">
        <h3>Last 7 days</h3>
        <div className="bars">
          {data.trend.map((d) => (
            <div className="bar-col" key={d.date}>
              <div className="bar" style={{ height: `${(d.engagement / max) * 100}%` }} title={`${d.engagement} interactions`} />
              <div className="muted small">{d.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Personalized insights</h3>
          <ul className="tips">
            {data.insights.map((i, idx) => <li key={idx}>{i}</li>)}
          </ul>
        </div>

        {data.topPost && (
          <div className="card">
            <h3>Top post</h3>
            {data.topPost.image && <img src={fileUrl(data.topPost.image)} alt="" className="post-img" />}
            <p>{data.topPost.text}</p>
            <div className="muted small">
              {data.topPost.likes.length} likes · {data.topPost.comments.length} comments
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>All posts performance</h3>
        <table className="table">
          <thead>
            <tr><th>Date</th><th>Caption</th><th>Likes</th><th>Comments</th><th>Engagement</th><th>Predicted</th></tr>
          </thead>
          <tbody>
            {data.posts.map((p) => (
              <tr key={p._id}>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td className="truncate">{p.text || <span className="muted">—</span>}</td>
                <td>{p.likes}</td>
                <td>{p.comments}</td>
                <td>{p.engagement}</td>
                <td>{p.predictedEngagement && <span className={`pill pill-${p.predictedEngagement.toLowerCase()}`}>{p.predictedEngagement}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.posts.length === 0 && <div className="muted center">No posts yet.</div>}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat card">
      <div className="stat-value">{value}</div>
      <div className="muted">{label}</div>
    </div>
  );
}
