import { Search } from "lucide-react";
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
  return (
    <header className="app-topbar">
      <div className="app-topbar-left">
        <h2>{title}</h2>
      </div>

      <div className="app-topbar-right">
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
        <button
          type="button"
          className="app-avatar"
          onClick={() => setShowAccountMenu(!showAccountMenu)}
        />
        {showAccountMenu && (
          <AccountMenu onClose={() => setShowAccountMenu(false)} themeMode={themeMode} />
        )}
      </div>
    </header>
  );
}