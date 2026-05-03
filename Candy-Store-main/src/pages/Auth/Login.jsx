import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Hook quản lý trạng thái đăng nhập hệ thống
import Button from "../../components/Button/Button";
import "./Auth.css"; // Sử dụng các định nghĩa kiểu dáng chung cho Auth[cite: 26]

/**
 * Trang Đăng Nhập (Login)
 * Xử lý xác thực người dùng và điều hướng thông minh sau khi đăng nhập thành công.
 */
const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login } = useAuth(); // Lấy hàm login từ AuthContext
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy đường dẫn gốc khách hàng muốn truy cập (ví dụ: /checkout) hoặc mặc định về trang chủ[cite: 24]
  const from = location.state?.from?.pathname || "/";

  // Cuộn lên đầu trang khi hiển thị form
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * Xử lý cập nhật State khi nhập liệu
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); // Xóa lỗi ngay khi người dùng bắt đầu sửa lại[cite: 24]
  };

  /**
   * Xử lý gửi yêu cầu đăng nhập[cite: 24]
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Gọi qua Context để cập nhật trạng thái User toàn ứng dụng[cite: 24]
      const res = await login({ ...formData, rememberMe }); 
      
      if (res.success) {
        // Quay lại trang trước đó khách đang xem[cite: 24]
        navigate(from, { replace: true }); 
      } else {
        setError(res.message || "Email hoặc mật khẩu không chính xác! 🍬");
      }
    } catch  {
      setError("Hệ thống kẹo đang gặp sự cố. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Chào mừng trở lại! 🍬</h2>
          <p>Đăng nhập để tiếp tục hành trình ngọt ngào của bạn</p>
        </div>

        {/* Thông báo lỗi tập trung */}
        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Trường Email[cite: 24, 26] */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          {/* Trường Mật khẩu[cite: 24, 26] */}
          <div className="form-group">
            <div className="label-row" style={{ display: "flex", justifyContent: "space-between" }}>
              <label htmlFor="password">Mật khẩu</label>
              <Link to="/auth/forgot-password" style={{ fontSize: "0.8rem", color: "var(--color-primary)" }}>
                Quên mật khẩu?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          {/* Tiện ích bổ sung */}
          <div className="form-options" style={{ display: "flex", alignItems: "center", marginBottom: "20px", textAlign: "left" }}>
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe} 
              onChange={() => setRememberMe(!rememberMe)} 
              style={{ width: "auto", marginRight: "8px" }}
            />
            <label htmlFor="remember" style={{ fontSize: "0.85rem", fontWeight: "normal", cursor: "pointer" }}>
              Ghi nhớ đăng nhập
            </label>
          </div>

          <Button type="submit" width="100%" loading={isLoading}>
            Đăng Nhập
          </Button>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay 🍭</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;