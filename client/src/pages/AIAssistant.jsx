import { useState } from 'react';
import { api, fileUrl } from '../utils/api';

export default function AIAssistant() {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const analyze = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('text', text);
      if (file) { fd.append('image', file); fd.append('hasImage', 'true'); }
      const { data } = await api.post('/api/ai/analyze', fd);
      setResult(data);
    } finally { setBusy(false); }
  };

  const copy = (s) => navigator.clipboard.writeText(s);

  return (
    <div className="ai">
      <div className="card">
        <h1>AI Content Assistant</h1>
        <p className="muted">Upload an image and/or a draft caption. Get caption ideas, hashtags, improvement tips, and the best time to post.</p>
        <form onSubmit={analyze}>
          <label>Draft caption (optional)</label>
          <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type the rough idea or paste a draft…" />
          <label>Image (optional)</label>
          <input type="file" accept="image/*" onChange={onFile} />
          {preview && <img src={preview} alt="" className="preview" />}
          <button className="btn primary block" disabled={busy || (!text.trim() && !file)}>
            {busy ? 'Thinking…' : 'Analyze'}
          </button>
        </form>
      </div>

      {result && (
        <div className="ai-result">
          <div className="card">
            <h3>Caption ideas <span className="muted small">({result.niche})</span></h3>
            <ul className="captions">
              {result.captions.map((c, i) => (
                <li key={i}>
                  <span>{c}</span>
                  <button className="btn ghost small" onClick={() => copy(c)}>Copy</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3>Hashtags</h3>
            <div className="tags">
              {result.hashtags.map((h) => (
                <button key={h} className="tag" onClick={() => copy(h)}>{h}</button>
              ))}
            </div>
            <button className="btn ghost small" onClick={() => copy(result.hashtags.join(' '))}>Copy all</button>
          </div>

          <div className="card">
            <h3>Improvement tips</h3>
            <ul className="tips">
              {result.tips.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          <div className="card best-time">
            <h3>Best time to post</h3>
            <p className="big">{result.bestTime}</p>
            <p className="muted small">Based on common high-engagement windows. Pair this with your own dashboard data for sharper timing.</p>
          </div>

          {result.image && (
            <div className="card">
              <h3>Your image</h3>
              <img src={fileUrl(result.image)} alt="" className="post-img" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
