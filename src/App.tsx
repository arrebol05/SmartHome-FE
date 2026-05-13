import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AllDevicesPage from "./pages/AllDevicesPage";
import TimerPage from "./pages/TimerPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import { useAppStore } from "./store/appStore";

import "@/styles/global.css";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAppStore((state) => state.accessToken);
  if (!token) return <Navigate to="/" replace />;
  return children;
}

function PublicLoginRoute() {
  const token = useAppStore((state) => state.accessToken);
  if (token) return <Navigate to="/dashboard" replace />;
  return <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLoginRoute />} />
        <Route path="/devices" element={<AllDevicesPage />} />
        <Route path="/timers" element={<TimerPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;