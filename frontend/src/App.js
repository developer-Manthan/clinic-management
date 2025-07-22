import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterPage from './pages/RegisterPage';
import DoctorRegistrationPage from './pages/DoctorRegistrationPage';
import PatientRegistrationPage from './pages/PatientRegistrationPage';
import AdminRegistrationPage from './pages/AdminRegistrationPage';
import EditClinicInfoPage from './pages/EditClinicInfoPage';
import GenerateDoctorSchedulePage from './pages/GenerateDoctorSchedulePage';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const redirectToDashboard = () => {
    if (!user) return '/login';

    switch (user.clearanceLevel) {
      case 1:
        return '/patient-dashboard';
      case 2:
        return '/doctor-dashboard';
      case 3:
        return '/admin-dashboard';
      default:
        return '/login';
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute allowedRoles={[1]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/patient-registration" element={<PatientRegistrationPage />} />

        <Route
          path="/doctor-registration"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <DoctorRegistrationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-registration"
          element={
            <ProtectedRoute allowedRoles={[3]}>
              <AdminRegistrationPage />
            </ProtectedRoute>
          }
        />

        <Route path="/edit-clinic-info" element={
          <ProtectedRoute allowedRoles={[3]}>
            <EditClinicInfoPage />
          </ProtectedRoute>
        } />

        <Route path="/generate-schedule" element={
          <ProtectedRoute allowedRoles={[3]}>
            <GenerateDoctorSchedulePage />
          </ProtectedRoute>
        } />

        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route path="/" element={<Navigate to={redirectToDashboard()} replace />} />

        <Route path="*" element={<Navigate to={redirectToDashboard()} replace />} />
      </Routes>
    </Router>
  );
}
