import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Kết nối API hệ thống[cite: 24]
import Button from "../../components/Button/Button";
import "./Auth.css"; // Đồng bộ giao diện với hệ thống Auth[cite: 23, 25]

/**
 * Trang Quên mật khẩu (Forgot Password)
 * Xử lý quy trình cấp lại mật khẩu qua 2 giai đoạn: Nhận mã và Đặt lại[cite: 24].
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập mã & mật khẩu mới[cite: 24]
  const [formData, setFormData] = useState({ token: "", newPassword: "", confirmPassword: "" });
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Cuộn lên đầu trang khi vào giao diện
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * Bước 1: Gửi yêu cầu lấy mã xác nhận qua Email[cite: 24]
   */
  const handleRequestToken = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await api.post("/auth/forgot-password", { email });
      if (res.data.success) {
        // Hiển thị thông báo thành công và chuyển bước[cite: 24]
        setMessage(res.data.message + " 🍭");
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Không tìm thấy email này trong hệ thống.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Bước 2: Xác nhận mã và cập nhật mật khẩu mới[cite: 24]
   */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Kiểm tra khớp mật khẩu trước khi gửi
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/reset-password", { email, ...formData });
      if (res.data.success) {
        alert("Chúc mừng! Mật khẩu của bạn đã được cập nhật. 🍬");
        navigate("/auth/login"); // Điều hướng về trang đăng nhập
      }
    } catch (err) {
      setError(err.response?.data?.message || "Mã xác nhận không đúng hoặc đã hết hạn.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cập nhật dữ liệu form bước 2
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  return (
    <main className="auth-container container">
      <div className="auth-card">
        <header className="auth-header">
          <h2>{step === 1 ? "Quên mật khẩu? 🔒" : "Đặt lại mật khẩu 🍬"}</h2>
          <p>
            {step === 1 
              ? "Đừng lo, chúng tôi sẽ giúp bạn lấy lại mật khẩu nhanh chóng." 
              : "Vui lòng nhập mã xác nhận và mật khẩu mới của bạn."}
          </p>
        </header>

        {/* Thông báo lỗi và thành công tập trung */}
        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success-box" style={{ color: '#27ae60', background: '#eafaf1', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleRequestToken} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email tài khoản</label>
              <input 
                id="email"
                type="email" 
                placeholder="Nhập email của bạn..." 
                required 
                value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }} 
              />
            </div>
            <Button type="submit" width="100%" loading={isLoading}>Gửi yêu cầu</Button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} noValidate>
            <div className="form-group">
              <label htmlFor="token">Mã xác nhận</label>
              <input 
                id="token"
                name="token"
                type="text" 
                placeholder="Nhập mã bạn nhận được" 
                required 
                value={formData.token}
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input 
                id="newPassword"
                name="newPassword"
                type="password" 
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)" 
                required 
                value={formData.newPassword}
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input 
                id="confirmPassword"
                name="confirmPassword"
                type="password" 
                placeholder="Nhập lại mật khẩu mới" 
                required 
                value={formData.confirmPassword}
                onChange={handleInputChange} 
              />
            </div>
            <Button type="submit" width="100%" loading={isLoading}>Cập nhật mật khẩu</Button>
          </form>
        )}

        <footer className="auth-footer">
          <Link to="/auth/login" className="back-link">← Quay lại Đăng nhập</Link>
        </footer>
      </div>
    </main>
  );
};

export default ForgotPassword;