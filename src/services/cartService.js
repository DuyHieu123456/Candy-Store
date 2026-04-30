const CART_KEY = "candy_store_cart";
const ORDERS_KEY = "candy_store_orders";

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
                const createdOrder = {
                    success: true,
                    orderId: "CS" + Date.now(),
                    message: "Đặt hàng thành công!",
                    status: "Đang xử lý",
                    createdAt: new Date().toISOString(),
                    ...orderData,
                };

                try {
                    const data = localStorage.getItem(ORDERS_KEY);
                    const current = data ? JSON.parse(data) : [];
                    const next = Array.isArray(current)
                        ? [createdOrder, ...current]
                        : [createdOrder];
                    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
                } catch (err) {
                    console.error("cartService.placeOrder persist error:", err);
                }

                resolve(createdOrder);
            }, 1500);
        });
    },
};

export default cartService;