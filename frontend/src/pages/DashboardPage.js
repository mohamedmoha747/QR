const DashboardPage = () => {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-3 text-slate-600">Your analytics, recent QR codes, and enterprise controls in one place.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <StatCard title="Active QR Codes" value="24" />
        <StatCard title="Total Scans" value="1.2k" />
        <StatCard title="Unique Visitors" value="893" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">{title}</p>
    <p className="mt-4 text-4xl font-semibold">{value}</p>
  </div>
);

export default DashboardPage;
