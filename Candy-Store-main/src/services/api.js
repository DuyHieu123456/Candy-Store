import axios from "axios";

/**
 * Khởi tạo Instance Axios với cấu hình cơ sở.
 * Sử dụng biến môi trường (Vite) để linh hoạt giữa Development và Production.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000, // Ngắt kết nối sau 10 giây nếu server không phản hồi
});

/**
 * 1. Request Interceptor: Tự động gắn Token bảo mật.
 * Đảm bảo mọi yêu cầu từ Admin hay Khách hàng đều mang theo "chìa khóa" định danh.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("candy_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Gắn Token theo chuẩn JWT
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 2. Response Interceptor: Xử lý dữ liệu và lỗi tập trung.
 * Giúp mã nguồn tại các file Service ngắn gọn hơn bằng cách bóc tách dữ liệu ngay tại đây[cite: 12].
 */
api.interceptors.response.use(
  (response) => {
    // Tự động trả về dữ liệu bên trong, giúp các Service không cần gọi .data quá nhiều lần
    return response; 
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc không hợp lệ
      if (response.status === 401) {
        console.warn("Phiên làm việc hết hạn. Đang yêu cầu đăng nhập lại...");
        localStorage.removeItem("candy_token");
        localStorage.removeItem("user_data");
        // Tự động chuyển hướng về trang Login nếu không ở trang Login
        if (!window.location.pathname.includes("/auth/login")) {
          window.location.href = "/auth/login";
        }
      }

      // Xử lý lỗi 403 (Forbidden) - Không có quyền truy cập vào khu vực Admin
      if (response.status === 403) {
        console.error("Bạn không có quyền truy cập vào khu vực này!");
      }
    } else {
      console.error("Lỗi kết nối: Không thể liên lạc với máy chủ kẹo 🍬❌");
    }

    return Promise.reject(error);
  }
);

export default api;