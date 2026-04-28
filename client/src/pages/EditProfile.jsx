import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, fileUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function EditProfile() {
  const { user, refreshMe } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);

  const onFile = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setPreview(f ? URL.createObjectURL(f) : '');
  };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('bio', bio);
      if (file) fd.append('avatar', file);
      await api.put('/api/users/me', fd);
      await refreshMe();
      nav(`/profile/${user._id}`);
    } finally { setBusy(false); }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Edit profile</h1>
        <form onSubmit={submit}>
          <div className="center">
            {(preview || user.avatar)
              ? <img src={preview || fileUrl(user.avatar)} alt="" className="avatar avatar-xl" />
              : <span className="avatar avatar-xl avatar-fallback">{user.name?.[0]?.toUpperCase()}</span>}
          </div>
          <label>Profile image</label>
          <input type="file" accept="image/*" onChange={onFile} />
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Bio</label>
          <textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} maxLength={200} />
          <button className="btn primary block" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    </div>
  );
}
