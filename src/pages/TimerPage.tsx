import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import AppSidebar from "@/components/AppSidebar";
import AccountMenu from "@/components/AccountMenu";
import { UI } from "@/constants/ui";
import AppTopbar from "@/components/AppTopbar";
import {
    Home, Bell, Search, Plus, CalendarDays, Trash2, CheckCircle, Clock3, Pencil,
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

function TimerCard({ item, onToggle, onEdit, onDelete }: { item: TimerItem; onToggle: (id: number) => void; onEdit: (id: number) => void; onDelete: (id: number) => void }) {
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
                <button className="edit-btn" type="button" onClick={() => onEdit(item.id)}>
                    <Pencil size={18} />
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingTimer, setEditingTimer] = useState<TimerItem | null>(null);

    const totalCount = timers.length;
    const activeCount = timers.filter((t) => t.enabled).length;
    const inactiveCount = timers.filter((t) => !t.enabled).length;
    const activePct = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0;
    const inactivePct = totalCount > 0 ? Math.round((inactiveCount / totalCount) * 100) : 0;

    const handleToggleTimer = (id: number) => {
        setTimers((prev) => prev.map((t) => t.id === id ? { ...t, enabled: !t.enabled } : t));
    };

    const handleEditTimer = (id: number) => {
        const timer = timers.find((t) => t.id === id);
        if (timer) {
            setEditingTimer(timer);
            setIsModalOpen(true);
        }
    };

    const handleSaveEdit = (id: number, time: string, repeat: string) => {
        setTimers((prev) => prev.map((t) => t.id === id ? { ...t, time, repeat } : t));
        setIsModalOpen(false);
        setEditingTimer(null);
    };

    const handleDeleteTimer = (id: number) => {
        setTimers((prev) => prev.filter((t) => t.id !== id));
    };

    const handleCreateTimer = () => {
        setIsCreateModalOpen(true);
    };

    const handleSaveNew = (data: Omit<TimerItem, "id" | "enabled" | "mode">) => {
        setTimers((prev) => [
            {
                id: Date.now(),
                ...data,
                mode: "BẬT",
                enabled: true,
            },
            ...prev,
        ]);
        setIsCreateModalOpen(false);
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
                    title="Welcome to Orange's Home"
                />

                <section className="timer-content">
                    <div className="timer-header-row">
                        <div>
                            <h1>Lịch hẹn giờ</h1>
                        </div>
                        <button className="create-timer-btn" type="button" onClick={handleCreateTimer}>
                            <Plus size={18} /><span>Tạo lịch mới</span>
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
                            <TimerCard key={item.id} item={item} onToggle={handleToggleTimer} onEdit={handleEditTimer} onDelete={handleDeleteTimer} />
                        ))}
                    </div>
                </section>

                {isModalOpen && editingTimer && (
                    <EditTimerModal
                        timer={editingTimer}
                        onClose={() => { setIsModalOpen(false); setEditingTimer(null); }}
                        onSave={handleSaveEdit}
                    />
                )}

                {isCreateModalOpen && (
                    <CreateTimerModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onSave={handleSaveNew}
                    />
                )}
            </main>
        </div>
    );
}

function EditTimerModal({ timer, onClose, onSave }: { timer: TimerItem; onClose: () => void; onSave: (id: number, time: string, repeat: string) => void }) {
    const [time, setTime] = useState(timer.time);
    const [repeat, setRepeat] = useState(timer.repeat);

    return (
        <div className="timer-modal-overlay" onClick={onClose}>
            <div className="timer-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Chỉnh sửa lịch hẹn</h2>

                <div className="modal-field">
                    <label>Thời gian</label>
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>

                <div className="modal-field">
                    <label>Lặp lại</label>
                    <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                        <option value="Hàng ngày">Hàng ngày</option>
                        <option value="Thứ 2 - Thứ 6">Thứ 2 - Thứ 6</option>
                        <option value="Cuối tuần">Cuối tuần</option>
                        <option value="Chỉ một lần">Chỉ một lần</option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>Hủy</button>
                    <button className="modal-btn save" onClick={() => onSave(timer.id, time, repeat)}>Lưu thay đổi</button>
                </div>
            </div>
        </div>
    );
}

function CreateTimerModal({ onClose, onSave }: { onClose: () => void; onSave: (data: Omit<TimerItem, "id" | "enabled" | "mode">) => void }) {
    const [device, setDevice] = useState("");
    const [room, setRoom] = useState("");
    const [time, setTime] = useState("08:00");
    const [repeat, setRepeat] = useState("Hàng ngày");

    return (
        <div className="timer-modal-overlay" onClick={onClose}>
            <div className="timer-modal" onClick={(e) => e.stopPropagation()}>
                <h2>Tạo lịch hẹn mới</h2>

                <div className="modal-field">
                    <label>Tên thiết bị</label>
                    <input
                        type="text"
                        placeholder="Ví dụ: Đèn trần"
                        value={device}
                        onChange={(e) => setDevice(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="modal-field">
                    <label>Phòng</label>
                    <input
                        type="text"
                        placeholder="Ví dụ: Phòng khách"
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label>Thời gian</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>

                <div className="modal-field">
                    <label>Lặp lại</label>
                    <select value={repeat} onChange={(e) => setRepeat(e.target.value)}>
                        <option value="Hàng ngày">Hàng ngày</option>
                        <option value="Thứ 2 - Thứ 6">Thứ 2 - Thứ 6</option>
                        <option value="Cuối tuần">Cuối tuần</option>
                        <option value="Chỉ một lần">Chỉ một lần</option>
                    </select>
                </div>

                <div className="modal-actions">
                    <button className="modal-btn cancel" onClick={onClose}>Hủy</button>
                    <button
                        className="modal-btn save"
                        onClick={() => {
                            if (device.trim()) onSave({ device, room: room || "Chưa xác định", time, repeat });
                        }}
                        disabled={!device.trim()}
                    >
                        Tạo mới
                    </button>
                </div>
            </div>
        </div>
    );
}
