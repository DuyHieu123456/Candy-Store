import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CartContext } from './CartContext';
import useAuth from '../hooks/useAuth'; // Hook lấy trạng thái từ AuthProvider[cite: 18, 20]
import api from '../services/api'; // Sử dụng instance api đã tối ưu[cite: 12]

/**
 * CartProvider - Quản lý kho kẹo ảo của người dùng.
 * Hỗ trợ lưu trữ offline (localStorage) và đồng bộ online (SQL Server).
 */
export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  /**
   * 1. Lấy dữ liệu giỏ hàng.
   * Ưu tiên dữ liệu từ Server nếu đã đăng nhập, ngược lại dùng localStorage.
   */
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.get('/cart'); // API: GET /api/cart
        if (res.data.success) {
          setCartItems(res.data.data.items || []);
        }
      } catch (err) {
        console.error("Không thể tải giỏ hàng từ máy chủ:", err);
      } finally {
        setLoading(false);
      }
    } else {
      // Đối với khách vãng lai, sử dụng khóa thống nhất 'candy_cart'[cite: 20]
      const saved = localStorage.getItem('candy_cart');
      setCartItems(saved ? JSON.parse(saved) : []);
    }
  }, [isAuthenticated]);

  /**
   * 2. Logic Hợp nhất giỏ hàng (Merge Logic).
   * Đưa kẹo từ LocalStorage lên Server ngay khi khách đăng nhập thành công.
   */
  useEffect(() => {
    const mergeCart = async () => {
      if (isAuthenticated) {
        const localCart = JSON.parse(localStorage.getItem('candy_cart') || '[]');
        if (localCart.length > 0) {
          try {
            // Gửi toàn bộ giỏ hàng tạm thời lên server[cite: 20]
            await api.post('/cart/merge', { items: localCart });
            localStorage.removeItem('candy_cart'); // Xóa giỏ tạm sau khi hợp nhất
          } catch (err) {
            console.error("Lỗi khi hợp nhất giỏ hàng:", err);
          }
        }
        fetchCart();
      }
    };
    mergeCart();
  }, [isAuthenticated, fetchCart]);

  /**
   * 3. Thêm kẹo vào giỏ.
   * Tự động phân luồng xử lý theo trạng thái đăng nhập[cite: 20].
   */
  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        // Gửi yêu cầu lên Backend SQL Server[cite: 20]
        await api.post('/cart', { product_id: product.id, quantity });
        await fetchCart();
      } catch {
        alert("Có lỗi xảy ra, không thể thêm kẹo vào giỏ! 🍬❌");
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        const newCart = existing 
          ? prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
          : [...prev, { ...product, quantity }];
        localStorage.setItem('candy_cart', JSON.stringify(newCart));
        return newCart;
      });
    }
    openDrawer(); // Mở nhanh giỏ hàng để khách kiểm tra[cite: 20]
  };

  /**
   * 4. Cập nhật số lượng & Xóa sản phẩm[cite: 20].
   */
  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return removeFromCart(id);

    if (isAuthenticated) {
      try {
        await api.put(`/cart/${id}`, { quantity: newQuantity });
        await fetchCart(); 
      } catch (err) {
        console.error("Lỗi cập nhật số lượng trên máy chủ:", err);
      }
    } else {
      const newCart = cartItems.map((item) => item.id === id ? { ...item, quantity: newQuantity } : item);
      setCartItems(newCart);
      localStorage.setItem('candy_cart', JSON.stringify(newCart));
    }
  };

  const removeFromCart = async (id) => {
    if (isAuthenticated) {
      try {
        await api.delete(`/cart/${id}`);
        await fetchCart();
      } catch (err) {
        console.error("Lỗi xóa kẹo khỏi giỏ hàng server:", err);
      }
    } else {
      const newCart = cartItems.filter((item) => item.id !== id);
      setCartItems(newCart);
      localStorage.setItem('candy_cart', JSON.stringify(newCart));
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    localStorage.removeItem('candy_cart');
    if (isAuthenticated) {
      try {
        await api.delete('/cart'); 
      } catch (err) {
        console.error("Lỗi làm sạch giỏ hàng server:", err);
      }
    }
  };

  // Tính toán tổng số lượng và giá trị giỏ hàng[cite: 20]
  const totalItems = useMemo(() => cartItems.reduce((t, i) => t + i.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => 
    cartItems.reduce((t, i) => t + (i.price) * i.quantity, 0), [cartItems]
  );

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      totalItems, 
      totalPrice, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      loading,
      isDrawerOpen, 
      openDrawer, 
      closeDrawer,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};