import { useState } from 'react';
import { api } from '../utils/api';

export default function CreatePost({ onCreated }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [err, setErr] = useState('');

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const predict = async () => {
    setErr('');
    try {
      const { data } = await api.post('/api/ai/predict', { text, hasImage: !!file });
      setPrediction(data);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to predict');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;
    setBusy(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('text', text);
      if (file) fd.append('image', file);
      await api.post('/api/posts', fd);
      setText(''); setFile(null); setPreview(''); setPrediction(null);
      onCreated?.();
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to post');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="card create-post" onSubmit={submit}>
      <textarea
        rows={3}
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {preview && <img src={preview} alt="" className="preview" />}
      <div className="row">
        <label className="btn ghost file">
          📷 Image
          <input type="file" accept="image/*" onChange={onFile} hidden />
        </label>
        <button type="button" className="btn ghost" onClick={predict} disabled={!text.trim() && !file}>
          Predict engagement
        </button>
        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Posting…' : 'Post'}
        </button>
      </div>
      {err && <div className="error">{err}</div>}
      {prediction && (
        <div className={`prediction pill-${prediction.level.toLowerCase()}`}>
          <strong>Predicted: {prediction.level}</strong>
          <span className="muted small"> (score {prediction.score})</span>
          <ul>
            {prediction.suggestions.slice(0, 4).map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
      )}
    </form>
  );
}
