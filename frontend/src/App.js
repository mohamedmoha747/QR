import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import DashboardPage from './pages/DashboardPage';
import GeneratePage from './pages/GeneratePage';
import MyQrPage from './pages/MyQrPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TeamPage from './pages/TeamPage';
import AdminPage from './pages/AdminPage';
import KnowledgePage from './pages/KnowledgePage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<GeneratePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="generate" element={<GeneratePage />} />
        <Route path="my-qrs" element={<MyQrPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="team" element={<TeamPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="knowledge" element={<KnowledgePage />} />
        <Route path="qr/:shortCode" element={<RedirectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}


export default App;
