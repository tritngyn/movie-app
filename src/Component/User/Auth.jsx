import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import "./Auth.scss";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      console.log("User info:", data.user);
      setSuccess("Đăng nhập thành công!");

      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="card">
        <h2 className="title">{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
        <p className="subtitle">
          {isLogin
            ? "Chào mừng trở lại! Đăng nhập để tiếp tục."
            : "Tạo tài khoản mới để bắt đầu khám phá."}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? (
              <span className="loader"></span>
            ) : isLogin ? (
              "Đăng nhập"
            ) : (
              "Đăng ký"
            )}
          </button>
        </form>

        {error && <p className="msg error">{error}</p>}
        {success && <p className="msg success">{success}</p>}

        <p className="auth-toggle">
          {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
          <span className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Đăng ký" : " Đăng nhập"}
          </span>
        </p>
      </div>
    </div>
  );
}
