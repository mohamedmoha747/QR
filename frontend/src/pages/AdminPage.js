const AdminPage = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
        <p className="mt-3 text-slate-600">Manage users, QR assets, and platform analytics from the admin console.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard label="Users" value="134" />
        <AdminCard label="QR Codes" value="2.4k" />
        <AdminCard label="Scans" value="18.2k" />
      </div>
    </div>
  );
};

const AdminCard = ({ label, value }) => (
  <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-4 text-4xl font-semibold">{value}</p>
  </div>
);

export default AdminPage;
