import { useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import AccountMenu from "@/components/AccountMenu";
import { UI } from "@/constants/ui";
import {
  Home,
  Zap,
  LayoutGrid,
  Clock3,
  Settings,
  Layers,
  Bell,
  Search,
  Droplets,
  Thermometer,
  Star,
  Fan,
  Monitor,
  Plus,
} from "lucide-react";
import "./home.css";

type SmartDevice = {
  id: number;
  name: string;
  room: string;
  subtitle: string;
  statusText: string;
  active: boolean;
  iconType: "star" | "fan" | "monitor" | "blank";
};

const initialDevices: SmartDevice[] = [
  { id: 1, name: "Smart LED", room: "Phòng khách", subtitle: "ON", statusText: "Active", active: true, iconType: "blank" },
  { id: 2, name: "Smart Fan", room: "Phòng khách", subtitle: "Level 3", statusText: "Active", active: true, iconType: "fan" },
  { id: 3, name: "Air Conditioner", room: "Phòng khách", subtitle: "24°C", statusText: "Inactive", active: false, iconType: "blank" },
  { id: 4, name: "TV", room: "Phòng khách", subtitle: "Channel 5", statusText: "Active", active: true, iconType: "monitor" },
];

const roomTabs = ["Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm", "Sân vườn"];

function DeviceCard({ device, onToggle }: { device: SmartDevice; onToggle: (id: number) => void }) {
  return (
    <div className="home-device-card">
      <div className="home-device-top">
        <div className={`home-device-icon-box ${device.active ? "active" : "off"}`}>
          {renderDeviceIcon(device.iconType, device.active)}
        </div>
        <button
          type="button"
          className={`home-device-switch ${device.active ? "on" : "off"}`}
          onClick={() => onToggle(device.id)}
        >
          <span className="home-device-switch-knob" />
        </button>
      </div>
      <div className="home-device-main">
        <h3>{device.name}</h3>
        <p>{device.subtitle}</p>
      </div>
      <div className="home-device-divider" />
      <div className="home-device-status">
        <span>Status:</span>
        <strong className={device.active ? "active" : "inactive"}>
          {device.active ? "Active" : "Inactive"}
        </strong>
      </div>
    </div>
  );
}

function renderDeviceIcon(type: SmartDevice["iconType"], active: boolean) {
  const className = "home-device-svg";
  if (!active && type === "blank") return <div className="home-device-placeholder" />;
  switch (type) {
    case "star": return <Star className={className} size={UI.DEVICE_ICON_SIZE} />;
    case "fan": return <Fan className={className} size={UI.DEVICE_ICON_SIZE} />;
    case "monitor": return <Monitor className={className} size={UI.DEVICE_ICON_SIZE} />;
    default: return <div className="home-device-placeholder" />;
  }
}

export default function HomePage() {
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useTheme();

  const [devices, setDevices] = useState(initialDevices);
  const [selectedRoom, setSelectedRoom] = useState("Phòng khách");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleDevice = (id: number) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, active: !d.active, statusText: !d.active ? "Active" : "Inactive" } : d
      )
    );
  };

  const filteredDevices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return devices.filter((d) => {
      const matchRoom = d.room === selectedRoom;
      const matchSearch = keyword === "" || d.name.toLowerCase().includes(keyword) || d.subtitle.toLowerCase().includes(keyword);
      return matchRoom && matchSearch;
    });
  }, [devices, selectedRoom, searchTerm]);

  return (
    <div className={`home-page ${themeMode === "dark" ? "dark-mode" : ""}`}>
      {/* Sidebar */}
      <aside className="home-sidebar">
        <button
          className="home-nav-btn active"
          type="button"
          title="Trang chủ"
          onClick={() => navigate("/home")}
        >
          <Home size={UI.SIDEBAR_ICON_SIZE} />
        </button>

        <div className="home-sidebar-links">
          <button className="home-nav-ghost" type="button" title="Thông báo"
            onClick={() => navigate("/notifications")}>
            <Zap size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="home-nav-ghost"
            type="button"
            title="Thiết bị"
            onClick={() => navigate("/devices")}
          >
            <Layers size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="home-nav-ghost"
            type="button"
            title="Lịch hẹn giờ"
            onClick={() => navigate("/timers")}
          >
            <Clock3 size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button className="home-nav-ghost" type="button" title="Bảng điều khiển">
            <LayoutGrid size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="home-nav-ghost"
            type="button"
            title="Cài đặt"
            onClick={() => navigate("/settings")}
          >
            <Settings size={UI.SIDEBAR_ICON_SIZE} />
          </button>
        </div>
      </aside>

      <main className="home-main">
        <header className="home-topbar">
          <div className="home-topbar-left">
            <button
              type="button"
              className="home-avatar"
              onClick={() => setShowAccountMenu((prev) => !prev)}
            />
            <h2>Welcome to Meomeo's Home</h2>

            {showAccountMenu && (
              <AccountMenu onClose={() => setShowAccountMenu(false)} themeMode={themeMode} />
            )}
          </div>

          <div className="home-topbar-right">
            <div className="topbar-search-box">
              <Search size={UI.TOPBAR_ICON_SIZE} />
              <input
                type="text"
                placeholder="Search any devices here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
            <button className="home-bell-btn" type="button">
              <Bell size={UI.TOPBAR_ICON_SIZE} />
            </button>
          </div>
        </header>

        <section className="home-content">
          <section className="home-summary-grid">
            <div className="home-circle-card">
              <div className="home-card-head">
                <h4>Độ ẩm</h4>
                <Droplets size={UI.TOPBAR_ICON_SIZE} />
              </div>
              <div className="home-ring-wrap">
                <div className="home-ring">
                  <div className="home-ring-value">65,0%</div>
                </div>
              </div>
            </div>

            <div className="home-circle-card">
              <div className="home-card-head">
                <h4>Nhiệt độ</h4>
                <Thermometer size={18} />
              </div>
              <div className="home-ring-wrap">
                <div className="home-ring">
                  <div className="home-ring-value">24°C</div>
                </div>
              </div>
            </div>

            <div className="home-energy-card">
              <h3>Tổng tiêu thụ</h3>
              <div className="home-energy-row">
                <span>Tháng 3</span>
                <strong>245 kWh</strong>
              </div>
              <div className="home-energy-bar">
                <div className="home-energy-bar-fill" />
              </div>
              <div className="home-energy-divider" />
              <div className="home-energy-stats">
                <div><span>Phòng khách</span><strong>98 kWh</strong></div>
                <div><span>Phòng ngủ</span><strong>76 kWh</strong></div>
                <div><span>Phòng bếp</span><strong>71 kWh</strong></div>
              </div>
            </div>
          </section>

          <section className="home-device-section">
            <h1>Thiết bị thông minh</h1>
            <div className="home-device-grid">
              {filteredDevices.map((device) => (
                <DeviceCard key={device.id} device={device} onToggle={handleToggleDevice} />
              ))}
            </div>
          </section>

          <section className="home-room-bar">
            <div className="home-room-tabs">
              {roomTabs.map((room) => (
                <button
                  key={room}
                  type="button"
                  className={`home-room-tab ${selectedRoom === room ? "active" : ""}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  {room}
                </button>
              ))}
            </div>
            <button className="home-room-add-btn" type="button">
              <Plus size={24} />
            </button>
          </section>
        </section>
      </main>
    </div>
  );
}
