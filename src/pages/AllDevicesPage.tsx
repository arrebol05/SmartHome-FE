import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Zap,
  LayoutGrid,
  Clock3,
  Settings,
  Bell,
  Search,
  SunMedium,
  Star,
  Fan,
  Monitor,
  Camera,
  ChevronDown,
} from "lucide-react";
import "./all-devices.css";

type Device = {
  id: number;
  name: string;
  room: string;
  consumption: string;
  lastUsed: string;
  status: "Hoạt động" | "Tắt";
  active: boolean;
  iconType: "star" | "fan" | "monitor" | "camera" | "blank";
};

const initialDevices: Device[] = [
  { id: 1, name: "Smart LED", room: "Phòng khách", consumption: "12W", lastUsed: "1 giờ trước", status: "Hoạt động", active: true, iconType: "star" },
  { id: 2, name: "Smart Fan", room: "Phòng khách", consumption: "75W", lastUsed: "2 giờ trước", status: "Hoạt động", active: true, iconType: "fan" },
  { id: 3, name: "Air Conditioner", room: "Phòng khách", consumption: "0W", lastUsed: "Hôm qua", status: "Tắt", active: false, iconType: "blank" },
  { id: 4, name: "TV", room: "Phòng khách", consumption: "120W", lastUsed: "30 phút trước", status: "Hoạt động", active: true, iconType: "monitor" },
  { id: 5, name: "Bedroom Light", room: "Phòng ngủ", consumption: "0W", lastUsed: "8 giờ trước", status: "Tắt", active: false, iconType: "star" },
  { id: 6, name: "Ceiling Fan", room: "Phòng ngủ", consumption: "60W", lastUsed: "15 phút trước", status: "Hoạt động", active: true, iconType: "fan" },
  { id: 7, name: "AC Unit", room: "Phòng ngủ", consumption: "1400W", lastUsed: "3 giờ trước", status: "Hoạt động", active: true, iconType: "blank" },
  { id: 8, name: "Smart Speaker", room: "Phòng ngủ", consumption: "0W", lastUsed: "2 ngày trước", status: "Tắt", active: false, iconType: "blank" },
  { id: 9, name: "Kitchen Light", room: "Phòng bếp", consumption: "18W", lastUsed: "1 giờ trước", status: "Hoạt động", active: true, iconType: "star" },
  { id: 10, name: "Exhaust Fan", room: "Phòng bếp", consumption: "0W", lastUsed: "12 giờ trước", status: "Tắt", active: false, iconType: "blank" },
  { id: 11, name: "Security Camera", room: "Phòng bếp", consumption: "8W", lastUsed: "10 phút trước", status: "Hoạt động", active: true, iconType: "camera" },
  { id: 12, name: "Dining Light", room: "Nhà ăn", consumption: "0W", lastUsed: "3 ngày trước", status: "Tắt", active: false, iconType: "star" },
  { id: 13, name: "Smart TV", room: "Nhà ăn", consumption: "0W", lastUsed: "4 ngày trước", status: "Tắt", active: false, iconType: "monitor" },
  { id: 14, name: "Play Room Light", room: "Sân vườn", consumption: "25W", lastUsed: "4 giờ trước", status: "Hoạt động", active: true, iconType: "star" },
  { id: 15, name: "Game Console", room: "Phòng khách", consumption: "150W", lastUsed: "6 giờ trước", status: "Hoạt động", active: true, iconType: "monitor" },
];

const roomTabs = [
  "Tất Cả Phòng",
  "Phòng khách",
  "Phòng ngủ",
  "Nhà ăn",
  "Phòng bếp",
  "Sân vườn",
] as const;

const statusOptions = ["Tất cả thiết bị", "Đang hoạt động", "Đã tắt"] as const;

type StatusFilter = (typeof statusOptions)[number];
type RoomFilter = (typeof roomTabs)[number];

function DeviceCard({
  device,
  onToggle,
}: {
  device: Device;
  onToggle: (id: number) => void;
}) {
  return (
    <div className={`device-card ${device.active ? "is-active" : "is-off"}`}>
      <div className="device-card-top">
        <div className={`device-icon-box ${device.active ? "active" : "off"}`}>
          {renderDeviceIcon(device.iconType, device.active)}
        </div>

        <button
          className={`device-switch ${device.active ? "on" : "off"}`}
          type="button"
          onClick={() => onToggle(device.id)}
          aria-label={`Bật tắt ${device.name}`}
        >
          <span className="device-switch-knob" />
        </button>
      </div>

      <div className="device-main">
        <h3>{device.name}</h3>
        <p>{device.room}</p>
      </div>

      <div className="device-divider" />

      <div className="device-meta">
        <div className="meta-row">
          <span>Tiêu thụ:</span>
          <strong className={device.active ? "blue" : "muted"}>
            {device.consumption}
          </strong>
        </div>
        <div className="meta-row">
          <span>Dùng lần cuối:</span>
          <strong className="normal">{device.lastUsed}</strong>
        </div>
        <div className="meta-row">
          <span>Trạng thái:</span>
          <strong className={device.active ? "green" : "normal"}>
            {device.active ? "Hoạt động" : "Tắt"}
          </strong>
        </div>
      </div>
    </div>
  );
}

function renderDeviceIcon(type: Device["iconType"], active: boolean) {
  const className = "device-svg-icon";

  if (!active && type === "blank") {
    return <div className="device-placeholder-icon" />;
  }

  switch (type) {
    case "star":
      return <Star className={className} size={20} />;
    case "fan":
      return <Fan className={className} size={20} />;
    case "monitor":
      return <Monitor className={className} size={20} />;
    case "camera":
      return <Camera className={className} size={20} />;
    default:
      return <div className="device-placeholder-icon" />;
  }
}

export default function AllDevicesPage() {
  const navigate = useNavigate();

  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedRoom, setSelectedRoom] = useState<RoomFilter>("Tất Cả Phòng");
  const [selectedStatus, setSelectedStatus] =
    useState<StatusFilter>("Tất cả thiết bị");
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleDevice = (id: number) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id
          ? {
              ...device,
              active: !device.active,
              status: !device.active ? "Hoạt động" : "Tắt",
            }
          : device
      )
    );
  };

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchRoom =
        selectedRoom === "Tất Cả Phòng" || device.room === selectedRoom;

      const matchStatus =
        selectedStatus === "Tất cả thiết bị" ||
        (selectedStatus === "Đang hoạt động" && device.active) ||
        (selectedStatus === "Đã tắt" && !device.active);

      const keyword = searchTerm.trim().toLowerCase();
      const matchSearch =
        keyword === "" ||
        device.name.toLowerCase().includes(keyword) ||
        device.room.toLowerCase().includes(keyword);

      return matchRoom && matchStatus && matchSearch;
    });
  }, [devices, selectedRoom, selectedStatus, searchTerm]);

  const totalDevices = devices.length;
  const activeDevices = devices.filter((device) => device.active).length;
  const activeRooms = new Set(
    devices.filter((device) => device.active).map((device) => device.room)
  ).size;

  return (
    <div className="all-devices-page">
      <aside className="side-nav">
        <div className="side-nav-logo">
          <button
            className="side-nav-item"
            type="button"
            onClick={() => navigate("/")}
            title="Trang chủ"
          >
            <Home size={18} />
          </button>
        </div>

        <div className="side-nav-links">
          <button className="side-nav-ghost" type="button" title="Điện năng">
            <Zap size={18} />
          </button>

          <button
            className="side-nav-item active"
            type="button"
            title="Thiết bị"
          >
            <LayoutGrid size={18} />
          </button>

          <button
            className="side-nav-ghost"
            type="button"
            title="Lịch hẹn giờ"
            onClick={() => navigate("/timers")}
          >
            <Clock3 size={18} />
          </button>

          <button className="side-nav-ghost" type="button" title="Bảng điều khiển">
            <LayoutGrid size={18} />
          </button>

          <button className="side-nav-ghost" type="button" title="Cài đặt">
            <Settings size={18} />
          </button>
        </div>
      </aside>

      <main className="all-devices-main">
        <header className="top-bar">
          <div className="top-bar-left">
            <div className="avatar" />
            <h2>Welcome to Meomeo’s Home</h2>
          </div>

          <div className="top-bar-right">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search any devices here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button className="theme-btn" type="button">
              <SunMedium size={16} />
              <span>Light</span>
            </button>

            <button className="bell-btn" type="button">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <section className="content-wrap">
          <div className="page-heading">
            <h1>Tất Cả Thiết Bị</h1>
            <p>Quản lý và điều khiển tất cả thiết bị trong nhà của bạn</p>
          </div>

          <section className="summary-grid">
            <div className="summary-card primary">
              <div>
                <p>Tổng Thiết Bị</p>
                <h3>{totalDevices}</h3>
                <span>{activeDevices} đang hoạt động</span>
              </div>
              <div className="summary-icon">
                <Settings size={18} />
              </div>
            </div>

            <div className="summary-card">
              <div>
                <p>Tiêu Thụ Hiện Tại</p>
                <h3>1.87</h3>
                <span>kW (kilowatts)</span>
              </div>
              <div className="summary-icon soft">
                <Zap size={18} />
              </div>
            </div>

            <div className="summary-card">
              <div>
                <p>Phòng Đang Dùng</p>
                <h3>{activeRooms}</h3>
                <span>/ 5 phòng</span>
              </div>
              <div className="summary-icon soft">
                <Home size={18} />
              </div>
            </div>
          </section>

          <section className="filter-panel">
            <div className="filter-left">
              <h4>Chọn Phòng</h4>
              <div className="room-tabs">
                {roomTabs.map((room) => (
                  <button
                    key={room}
                    className={`room-tab ${selectedRoom === room ? "active" : ""}`}
                    type="button"
                    onClick={() => setSelectedRoom(room)}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-right">
              <h4>Trạng Thái</h4>
              <div className="status-dropdown-wrap">
                <select
                  className="status-select"
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as StatusFilter)
                  }
                >
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="status-select-icon" />
              </div>
            </div>
          </section>

          <section className="device-grid">
            {filteredDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleToggleDevice}
              />
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}