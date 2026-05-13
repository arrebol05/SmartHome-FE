import { Search, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import AccountMenu from "./AccountMenu";
import { UI } from "@/constants/ui";
import "./app-layout.css";

type AppTopbarProps = {
  showAccountMenu: boolean;
  setShowAccountMenu: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  themeMode: "light" | "dark";
  toggleTheme: () => void;
  title: string;
};

export default function AppTopbar({
  showAccountMenu,
  setShowAccountMenu,
  searchTerm,
  setSearchTerm,
  themeMode,
  toggleTheme,
  title,
}: AppTopbarProps) {
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!showSearch) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [showSearch]);

  return (
    <header ref={headerRef} className="app-topbar">
      <div className="app-topbar-left">
        <h2>{title}</h2>
      </div>

      <div className="app-topbar-right">
        {/* Search box — visible on large screens only */}
        <div className="topbar-search-box topbar-search-desktop">
          <Search size={UI.TOPBAR_ICON_SIZE} />
          <input
            type="text"
            placeholder="Tìm thiết bị theo type/mode/state"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Round search button — visible on small screens only */}
        <button
          type="button"
          className={`topbar-search-toggle-btn ${showSearch ? "active" : ""}`}
          onClick={() => setShowSearch((p) => !p)}
          title="Tìm kiếm"
        >
          <Search size={UI.TOPBAR_ICON_SIZE} />
        </button>

        <button
          type="button"
          className="app-notification-btn"
          onClick={() => navigate("/notifications")}
        >
          <Bell size={UI.TOPBAR_ICON_SIZE} />
        </button>
        <ThemeToggle mode={themeMode} onToggle={toggleTheme} />
        <button
          type="button"
          className="app-avatar"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
        />
        {showAccountMenu && (
          <AccountMenu onClose={() => setShowAccountMenu(false)} themeMode={themeMode} />
        )}
      </div>

      {/* Expanded search — absolutely positioned below, doesn't shift layout */}
      {showSearch && (
        <div className="topbar-search-expanded">
          <div className="topbar-search-box">
            <Search size={UI.TOPBAR_ICON_SIZE} />
            <input
              type="text"
              placeholder="Tìm thiết bị theo type/mode/state"
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}
    </header>
  );
}