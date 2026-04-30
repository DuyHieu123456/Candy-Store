import { Link, useParams } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import "./OrderDetail.css";

const ORDERS_KEY = "candy_store_orders";

const getOrders = () => {
    try {
        const data = localStorage.getItem(ORDERS_KEY);
        const parsed = data ? JSON.parse(data) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const formatOrderDateTime = (order) => {
    const date = order?.createdAt ? new Date(order.createdAt) : null;
    if (!date || Number.isNaN(date.getTime())) {
        return "Không xác định";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
};

export default function OrderDetail() {
    const { id } = useParams();
    const orderId = decodeURIComponent(id || "");

    const order = getOrders().find((item) => item.orderId === orderId);

    if (!order) {
        return (
            <section className="order-detail-page container">
                <div className="order-detail-empty">
                    <div className="order-detail-empty__icon">🔎</div>
                    <h2>Không tìm thấy đơn hàng</h2>
                    <p>Đơn hàng bạn đang tìm có thể đã bị xóa hoặc không tồn tại.</p>
                    <Link to="/orders" className="order-detail-empty__link">
                        Quay lại danh sách đơn hàng
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className="order-detail-page container">
            <header className="order-detail-header">
                <div>
                    <h1>Chi Tiết Đơn Hàng</h1>
                    <p>Mã đơn: {order.orderId}</p>
                </div>
                <Link className="order-detail-back" to="/orders">
                    ← Quay lại
                </Link>
            </header>

            <div className="order-detail-grid">
                <article className="order-detail-card">
                    <h3>Thông tin giao hàng</h3>
                    <p><span>Người nhận:</span> {order.fullName}</p>
                    <p><span>Số điện thoại:</span> {order.phone}</p>
                    <p><span>Địa chỉ:</span> {order.address}, {order.district}, {order.province}</p>
                    <p><span>Ngày đặt:</span> {formatOrderDateTime(order)}</p>
                    <p><span>Trạng thái:</span> {order.status || "Đang xử lý"}</p>
                </article>

                <article className="order-detail-card">
                    <h3>Tóm tắt thanh toán</h3>
                    <p><span>Tạm tính:</span> {formatPrice(order.totalPrice || 0)}</p>
                    <p><span>Phí vận chuyển:</span> {formatPrice(order.shippingFee || 0)}</p>
                    <p className="order-detail-total"><span>Tổng thanh toán:</span> {formatPrice(order.finalTotal || 0)}</p>
                </article>
            </div>

            <article className="order-detail-card order-detail-items">
                <h3>Sản phẩm trong đơn</h3>

                {!Array.isArray(order.items) || order.items.length === 0 ? (
                    <p>Không có dữ liệu sản phẩm trong đơn hàng này.</p>
                ) : (
                    <div className="order-detail-items__list">
                        {order.items.map((item, idx) => (
                            <div className="order-detail-item" key={`${item.id || idx}-${idx}`}>
                                <div className="order-detail-item__left">
                                    <div className="order-detail-item__thumb">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <span>{item.emoji || "🍬"}</span>
                                        )}
                                    </div>
                                    <div>
                                        <strong>{item.name}</strong>
                                        <p>Số lượng: {item.quantity}</p>
                                    </div>
                                </div>
                                <strong>{formatPrice((item.price || 0) * (item.quantity || 0))}</strong>
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </section>
    );
}
