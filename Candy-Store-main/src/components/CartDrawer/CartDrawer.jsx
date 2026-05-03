import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart'; // Hook kết nối với CartProvider
import { formatPrice } from "../../utils/formatPrice"; // Tiện ích định dạng tiền tệ
import './CartDrawer.css'; // Tích hợp phong cách giao diện trượt[cite: 76]

/**
 * CartDrawer - Ngăn kéo giỏ hàng thông minh.
 * Hiển thị danh sách kẹo đã chọn và tính toán quyền lợi vận chuyển.
 */
const CartDrawer = () => {
  const { 
    cartItems, 
    totalItems,
    totalPrice,
    isDrawerOpen, 
    closeDrawer, 
    removeFromCart, 
    updateQuantity 
  } = useCart();

  // Mốc miễn phí vận chuyển (Đồng bộ với logic hệ thống: 300,000đ)[cite: 75]
  const SHIPPING_THRESHOLD = 300000;
  const isFreeShipping = totalPrice >= SHIPPING_THRESHOLD;
  const progressToFreeShip = Math.min((totalPrice / SHIPPING_THRESHOLD) * 100, 100);

  // Ảnh dự phòng nếu kẹo thiếu ảnh trên Database
  const CANDY_FALLBACK = "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=200&h=200&auto=format&fit=crop";

  return (
    <>
      {/* Lớp nền mờ để đóng giỏ hàng khi nhấn ra ngoài[cite: 75, 76] */}
      <div 
        className={`cart-overlay ${isDrawerOpen ? 'active' : ''}`} 
        onClick={closeDrawer} 
        aria-hidden="true"
      />
      
      <aside className={`cart-drawer ${isDrawerOpen ? 'open' : ''}`} aria-label="Giỏ hàng nhanh">
        
        {/* 1. Header: Hiển thị tiêu đề và tổng số lượng món[cite: 5, 75, 76] */}
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">
            GIỎ HÀNG CỦA BẠN ({totalItems}) 🍬
          </h3>
          <button className="cart-drawer__close" onClick={closeDrawer}>&times;</button>
        </div>

        {/* 2. Content: Danh sách kẹo hoặc thông báo trống[cite: 75, 76] */}
        <div className="cart-drawer__content">
          {cartItems.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="empty-icon">🍭</div>
              <p>Bạn chưa chọn loại kẹo nào!</p>
              <Link to="/products" className="btn-continue" onClick={closeDrawer}>
                MUA KẸO NGAY
              </Link>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-drawer__item">
                  <div className="item-image-box">
                    <img 
                      src={item.image_url || item.image || CANDY_FALLBACK} 
                      alt={item.name} 
                      onError={(e) => { e.target.src = CANDY_FALLBACK; }} 
                    />
                  </div>
                  
                  <div className="item-info">
                    <h4 className="item-name">{item.name}</h4>
                    <p className="item-unit-price">{formatPrice(item.price)}</p>
                    
                    <div className="item-actions">
                      <div className="quantity-control">
                        <button 
                          className="btn-qty" 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                          className="btn-qty" 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <p className="item-subtotal">{formatPrice(item.price * item.quantity)}</p>
                    </div>

                    <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                      Xóa món
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Footer: Tổng kết và Thanh toán[cite: 75, 76] */}
        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            {/* Thanh tiến trình Miễn phí vận chuyển trực quan */}
            <div className="shipping-progress">
              <div className="shipping-info">
                {isFreeShipping ? (
                  <span>🎊 Đã đủ điều kiện <strong>Free Ship</strong>!</span>
                ) : (
                  <span>Mua thêm <strong>{formatPrice(SHIPPING_THRESHOLD - totalPrice)}</strong> để Free Ship</span>
                )}
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressToFreeShip}%` }}></div>
              </div>
            </div>

            <div className="total-row">
              <span className="total-label">TỔNG TIỀN KẸO:</span>
              <strong className="total-value">{formatPrice(totalPrice)}</strong>
            </div>

            <Link to="/checkout" className="btn-checkout" onClick={closeDrawer}>
              THANH TOÁN NGAY
            </Link>
            
            <Link to="/cart" className="btn-view-cart" onClick={closeDrawer}>
              XEM CHI TIẾT GIỎ HÀNG
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;