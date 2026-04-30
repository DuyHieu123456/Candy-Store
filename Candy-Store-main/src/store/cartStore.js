import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [], // Mảng chứa các sản phẩm trong giỏ

      // Thêm vào giỏ
      addToCart: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(item => item.id === product.id);

        if (existingItem) {
          // Nếu kẹo đã có trong giỏ, chỉ tăng số lượng
          set({
            items: currentItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          // Nếu kẹo mới, thêm vào mảng
          set({ items: [...currentItems, { ...product, quantity }] });
        }
      },

      // Xóa 1 sản phẩm khỏi giỏ
      removeFromCart: (productId) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      // Cập nhật số lượng (khi bấm nút + / - trong giỏ)
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) return; // Không cho âm
        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          )
        });
      },

      // Xóa sạch giỏ hàng (dùng sau khi thanh toán thành công)
      clearCart: () => set({ items: [] }),

      // Tính tổng tiền
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      // Tính tổng số lượng món (để hiện icon số nhỏ nhỏ trên Navbar)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'candy-cart-storage', // Tên key lưu trong localStorage
    }
  )
);

export default useCartStore;