import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import orderService from "../../services/orderService"; // Service xử lý API đơn hàng[cite: 7, 11]
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import "./OrderDetailAdmin.css";

/**
 * Trang Chi Tiết Đơn Hàng (Admin)
 * Cho phép quản trị viên xem chi tiết kẹo khách đặt và cập nhật trạng thái vận chuyển.
 */
const OrderDetailAdmin = () => {
  const { id } = useParams(); // Lấy ID đơn hàng từ URL
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // 1. Tải chi tiết đơn hàng dựa trên ID[cite: 7, 11]
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderService.getById(id); // API: GET /api/orders/:id
        if (res.success) {
          setOrder(res.data);
          setNewStatus(res.data.status);
        }
      } catch {
        alert("Không tìm thấy đơn hàng này!");
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // 2. Logic Cập nhật trạng thái đơn hàng[cite: 7, 11]
  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const res = await orderService.updateStatus(id, newStatus); // API: PUT /api/orders/:id/status
      if (res.success) {
        alert("Đã cập nhật trạng thái đơn hàng thành công! 🍭");
        setOrder({ ...order, status: newStatus });
      }
    } catch {
      alert("Lỗi khi cập nhật trạng thái. Vui lòng thử lại.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="admin-loader">📋 Đang kiểm tra chi tiết hóa đơn...</div>;
  if (!order) return <div className="admin-loader">Không tìm thấy dữ liệu đơn hàng.</div>;

  return (
    <div className="order-detail-admin">
      <header className="page-header">
        <Link to="/admin/orders" className="back-btn">← Quay lại danh sách đơn</Link>
        <h1>Chi Tiết Đơn Hàng #{order.order_number}</h1>
      </header>

      <div className="order-admin-grid">
        {/* ── Cột trái: Thông tin khách hàng & Danh sách sản phẩm ── */}
        <div className="order-main-info">
          <section className="info-card">
            <h3>🏠 Thông Tin Giao Hàng</h3>
            <div className="info-content">
              <p><strong>Khách hàng:</strong> {order.recipient_name}</p>
              <p><strong>Số điện thoại:</strong> {order.recipient_phone}</p>
              <p><strong>Địa chỉ:</strong> {order.shipping_address}</p>
              <p><strong>Ghi chú:</strong> {order.note || "Không có ghi chú"}</p>
            </div>
          </section>

          <section className="items-card">
            <h3>🍬 Kẹo Đã Đặt</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name-cell">
                      <img src={item.image_url} alt={item.name} className="item-thumb" />
                      <span>{item.name}</span>
                    </td>
                    <td>{formatPrice(item.price)}</td>
                    <td>x{item.quantity}</td>
                    <td className="item-subtotal">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="order-total-summary">
              <div className="summary-row">
                <span>Tổng tiền hàng:</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>{formatPrice(order.shipping_fee)}</span>
              </div>
              <div className="summary-row grand-total">
                <span>TỔNG CỘNG:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>
        </div>

        {/* ── Cột phải: Quản lý trạng thái & Thanh toán ── */}
        <aside className="order-sidebar-admin">
          <section className="status-card">
            <h3>⚡ Xử Lý Đơn Hàng</h3>
            <div className="current-status">
              Trạng thái hiện tại: 
              <span className={`status-badge status-${order.status}`}>
                {order.status === 'pending' ? 'Chờ xử lý' : 
                 order.status === 'completed' ? 'Thành công' : 'Đã hủy'}
              </span>
            </div>
            
            <div className="status-control">
              <label>Cập nhật trạng thái mới:</label>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
                className="admin-select"
              >
                <option value="pending">⏳ Chờ xử lý</option>
                <option value="completed">✅ Hoàn thành</option>
                <option value="cancelled">❌ Hủy đơn hàng</option>
              </select>
              <Button 
                onClick={handleUpdateStatus} 
                loading={updating}
                width="100%"
                style={{ marginTop: '15px' }}
              >
                Lưu Trạng Thái
              </Button>
            </div>
          </section>

          <section className="payment-card">
            <h3>💳 Thanh Toán</h3>
            <p><strong>Phương thức:</strong> {order.payment_method?.toUpperCase()}</p>
            <p><strong>Tình trạng:</strong> {order.status === 'completed' ? 'Đã thu tiền' : 'Chưa hoàn tất'}</p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;