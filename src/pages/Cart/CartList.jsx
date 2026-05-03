import useCart from "../../hooks/useCart";
import CartItem from "./CartItem";

const CartList = () => {
  const { items, clearCart } = useCart();

  return (
    <div className="cart-list">
      <div className="cart-list__header">
        <span className="cart-list__count">
          🛒 {items.length} sản phẩm
        </span>
        <button className="cart-list__clear-btn" onClick={clearCart}>
          Xóa tất cả
        </button>
      </div>

      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export default CartList;