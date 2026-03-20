import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AllDevicesPage from "./pages/AllDevicesPage";
import TimerPage from "./pages/TimerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/devices" element={<AllDevicesPage />} />
        <Route path="/timers" element={<TimerPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;