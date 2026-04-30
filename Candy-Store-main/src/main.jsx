import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AuthProvider } from "./context/AuthContext";
// Sửa đường dẫn này cho đúng với file chứa logic Provider của bạn
import { CartProvider } from "./context/CartProvider"; 

import AppRouter from "./routes/AppRouter";

import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);