const KnowledgePage = () => {
  const topics = [
    { title: 'What is a QR Code?', description: 'A machine-readable code used to encode URLs, text, contact data, WiFi credentials, and more.' },
    { title: 'Static vs Dynamic QR', description: 'Static QR codes store content directly, while dynamic QR codes redirect and can be updated after creation.' },
    { title: 'Model 1 QR', description: 'An older QR format with a smaller data table and limited error correction compared to Model 2.' },
    { title: 'Model 2 QR', description: 'The modern QR format used widely today with improved capacity and reliability.' },
    { title: 'Micro QR', description: 'A compact QR variant for small surfaces with reduced data capacity.' },
    { title: 'iQR', description: 'A flexible QR format that supports rectangular and square layouts.' },
    { title: 'rMQR', description: 'Reduced-size Micro QR codes for very small physical labels.' },
    { title: 'SQRC', description: 'Secure QR Code variant for protected content and brand authentication.' },
    { title: 'Error Correction', description: 'QR codes use redundancy to recover from damage or distortion during scanning.' },
    { title: 'Reed-Solomon', description: 'The algorithm that underpins QR code error correction and recovery.' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">QR Type Knowledge</h1>
        <p className="mt-3 text-slate-600">Learn about QR code standards, dynamic / static behavior, and advanced formats.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic) => (
          <div key={topic.title} className="rounded-3xl bg-slate-900 p-6 text-white shadow-xl">
            <h2 className="text-2xl font-semibold">{topic.title}</h2>
            <p className="mt-3 text-slate-300">{topic.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KnowledgePage;
