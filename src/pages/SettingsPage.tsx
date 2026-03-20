import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { UI } from "@/constants/ui";
import {
  Home,
  Zap,
  LayoutGrid,
  Clock3,
  Settings,
  Bell,
  Search,
  Thermometer,
  Droplets,
  Sun,
  Zap as AutomationIcon,
} from "lucide-react";
import "./settings.css";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useTheme();

  const [searchTerm, setSearchTerm] = useState("");

  const [temperature, setTemperature] = useState({
    high: 30,
    low: 18,
  });

  const [humidity, setHumidity] = useState({
    high: 80,
    low: 40,
  });

  const [light, setLight] = useState({
    high: 700,
    low: 50,
  });

  const [automation, setAutomation] = useState({
    fan: true,
    light: true,
  });

  const [notifications, setNotifications] = useState({
    temp: true,
    humidity: true,
    motion: true,
  });

  const handleReset = () => {
    setTemperature({ high: 30, low: 18 });
    setHumidity({ high: 80, low: 40 });
    setLight({ high: 700, low: 50 });
    setAutomation({
      fan: true,
      light: true,
    });
    setNotifications({
      temp: true,
      humidity: true,
      motion: true,
    });
  };

  return (
    <div className={`settings-page ${themeMode === "dark" ? "dark-mode" : ""}`}>
      <aside className="settings-sidebar">
        <button
          className="settings-nav-btn"
          type="button"
          title="Trang chủ"
          onClick={() => navigate("/home")}
        >
          <Home size={UI.SIDEBAR_ICON_SIZE} />
        </button>

        <div className="settings-sidebar-links">
          <button
            className="settings-nav-ghost"
            type="button"
            title="Điện năng"
          >
            <Zap size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="settings-nav-ghost"
            type="button"
            title="Thiết bị"
            onClick={() => navigate("/devices")}
          >
            <LayoutGrid size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="settings-nav-ghost"
            type="button"
            title="Lịch hẹn giờ"
            onClick={() => navigate("/timers")}
          >
            <Clock3 size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="settings-nav-ghost"
            type="button"
            title="Bảng điều khiển"
          >
            <LayoutGrid size={UI.SIDEBAR_ICON_SIZE} />
          </button>

          <button
            className="settings-nav-btn active"
            type="button"
            title="Cài đặt"
            onClick={() => navigate("/settings")}
          >
            <Settings size={UI.SIDEBAR_ICON_SIZE} />
          </button>
        </div>
      </aside>

      <main className="settings-main">
        <header className="settings-topbar">
          <div className="settings-topbar-left">
            <div className="settings-avatar" />
            <h2>Welcome to Meomeo’s Home</h2>
          </div>

          <div className="settings-topbar-right">
            <div className="settings-search-box">
              <Search size={UI.TOPBAR_ICON_SIZE} />
              <input
                type="text"
                placeholder="Search any devices here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ThemeToggle mode={themeMode} onToggle={toggleTheme} />

            <button className="settings-bell-btn" type="button">
              <Bell size={UI.TOPBAR_ICON_SIZE} />
            </button>
          </div>
        </header>

        <section className="settings-content">
          <div className="settings-header">
            <div>
              <h1>Cài Đặt</h1>
              <p>Cấu hình ngưỡng cảnh báo và quy tắc tự động hóa</p>
            </div>

            <div className="settings-actions">
              <button
                className="btn-secondary"
                type="button"
                onClick={handleReset}
              >
                Đặt Lại
              </button>

              <button className="btn-primary" type="button">
                Lưu Thay Đổi
              </button>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="icon red">
                <Thermometer size={UI.TOPBAR_ICON_SIZE} />
              </div>
              <div>
                <h3>Ngưỡng Nhiệt Độ</h3>
                <p>Đặt giới hạn cảnh báo nhiệt độ</p>
              </div>
            </div>

            <div className="settings-grid">
              <div>
                <label>Cảnh Báo Nhiệt Độ Cao (°C)</label>
                <input
                  type="number"
                  value={temperature.high}
                  onChange={(e) =>
                    setTemperature({
                      ...temperature,
                      high: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label>Cảnh Báo Nhiệt Độ Thấp (°C)</label>
                <input
                  type="number"
                  value={temperature.low}
                  onChange={(e) =>
                    setTemperature({
                      ...temperature,
                      low: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="icon blue">
                <Droplets size={UI.TOPBAR_ICON_SIZE} />
              </div>
              <div>
                <h3>Ngưỡng Độ Ẩm</h3>
                <p>Đặt giới hạn cảnh báo độ ẩm</p>
              </div>
            </div>

            <div className="settings-grid">
              <div>
                <label>Cảnh Báo Độ Ẩm Cao (%)</label>
                <input
                  type="number"
                  value={humidity.high}
                  onChange={(e) =>
                    setHumidity({
                      ...humidity,
                      high: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label>Cảnh Báo Độ Ẩm Thấp (%)</label>
                <input
                  type="number"
                  value={humidity.low}
                  onChange={(e) =>
                    setHumidity({
                      ...humidity,
                      low: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="icon yellow">
                <Sun size={UI.TOPBAR_ICON_SIZE} />
              </div>
              <div>
                <h3>Ngưỡng Ánh Sáng</h3>
                <p>Đặt giới hạn cảnh báo ánh sáng</p>
              </div>
            </div>

            <div className="settings-grid">
              <div>
                <label>Cảnh Báo Ánh Sáng Cao (lux)</label>
                <input
                  type="number"
                  value={light.high}
                  onChange={(e) =>
                    setLight({
                      ...light,
                      high: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label>Cảnh Báo Ánh Sáng Thấp (lux)</label>
                <input
                  type="number"
                  value={light.low}
                  onChange={(e) =>
                    setLight({
                      ...light,
                      low: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="icon purple">
                <AutomationIcon size={UI.TOPBAR_ICON_SIZE} />
              </div>
              <div>
                <h3>Quy Tắc Tự Động Hóa</h3>
                <p>Bật điều khiển thiết bị tự động</p>
              </div>
            </div>

            <div className="settings-toggle">
              <span>Điều Khiển Quạt</span>
              <input
                type="checkbox"
                checked={automation.fan}
                onChange={() =>
                  setAutomation({ ...automation, fan: !automation.fan })
                }
              />
            </div>

            <div className="settings-toggle">
              <span>Điều Khiển Đèn</span>
              <input
                type="checkbox"
                checked={automation.light}
                onChange={() =>
                  setAutomation({ ...automation, light: !automation.light })
                }
              />
            </div>
          </div>

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="icon orange">
                <Bell size={UI.TOPBAR_ICON_SIZE} />
              </div>
              <div>
                <h3>Cài Đặt Thông Báo</h3>
                <p>Quản lý cảnh báo</p>
              </div>
            </div>

            <div className="settings-toggle">
              <span>Cảnh Báo Nhiệt Độ</span>
              <input
                type="checkbox"
                checked={notifications.temp}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    temp: !notifications.temp,
                  })
                }
              />
            </div>

            <div className="settings-toggle">
              <span>Cảnh Báo Độ Ẩm</span>
              <input
                type="checkbox"
                checked={notifications.humidity}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    humidity: !notifications.humidity,
                  })
                }
              />
            </div>

            <div className="settings-toggle">
              <span>Phát Hiện Chuyển Động</span>
              <input
                type="checkbox"
                checked={notifications.motion}
                onChange={() =>
                  setNotifications({
                    ...notifications,
                    motion: !notifications.motion,
                  })
                }
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}