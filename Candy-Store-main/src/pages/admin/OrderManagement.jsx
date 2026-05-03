import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService"; // Service lấy dữ liệu đơn hàng toàn hệ thống
import { formatPrice } from "../../utils/formatPrice";
import "./OrderManagement.css";

/**
 * Trang Quản lý Đơn hàng (Admin)
 * Hiển thị danh sách tất cả đơn hàng từ mọi khách hàng để xử lý và cập nhật trạng thái.
 */
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      // API dành riêng cho admin để lấy toàn bộ đơn hàng
      const res = await orderService.getAllOrders(); 
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logic lọc đơn hàng theo trạng thái để Admin dễ quản lý
  const filteredOrders = statusFilter === "all" 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading) return <div className="admin-loader">📦 Đang đồng bộ đơn hàng...</div>;

  return (
    <div className="order-management">
      <header className="page-header">
        <div className="header-left">
          <h1>Quản Lý Đơn Hàng</h1>
          <p>Bạn có <strong>{orders.length}</strong> đơn hàng cần theo dõi</p>
        </div>
      </header>

      {/* Bộ lọc trạng thái đơn hàng */}
      <div className="table-toolbar">
        <div className="filter-group">
          <label>Trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="all">Tất cả đơn hàng</option>
            <option value="pending">⏳ Chờ xử lý</option>
            <option value="completed">✅ Đã hoàn thành</option>
            <option value="cancelled">❌ Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Khách Hàng</th>
              <th>Ngày Đặt</th>
              <th>Tổng Tiền</th>
              <th>Thanh Toán</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">#{order.order_number}</td>
                  <td>
                    <div className="customer-info">
                      <span className="customer-name">{order.recipient_name}</span>
                      <span className="customer-phone">{order.recipient_phone}</span>
                    </div>
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString('vi-VN')}</td>
                  <td className="price-cell">{formatPrice(order.total)}</td>
                  <td>
                    <span className="payment-tag">
                      {order.payment_method?.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status === 'pending' ? 'Chờ xử lý' : 
                       order.status === 'completed' ? 'Thành công' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/orders/${order.id}`} className="btn-view-detail">
                      Xem chi tiết 🔍
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-row">Chưa có đơn hàng nào trong danh mục này 🏜️</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;