import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, RoleGuard } from './components/ProtectedRoute';

// All 14 Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerDashboard from './pages/CustomerDashboard';
import RegisterWastePage from './pages/RegisterWastePage';
import QRSuccessPage from './pages/QRSuccessPage';
import PublicTrackingSearch from './pages/PublicTrackingSearch';
import PublicTrackingDetails from './pages/PublicTrackingDetails';
import StakeholderDashboard from './pages/StakeholderDashboard';
import StatusUpdatePage from './pages/StatusUpdatePage';
import InspectionPage from './pages/InspectionPage';
import AdminDashboard from './pages/AdminDashboard';
import UserManagementPage from './pages/UserManagementPage';
import ProfilePage from './pages/ProfilePage';
import CustomerTrackPage from './pages/CustomerTrackPage';
import ScannerPage from './pages/ScannerPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/track" element={<PublicTrackingSearch />} />
          <Route path="/track/:itemId" element={<PublicTrackingDetails />} />

          {/* Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/track"
            element={
              <ProtectedRoute>
                <CustomerTrackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/track/:itemId"
            element={
              <ProtectedRoute>
                <CustomerTrackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-waste"
            element={
              <ProtectedRoute>
                <RegisterWastePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/qr-success/:itemId"
            element={
              <ProtectedRoute>
                <QRSuccessPage />
              </ProtectedRoute>
            }
          />

          {/* Stakeholder Routes */}
          <Route
            path="/stakeholder"
            element={
              <ProtectedRoute>
                <StakeholderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/scanner"
            element={
              <ProtectedRoute>
                <ScannerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-status/:itemId"
            element={
              <ProtectedRoute>
                <StatusUpdatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inspection/:itemId"
            element={
              <ProtectedRoute>
                <InspectionPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['ADMIN']}>
                  <UserManagementPage />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
