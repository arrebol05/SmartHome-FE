import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import AppSidebar from "@/components/AppSidebar";
import AppTopbar from "@/components/AppTopbar";
import { ChevronDown, Settings, Zap, Home } from "lucide-react";
import { UI } from "@/constants/ui";
import { deviceService, toErrorMessage } from "@/services/api";
import { useAppStore } from "@/store/appStore";
import type { DeviceMode, DeviceStatusResponse, DeviceType } from "@/types";
import "./all-devices.css";

type StatusFilter = "Tất cả thiết bị" | "Đang bật" | "Đang tắt";

const statusOptions: StatusFilter[] = ["Tất cả thiết bị", "Đang bật", "Đang tắt"];

function DeviceCard({
  device,
  onToggleState,
  onToggleMode,
  isPending,
}: {
  device: DeviceStatusResponse;
  onToggleState: (deviceType: DeviceType, currentState: "ON" | "OFF") => void;
  onToggleMode: (deviceType: DeviceType, mode: DeviceMode) => void;
  isPending: boolean;
}) {
  const isOn = device.state === "ON";

  return (
    <div className={`device-card ${isOn ? "is-active" : "is-off"}`}>
      <div className="device-card-top">
        <div className={`device-icon-box ${isOn ? "active" : "off"}`}>
          <strong>{device.deviceType}</strong>
        </div>
        <button
          className={`device-switch ${isOn ? "on" : "off"}`}
          type="button"
          onClick={() => onToggleState(device.deviceType, device.state)}
          disabled={isPending}
        >
          <span className="device-switch-knob" />
        </button>
      </div>

      <div className="device-main">
        <h3>{device.deviceType}</h3>
        <p>Mode: {device.mode}</p>
      </div>

      <div className="device-divider" />

      <div className="device-meta">
        <div className="meta-row">
          <span>Trạng thái:</span>
          <strong className={isOn ? "green" : "normal"}>{device.state}</strong>
        </div>
        <div className="meta-row">
          <span>Nguồn lệnh:</span>
          <strong className="normal">{device.lastCommandSource || "--"}</strong>
        </div>
        <div className="meta-row">
          <span>Cập nhật:</span>
          <strong className="normal">{device.updatedAt ? new Date(device.updatedAt).toLocaleTimeString("vi-VN") : "--"}</strong>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          type="button"
          className="room-tab"
          onClick={() => onToggleMode(device.deviceType, device.mode === "AUTO" ? "MANUAL" : "AUTO")}
          disabled={isPending}
          style={{ flex: 1 }}
        >
          {device.mode === "AUTO" ? "Đổi sang MANUAL" : "Đổi sang AUTO"}
        </button>
      </div>
    </div>
  );
}

export default function AllDevicesPage() {
  const { themeMode, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("Tất cả thiết bị");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingDevice, setPendingDevice] = useState<DeviceType | null>(null);

  const led = useAppStore((state) => state.led);
  const fan = useAppStore((state) => state.fan);
  const setDeviceStatus = useAppStore((state) => state.setDeviceStatus);
  const setDashboard = useAppStore((state) => state.setDashboard);

  const fetchDevices = useCallback(async () => {
    try {
      const [ledStatus, fanStatus] = await Promise.all([
        deviceService.getStatus("LED"),
        deviceService.getStatus("FAN"),
      ]);
      setDeviceStatus(ledStatus);
      setDeviceStatus(fanStatus);
      setError("");
    } catch (err) {
      setError(toErrorMessage(err, "Không thể tải trạng thái thiết bị"));
    } finally {
      setIsLoading(false);
    }
  }, [setDeviceStatus]);

  useEffect(() => {
    fetchDevices();
    const timer = window.setInterval(fetchDevices, 10000);
    return () => window.clearInterval(timer);
  }, [fetchDevices]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowStatusMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleState = async (deviceType: DeviceType, currentState: "ON" | "OFF") => {
    setPendingDevice(deviceType);
    try {
      const nextState = currentState === "ON" ? "OFF" : "ON";
      const updated = await deviceService.sendCommand(deviceType, {
        state: nextState,
        reason: "toggle from all devices page",
      });
      setDeviceStatus(updated);
      setDashboard(null);
      setError("");
    } catch (err) {
      setError(toErrorMessage(err, "Không thể gửi lệnh thiết bị"));
    } finally {
      setPendingDevice(null);
    }
  };

  const handleToggleMode = async (deviceType: DeviceType, mode: DeviceMode) => {
    setPendingDevice(deviceType);
    try {
      const updated = await deviceService.updateMode(deviceType, { mode });
      setDeviceStatus(updated);
      setError("");
    } catch (err) {
      setError(toErrorMessage(err, "Không thể cập nhật mode thiết bị"));
    } finally {
      setPendingDevice(null);
    }
  };

  const devices = useMemo(() => [led, fan].filter((d): d is DeviceStatusResponse => Boolean(d)), [led, fan]);

  const filteredDevices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    return devices.filter((d) => {
      const matchesStatus =
        selectedStatus === "Tất cả thiết bị" ||
        (selectedStatus === "Đang bật" && d.state === "ON") ||
        (selectedStatus === "Đang tắt" && d.state === "OFF");
      const text = `${d.deviceType} ${d.mode} ${d.state}`.toLowerCase();
      const matchesSearch = keyword === "" || text.includes(keyword);
      return matchesStatus && matchesSearch;
    });
  }, [devices, searchTerm, selectedStatus]);

  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.state === "ON").length;

  return (
    <div className={`all-devices-page ${themeMode === "dark" ? "dark-mode" : ""}`}>
      <AppSidebar />

      <main className="home-main">
        <AppTopbar
          showAccountMenu={showAccountMenu}
          setShowAccountMenu={setShowAccountMenu}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          themeMode={themeMode}
          toggleTheme={toggleTheme}
          title="Welcome to Orange's Home"
        />

        <section className="content-wrap">
          <div className="page-heading">
            <h1>Tất cả thiết bị</h1>
            {error && <p style={{ color: "#d14343", marginTop: 8 }}>{error}</p>}
          </div>

          <section className="summary-grid">
            <div className="summary-card primary">
              <div>
                <p>Tổng thiết bị</p>
                <h3>{totalDevices}</h3>
                <span>{activeDevices} đang hoạt động</span>
              </div>

            </div>
            <div className="summary-card">
              <div>
                <p>Thiết bị bật</p>
                <h3>{activeDevices}</h3>
                <span>Đang hoạt động</span>
              </div>

            </div>
            <div className="summary-card">
              <div>
                <p>Phòng đang dùng</p>
                <h3>{activeDevices > 0 ? 1 : 0}</h3>
                <span>/ 4 phòng</span>
              </div>

            </div>
          </section>

          <section className="filter-panel">
            <div className="filter-left">
              <h4>Thiết bị hiện có</h4>
              <div className="room-tabs">
                <button className="room-tab active" type="button">LED</button>
                <button className="room-tab active" type="button">FAN</button>
              </div>
            </div>

            <div className="filter-right">
              <h4>Trạng Thái</h4>
              <div className="status-dropdown-wrap" ref={dropdownRef}>
                <button className={`status-dropdown-btn ${showStatusMenu ? "open" : ""}`} type="button" onClick={() => setShowStatusMenu((p) => !p)}>
                  <span>{selectedStatus}</span>
                  <ChevronDown size={UI.TOPBAR_ICON_SIZE} className="status-dropdown-arrow" />
                </button>
                {showStatusMenu && (
                  <div className="status-dropdown-menu">
                    {statusOptions.map((option, i) => (
                      <button
                        key={option}
                        type="button"
                        className={`status-dropdown-item ${selectedStatus === option ? "active" : ""} ${i < statusOptions.length - 1 ? "with-border" : ""}`}
                        onClick={() => {
                          setSelectedStatus(option);
                          setShowStatusMenu(false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="device-grid">
            {isLoading && <p>Đang tải dữ liệu thiết bị...</p>}
            {!isLoading && filteredDevices.length === 0 && <p>Không có thiết bị phù hợp bộ lọc.</p>}
            {filteredDevices.map((device) => (
              <DeviceCard
                key={device.deviceType}
                device={device}
                onToggleState={handleToggleState}
                onToggleMode={handleToggleMode}
                isPending={pendingDevice === device.deviceType}
              />
            ))}
          </section>
        </section>
      </main>
    </div>
  );
}
