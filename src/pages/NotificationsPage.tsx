import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import {
  Home,
  Zap,
  LayoutGrid,
  Clock3,
  Settings,
  Bell,
  Search,
  Check,
  Trash2,
  CircleAlert,
  CheckCircle2,
} from "lucide-react";
import "./notifications.css";

type NotificationItem = {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "success" | "error";
  isRead: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "TV - Lỗi Bật",
    message: "Lỗi kết nối với TV. Vui lòng kiểm tra kết nối mạng và thử lại.",
    time: "Vừa xong",
    type: "error",
    isRead: true,
  },
  {
    id: 2,
    title: "TV - Đã Tắt",
    message: "Thiết bị đã được tắt thành công",
    time: "Vừa xong",
    type: "success",
    isRead: true,
  },
  {
    id: 3,
    title: "Air Conditioner - Đã Bật",
    message: "Thiết bị đã được bật thành công",
    time: "Vừa xong",
    type: "success",
    isRead: false,
  },
  {
    id: 4,
    title: "Air Conditioner - Lỗi Bật",
    message:
      "Lỗi kết nối với Air Conditioner. Vui lòng kiểm tra kết nối mạng và thử lại.",
    time: "5 phút trước",
    type: "error",
    isRead: false,
  },
  {
    id: 5,
    title: "Air Conditioner - Lỗi Bật",
    message:
      "Lỗi kết nối với Air Conditioner. Vui lòng kiểm tra kết nối mạng và thử lại.",
    time: "5 phút trước",
    type: "error",
    isRead: false,
  },
  {
    id: 6,
    title: "Smart Fan - Lỗi Bật",
    message:
      "Lỗi kết nối với Smart Fan. Vui lòng kiểm tra kết nối mạng và thử lại.",
    time: "5 phút trước",
    type: "error",
    isRead: false,
  },
  {
    id: 7,
    title: "Smart Fan - Đã Tắt",
    message: "Thiết bị đã được tắt thành công",
    time: "1 ngày trước",
    type: "success",
    isRead: false,
  },
];

type FilterType = "all" | "unread";

function NotificationCard({
  item,
  onDelete,
  onMarkRead,
}: {
  item: NotificationItem;
  onDelete: (id: number) => void;
  onMarkRead: (id: number) => void;
}) {
  return (
    <div className={`notification-card ${!item.isRead ? "unread" : ""}`}>
      <div className="notification-left">
        <div className={`notification-icon-box ${item.type}`}>
          {item.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <CircleAlert size={20} />
          )}
        </div>

        <div className="notification-content">
          <h3>
            {item.title}
            {!item.isRead && <span className="notification-dot" />}
          </h3>
          <p>{item.message}</p>
          <span className="notification-time">{item.time}</span>
        </div>
      </div>

      <div className="notification-actions">
        {!item.isRead && (
          <button
            type="button"
            className="notification-check-btn"
            onClick={() => onMarkRead(item.id)}
            title="Đánh dấu đã đọc"
          >
            <Check size={18} />
          </button>
        )}

        <button
          type="button"
          className="notification-delete-btn"
          onClick={() => onDelete(item.id)}
          title="Xóa thông báo"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { themeMode, toggleTheme } = useTheme();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const filteredNotifications = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchFilter =
        activeFilter === "all" ? true : activeFilter === "unread" ? !item.isRead : true;

      const matchSearch =
        keyword === "" ||
        item.title.toLowerCase().includes(keyword) ||
        item.message.toLowerCase().includes(keyword);

      return matchFilter && matchSearch;
    });
  }, [notifications, activeFilter, searchTerm]);

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMarkRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <div
      className={`notifications-page ${themeMode === "dark" ? "dark-mode" : ""}`}
    >
      <aside className="notifications-sidebar">
        <button
          className="notifications-nav-btn"
          type="button"
          onClick={() => navigate("/home")}
        >
          <Home size={18} />
        </button>

        <div className="notifications-sidebar-links">
          <button className="notifications-nav-ghost" type="button">
            <Zap size={18} />
          </button>

          <button
            className="notifications-nav-ghost"
            type="button"
            onClick={() => navigate("/devices")}
          >
            <LayoutGrid size={18} />
          </button>

          <button
            className="notifications-nav-ghost"
            type="button"
            onClick={() => navigate("/timers")}
          >
            <Clock3 size={18} />
          </button>

          <button className="notifications-nav-btn active" type="button">
            <Bell size={18} />
          </button>

          <button className="notifications-nav-ghost" type="button">
            <Settings size={18} />
          </button>
        </div>
      </aside>

      <main className="notifications-main">
        <header className="notifications-topbar">
          <div className="notifications-topbar-left">
            <div className="notifications-avatar" />
            <h2>Welcome to Meomeo’s Home</h2>
          </div>

          <div className="notifications-topbar-right">
            <div className="notifications-search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search any devices here"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <ThemeToggle mode={themeMode} onToggle={toggleTheme} />

            <button className="notifications-bell-btn" type="button">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <section className="notifications-content">
          <div className="notifications-header-row">
            <div>
              <h1>Lịch Sử Thông Báo</h1>
              <p>Bạn có {unreadCount} thông báo chưa đọc</p>
            </div>

            <button
              type="button"
              className="mark-all-btn"
              onClick={handleMarkAllRead}
            >
              <Check size={16} />
              <span>Đánh Dấu Tất Cả Đã Đọc</span>
            </button>
          </div>

          <div className="notification-tabs">
            <button
              type="button"
              className={`notification-tab ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              Tất Cả ({notifications.length})
            </button>

            <button
              type="button"
              className={`notification-tab ${activeFilter === "unread" ? "active" : ""}`}
              onClick={() => setActiveFilter("unread")}
            >
              Chưa Đọc ({unreadCount})
            </button>
          </div>

          <div className="notifications-list">
            {filteredNotifications.map((item) => (
              <NotificationCard
                key={item.id}
                item={item}
                onDelete={handleDelete}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}