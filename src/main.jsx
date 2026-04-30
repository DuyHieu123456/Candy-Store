// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { UserProvider } from "./store/userStore.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import AppRouter from "./routes/AppRouter";

import "./assets/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </UserProvider>
  </StrictMode>
);