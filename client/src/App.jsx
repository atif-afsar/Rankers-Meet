import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import TicketPage from './pages/TicketPage';
import SuccessPage from './pages/SuccessPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminAttendees from './pages/AdminAttendees';
import AdminScanner from './pages/AdminScanner';
import AdminSettings from './pages/AdminSettings';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/rankers-meet" replace />} />
            <Route path="/rankers-meet" element={<LandingPage />} />
            <Route path="/rankers-meet/register" element={<RegisterPage />} />
            <Route path="/rankers-meet/ticket/:id" element={<TicketPage />} />
            <Route path="/rankers-meet/success/:registrationId" element={<SuccessPage />} />
            <Route path="/rankers-meet/success" element={<SuccessPage />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/registrations" element={<AdminAttendees />} />
            <Route path="/admin/check-in" element={<AdminScanner />} />
            <Route path="/admin/settings" element={<AdminSettings />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/rankers-meet" replace />} />
          </Routes>
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
