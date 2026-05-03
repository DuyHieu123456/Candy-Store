import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService"; // Service kết nối API quản lý đơn hàng
import { formatPrice } from "../../utils/formatPrice"; // Tiện ích định dạng tiền tệ
import Button from "../../components/Button/Button";
import "./Orders.css"; // Tích hợp bộ nhận diện thương hiệu Candy Store[cite: 74]

/**
 * Orders Component - Trang Lịch sử mua kẹo.
 * Cho phép người dùng theo dõi tiến độ giao hàng và hủy đơn khi cần thiết[cite: 70, 73].
 */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 1. Khởi tạo dữ liệu: Lấy danh sách đơn hàng của người dùng hiện tại[cite: 70, 73].
   */
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      // Gọi API GET /api/orders/my-orders thông qua orderService[cite: 70, 73]
      const response = await orderService.getMyOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error("Lỗi Store: Không thể tải lịch sử mua kẹo", err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 2. Xử lý hủy đơn hàng (Business Logic).
   * Ràng buộc: Chỉ cho phép hủy khi đơn ở trạng thái 'pending'.
   */
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Bạn muốn hủy túi kẹo này? Thao tác này không thể hoàn tác. 🍬");
    if (!confirmCancel) return;

    try {
      const response = await orderService.cancelOrder(orderId); // API: PUT /api/orders/:id/cancel[cite: 70]
      if (response.success) {
        alert("Đã hủy đơn hàng thành công!");
        fetchOrders(); // Tải lại danh sách để cập nhật trạng thái mới nhất[cite: 70]
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Hệ thống không thể hủy đơn lúc này.";
      alert(errorMsg);
    }
  };

  /**
   * 3. Bản đồ trạng thái (Status Mapping).
   * Ánh xạ mã trạng thái từ SQL Server sang nhãn hiển thị và CSS class.
   */
  const statusMap = {
    pending: { label: "⏳ Chờ xử lý", class: "status--pending" },
    confirmed: { label: "✅ Đã xác nhận", class: "status--confirmed" },
    shipping: { label: "🚚 Đang giao hàng", class: "status--shipping" },
    delivered: { label: "📦 Đã giao kẹo", class: "status--delivered" },
    cancelled: { label: "❌ Đã hủy", class: "status--cancelled" },
  };

  // Giao diện khi đang kết nối máy chủ[cite: 74]
  if (isLoading) {
    return (
      <div className="orders-page container">
        <div className="orders-loader">🍭 Đang kiểm kê kho kẹo của bạn...</div>
      </div>
    );
  }

  return (
    <main className="orders-page container">
      <header className="orders-header">
        <h1>LỊCH SỬ MUA KẸO</h1>
        <p>Kiểm tra trạng thái những phần quà ngọt ngào bạn đã đặt[cite: 70]</p>
      </header>

      {/* 4. Xử lý trường hợp không có dữ liệu đơn hàng[cite: 70, 73, 74] */}
      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">🏜️</div>
          <h3>Giỏ kẹo của bạn đang trống!</h3>
          <p>Đừng để niềm vui chờ đợi, hãy khám phá kẹo mới ngay.</p>
          <Link to="/products">
            <Button variant="primary">ĐI MUA KẸO NGAY</Button>
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const statusInfo = statusMap[order.status] || { label: order.status, class: "" };
            
            return (
              <div key={order.id} className="order-card">
                {/* Header thẻ: Thông tin định danh và trạng thái */}
                <div className="order-card__header">
                  <div className="order-info">
                    <span className="order-id">Mã đơn: #{order.order_number}</span>
                    <span className="order-date">
                      Ngày đặt: {new Date(order.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <span className={`order-status ${statusInfo.class}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Body thẻ: Tóm tắt chi phí và thanh toán[cite: 70, 74] */}
                <div className="order-card__body">
                  <div className="order-total">
                    <span className="total-label">Tổng thanh toán:</span>
                    <span className="total-value">{formatPrice(order.total)}</span>
                  </div>
                  <div className="order-payment">
                    PTTT: <strong>{order.payment_method?.toUpperCase()}</strong>
                  </div>
                </div>

                {/* Footer thẻ: Các nút tương tác[cite: 70, 73, 74] */}
                <div className="order-card__actions">
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="outline" size="sm">Xem Chi Tiết</Button>
                  </Link>
                  
                  {/* Logic ràng buộc: Chỉ hiển thị nút hủy đơn cho trạng thái chờ xử lý[cite: 70, 74] */}
                  {order.status === "pending" && (
                    <button 
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Hủy đơn hàng
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Orders;