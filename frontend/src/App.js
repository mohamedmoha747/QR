import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './layouts/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import GeneratePage from './pages/GeneratePage';
import MyQrPage from './pages/MyQrPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import TeamPage from './pages/TeamPage';
import AdminPage from './pages/AdminPage';
import KnowledgePage from './pages/KnowledgePage';
import RedirectPage from './pages/RedirectPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="generate" element={<PrivateRoute><GeneratePage /></PrivateRoute>} />
          <Route path="my-qrs" element={<PrivateRoute><MyQrPage /></PrivateRoute>} />
          <Route path="analytics" element={<PrivateRoute><AnalyticsPage /></PrivateRoute>} />
          <Route path="team" element={<PrivateRoute><TeamPage /></PrivateRoute>} />
          <Route path="admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
          <Route path="knowledge" element={<KnowledgePage />} />
          <Route path="qr/:shortCode" element={<RedirectPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

export default App;
