import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import "./Auth.scss";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        setError("Vui lòng nhập họ tên");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        //  Đăng nhập
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        setSuccess("Đăng nhập thành công!");
      } else {
        //  Đăng ký
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
            },
          },
        });

        if (error) throw error;
        setSuccess("Đăng ký thành công! Vui lòng xác nhận email của bạn.");
      }

      setTimeout(() => {
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
        });
        setSuccess("");
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    });
  };

  return (
    <div className="auth-container">
      {/* Background decorative elements */}
      <div className="background-decoration">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="icon-wrapper">
            <Lock className="icon" />
          </div>
          <h2 className="title">
            {isLogin ? "Chào mừng trở lại" : "Tạo tài khoản"}
          </h2>
          <p className="subtitle">
            {isLogin
              ? "Đăng nhập để tiếp tục hành trình của bạn"
              : "Bắt đầu hành trình của bạn ngay hôm nay"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name - Only for Register */}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Nhập họ và tên"
                  className="form-input"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <div className="input-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                className="form-input"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-input password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? (
                  <EyeOff className="toggle-icon" />
                ) : (
                  <Eye className="toggle-icon" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password*/}
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Xác nhận mật khẩu</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="form-input password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="toggle-icon" />
                  ) : (
                    <Eye className="toggle-icon" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="message error-message">
              <AlertCircle className="message-icon" />
              <p className="message-text">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="message success-message">
              <CheckCircle className="message-icon" />
              <p className="message-text">{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <div className="loading-wrapper">
                <div className="spinner"></div>
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <span>{isLogin ? "Đăng nhập" : "Đăng ký"}</span>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="auth-toggle">
          <p className="toggle-text">
            {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
            <button onClick={toggleMode} className="toggle-button">
              {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
