import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  Zap,
  Clock3,
  Settings,
  Bell,
  Search,
  Plus,
  CalendarDays,
  Trash2,
  CheckCircle,
  LayoutGrid,
} from "lucide-react";
import "./timer.css";

type TimerItem = {
  id: number;
  time: string;
  device: string;
  room: string;
  repeat: string;
  mode: "BẬT" | "TẮT";
  enabled: boolean;
};

const initialTimerList: TimerItem[] = [
  {
    id: 1,
    time: "07:00",
    device: "Smart LED",
    room: "Living Room",
    repeat: "Các ngày trong tuần",
    mode: "BẬT",
    enabled: true,
  },
  {
    id: 2,
    time: "23:00",
    device: "Air Conditioner",
    room: "Bedroom",
    repeat: "Hàng ngày",
    mode: "TẮT",
    enabled: true,
  },
  {
    id: 3,
    time: "18:00",
    device: "Smart Fan",
    room: "Living Room",
    repeat: "Cuối tuần",
    mode: "BẬT",
    enabled: false,
  },
];

function TimerCard({
  item,
  onToggle,
  onDelete,
}: {
  item: TimerItem;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="timer-item-card">
      <div className="timer-item-left">
        <div className="timer-time-box">{item.time}</div>

        <div className="timer-item-content">
          <div className="timer-item-title-row">
            <h3>{item.device}</h3>
            <span className={`timer-badge ${item.mode === "BẬT" ? "on" : "off"}`}>
              {item.mode}
            </span>
          </div>

          <div className="timer-item-meta">
            <span>
              <Home size={16} />
              {item.room}
            </span>
            <span>
              <CalendarDays size={16} />
              {item.repeat}
            </span>
          </div>
        </div>
      </div>

      <div className="timer-item-actions">
        <button
          className={`toggle-switch ${item.enabled ? "on" : "off"}`}
          type="button"
          onClick={() => onToggle(item.id)}
          aria-label="Bật tắt lịch"
        >
          <span className="toggle-knob" />
        </button>

        <button
          className="delete-btn"
          type="button"
          onClick={() => onDelete(item.id)}
          aria-label="Xóa lịch"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function TimerPage() {
  const navigate = useNavigate();
  const [timers, setTimers] = useState<TimerItem[]>(initialTimerList);

  const totalCount = timers.length;
  const activeCount = timers.filter((item) => item.enabled).length;
  const inactiveCount = timers.filter((item) => !item.enabled).length;
  const { themeMode, toggleTheme } = useTheme();

  const timerStats = [
    {
      id: 1,
      title: "Tổng số lịch",
      value: String(totalCount),
      icon: <Clock3 size={20} />,
      theme: "blue",
    },
    {
      id: 2,
      title: "Đang hoạt động",
      value: String(activeCount),
      icon: <CheckCircle size={20} />,
      theme: "green",
    },
    {
      id: 3,
      title: "Đã tắt",
      value: String(inactiveCount),
      icon: <Clock3 size={20} />,
      theme: "gray",
    },
  ];

  const handleToggleTimer = (id: number) => {
    setTimers((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
  };

  const handleDeleteTimer = (id: number) => {
    setTimers((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCreateTimer = () => {
    const newTimer: TimerItem = {
      id: Date.now(),
      time: "20:30",
      device: "New Device",
      room: "Living Room",
      repeat: "Hàng ngày",
      mode: "BẬT",
      enabled: true,
    };

    setTimers((prev) => [newTimer, ...prev]);
  };

  return (
    <div className={`timer-page ${themeMode === "dark" ? "dark-mode" : ""}`}>
      <aside className="timer-sidebar">
        <button
          className="timer-nav-btn"
          type="button"
          onClick={() => navigate("/")}
          title="Trang chủ"
        >
          <Home size={18} />
        </button>

        <div className="timer-sidebar-links">
          <button className="timer-nav-ghost" type="button" title="Điện năng">
            <Zap size={18} />
          </button>

          <button
            className="timer-nav-ghost"
            type="button"
            title="Thiết bị"
            onClick={() => navigate("/devices")}
          >
            <LayoutGrid size={18} />
          </button>

          <button className="timer-nav-btn active" type="button" title="Lịch hẹn giờ">
            <Clock3 size={18} />
          </button>

          <button className="timer-nav-ghost" type="button" title="Bảng điều khiển">
            <LayoutGrid size={18} />
          </button>

          <button className="timer-nav-ghost" type="button" title="Cài đặt">
            <Settings size={18} />
          </button>
        </div>
      </aside>

      <main className="timer-main">
        <header className="timer-topbar">
          <div className="timer-topbar-left">
            <div className="timer-avatar" />
            <h2>Welcome to Meomeo’s Home</h2>
          </div>

          <div className="timer-topbar-right">
            <div className="timer-search-box">
              <Search size={18} />
              <input type="text" placeholder="Search any devices here" />
            </div>
        
            <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
            <button className="timer-bell-btn" type="button">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <section className="timer-content">
          <div className="timer-header-row">
            <div>
              <h1>Lịch Hẹn Giờ</h1>
              <p>Quản lý và theo dõi lịch trình của bạn</p>
            </div>

            <button
              className="create-timer-btn"
              type="button"
              onClick={handleCreateTimer}
            >
              <Plus size={18} />
              <span>Tạo Lịch Mới</span>
            </button>
          </div>

          <div className="timer-stats-grid">
            {timerStats.map((stat) => (
              <div className="timer-stat-card" key={stat.id}>
                <div className={`timer-stat-icon ${stat.theme}`}>{stat.icon}</div>
                <div className="timer-stat-text">
                  <p>{stat.title}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="timer-list">
            {timers.map((item) => (
              <TimerCard
                key={item.id}
                item={item}
                onToggle={handleToggleTimer}
                onDelete={handleDeleteTimer}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}