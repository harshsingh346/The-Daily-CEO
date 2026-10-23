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

export function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<AuthPage />} />

            {/* Core Application Shell */}
            <Route path="/" element={<Layout />}>
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

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
