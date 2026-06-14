const SettingsPage = () => {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h1 className="text-3xl font-semibold">Settings</h1>
      <p className="mt-3 text-slate-600">This public QR generator version does not require authentication, so personal settings are not available.</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
        <p className="font-semibold text-slate-900">Public mode notice</p>
        <p className="mt-3">The home page is the QR generation interface. To create or manage more QR codes, use the Generate, QR Library, and Analytics pages.</p>
      </div>
    </div>
  );
};

export default SettingsPage;

export default SettingsPage;
