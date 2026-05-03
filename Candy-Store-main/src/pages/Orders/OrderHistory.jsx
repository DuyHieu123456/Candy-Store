import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import orderService from "../../services/orderService";
import { formatPrice } from "../../utils/formatPrice";
import "./OrderHistory.css";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderService.getMyOrders();
                if (res.success) setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="container">Đang tải lịch sử kẹo...</div>;

    return (
        <div className="order-history container">
            <h1>📦 Lịch Sử Đơn Hàng</h1>
            {orders.length === 0 ? (
                <p>Bạn chưa đặt món kẹo nào. <Link to="/products">Mua ngay!</Link></p>
            ) : (
                <div className="order-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-item-card">
                            <div className="order-info">
                                <h3>Mã đơn: {order.order_number}</h3>[cite: 15]
                                <p>Ngày đặt: {new Date(order.created_at).toLocaleDateString('vi-VN')}</p>
                                <p>Trạng thái: <span className={`status-${order.status}`}>{order.status}</span></p>
                            </div>
                            <div className="order-total">
                                <strong>{formatPrice(order.total)}</strong>
                                <Link to={`/orders/${order.id}`} className="btn-detail">Chi tiết</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;