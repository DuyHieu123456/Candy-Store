import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import CartList from "./CartList";
import CartSummary from "./CartSummary";
import Button from "../../components/Button/Button";
import "./Cart.css";

const Cart = () => {
  const { items } = useCart();

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-page__title">🛒 Giỏ Hàng</h1>
        <p className="cart-page__subtitle">
          {items.length > 0
            ? `Bạn có ${items.length} sản phẩm trong giỏ hàng`
            : "Giỏ hàng của bạn đang trống"}
        </p>

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty__icon">🛒</div>
            <h2 className="cart-empty__title">Giỏ hàng trống!</h2>
            <p className="cart-empty__sub">
              Hãy thêm vài món kẹo ngon vào giỏ nhé 🍬
            </p>
            <Link to="/products">
              <Button size="lg">Khám Phá Sản Phẩm</Button>
            </Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            <CartList />
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;