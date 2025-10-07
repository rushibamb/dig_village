import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './components/LanguageProvider';
import { AuthProvider } from './components/AuthContext';
import { SimpleNavbar } from './components/SimpleNavbar';
import { VillageLandingPage } from './components/VillageLandingPage';
import { TaxPaymentPage } from './components/TaxPaymentPage';
import { GrievancePage } from './components/GrievancePage';
import { ManageVillagerPage } from './components/ManageVillagerPage';
import { GramPanchayatPage } from './components/GramPanchayatPage';
import { MediaPage } from './components/MediaPage';
import { NewsPage } from './components/NewsPage';
import { ContractsPage } from './components/ContractsPage';
import { AuthenticationPage } from './components/AuthenticationPage';
import AdminPage from './components/AdminPage';
import { AdminContractsPage } from './components/AdminContractsPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { AdminFloatingContractsButton } from './components/AdminFloatingContractsButton';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';

// Dashboard component for protected route
const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Welcome to your Dashboard</h2>
            <p className="text-muted-foreground">This is a protected route that requires authentication.</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Your Profile</h2>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
            <p className="text-muted-foreground">Access frequently used features and services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <SimpleNavbar />
                  <VillageLandingPage />
                </>
              } />
              
              <Route path="/login" element={<AuthenticationPage />} />
              <Route path="/register" element={<AuthenticationPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <>
                    <AdminPage />
                    <AdminFloatingContractsButton />
                  </>
                </AdminProtectedRoute>
              } />
              
              <Route path="/admin/contracts" element={
                <AdminProtectedRoute>
                  <AdminContractsPage />
                </AdminProtectedRoute>
              } />
              
              {/* Protected routes for villagers */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              
              {/* Other public routes with navbar */}
              <Route path="/tax" element={
                <>
                  <SimpleNavbar />
                  <TaxPaymentPage />
                </>
              } />
              
              <Route path="/grievance" element={
                <>
                  <SimpleNavbar />
                  <GrievancePage />
                </>
              } />
              
              <Route path="/villager" element={
                <ProtectedRoute>
                  <SimpleNavbar />
                  <ManageVillagerPage />
                </ProtectedRoute>
              } />
              
              <Route path="/committee" element={
                <>
                  <SimpleNavbar />
                  <GramPanchayatPage />
                </>
              } />
              
              <Route path="/media" element={
                <>
                  <SimpleNavbar />
                  <MediaPage />
                </>
              } />
              
              <Route path="/news" element={
                <>
                  <SimpleNavbar />
                  <NewsPage />
                </>
              } />
              
              <Route path="/contracts" element={
                <ProtectedRoute>
                  <SimpleNavbar />
                  <ContractsPage />
                </ProtectedRoute>
              } />
            </Routes>

            <Toaster 
              position="top-right"
              richColors
              closeButton
            />
          </div>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}