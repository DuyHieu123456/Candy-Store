import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import "./OrderHistory.css";

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

const STATUS_CLASS_MAP = {
    "Đang xử lý": "order-card__status--processing",
    "Đang giao": "order-card__status--shipping",
    "Hoàn thành": "order-card__status--success",
    "Đã hủy": "order-card__status--cancelled",
};

const getOrderDate = (order) => {
    if (order?.createdAt) {
        return new Date(order.createdAt);
    }

    if (typeof order?.orderId === "string" && order.orderId.startsWith("CS")) {
        const ts = Number(order.orderId.replace("CS", ""));
        if (!Number.isNaN(ts)) {
            return new Date(ts);
        }
    }

    return null;
};

const formatOrderDateTime = (order) => {
    const date = getOrderDate(order);
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

export default function OrderHistory() {
    const orders = getOrders();

    return (
        <section className="orders-page container">
            <header className="orders-page__header">
                <h1>Đơn Hàng Của Bạn</h1>
                <p>Theo dõi trạng thái và thông tin các đơn đã đặt.</p>
            </header>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <div className="orders-empty__icon">📦</div>
                    <h3>Chưa có đơn hàng nào</h3>
                    <p>Bạn hãy đặt hàng để xem lịch sử tại đây.</p>
                    <Link className="orders-empty__link" to="/products">
                        Mua sắm ngay
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <article key={order.orderId} className="order-card">
                            <div className="order-card__top">
                                <strong>Mã đơn: {order.orderId}</strong>
                                <span
                                    className={`order-card__status ${STATUS_CLASS_MAP[order.status || "Đang xử lý"] || "order-card__status--processing"}`}
                                >
                                    {order.status || "Đang xử lý"}
                                </span>
                            </div>

                            <p className="order-card__line order-card__line--meta">
                                <span>Ngày đặt:</span> {formatOrderDateTime(order)}
                            </p>

                            <p className="order-card__line">
                                <span>Người nhận:</span> {order.fullName} - {order.phone}
                            </p>
                            <p className="order-card__line">
                                <span>Địa chỉ:</span> {order.address}, {order.district}, {order.province}
                            </p>

                            <div className="order-card__bottom">
                                <span>{Array.isArray(order.items) ? order.items.length : 0} sản phẩm</span>
                                <strong>{formatPrice(order.finalTotal || 0)}</strong>
                            </div>

                            <div className="order-card__actions">
                                <Link className="order-card__detail-link" to={`/orders/${encodeURIComponent(order.orderId)}`}>
                                    Xem chi tiết
                                </Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}
