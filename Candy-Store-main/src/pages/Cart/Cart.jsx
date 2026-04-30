import React from 'react';
import useCart from '../../hooks/useCart';
import CartList from './CartList';
import CartSummary from './CartSummary';
import { Link } from 'react-router-dom';
import "./Cart.css";

const Cart = () => {
  const { cartItems, totalPrice, totalItems } = useCart();
  if (!cartItems || cartItems.length === 0) {
    return <div className="container">Giỏ hàng trống!</div>;
  }
  // Kiểm tra an toàn: nếu cartItems bị undefined thì coi như mảng rỗng
  const itemsCount = cartItems?.length || 0;

  if (itemsCount === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <h2>Giỏ hàng của bạn đang trống 🍭</h2>
        <Link to="/products" className="btn-primary">Tiếp tục mua sắm</Link>
      </div>
    );
  }

  return (
    <section className="cart-page">
      <div className="container">
        <h1>Giỏ hàng của bạn ({totalItems} sản phẩm)</h1>
        <div className="cart-page__grid">
          <div className="cart-page__list">
            <CartList items={cartItems} />
          </div>
          <div className="cart-page__summary">
            <CartSummary total={totalPrice} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;