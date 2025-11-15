import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RoundsPage from './pages/RoundsPage';
import PrizesPage from './pages/PrizesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import RegistrationPage from './pages/RegistrationPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import { ContestProvider } from './contexts/ContestContext';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOverview from './pages/admin/AdminOverview';
import ManageRounds from './pages/admin/ManageRounds';
import ManageTeams from './pages/admin/ManageTeams';
import ManageMCQs from './pages/admin/ManageMCQs';
import ManageProblems from './pages/admin/ManageProblems';
import ManageResults from './pages/admin/ManageResults';
import ManageCertificates from './pages/admin/ManageCertificates';
import AdminRegistrationPage from './pages/admin/AdminRegistrationPage';
import ViewSubmission from './pages/admin/ViewSubmission';

// Contest Pages
import Round1ContestPage from './pages/contest/Round1ContestPage';
import Round2SubmissionPage from './pages/contest/Round2SubmissionPage';

// Team Dashboard Page
import TeamDashboardPage from './pages/TeamDashboardPage';


const PublicLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ContestProvider>
          <HashRouter>
              <Routes>
                  {/* Public and Auth Routes */}
                  <Route path="/" element={<PublicLayout />}>
                      <Route index element={<HomePage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="rounds" element={<RoundsPage />} />
                      <Route path="prizes" element={<PrizesPage />} />
                      <Route path="leaderboard" element={<LeaderboardPage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="login" element={<LoginPage />} />
                      <Route path="signup" element={<SignupPage />} />
                      <Route path="unauthorized" element={<UnauthorizedPage />} />
                      <Route path="setup-admin" element={<AdminRegistrationPage />} />
                      
                      {/* Protected User Routes */}
                      <Route path="dashboard" element={
                        <ProtectedRoute allowedRoles={[UserRole.TEAM_LEADER, UserRole.TEAM_MEMBER, UserRole.ADMIN, UserRole.GUEST]}>
                          <TeamDashboardPage />
                        </ProtectedRoute>
                      } />
                       <Route path="registration" element={
                        <ProtectedRoute allowedRoles={[UserRole.GUEST, UserRole.TEAM_LEADER, UserRole.TEAM_MEMBER]}>
                          <RegistrationPage />
                        </ProtectedRoute>
                      } />
                      <Route path="contest/round1" element={
                          <ProtectedRoute allowedRoles={[UserRole.TEAM_LEADER, UserRole.TEAM_MEMBER]}>
                              <Round1ContestPage />
                          </ProtectedRoute>
                      } />
                      <Route path="contest/round2" element={
                          <ProtectedRoute allowedRoles={[UserRole.TEAM_LEADER, UserRole.TEAM_MEMBER]}>
                              <Round2SubmissionPage />
                          </ProtectedRoute>
                      } />
                  </Route>
                  
                  {/* Protected Admin Dashboard Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  >
                      <Route index element={<AdminOverview />} />
                      <Route path="rounds" element={<ManageRounds />} />
                      <Route path="teams" element={<ManageTeams />} />
                      <Route path="mcqs" element={<ManageMCQs />} />
                      <Route path="problems" element={<ManageProblems />} />
                      <Route path="results" element={<ManageResults />} />
                      <Route path="certificates" element={<ManageCertificates />} />
                      <Route path="submission/:teamId" element={<ViewSubmission />} />
                  </Route>

                  {/* Catch-all 404 Route */}
                  <Route path="*" element={<NotFoundPage />} />
              </Routes>
          </HashRouter>
        </ContestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;