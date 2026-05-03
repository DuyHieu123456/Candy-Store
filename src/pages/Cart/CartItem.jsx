import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";

const CartItem = ({ item }) => {
  const { removeItem, updateQty } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item__img">
        {item.image ? (
          <img src={item.image} alt={item.name} />
        ) : (
          <span>{item.emoji || "🍬"}</span>
        )}
      </div>

      <div className="cart-item__info">
        <p className="cart-item__brand">{item.brand}</p>
        <h4 className="cart-item__name">{item.name}</h4>
        <p className="cart-item__unit-price">
          Đơn giá: {formatPrice(item.price)}
        </p>
      </div>

      <div className="cart-item__actions">
        <span className="cart-item__price">
          {formatPrice(item.price * item.quantity)}
        </span>

        <div className="cart-item__qty">
          <button
            className="cart-item__qty-btn"
            onClick={() => updateQty(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            aria-label="Giảm"
          >
            −
          </button>
          <span className="cart-item__qty-num">{item.quantity}</span>
          <button
            className="cart-item__qty-btn"
            onClick={() => updateQty(item.id, item.quantity + 1)}
            aria-label="Tăng"
          >
            +
          </button>
        </div>

        <button
          className="cart-item__remove"
          onClick={() => removeItem(item.id)}
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;