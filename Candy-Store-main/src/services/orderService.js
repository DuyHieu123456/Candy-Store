import api from "./api"; // Import instance axios đã cấu hình Interceptor

/**
 * orderService - Quản lý toàn bộ luồng dữ liệu của hóa đơn kẹo.
 * Hỗ trợ đồng thời Khách hàng theo dõi đơn cá nhân và Admin điều hành toàn bộ hệ thống.
 */
const orderService = {
    // 1. Dành cho Khách hàng: Lấy danh sách lịch sử mua kẹo cá nhân
    getMyOrders: async function() {
        try {
            const response = await api.get("/orders/my-orders");
            return response.data; // Trả về { success: true, data: [...] }
        } catch (error) {
            console.error("Lỗi lấy lịch sử đơn hàng cá nhân:", error);
            throw error;
        }
    },

    /**
     * 2. Dành cho Admin: Lấy toàn bộ đơn hàng trong hệ thống.
     * Khớp logic hiển thị tại trang AdminDashboard và OrderManagement.
     */
    getAllOrders: async function() {
        try {
            const response = await api.get("/admin/orders");
            return response.data; // Dữ liệu trả về mảng đơn hàng của mọi khách hàng
        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng toàn hệ thống:", error);
            throw error;
        }
    },

    /**
     * 3. Lấy chi tiết một hóa đơn cụ thể (Dùng chung cho cả Khách và Admin).
     * Được đổi tên từ getOrderById thành getById để thống nhất với productService.
     */
    getById: async function(id) {
        try {
            const response = await api.get(`/orders/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi lấy chi tiết hóa đơn:", error);
            throw error;
        }
    },

    /**
     * 4. Dành cho Admin: Cập nhật trạng thái đơn hàng (Pending -> Completed -> Cancelled).
     * Khớp với bộ điều khiển trạng thái tại trang OrderDetailAdmin.
     */
    updateStatus: async function(id, status) {
        try {
            const response = await api.put(`/admin/orders/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái vận chuyển:", error);
            throw error;
        }
    }
};

// Xuất bản mặc định để giải quyết lỗi import tại các trang quản trị
export default orderService;