import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart"; // Lấy dữ liệu giỏ hàng
import CheckoutForm from "./CheckoutForm"; // Form nhập liệu[cite: 76]
import OrderSuccess from "./OrderSuccess"; // Giao diện thành công[cite: 77]
import cartService from "../../services/cartService"; // Giao tiếp API
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import "./Checkout.css";

const FREE_SHIP_THRESHOLD = 300000; // Ngưỡng freeship 300k
const DEFAULT_SHIPPING_FEE = 30000;

/**
 * Checkout Component - Đã sửa lỗi ID: undefined và đồng bộ hóa Backend
 */
const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const shippingFee = totalPrice >= FREE_SHIP_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
  const finalTotal = totalPrice + shippingFee;

  /**
   * Xử lý đặt hàng: Sửa lỗi ánh xạ dữ liệu ID[cite: 75]
   */
  const handlePlaceOrder = async (formData) => {
    setLoading(true);
    try {
      // 1. Ánh xạ dữ liệu chính xác theo yêu cầu Backend (Snake Case)[cite: 75]
      const orderPayload = {
        recipient_name: formData.fullName, // Đồng bộ với console log[cite: 75]
        recipient_phone: formData.phone,
        shipping_address: formData.address,
        city: formData.city || "VN",       // Mặc định thành phố
        payment_method: formData.payment,
        note: formData.note || "",
        
        // 2. SỬA LỖI QUAN TRỌNG: Kiểm tra cả id và Id để tránh undefined[cite: 75]
        items: cartItems.map(item => ({
          product_id: item.id || item.Id, // Hỗ trợ cả 2 định dạng từ LocalStorage[cite: 75]
          quantity: item.quantity
        })),
        
        shipping_fee: shippingFee,
        total_amount: finalTotal // Đảm bảo đúng tên trường Backend chờ
      };

      // 3. Gửi đơn hàng qua service[cite: 75]
      const result = await cartService.placeOrder(orderPayload);

      if (result.success) {
        setOrder({
          ...formData,
          order_number: result.data.order_number, // Mã đơn từ SQL Server[cite: 75, 77]
          totalPrice: finalTotal,
        });
        
        if (clearCart) clearCart(); // Xóa giỏ hàng khi thành công[cite: 75]
      }
    } catch (err) {
      console.error("Lỗi xác nhận đơn hàng:", err);
      // Hiển thị thông báo lỗi chi tiết từ Server[cite: 75]
      const msg = err.response?.data?.message || "Sản phẩm không hợp lệ hoặc đã ngừng bán.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Trạng thái thành công[cite: 77]
  if (order) {
    return <div className="checkout-page container"><OrderSuccess order={order} /></div>;
  }

  // Trạng thái giỏ hàng trống[cite: 75]
  if (cartItems.length === 0) {
    return (
      <div className="checkout-page container" style={{ textAlign: "center", padding: "100px 0" }}>
        <h2 style={{ fontWeight: 900 }}>GIỎ HÀNG ĐANG TRỐNG 🍭</h2>
        <p style={{ color: "var(--color-text-muted)", marginBottom: 32 }}>Chọn kẹo trước khi thanh toán bạn nhé!</p>
        <Link to="/products"><Button variant="primary">QUAY LẠI MUA SẮM</Button></Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <header className="checkout-page__header">
          <h1 className="checkout-page__title">THANH TOÁN</h1>
          <p className="checkout-page__subtitle">Đảm bảo thông tin giao kẹo chính xác 🍬</p>
        </header>

        <div className="checkout-page__layout">
          <main className="checkout-page__form">
            <CheckoutForm onSubmit={handlePlaceOrder} loading={loading} />
          </main>

          <aside className="checkout-summary">
            <h3 className="checkout-summary__title">TÓM TẮT ĐƠN HÀNG</h3>
            <div className="checkout-summary__list">
              {cartItems.map((item) => (
                <div key={item.id || item.Id} className="checkout-summary__item">
                  <div className="checkout-summary__emoji">🍬</div>
                  <div className="checkout-summary__item-info">
                    <span className="checkout-summary__item-name">{item.name}</span>
                    <span className="checkout-summary__item-qty">x{item.quantity}</span>
                  </div>
                  <span className="checkout-summary__item-price">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span>Tạm tính:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="checkout-summary__row">
                <span>Phí vận chuyển:</span>
                <span className={shippingFee === 0 ? "text-success" : ""}>
                  {shippingFee === 0 ? "Miễn phí ✨" : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>TỔNG CỘNG:</span>
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