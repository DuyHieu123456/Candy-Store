import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../../services/authService";
import Button from "../../components/Button/Button";
import "./Auth.css"; // Đảm bảo sử dụng chung file định dạng với Login[cite: 21, 23]

/**
 * Trang Đăng Ký (Register)
 * Xử lý tạo tài khoản mới và kiểm tra tính hợp lệ của thông tin.
 */
const Register = () => {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "", // Bổ sung trường xác nhận mật khẩu[cite: 20]
    phone: "" 
  });
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Cuộn lên đầu trang khi hiển thị form
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * Cập nhật dữ liệu form và xóa lỗi cũ khi người dùng nhập lại
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(""); 
  };

  /**
   * Kiểm tra tính hợp lệ trước khi gửi yêu cầu[cite: 20, 23]
   */
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp! 🍬");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    return true;
  };

  /**
   * Xử lý gửi yêu cầu đăng ký tài khoản[cite: 20]
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      // Gọi service đăng ký tài khoản[cite: 20]
      const res = await authService.register(formData);
      if (res.success) {
        alert("Chào mừng bạn đến với thế giới kẹo! Hãy đăng nhập nhé. 🍭");
        navigate("/auth/login");
      } else {
        setError(res.message || "Đăng ký không thành công. Hãy kiểm tra lại thông tin!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Hệ thống đang bận. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Tham Gia Thế Giới Kẹo! 🍭</h2>
          <p>Tạo tài khoản để nhận ưu đãi và quản lý kẹo yêu thích của bạn</p>
        </div>

        {/* Hiển thị lỗi nếu có[cite: 21, 23] */}
        {error && <div className="auth-error" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Họ và tên[cite: 20, 21] */}
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input 
              id="name"
              name="name"
              type="text" 
              required 
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Nguyễn Văn Kẹo"
            />
          </div>

          {/* Email[cite: 20, 21] */}
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

          {/* Số điện thoại[cite: 20] */}
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input 
              id="phone"
              name="phone"
              type="tel" 
              required 
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="09xx xxx xxx"
            />
          </div>

          {/* Mật khẩu[cite: 20, 21] */}
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input 
              id="password"
              name="password"
              type="password" 
              required 
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Tối thiểu 6 ký tự"
              autoComplete="new-password"
            />
          </div>

          {/* Xác nhận mật khẩu[cite: 20] */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
            <input 
              id="confirmPassword"
              name="confirmPassword"
              type="password" 
              required 
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" width="100%" loading={isLoading}>
            Tham Gia Ngay
          </Button>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link to="/auth/login">Đăng nhập tại đây</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;