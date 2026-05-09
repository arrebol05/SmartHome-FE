import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { authApi } from "../services/api";
import "./login.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập tên đăng nhập và mật khẩu");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authApi.login({ username, password });
      if (response.data.statusCode === 200 && response.data.data) {
        // Save tokens
        localStorage.setItem("smartHome_accessToken", response.data.data.accessToken);
        localStorage.setItem("smartHome_refreshToken", response.data.data.refreshToken);
        localStorage.setItem("smartHome_tokenExpiresAt", response.data.data.expiresAt);

        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        setError(response.data.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi kết nối đến server";
      setError(errorMsg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="smart-login-page">
      <div className="smart-login-card">
        <div className="smart-login-header">
          <h1>Đăng nhập tài khoản</h1>
          <p>Chào mừng bạn quay trở lại!</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="smart-error-message" style={{
              padding: "10px",
              marginBottom: "16px",
              backgroundColor: "#fee",
              color: "#c33",
              borderRadius: "6px",
              fontSize: "14px"
            }}>
              {error}
            </div>
          )}

          <div className="smart-field">
            <label>Tên đăng nhập</label>
            <div className="smart-input-row">
              <User size={18} className="icon-left" />
              <input
                type="text"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="smart-field">
            <label>Mật khẩu</label>
            <div className="smart-input-row">
              <Lock size={18} className="icon-left" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                className="icon-right"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="smart-login-options">
            <label className="remember-box">
              <input type="checkbox" disabled={loading} />
              <span>Ghi nhớ đăng nhập</span>
            </label>

            <a href="/">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            className="smart-login-btn"
            disabled={loading}
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}