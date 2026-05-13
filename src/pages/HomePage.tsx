import { useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";
import AppTopbar from "@/components/AppTopbar";
import { UI } from "@/constants/ui";
import AppSidebar from "@/components/AppSidebar";
import {
  Droplets, Thermometer,
  X, Plus,
} from "lucide-react";
import "./home.css";

type SmartDevice = {
  id: number;
  name: string;
  room: string;
  subtitle: string;
  statusText: string;
  active: boolean;
  level: number;
  mode: "OFF" | "AUTO" | "SWING";
  percent: number;
};

const initialDevices: SmartDevice[] = [
  // Phòng khách (cũ)
  { id: 1, name: "Smart LED", room: "Phòng khách", subtitle: "ON", statusText: "Active", active: true, level: 3, mode: "AUTO", percent: 65 },
  { id: 2, name: "Smart Fan", room: "Phòng khách", subtitle: "Level 3", statusText: "Active", active: true, level: 3, mode: "AUTO", percent: 65 },
  { id: 3, name: "Air Conditioner", room: "Phòng khách", subtitle: "24°C", statusText: "Inactive", active: false, level: 1, mode: "OFF", percent: 0 },
  { id: 4, name: "TV", room: "Phòng khách", subtitle: "Channel 5", statusText: "Active", active: true, level: 2, mode: "AUTO", percent: 40 },

  // Phòng ngủ (mới)
  { id: 5, name: "Smart LED", room: "Phòng ngủ", subtitle: "ON", statusText: "Active", active: true, level: 2, mode: "AUTO", percent: 40 },
  { id: 6, name: "Air Conditioner", room: "Phòng ngủ", subtitle: "22°C", statusText: "Active", active: true, level: 3, mode: "AUTO", percent: 60 },
  { id: 7, name: "Smart Curtain", room: "Phòng ngủ", subtitle: "Đã mở", statusText: "Active", active: true, level: 3, mode: "AUTO", percent: 75 },
  { id: 8, name: "Smart Speaker", room: "Phòng ngủ", subtitle: "Volume 5", statusText: "Inactive", active: false, level: 1, mode: "OFF", percent: 0 },

  // Phòng bếp (mới)
  { id: 9, name: "Smart LED", room: "Phòng bếp", subtitle: "ON", statusText: "Active", active: true, level: 3, mode: "AUTO", percent: 80 },
  { id: 10, name: "Hood Fan", room: "Phòng bếp", subtitle: "Level 2", statusText: "Active", active: true, level: 2, mode: "AUTO", percent: 50 },
  { id: 11, name: "Smart Fridge", room: "Phòng bếp", subtitle: "4°C", statusText: "Active", active: true, level: 2, mode: "AUTO", percent: 55 },
  { id: 12, name: "Microwave", room: "Phòng bếp", subtitle: "OFF", statusText: "Inactive", active: false, level: 1, mode: "OFF", percent: 0 },

  // Phòng tắm (mới)
  { id: 13, name: "Smart LED", room: "Phòng tắm", subtitle: "ON", statusText: "Active", active: true, level: 2, mode: "AUTO", percent: 45 },
  { id: 14, name: "Water Heater", room: "Phòng tắm", subtitle: "50°C", statusText: "Active", active: true, level: 3, mode: "AUTO", percent: 70 },
  { id: 15, name: "Exhaust Fan", room: "Phòng tắm", subtitle: "Level 1", statusText: "Inactive", active: false, level: 1, mode: "OFF", percent: 0 },
  { id: 16, name: "Smart Mirror", room: "Phòng tắm", subtitle: "ON", statusText: "Active", active: true, level: 2, mode: "AUTO", percent: 50 },
];

const initialRooms = ["Phòng khách", "Phòng ngủ", "Phòng bếp", "Phòng tắm"];

/* ── RING SVG ── */
function Ring({ percent, size = 160 }: { percent: number; size?: number }) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const fill = (percent / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e8edf2" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#ringGrad)" strokeWidth={stroke}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9ed8e1" />
          <stop offset="100%" stopColor="#5f9bf5" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── DEVICE MODAL ── */
function DeviceModal({
  device, onClose, onUpdate, themeMode,
}: {
  device: SmartDevice;
  onClose: () => void;
  onUpdate: (id: number, changes: Partial<SmartDevice>) => void;
  themeMode: "light" | "dark";
}) {
  const [level, setLevel] = useState(device.level);
  const [mode, setMode] = useState(device.mode);
  const [percent, setPercent] = useState(device.percent);

  const handleLevel = (l: number) => {
    const newPercent = Math.round((l / 5) * 100);
    const newMode = mode === "OFF" ? "AUTO" : mode;
    setLevel(l);
    setPercent(newPercent);
    if (mode === "OFF") setMode("AUTO");
    onUpdate(device.id, { level: l, mode: newMode, percent: newPercent, subtitle: `Level ${l}`, active: true, statusText: "Active" });
  };

  const handleMode = (m: "OFF" | "AUTO" | "SWING") => {
    let newLevel = level;
    let newPercent = percent;
    let newActive = true;
    if (m === "OFF") {
      newPercent = 0;
      newLevel = 0;
      newActive = false;
    } else {
      newLevel = device.level || 3;
      newPercent = device.percent || 65;
      newActive = true;
    }
    setMode(m);
    setLevel(newLevel);
    setPercent(newPercent);
    const statusText = m === "OFF" ? "Inactive" : "Active";
    onUpdate(device.id, { level: newLevel, mode: m, percent: newPercent, subtitle: m === "OFF" ? "OFF" : `Level ${newLevel}`, active: newActive, statusText });
  };

  const handleSave = () => {
    onClose();
  };

  return (
    <div className="device-modal-overlay" onClick={onClose}>
      <div className={`device-modal ${themeMode === "dark" ? "dark-mode" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="device-modal-header">
          <div>
            <h2>{device.name}</h2>
            <p>{device.room}</p>
          </div>
          <button type="button" className="device-modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Ring */}
        <div className="device-modal-ring-wrap">
          <Ring percent={percent} />
          <div className="device-modal-ring-value">{percent},0%</div>
        </div>

        {/* Mode label */}
        <div className="device-modal-mode-label">
          <span>MODE</span>
          <strong>{mode}</strong>
        </div>

        {/* Level buttons */}
        <div className="device-modal-levels">
          {[1, 2, 3, 4, 5].map((l) => (
            <button
              key={l} type="button"
              className={`device-modal-level-btn ${level === l && mode !== "OFF" ? "active" : ""}`}
              onClick={() => handleLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Mode buttons */}
        <div className="device-modal-modes">
          {(["OFF", "AUTO", "SWING"] as const).map((m) => (
            <button
              key={m} type="button"
              className={`device-modal-mode-btn ${mode === m ? "active" : ""}`}
              onClick={() => handleMode(m)}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Save */}
        <button type="button" className="device-modal-save" onClick={handleSave}>
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

/* ── ADD POPUP ── */
function AddPopup({
  onAddRoom, onAddDevice, onClose, themeMode,
}: {
  onAddRoom: () => void;
  onAddDevice: () => void;
  onClose: () => void;
  themeMode: "light" | "dark";
}) {
  return (
    <>
      <div className="add-popup-overlay" onClick={onClose} />
      <div className={`add-popup ${themeMode === "dark" ? "dark-mode" : ""}`}>
        <button type="button" className="add-popup-item" onClick={() => { onAddRoom(); onClose(); }}>
          Thêm phòng
        </button>
        <button type="button" className="add-popup-item" onClick={() => { onAddDevice(); onClose(); }}>
          Thêm thiết bị
        </button>
      </div>
    </>
  );
}

/* ── DEVICE CARD ── */
function DeviceCard({
  device, onToggle, onOpen, isEditing, onDelete,
}: {
  device: SmartDevice;
  onToggle: (id: number) => void;
  onOpen: (d: SmartDevice) => void;
  isEditing: boolean;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="home-device-card" style={{ cursor: "pointer" }} onClick={() => !isEditing && onOpen(device)}>
      {isEditing && (
        <button
          type="button"
          className="device-delete-btn"
          onClick={(e) => { e.stopPropagation(); onDelete(device.id); }}
        >
          <X size={14} />
        </button>
      )}

      <div className="home-device-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div>
            <h3>{device.name}</h3>
            <p>{device.subtitle}</p>
          </div>
          <button
            type="button"
            className={`home-device-switch ${device.active ? "on" : "off"}`}
            onClick={(e) => { e.stopPropagation(); onToggle(device.id); }}
            style={{ flexShrink: 0 }}
          >
            <span className="home-device-switch-knob" />
          </button>
        </div>
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

/* ── HOME PAGE ── */
export default function HomePage() {
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useTheme();

  const [devices, setDevices] = useState(initialDevices);
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedRoom, setSelectedRoom] = useState("Phòng khách");
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevice, setSelectedDevice] = useState<SmartDevice | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleDevice = (id: number) => {
    setDevices((prev) => prev.map((d) =>
      d.id === id ? { ...d, active: !d.active, statusText: !d.active ? "Active" : "Inactive" } : d
    ));
  };

  const handleUpdateDevice = (id: number, changes: Partial<SmartDevice>) => {
    setDevices((prev) => prev.map((d) => d.id === id ? { ...d, ...changes } : d));
  };

  const handleAddRoom = () => {
    const name = prompt("Tên phòng mới:");
    if (name?.trim()) setRooms((prev) => [...prev, name.trim()]);
  };

  const handleAddDevice = () => {
    const name = prompt("Tên thiết bị mới:");
    if (name?.trim()) {
      setDevices((prev) => [...prev, {
        id: Date.now(), name: name.trim(), room: selectedRoom,
        subtitle: "OFF", statusText: "Inactive", active: false,
        level: 1, mode: "OFF", percent: 0,
      }]);
    }
  };

  const handleDeleteDevice = (id: number) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const filteredDevices = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    return devices.filter((d) =>
      d.room === selectedRoom &&
      (kw === "" || d.name.toLowerCase().includes(kw) || d.subtitle.toLowerCase().includes(kw))
    );
  }, [devices, selectedRoom, searchTerm]);

  return (
    <div className={`home-page ${themeMode === "dark" ? "dark-mode" : ""}`}>
      <AppSidebar />

      <main className="home-main">
        <AppTopbar
          showAccountMenu={showAccountMenu}
          setShowAccountMenu={setShowAccountMenu}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          title="Welcome to Dokyeom's Home"
        />

        <section className="home-content">
          <section className="home-summary-section">
            <div className="section-header">
              <h1 className="section-title">Tổng quan</h1>
              <button className="section-action-btn" onClick={() => navigate("/dashboard")}>
                Chi tiết
              </button>
            </div>
            <section className="home-summary-grid">
              <div className="home-circle-card">
                <div className="home-card-head"><h4>Độ ẩm</h4><Droplets size={UI.TOPBAR_ICON_SIZE} /></div>
                <div className="home-ring-wrap">
                  <Ring percent={65} size={120} />
                  <div className="home-ring-value">65,0%</div>
                </div>
              </div>
              <div className="home-circle-card">
                <div className="home-card-head"><h4>Nhiệt độ</h4><Thermometer size={18} /></div>
                <div className="home-ring-wrap">
                  <Ring percent={80} size={120} />
                  <div className="home-ring-value">24°C</div>
                </div>
              </div>
              <div className="home-energy-card">
                <h3>Tổng tiêu thụ</h3>
                <div className="home-energy-row"><span>Tháng 5</span><strong>245 kWh</strong></div>
                <div className="home-energy-bar"><div className="home-energy-bar-fill" /></div>
                <div className="home-energy-divider" />
                <div className="home-energy-stats">
                  <div><span>Phòng khách</span><strong>98 kWh</strong></div>
                  <div><span>Phòng ngủ</span><strong>76 kWh</strong></div>
                  <div><span>Phòng bếp</span><strong>71 kWh</strong></div>
                </div>
              </div>
            </section>
          </section>

          <section className="home-device-section">
            <div className="section-header">
              <h1 className="section-title">Thiết bị thông minh</h1>
              <button
                className={`section-action-btn ${isEditing ? "editing" : ""}`}
                onClick={() => setIsEditing((prev) => !prev)}
              >
                {isEditing ? "Xong" : "Chỉnh sửa"}
              </button>
            </div>
            <div className="home-device-grid">
              {filteredDevices.map((device) => (
                <DeviceCard key={device.id} device={device} onToggle={handleToggleDevice} onOpen={setSelectedDevice} isEditing={isEditing} onDelete={handleDeleteDevice} />
              ))}
            </div>
          </section>

          <section className="home-room-bar">
            <div className="home-room-tabs">
              {rooms.map((room) => (
                <button key={room} type="button"
                  className={`home-room-tab ${selectedRoom === room ? "active" : ""}`}
                  onClick={() => setSelectedRoom(room)}
                >
                  {room}
                </button>
              ))}
            </div>
            <div style={{ position: "relative" }}>
              <button className="home-room-add-btn" type="button" onClick={() => setShowAddPopup((p) => !p)}>
                <Plus size={24} />
              </button>
              {showAddPopup && (
                <AddPopup
                  onAddRoom={handleAddRoom}
                  onAddDevice={handleAddDevice}
                  onClose={() => setShowAddPopup(false)}
                  themeMode={themeMode}
                />
              )}
            </div>
          </section>
        </section>
      </main>

      {/* Device modal */}
      {selectedDevice && (
        <DeviceModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onUpdate={handleUpdateDevice}
          themeMode={themeMode}
        />
      )}
    </div>
  );
}
