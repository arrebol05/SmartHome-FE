import { useState } from "react";
import "./signup.css";

const IconUser = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconEmail = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
);

const IconLock = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);

const IconCheck = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const IconEye = ({ off }) => off ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const IconSuccess = () => (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

export default function SignupPage() {
    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [errors, setErrors] = useState({});
    const [showPw, setShowPw] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const validate = () => {
        const e = {};
        if (!form.username || form.username.length < 3) e.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
        if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email không hợp lệ";
        if (!form.password || form.password.length < 6) e.password = "Mật khẩu phải có ít nhất 6 ký tự";
        if (form.confirm !== form.password) e.confirm = "Mật khẩu xác nhận không khớp";
        if (!agreeTerms) e.terms = "Vui lòng đồng ý với Điều khoản dịch vụ";
        return e;
    };

    const handleChange = (field) => (e) => {
        setForm(f => ({ ...f, [field]: e.target.value }));
        if (errors[field]) setErrors(er => ({ ...er, [field]: "" }));
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setLoading(true);
        await new Promise(r => setTimeout(r, 1800));
        setLoading(false);
        setSuccess(true);
    };

    return (
        <div className="signup-root">
            <div className="signup-blob blob-1" />
            <div className="signup-blob blob-2" />
            <div className="signup-blob blob-3" />

            <div className="signup-card">
                {success && (
                    <div className="success-overlay">
                        <div className="success-icon"><IconSuccess /></div>
                        <div className="success-title">Đăng ký thành công!</div>
                        <div className="success-sub">Tài khoản của bạn đã được tạo. Hãy đăng nhập để bắt đầu.</div>
                    </div>
                )}

                <div className="signup-header">
                    <h1 className="signup-title">Đăng ký tài khoản</h1>
                    <p className="signup-subtitle">Tạo tài khoản mới để bắt đầu</p>
                </div>

                {/* Username */}
                <div className="field-group">
                    <label className="field-label">
                        Tên đăng nhập<span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="input-icon"><IconUser /></span>
                        <input
                            className={`field-input ${errors.username ? "error" : form.username.length >= 3 ? "success" : ""}`}
                            type="text"
                            placeholder="Nhập tên đăng nhập (tối thiểu 3 ký tự)"
                            value={form.username}
                            onChange={handleChange("username")}
                        />
                    </div>
                    {errors.username && <div className="error-msg">⚠ {errors.username}</div>}
                </div>

                {/* Email */}
                <div className="field-group">
                    <label className="field-label">
                        Email<span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="input-icon"><IconEmail /></span>
                        <input
                            className={`field-input ${errors.email ? "error" : form.email && !errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "success" : ""}`}
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            value={form.email}
                            onChange={handleChange("email")}
                        />
                    </div>
                    {errors.email && <div className="error-msg">⚠ {errors.email}</div>}
                </div>

                {/* Password */}
                <div className="field-group">
                    <label className="field-label">
                        Mật khẩu<span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="input-icon"><IconLock /></span>
                        <input
                            className={`field-input ${errors.password ? "error" : form.password.length >= 6 ? "success" : ""}`}
                            type={showPw ? "text" : "password"}
                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                            value={form.password}
                            onChange={handleChange("password")}
                        />
                        <button className="toggle-pw" onClick={() => setShowPw(v => !v)} type="button">
                            <IconEye off={showPw} />
                        </button>
                    </div>
                    {errors.password && <div className="error-msg">⚠ {errors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="field-group">
                    <label className="field-label">
                        Xác nhận mật khẩu<span className="required-star">*</span>
                    </label>
                    <div className="input-wrapper">
                        <span className="input-icon"><IconCheck /></span>
                        <input
                            className={`field-input ${errors.confirm ? "error" : form.confirm && form.confirm === form.password ? "success" : ""}`}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu"
                            value={form.confirm}
                            onChange={handleChange("confirm")}
                        />
                        <button className="toggle-pw" onClick={() => setShowConfirm(v => !v)} type="button">
                            <IconEye off={showConfirm} />
                        </button>
                    </div>
                    {errors.confirm && <div className="error-msg">⚠ {errors.confirm}</div>}
                </div>

                <div className="terms-row">
                    <label className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(e) => setAgreeTerms(e.target.checked)}
                            disabled={loading}
                            className="terms-checkbox"
                        />
                        <span className="checkbox-label">
                            Tôi đồng ý với{" "}
                            <a href="#" className="terms-link">Điều khoản dịch vụ</a>
                            {" "}và{" "}
                            <a href="#" className="terms-link">Chính sách bảo mật</a>
                        </span>
                    </label>
                    {errors.terms && <div className="error-msg" style={{ marginTop: "8px" }}>⚠ {errors.terms}</div>}
                </div>

                <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                    {loading && <span className="btn-spinner" />}
                    {loading ? "Đang xử lý..." : "Đăng ký"}
                </button>

                <div className="login-row">
                    Đã có tài khoản?{" "}
                    <a href="/login" className="login-link">Đăng nhập ngay</a>
                </div>
            </div>
        </div>
    );
}