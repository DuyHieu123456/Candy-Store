import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";
import { formatPrice } from "../../utils/formatPrice";

const OrderSuccess = ({ order }) => {
  const paymentLabel = {
    cod: "💵 Tiền mặt (COD)",
    momo: "💜 Ví MoMo",
    vnpay: "💳 VNPay",
  };

  return (
    <div className="order-success">
      <div className="order-success__icon">🎉</div>
      <h2 className="order-success__title">Đặt Hàng Thành Công!</h2>
      {/* Hiển thị mã đơn hàng chính xác từ Backend[cite: 16, 33] */}
      <p className="order-success__order-id">Mã đơn: #{order.order_number}</p>

      <p className="order-success__sub">
        Candy Store đã nhận đơn hàng của bạn! 🍬<br />
        Chúng tôi sẽ chuẩn bị kẹo và giao đến bạn sớm nhất.
      </p>

      <div className="order-success__info-box">
        <div className="order-success__info-row">
          <span>Người nhận:</span>
          <span>{order.fullName}</span> {/* Dữ liệu từ form khách nhập[cite: 33] */}
        </div>
        <div className="order-success__info-row">
          <span>Địa chỉ:</span>
          <span>{order.address}</span> {/* Dữ liệu từ form khách nhập[cite: 33] */}
        </div>
        <div className="order-success__info-row">
          <span>Thanh toán:</span>
          <span>{paymentLabel[order.payment] || order.payment}</span>
        </div>
        <div className="order-success__info-row">
          <span>Tổng tiền:</span>
          <span style={{ color: "var(--color-primary)", fontWeight: 800 }}>
            {formatPrice(order.totalPrice)}
          </span>
        </div>
      </div>

      <div className="order-success__actions">
        <Link to="/orders">
          <Button variant="outline">📦 Theo Dõi Đơn Hàng</Button>
        </Link>
        <Link to="/">
          <Button>🛍️ Về Trang Chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;