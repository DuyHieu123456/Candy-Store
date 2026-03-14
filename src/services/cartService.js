const CART_KEY = "candy_store_cart";

const cartService = {
    getCart() {
        try {
            const data = localStorage.getItem(CART_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    },

    saveCart(items) {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(items));
        } catch (err) {
            console.error("cartService.saveCart error:", err);
        }
    },

    clearCart() {
        localStorage.removeItem(CART_KEY);
    },

    async placeOrder(orderData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    orderId: "CS" + Date.now(),
                    message: "Đặt hàng thành công!",
                    ...orderData,
                });
            }, 1500);
        });
    },
};

export default cartService;