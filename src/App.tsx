import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import EntryLandingPage from './pages/EntryLandingPage';
import LandingPage from './pages/LandingPage';
import OverviewPage from './pages/OverviewPage';
import { SmartHivesPage } from './pages/SmartHivesPage';
import { HiveDetailPage } from './pages/HiveDetailPage';
import HoneyPassportPage from './pages/HoneyPassportPage';
import { IntelligencePage } from './pages/IntelligencePage';
import TraceabilityPage from './pages/TraceabilityPage';
import { MarketPage } from './pages/MarketPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import { VerifyPage } from './pages/VerifyPage';
import { useAuth } from './contexts/AuthContext';

// Guard: Redirect unauthenticated users to entry landing
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isGuest, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-[var(--text-secondary)] font-medium">Loading HoneyChain…</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isGuest) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* ── Entry / Authentication (no auth required) ── */}
      <Route path="/" element={<EntryLandingPage />} />

      {/* ── Consumer QR verification — publicly accessible ── */}
      <Route path="/verify" element={<Navigate to="/verify/HC-2026-0142" replace />} />
      <Route path="/verify/:batchId" element={<VerifyPage />} />

      {/* ── Main application with persistent AppShell (requires auth OR guest) ── */}
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        {/* Former landing page is now the platform home */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/overview" element={<OverviewPage />} />

        {/* Smart Hives */}
        <Route path="/smart-hives" element={<SmartHivesPage />} />
        <Route path="/smart-hives/:hiveId" element={<HiveDetailPage />} />
        <Route path="/hives" element={<Navigate to="/smart-hives" replace />} />
        <Route path="/hives/:hiveId" element={<Navigate to="/smart-hives/:hiveId" replace />} />

        {/* Honey Passport */}
        <Route path="/honey-passport" element={<HoneyPassportPage />} />
        <Route path="/honey-passport/:batchId" element={<HoneyPassportPage />} />
        <Route path="/passport" element={<Navigate to="/honey-passport" replace />} />

        {/* Domain Modules */}
        <Route path="/intelligence" element={<IntelligencePage />} />
        <Route path="/traceability" element={<TraceabilityPage />} />
        <Route path="/market" element={<MarketPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Wildcard fallback */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
