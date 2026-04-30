import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import Button from "../../components/Button/Button";
import { formatPrice } from "../../utils/formatPrice";

const FREE_SHIP_THRESHOLD = 300_000;

const CartSummary = () => {
  const { items, totalPrice } = useCart();
  const navigate = useNavigate();

  const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : 30_000;
  const finalTotal  = totalPrice + shippingFee;

  if (items.length === 0) return null;

  return (
    <aside className="cart-summary">
      <h3 className="cart-summary__title">Tóm Tắt Đơn Hàng</h3>

      <div className="cart-summary__row">
        <span>Tạm tính ({items.length} món)</span>
        <span>{formatPrice(totalPrice)}</span>
      </div>

      <div className="cart-summary__row">
        <span>Phí vận chuyển</span>
        <span>{shippingFee === 0 ? "Miễn phí 🎉" : formatPrice(shippingFee)}</span>
      </div>

      {shippingFee > 0 && (
        <p className="cart-summary__free-ship">
          🚚 Mua thêm{" "}
          {formatPrice(FREE_SHIP_THRESHOLD - totalPrice)}{" "}
          để được miễn phí ship!
        </p>
      )}

      {shippingFee === 0 && (
        <p className="cart-summary__free-ship">
          ✅ Bạn được miễn phí vận chuyển!
        </p>
      )}

      <div className="cart-summary__row cart-summary__row--total">
        <span>Tổng cộng</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>

      <Button
        className="cart-summary__btn"
        fullWidth
        size="lg"
        onClick={() => navigate("/checkout")}
      >
        Đặt Hàng Ngay →
      </Button>

      <Link to="/products" className="cart-summary__continue">
        ← Tiếp tục mua sắm
      </Link>
    </aside>
  );
};

export default CartSummary;