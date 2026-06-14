import { useEffect, useState } from 'react';
import api from '../services/api';

const acceptedLogoTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];

const GeneratePage = () => {
  const [type, setType] = useState('url');
  const [name, setName] = useState('');
  const [payload, setPayload] = useState({ url: '' });
  const [destinationUrl, setDestinationUrl] = useState('');
  const [dynamic, setDynamic] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(logoFile);
    setLogoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [logoFile]);

  const getQrText = () => {
    if (dynamic && type === 'url') {
      return destinationUrl || '';
    }
    if (type === 'url') {
      return payload.url || '';
    }
    return payload.text || '';
  };

  const svgToDataUrl = (svgText) => {
    const encoded = btoa(unescape(encodeURIComponent(svgText)));
    return `data:image/svg+xml;base64,${encoded}`;
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  };

  const embedLogoInQr = async (qrDataUrl, logoSrc) => {
    const qrImageElement = await loadImage(qrDataUrl);
    const logoImageElement = await loadImage(logoSrc);
    const size = qrImageElement.width;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(qrImageElement, 0, 0, size, size);

    const maxLogoSize = size * 0.2;
    const logoScale = Math.min(maxLogoSize / logoImageElement.width, maxLogoSize / logoImageElement.height, 1);
    const logoWidth = logoImageElement.width * logoScale;
    const logoHeight = logoImageElement.height * logoScale;
    const x = (size - logoWidth) / 2;
    const y = (size - logoHeight) / 2;
    const padding = 10;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - padding, y - padding, logoWidth + padding * 2, logoHeight + padding * 2);
    ctx.drawImage(logoImageElement, x, y, logoWidth, logoHeight);

    return canvas.toDataURL('image/png');
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (!acceptedLogoTypes.includes(file.type)) {
      setMessage('Logo must be PNG, JPG, or SVG.');
      return;
    }

    setLogoFile(file);
    setMessage('Logo uploaded.');
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview('');
    setMessage('Logo removed.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const qrText = getQrText();

    if (!name.trim() || !qrText.trim()) {
      setMessage('Please provide a name and QR content.');
      setQrImage('');
      return;
    }

    try {
      setSaving(true);
      const createPayload = {
        name,
        type,
        payload: type === 'url' ? { url: dynamic ? destinationUrl : payload.url } : payload,
        dynamic: dynamic && type === 'url',
        destinationUrl: dynamic && type === 'url' ? destinationUrl : undefined,
        foregroundColor: '#000000',
        backgroundColor: '#ffffff',
      };

      const response = await api.post('/qr', createPayload);
      const savedQr = response.data;
      const svgSource = savedQr.svgData ? svgToDataUrl(savedQr.svgData) : '';
      const finalQr = logoPreview ? await embedLogoInQr(svgSource, logoPreview) : svgSource;
      setQrImage(finalQr);
      setMessage(dynamic ? `Dynamic QR created. Short URL: ${savedQr.qrData}` : 'QR code created successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create QR code.');
      setQrImage('');
    } finally {
      setSaving(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case 'url':
        return null;
      case 'text':
        return (
          <label className="block">
            <span className="text-slate-700">Text</span>
            <textarea value={payload.text} onChange={(e) => setPayload({ ...payload, text: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" rows="4" required />
          </label>
        );
      default:
        return (
          <label className="block">
            <span className="text-slate-700">Data</span>
            <input value={payload.text || ''} onChange={(e) => setPayload({ ...payload, text: e.target.value })} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
          </label>
        );
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-semibold">Generate QR Code</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="text-slate-700">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3" required />
        </label>
        <label className="block">
          <span className="text-slate-700">Type</span>
          <select value={type} onChange={(e) => {
            const next = e.target.value;
            setType(next);
            setPayload({ url: '' });
            setDestinationUrl('');
            setDynamic(false);
          }} className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3">
            <option value="url">URL</option>
            <option value="text">Text</option>
            <option value="contact">Contact</option>
            <option value="wifi">WiFi</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
            <option value="sms">SMS</option>
            <option value="location">Location</option>
            <option value="event">Event</option>
          </select>
        </label>
        {type === 'url' && (
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-slate-700">Destination URL</span>
              <input
                value={dynamic ? destinationUrl : payload.url}
                onChange={(e) => dynamic ? setDestinationUrl(e.target.value) : setPayload({ ...payload, url: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
                required
              />
            </label>
            <label className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm">
              <input type="checkbox" checked={dynamic} onChange={(e) => setDynamic(e.target.checked)} />
              <div>
                <p className="font-semibold text-slate-900">Dynamic QR</p>
                <p className="text-slate-500">Encode a short, editable URL instead of the final destination.</p>
              </div>
            </label>
          </div>
        )}
        <label className="block">
          <span className="text-slate-700">Upload Logo</span>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.svg"
            onChange={handleLogoUpload}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
          />
        </label>
        {logoPreview && (
          <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Logo Preview</p>
              <p className="text-sm text-slate-500">The logo will be embedded at the center of the QR code.</p>
            </div>
            <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded-xl object-contain" />
            <button type="button" onClick={removeLogo} className="rounded-2xl bg-red-500 px-4 py-2 text-white hover:bg-red-400">
              Remove Logo
            </button>
          </div>
        )}
        {renderFields()}
        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={saving} className="rounded-2xl bg-slate-900 px-6 py-3 text-white hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Creating…' : 'Create QR'}
          </button>
          {qrImage && (
            <a href={qrImage} download="qrcode.png" className="rounded-2xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-500">
              Download QR
            </a>
          )}
        </div>
      </form>
      {message && <p className="mt-4 text-slate-700">{message}</p>}
      <div className="mt-8 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        {qrImage ? (
          <img src={qrImage} alt="QR Code" className="mx-auto h-64 w-64 object-contain" />
        ) : (
          <div className="flex min-h-[16rem] items-center justify-center text-slate-500">
            <span>No QR code generated yet</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratePage;
