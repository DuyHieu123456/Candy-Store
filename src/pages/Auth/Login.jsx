// src/pages/Auth/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import Button from "../../components/Button/Button";

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/";

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.login(form.email, form.password);
      login(res.user, res.token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__logo">🍭</span>
          <h1 className="auth-card__title">Đăng Nhập</h1>
          <p className="auth-card__sub">Chào mừng bạn trở lại!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="auth-form__error">⚠️ {error}</p>}

          <div className="auth-form__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
          </Button>
        </form>

        <p className="auth-card__footer">
          Chưa có tài khoản?{" "}
          <Link to="/auth/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
