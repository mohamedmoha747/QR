import { useEffect, useState } from 'react';
import api from '../services/api';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(window.location.search);
        const qrId = params.get('qrId');
        if (!qrId) {
          setError('No QR selected');
          setLoading(false);
          return;
        }
        const res = await api.get(`/qr/${qrId}/analytics`);
        setStats(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="rounded-3xl bg-white p-8 shadow-xl">Loading analytics…</div>;
  if (error) return <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">Analytics</h1>
        <p className="mt-3 text-slate-600">Scan metrics and recent scan history.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <MetricCard label="Total Scans" value={stats.totalScans} />
        <MetricCard label="Unique Scans" value={stats.uniqueScans} />
        <MetricCard label="Recent Scans" value={stats.recent.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <BreakdownCard title="Devices" data={stats.deviceBreakdown} />
        <BreakdownCard title="Browsers" data={stats.browserBreakdown} />
        <BreakdownCard title="Countries" data={stats.countryBreakdown} />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Scans</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Browser</th>
                <th className="px-4 py-3">OS</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">User Agent</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((r, i) => (
                <tr key={i} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3">{new Date(r.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.ipAddress}</td>
                  <td className="px-4 py-3">{r.device}</td>
                  <td className="px-4 py-3">{r.browser}</td>
                  <td className="px-4 py-3">{r.os}</td>
                  <td className="px-4 py-3">{r.city || r.country || '—'}</td>
                  <td className="px-4 py-3"><div className="line-clamp-2 max-w-lg">{r.userAgent}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value }) => (
  <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-4 text-4xl font-semibold">{value}</p>
  </div>
);

const BreakdownCard = ({ title, data }) => (
  <div className="rounded-3xl bg-white p-6 shadow">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    <ul className="space-y-2 max-h-48 overflow-auto">
      {Object.entries(data || {}).sort((a,b)=>b[1]-a[1]).map(([k,v]) => (
        <li key={k} className="flex justify-between">
          <span className="text-slate-700">{k}</span>
          <span className="font-semibold">{v}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AnalyticsPage;
