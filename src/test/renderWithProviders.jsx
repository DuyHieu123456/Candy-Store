// src/test/renderWithProviders.jsx
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext";

export function renderWithProviders(ui, { route = "/", ...options } = {}) {
  return render(
    <AuthProvider>
      <CartProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </CartProvider>
    </AuthProvider>,
    options
  );
}
