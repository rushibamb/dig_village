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
import { ProfilePage } from './components/ProfilePage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import AdminPage from './components/AdminPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { Toaster } from './components/ui/sonner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';


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
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={
                <AdminProtectedRoute>
                  <AdminPage />
                </AdminProtectedRoute>
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
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <SimpleNavbar />
                  <ProfilePage />
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