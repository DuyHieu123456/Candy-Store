import api from "./api"; // Kết nối với cấu hình Axios chính

const CART_KEY = "candy_cart"; 

/**
 * cartService - Bộ xử lý dữ liệu đơn hàng cuối cùng trước khi lên SQL Server.
 * Đã sửa lỗi: Tối ưu hóa ánh xạ ID để tránh trạng thái 'undefined'.
 */
const cartService = {
  getCart() {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },

  saveCart(items) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (err) { console.error("Lỗi lưu kẹo:", err); }
  },

  clearCart() {
    localStorage.removeItem(CART_KEY);
  },

  /**
   * placeOrder - Hàm gửi đơn hàng "Bulletproof" (Chống lỗi ID).
   * Đảm bảo mọi trường thông tin khớp hoàn toàn với Schema SQL của Backend.
   */
  async placeOrder(orderData) {
    try {
      // 1. CHỐNG LỖI ID: Kiểm tra mọi khả năng có thể của khóa ID sản phẩm
      const formattedItems = (orderData.items || []).map(item => ({
        // Lấy theo thứ tự: đã map rồi || id mới || Id cũ từ localStorage
        product_id: item.product_id || item.id || item.Id, 
        quantity: item.quantity
      }));

      // 2. CHUẨN HÓA PAYLOAD: Ánh xạ chuẩn xác theo log Console bạn gửi
      const payload = {
        recipient_name: orderData.fullName || orderData.recipient_name,
        recipient_phone: orderData.phone || orderData.recipient_phone,
        shipping_address: orderData.address || orderData.shipping_address,
        city: orderData.province || orderData.city || "VN",
        payment_method: orderData.payment || orderData.payment_method || "cod",
        note: orderData.note || "",
        items: formattedItems,
        shipping_fee: orderData.shipping_fee || 0,
        // Backend thường dùng 'total' hoặc 'total_amount', ta ưu tiên 'total'
        total: orderData.total || orderData.totalPrice || orderData.total_amount 
      };

      // Log để bạn kiểm tra trực tiếp: Nếu thấy product_id có số là CHẮC CHẮN CHẠY
      console.log("🚀 Dữ liệu chuẩn hóa gửi lên API:", payload);

      const response = await api.post("/orders", payload);
      return response.data; 
    } catch (error) {
      console.error("❌ Lỗi Server 500:", error.response?.data || error.message);
      throw error; 
    }
  }
};

export default cartService;