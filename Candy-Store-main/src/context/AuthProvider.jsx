import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext"; 
import api from "../services/api"; // Sử dụng instance api đã cấu hình Interceptor[cite: 12]

/**
 * AuthProvider - "Trái tim" bảo mật của ứng dụng.
 * Quản lý trạng thái người dùng, quyền hạn (Admin/User) và phiên làm việc.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * 1. Hàm đăng xuất: Xóa sạch dấu vết phiên làm việc.
   * Sử dụng window.location.href để reset hoàn toàn bộ nhớ ứng dụng.
   */
  const logout = useCallback(() => {
    localStorage.removeItem("candy_token");
    localStorage.removeItem("user_data");
    setUser(null);
    // Chỉ chuyển hướng nếu không phải đang ở trang đăng nhập
    if (!window.location.pathname.includes("/auth/login")) {
      window.location.href = "/auth/login"; 
    }
  }, []);

  /**
   * 2. Kiểm tra xác thực: Xác minh Token với Backend SQL Server.
   * Chạy ngay khi ứng dụng khởi động để duy trì trạng thái đăng nhập.
   */
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("candy_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Gọi API lấy thông tin cá nhân để xác nhận Token còn hiệu lực[cite: 14]
      const res = await api.get("/auth/profile");
      if (res.data.success) {
        setUser(res.data.data); // Cập nhật thông tin User (bao gồm Role)
      } else {
        logout();
      }
    } catch (error) {
      console.error("Xác thực thất bại:", error);
      logout(); // Tự động đăng xuất nếu Token lỗi hoặc hết hạn
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * 3. Hàm đăng nhập: Tiếp nhận thông tin và lưu trữ Token.
   * Trả về kết quả để trang Login có thể hiển thị thông báo lỗi nếu cần[cite: 14].
   */
  const login = async (credentials) => {
    try {
      const res = await api.post("/auth/login", credentials);
      if (res.data.success) {
        const { token, user: userData } = res.data.data;
        localStorage.setItem("candy_token", token);
        setUser(userData);
      }
      return res.data;
    } catch (error) {
      // Trả về cấu trúc lỗi thống nhất để UI xử lý
      return { 
        success: false, 
        message: error.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!" 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      // Kiểm tra quyền Admin dựa trên thuộc tính role từ Database[cite: 14]
      isAdmin: user?.role === 'admin' || user?.Role === 'admin',
      login, 
      logout,
      loading 
    }}>
      {/* Chỉ hiển thị ứng dụng khi đã kiểm tra xong trạng thái đăng nhập */}
      {!loading && children}
    </AuthContext.Provider>
  );
};