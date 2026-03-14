import cartService from "../services/cartService";

export const getInitialCartState = () => ({
    items: cartService.getCart(),
});

export const persistCart = (items) => {
    cartService.saveCart(items);
};

export const clearPersistedCart = () => {
    cartService.clearCart();
};