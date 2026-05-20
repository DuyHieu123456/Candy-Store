// src/pages/Auth/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";
import Button from "../../components/Button/Button";

const Register = () => {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    setLoading(true);
    try {
      const res = await authService.register(form.name, form.email, form.password);
      login(res.user, res.token);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <span className="auth-card__logo">🍭</span>
          <h1 className="auth-card__title">Đăng Ký</h1>
          <p className="auth-card__sub">Tạo tài khoản để mua sắm dễ dàng hơn!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p className="auth-form__error">⚠️ {error}</p>}

          <div className="auth-form__field">
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Nguyễn Văn A"
            />
          </div>

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
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="confirm">Xác nhận mật khẩu</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              value={form.confirm}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
            />
          </div>

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng Ký"}
          </Button>
        </form>

        <p className="auth-card__footer">
          Đã có tài khoản?{" "}
          <Link to="/auth/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
