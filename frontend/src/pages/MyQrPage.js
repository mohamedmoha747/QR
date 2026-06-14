import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const MyQrPage = () => {
  const [qrs, setQrs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchQrs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/qr');
      setQrs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load QR codes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQrs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">QR Library</h1>
        <p className="mt-3 text-slate-600">Browse generated QR codes, view analytics, and manage dynamic URLs without signing in.</p>
      </div>
      {error && <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>}
      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">Loading QR codes…</div>
      ) : qrs.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">No QR codes found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {qrs.map((qr) => (
            <QrCard key={qr._id} qr={qr} refresh={fetchQrs} />
          ))}
        </div>
      )}
    </div>
  );
};

const svgToDataUrl = (svgText) => {
  const encoded = btoa(unescape(encodeURIComponent(svgText)));
  return `data:image/svg+xml;base64,${encoded}`;
};

const getDisplayContent = (qr) => {
  if (qr.type === 'url' || qr.dynamic) {
    return qr.destinationUrl || qr.payload?.url || 'No URL provided';
  }
  if (qr.type === 'text') {
    return qr.payload?.text || 'No text provided';
  }
  if (qr.type === 'contact') {
    return qr.payload?.email || qr.payload?.phone || 'Contact payload';
  }
  if (qr.type === 'wifi') {
    return `${qr.payload?.ssid || 'WiFi'} (${qr.payload?.security || 'open'})`;
  }
  if (qr.type === 'email') {
    return qr.payload?.to || 'Email payload';
  }
  if (qr.type === 'phone') {
    return qr.payload?.phone || 'Phone payload';
  }
  if (qr.type === 'sms') {
    return qr.payload?.phone || 'SMS payload';
  }
  if (qr.type === 'location') {
    return `${qr.payload?.lat || 'N/A'}, ${qr.payload?.lng || 'N/A'}`;
  }
  if (qr.type === 'event') {
    return qr.payload?.title || 'Event payload';
  }
  return 'Unknown QR content';
};

const QrCard = ({ qr, refresh }) => {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState(qr.destinationUrl || '');
  const [saving, setSaving] = useState(false);
  const [cardMessage, setCardMessage] = useState('');
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm('Delete this QR code?')) return;
    try {
      await api.delete(`/qr/${qr._id}`);
      refresh();
    } catch (err) {
      setCardMessage(err.response?.data?.message || 'Failed to delete QR code.');
    }
  };

  const saveDestinationUrl = async () => {
    if (!destinationUrl.trim()) {
      setCardMessage('Enter a destination URL before saving.');
      return;
    }
    try {
      setSaving(true);
      await api.put(`/qr/${qr._id}`, { destinationUrl });
      setCardMessage('Dynamic URL updated successfully.');
      setEditMode(false);
      refresh();
    } catch (err) {
      setCardMessage(err.response?.data?.message || 'Failed to update URL.');
    } finally {
      setSaving(false);
    }
  };

  const qrImageSrc = qr.svgData ? svgToDataUrl(qr.svgData) : undefined;

  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-0.5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-sky-600">{qr.type.toUpperCase()}</p>
            <h2 className="text-2xl font-semibold text-slate-900">{qr.name}</h2>
            <p className="mt-2 text-slate-600 line-clamp-2">{getDisplayContent(qr)}</p>
          </div>
          <div className="grid gap-2 text-right">
            <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Scans: {qr.scanCount || 0}</span>
            <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Created: {new Date(qr.createdAt).toLocaleDateString()}</span>
            <span className="rounded-3xl bg-slate-100 px-4 py-2 text-sm text-slate-700">Status: {qr.status}</span>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[130px_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
            {qrImageSrc ? (
              <img src={qrImageSrc} alt={`${qr.name} preview`} className="h-32 w-32 object-contain" />
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white text-slate-400">Preview</div>
            )}
          </div>
          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setExpanded((current) => !current)} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">
                {expanded ? 'Hide Details' : 'View'}
              </button>
              <button type="button" onClick={() => navigate(`/analytics?qrId=${qr._id}`)} className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500">
                Analytics
              </button>
              <button type="button" onClick={handleDelete} className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500">
                Delete
              </button>
              <button type="button" onClick={() => setEditMode((current) => !current)} className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Edit
              </button>
            </div>
            {cardMessage && <p className="text-sm text-rose-600">{cardMessage}</p>}
          </div>
        </div>

        {expanded && (
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            <p><span className="font-semibold text-slate-900">Name:</span> {qr.name}</p>
            <p><span className="font-semibold text-slate-900">Type:</span> {qr.type}</p>
            {qr.dynamic && (
              <p>
                <span className="font-semibold text-slate-900">Short URL:</span>{' '}
                <a href={qr.qrData} className="text-sky-600 underline" target="_blank" rel="noreferrer">
                  {qr.qrData}
                </a>
              </p>
            )}
            <p><span className="font-semibold text-slate-900">Content:</span> {getDisplayContent(qr)}</p>
            <p><span className="font-semibold text-slate-900">Created:</span> {new Date(qr.createdAt).toLocaleString()}</p>
            <p><span className="font-semibold text-slate-900">Scans:</span> {qr.scanCount || 0}</p>
          </div>
        )}

        {editMode && qr.dynamic && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Edit Dynamic Destination URL</p>
            <input
              type="text"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="Enter new destination URL"
              className="mt-3 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900"
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={saveDestinationUrl} disabled={saving} className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? 'Saving…' : 'Save URL'}
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200">
                Cancel
              </button>
            </div>
          </div>
        )}

        {editMode && !qr.dynamic && (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            Dynamic QR editing is available only for dynamic QR codes.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyQrPage;
