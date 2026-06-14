import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Redirecting…');

  useEffect(() => {
    const redirect = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${apiUrl}/qr/${shortCode}`);
        const destinationUrl = response.data.destinationUrl;

        if (!destinationUrl) {
          setStatus('error');
          setMessage('QR Code not found.');
          return;
        }

        window.location.href = destinationUrl;
      } catch (err) {
        setStatus('error');
        setMessage('QR Code not found.');
      }
    };

    redirect();
  }, [shortCode]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="rounded-3xl bg-white p-8 shadow-xl text-center max-w-md w-full">
        {status === 'loading' && (
          <>
            <div className="mb-6 inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600"></div>
            <h1 className="text-2xl font-semibold text-slate-900">Redirecting</h1>
            <p className="mt-3 text-slate-600">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="mb-6 text-5xl">⚠️</div>
            <h1 className="text-2xl font-semibold text-slate-900">QR Not Found</h1>
            <p className="mt-3 text-slate-600">{message}</p>
            <a href="/" className="mt-6 inline-block rounded-2xl bg-sky-600 px-6 py-3 text-white hover:bg-sky-500">
              Go Home
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default RedirectPage;
