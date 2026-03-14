import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import CheckoutForm from "./CheckoutForm";
import OrderSuccess from "./OrderSuccess";
import cartService from "../../services/cartService";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import "./Checkout.css";

const FREE_SHIP_THRESHOLD = 300_000;

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [loading,  setLoading]  = useState(false);
  const [order,    setOrder]    = useState(null);

  const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : 30_000;
  const finalTotal  = totalPrice + shippingFee;

  if (items.length === 0 && !order) {
    return (
      <div className="checkout-page">
        <div className="container" style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>🛒</div>
          <h2 style={{ marginBottom: 8 }}>Giỏ hàng trống!</h2>
          <p style={{ color: "var(--color-text-muted)", marginBottom: 24 }}>
            Bạn chưa có sản phẩm nào trong giỏ.
          </p>
          <Link to="/products">
            <Button size="lg">Khám Phá Sản Phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (order) {
    return (
      <div className="checkout-page">
        <div className="container">
          <OrderSuccess order={order} />
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (formData) => {
    setLoading(true);
    try {
      const result = await cartService.placeOrder({
        ...formData,
        items,
        totalPrice,
        shippingFee,
        finalTotal,
      });

      if (result.success) {
        clearCart();
        setOrder(result);
      }
    } catch (err) {
      console.error("Lỗi đặt hàng:", err);
      alert("Có lỗi xảy ra! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-page__title">💳 Thanh Toán</h1>
        <p className="checkout-page__subtitle">
          Kiểm tra thông tin và xác nhận đơn hàng của bạn
        </p>

        <div className="checkout-page__layout">
          <CheckoutForm onSubmit={handlePlaceOrder} loading={loading} />

          <aside className="checkout-summary">
            <h3 className="checkout-summary__title">🛍️ Đơn Hàng Của Bạn</h3>

            {items.map((item) => (
              <div key={item.id} className="checkout-summary__item">
                <div className="checkout-summary__emoji">
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }} />
                    : item.emoji || "🍬"
                  }
                </div>
                <span className="checkout-summary__item-name">{item.name}</span>
                <span className="checkout-summary__item-qty">×{item.quantity}</span>
                <span className="checkout-summary__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}

            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span>Tạm tính</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Phí ship</span>
                <span>{shippingFee === 0 ? "Miễn phí 🎉" : formatPrice(shippingFee)}</span>
              </div>
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Tổng cộng</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;