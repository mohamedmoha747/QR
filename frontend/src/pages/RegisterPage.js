import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;
    console.log('Register started');
    setSaving(true);
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      console.log('Register success', response.data);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.log('Register failed', err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-semibold">Register</h1>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-slate-700">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block">
          <span className="text-slate-700">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block">
          <span className="text-slate-700">Password</span>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={saving} className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed">{saving ? 'Registering…' : 'Register'}</button>
      </form>
      <p className="mt-6 text-sm text-slate-600">Already have an account? <Link to="/login" className="text-sky-600">Login</Link></p>
    </div>
  );
};

export default RegisterPage;
