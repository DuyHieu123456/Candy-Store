import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import orderService from "../../services/orderService"; // Service kết nối API
import { formatPrice } from "../../utils/formatPrice"; // Tiện ích định dạng tiền[cite: 74]
import "./OrderHistory.css"; // Tích hợp CSS đồng bộ cho toàn bộ hệ thống Order

/**
 * OrderDetail - Trang hiển thị chi tiết một đơn hàng kẹo.
 * Kết nối dữ liệu từ Backend và hiển thị bảng sản phẩm kèm thông tin giao nhận.
 */
const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ảnh dự phòng khi sản phẩm kẹo không có ảnh minh họa[cite: 74]
  const CANDY_FALLBACK = "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=100&h=100&auto=format&fit=crop";

  // Bản đồ trạng thái đồng bộ với trang danh sách đơn hàng[cite: 73]
  const statusMap = {
    pending: { label: "⏳ Chờ xử lý", class: "status--pending" },
    confirmed: { label: "✅ Đã xác nhận", class: "status--confirmed" },
    shipping: { label: "🚚 Đang giao hàng", class: "status--shipping" },
    delivered: { label: "📦 Đã giao kẹo", class: "status--delivered" },
    cancelled: { label: "❌ Đã hủy", class: "status--cancelled" },
  };

  /**
   * Khởi tạo: Lấy chi tiết đơn hàng từ SQL Server qua ID[cite: 74].
   */
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.data);
        }
      } catch (err) {
        console.error("Lỗi Store: Không thể tải chi tiết đơn kẹo", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  // 1. Trạng thái đang tải dữ liệu[cite: 74, 77]
  if (loading) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="orders-loader">🍭 Đang mở xem túi kẹo của bạn...</div>
      </div>
    );
  }

  // 2. Trạng thái không tìm thấy đơn hàng[cite: 74]
  if (!order) {
    return (
      <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>
        <h2 style={{ fontWeight: 900 }}>😕 KHÔNG TÌM THẤY ĐƠN HÀNG!</h2>
        <p style={{ margin: "16px 0 24px", color: "var(--color-text-muted)" }}>
          Đơn hàng có thể không tồn tại hoặc bạn không có quyền xem.
        </p>
        <Link to="/orders" className="btn-detail">Quay lại lịch sử</Link>
      </div>
    );
  }

  const statusInfo = statusMap[order.status] || { label: order.status, class: "" };

  return (
    <div className="order-detail container">
      {/* Nút quay lại lịch sử mua hàng[cite: 74, 75] */}
      <Link to="/orders" className="back-link">← Quay lại lịch sử mua kẹo</Link>
      
      <header className="order-detail__header" style={{ marginTop: "24px", marginBottom: "32px" }}>
        <h1 style={{ marginBottom: "8px" }}>
          Đơn hàng: <span style={{ color: "var(--color-primary)" }}>#{order.order_number}</span>
        </h1>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <span className="order-date">
            Ngày đặt: {new Date(order.created_at).toLocaleString('vi-VN')}
          </span>
          <span className={`order-status ${statusInfo.class}`}>
            {statusInfo.label}
          </span>
        </div>
      </header>
      
      {/* Bố cục chính: Danh sách kẹo và Sidebar thông tin[cite: 74, 75] */}
      <div className="order-layout">
        
        {/* Cột trái: Bảng danh sách các loại kẹo đã mua[cite: 74, 75] */}
        <div className="order-items-section">
          <h3 style={{ marginBottom: "16px", fontSize: "1.1rem", fontWeight: 800 }}>🍬 DANH SÁCH KẸO ĐÃ ĐẶT</h3>
          <div className="items-table-wrapper">
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th style={{ textAlign: "center" }}>Số lượng</th>
                  <th style={{ textAlign: "right" }}>Đơn giá</th>
                  <th style={{ textAlign: "right" }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <img 
                        src={item.product_img || CANDY_FALLBACK} 
                        alt={item.product_name}
                        className="order-item-img"
                        style={{ width: "55px", height: "55px", borderRadius: "10px", objectFit: "cover" }}
                      />
                      <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{item.product_name}</span>
                    </td>
                    <td style={{ textAlign: "center" }}>x{item.quantity}</td>
                    <td style={{ textAlign: "right" }}>{formatPrice(item.unit_price)}</td>
                    <td style={{ textAlign: "right", fontWeight: 800, color: "var(--color-primary)" }}>
                      {formatPrice(item.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Thông tin nhận hàng và Tóm tắt tài chính[cite: 74, 75] */}
        <aside className="order-sidebar">
          <div className="order-meta-box">
            <h3 style={{ marginBottom: "20px", fontSize: "1rem", fontWeight: 900, borderBottom: "2px solid var(--color-border)", paddingBottom: "10px" }}>
              📦 THÔNG TIN GIAO NHẬN
            </h3>
            
            <div className="order-meta-content" style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.88rem" }}>
              <p><strong>Người nhận:</strong> {order.recipient_name}</p>
              <p><strong>Điện thoại:</strong> {order.recipient_phone}</p>
              <p><strong>Địa chỉ:</strong> {order.shipping_address}, {order.city}</p>
              <p><strong>Thanh toán:</strong> {order.payment_method?.toUpperCase()}</p>
              
              <div style={{ marginTop: "12px", paddingTop: "16px", borderTop: "2px dashed var(--color-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Tiền kẹo:</span>
                  <span>{formatPrice(order.total - (order.shipping_fee || 0))}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Phí ship:</span>
                  <span>{order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Miễn phí"}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800 }}>TỔNG CỘNG:</span>
                  <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--color-primary)" }}>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
              Cảm ơn bạn đã tin tưởng chọn kẹo tại Candy Store! 🍬
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default OrderDetail;