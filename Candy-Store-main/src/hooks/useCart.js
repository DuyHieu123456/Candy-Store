// src/hooks/useCart.js
import { useContext } from "react";
// Import từ file .js (Hộp chứa dữ liệu)
import { CartContext } from "../context/CartContext"; 

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }
  return context;
};

export default useCart;