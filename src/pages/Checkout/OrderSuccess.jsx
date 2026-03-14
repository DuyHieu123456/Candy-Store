import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { formatPrice } from "../../utils/formatPrice";

const OrderSuccess = ({ order }) => {
  const paymentLabel = {
    cod:        "💵 Thanh toán khi nhận hàng",
    momo:       "💜 Ví MoMo",
    zalopay:    "🔵 ZaloPay",
    visa:       "💳 VISA",
    mastercard: "💳 Mastercard",
  };

  return (
    <div className="order-success">
      <div className="order-success__icon">🎉</div>

      <h2 className="order-success__title">Đặt Hàng Thành Công!</h2>
      <p className="order-success__order-id">#{order.orderId}</p>

      <p className="order-success__sub">
        Cảm ơn bạn đã tin tưởng Candy Store! 🍬<br />
        Chúng tôi sẽ liên hệ xác nhận đơn hàng sớm nhất có thể.
      </p>

      <div className="order-success__info-box">
        <div className="order-success__info-row">
          <span>Người nhận</span>
          <span>{order.fullName}</span>
        </div>
        <div className="order-success__info-row">
          <span>Số điện thoại</span>
          <span>{order.phone}</span>
        </div>
        <div className="order-success__info-row">
          <span>Địa chỉ</span>
          <span>{order.address}, {order.district}, {order.province}</span>
        </div>
        <div className="order-success__info-row">
          <span>Thanh toán</span>
          <span>{paymentLabel[order.payment] || order.payment}</span>
        </div>
        <div className="order-success__info-row">
          <span>Tổng tiền</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 800 }}>
            {formatPrice(order.finalTotal)}
          </span>
        </div>
      </div>

      <div className="order-success__actions">
        <Link to="/orders">
          <Button variant="outline">📦 Xem Đơn Hàng</Button>
        </Link>
        <Link to="/products">
          <Button>🛍️ Tiếp Tục Mua Sắm</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;