import { Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
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

function App() {
  return (
    <Routes>
      {/* Consumer verification - standalone page without sidebar */}
      <Route path="/verify" element={<Navigate to="/verify/HC-2026-0142" replace />} />
      <Route path="/verify/:batchId" element={<VerifyPage />} />

      {/* Main application with persistent AppShell */}
      <Route element={<AppShell />}>
        <Route path="/" element={<LandingPage />} />
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

        {/* Wildcard Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
