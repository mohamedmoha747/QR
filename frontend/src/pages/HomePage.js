const HomePage = () => {
  return (
    <section className="space-y-8">
      <div className="rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="text-4xl font-semibold text-slate-900">QR Code Management SaaS</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Create, update, analyze, and manage static and dynamic QR codes with enterprise-ready controls, branding, security, and analytics.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Generate QR" description="Build URL, contact, wifi, email, payment, location, event and more." />
        <Card title="Analytics" description="Track scans, devices, location, and timeline reports." />
        <Card title="Enterprise" description="Team management, bulk generation, campaigns, and secure sharing." />
      </div>
    </section>
  );
};

const Card = ({ title, description }) => (
  <div className="rounded-3xl bg-slate-900 text-white p-8 shadow-xl">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <p className="mt-3 text-slate-300">{description}</p>
  </div>
);

export default HomePage;
