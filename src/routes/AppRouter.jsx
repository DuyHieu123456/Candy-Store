import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "../pages/Auth/Login"
import Register from "../pages/Auth/Register"
import Products from "../pages/Products/Products"
import ProductDetail from "../pages/ProductDetail/ProductDetail"
import Cart from "../pages/Cart/Cart"
import Checkout from "../pages/Checkout/Checkout"
import OrderHistory from "../pages/Orders/OrderHistory"

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />

        <Route path="/orders" element={<OrderHistory />} />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter