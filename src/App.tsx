import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { CheckInPage } from './pages/CheckInPage';
import { JournalPage } from './pages/JournalPage';
import { GoalsPage } from './pages/GoalsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DecisionRoomPage } from './pages/DecisionRoomPage';
import { HistoryPage } from './pages/HistoryPage';
import { ReviewPage } from './pages/ReviewPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuthPage } from './pages/AuthPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse">
            <span className="text-black font-extrabold text-sm">CEO</span>
          </div>
          <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">
            Loading Executive Command Center...
          </span>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Page - default entry point */}
            <Route path="/login" element={<AuthPage />} />

            {/* Protected Core Application Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="checkin" element={<CheckInPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="goals" element={<GoalsPage />} />
              <Route path="decision-room" element={<DecisionRoomPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Fallback to login if not authenticated or root */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
