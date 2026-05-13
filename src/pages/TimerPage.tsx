import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import AppSidebar from "@/components/AppSidebar";
import AccountMenu from "@/components/AccountMenu";
import { UI } from "@/constants/ui";
import AppTopbar from "@/components/AppTopbar";
import {
    Home, Bell, Search, Plus, CalendarDays, Trash2, CheckCircle, Clock3,
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
    { id: 1, time: "07:00", device: "Smart LED", room: "Phòng khách", repeat: "Các ngày trong tuần", mode: "BẬT", enabled: true },
    { id: 2, time: "23:00", device: "Air Conditioner", room: "Phòng ngủ", repeat: "Hàng ngày", mode: "TẮT", enabled: true },
    { id: 3, time: "18:00", device: "Smart Fan", room: "Phòng khách", repeat: "Cuối tuần", mode: "BẬT", enabled: false },
];

function TimerCard({ item, onToggle, onDelete }: { item: TimerItem; onToggle: (id: number) => void; onDelete: (id: number) => void }) {
    return (
        <div className="timer-item-card">
            <div className="timer-item-left">
                <div className="timer-time-box">{item.time}</div>
                <div className="timer-item-content">
                    <div className="timer-item-title-row">
                        <h3>{item.device}</h3>
                        <span className={`timer-badge ${item.enabled ? "on" : "off"}`}>{item.enabled ? "BẬT" : "TẮT"}</span>
                    </div>
                    <div className="timer-item-meta">
                        <span><Home size={16} />{item.room}</span>
                        <span><CalendarDays size={16} />{item.repeat}</span>
                    </div>
                </div>
            </div>
            <div className="timer-item-actions">
                <button className={`toggle-switch ${item.enabled ? "on" : "off"}`} type="button" onClick={() => onToggle(item.id)}>
                    <span className="toggle-knob" />
                </button>
                <button className="delete-btn" type="button" onClick={() => onDelete(item.id)}>
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}

export default function TimerPage() {
    const { themeMode, toggleTheme } = useTheme();

    const [timers, setTimers] = useState<TimerItem[]>(initialTimerList);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAccountMenu, setShowAccountMenu] = useState(false);

    const totalCount = timers.length;
    const activeCount = timers.filter((t) => t.enabled).length;
    const inactiveCount = timers.filter((t) => !t.enabled).length;
    const activePct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
    const inactivePct = totalCount > 0 ? Math.round((inactiveCount / totalCount) * 100) : 0;

    const handleToggleTimer = (id: number) => {
        setTimers((prev) => prev.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));
    };

    const handleDeleteTimer = (id: number) => {
        setTimers((prev) => prev.filter((t) => t.id !== id));
    };

    const handleCreateTimer = () => {
        setTimers((prev) => [{
            id: Date.now(), time: "20:30", device: "New Device",
            room: "Phòng khách", repeat: "Hàng ngày", mode: "BẬT", enabled: true,
        }, ...prev]);
    };

    return (
        <div className={`timer-page ${themeMode === "dark" ? "dark-mode" : ""}`}>
            <AppSidebar />

            <main className="timer-main">
                <AppTopbar
                    showAccountMenu={showAccountMenu}
                    setShowAccountMenu={setShowAccountMenu}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    themeMode={themeMode}
                    toggleTheme={toggleTheme}
                    title="Welcome to Meomeo's Home"
                />

                <section className="timer-content">
                    <div className="timer-header-row">
                        <div>
                            <h1>Lịch hẹn giờ</h1>
                        </div>
                        <button className="create-timer-btn" type="button" onClick={handleCreateTimer}>
                            <Plus size={18} /><span>Tạo Lịch Mới</span>
                        </button>
                    </div>

                    <div className="timer-stats-grid">
                        {/* Hero card — total */}
                        <div className="timer-stat-card primary">
                            <div className="timer-stat-top">
                                <span className="timer-stat-label">Tổng số lịch</span>
                            </div>
                            <div className="timer-stat-value-row">
                                <h3>{totalCount}</h3>
                                <span>Lịch hẹn</span>
                            </div>
                            <div className="timer-stat-bar-wrap">
                                <div className="timer-stat-bar-fill" style={{ width: "100%" }} />
                            </div>
                        </div>

                        {/* Active card */}
                        <div className="timer-stat-card accent-green">
                            <div className="timer-stat-top">
                                <span className="timer-stat-label">Đang hoạt động</span>
                            </div>
                            <div className="timer-stat-value-row">
                                <h3>{activeCount}</h3>
                                <span>Thiết bị</span>
                            </div>
                            <div className="timer-stat-bar-wrap" style={{ background: "#e6f9ee" }}>
                                <div className="timer-stat-bar-fill green" style={{ width: `${activePct}%` }} />
                            </div>
                        </div>

                        {/* Inactive card */}
                        <div className="timer-stat-card accent-gray">
                            <div className="timer-stat-top">
                                <span className="timer-stat-label">Đã tắt</span>
                            </div>
                            <div className="timer-stat-value-row">
                                <h3>{inactiveCount}</h3>
                                <span>Thiết bị</span>
                            </div>
                            <div className="timer-stat-bar-wrap" style={{ background: "#f0f2f6" }}>
                                <div className="timer-stat-bar-fill gray" style={{ width: `${inactivePct}%` }} />
                            </div>
                        </div>
                    </div>

                    <div className="timer-list">
                        {timers.map((item) => (
                            <TimerCard key={item.id} item={item} onToggle={handleToggleTimer} onDelete={handleDeleteTimer} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
