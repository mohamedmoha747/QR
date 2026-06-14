import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const SettingsPage = () => {
  const { user, login } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put('/auth/profile', { name, avatarUrl, password });
      login(response.data.user, response.data.token);
      setMessage('Profile updated successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <form className="mt-6 space-y-4" onSubmit={handleUpdate}>
        <label className="block">
          <span className="text-slate-700">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-slate-700">Avatar URL</span>
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-slate-700">New Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <button type="submit" className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700">Save changes</button>
      </form>
      {message && <p className="mt-4 text-slate-700">{message}</p>}
    </div>
  );
};

export default SettingsPage;
