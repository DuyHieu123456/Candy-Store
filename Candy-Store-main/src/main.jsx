import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthProvider";
import { CartProvider } from "./context/CartProvider";
import AppRouter from "./routes/AppRouter"; // Đảm bảo gọi AppRouter để quản lý các tuyến đường[cite: 14]
import "./assets/styles/global.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <AppRouter /> 
      </CartProvider>
    </AuthProvider>
  </StrictMode>
);