import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";

// ── CUSTOMER LAYOUT & PAGES ──
import MainLayout     from "../layouts/MainLayout";
import Home           from "../pages/Home/Home.jsx";
import Products       from "../pages/Products/Products.jsx";
import ProductDetail  from "../pages/ProductDetail/ProductDetail.jsx";
import Cart           from "../pages/Cart/Cart.jsx";
import Checkout       from "../pages/Checkout/Checkout.jsx";
import OrderHistory   from "../pages/Orders/OrderHistory.jsx";
import OrderDetail    from "../pages/Orders/OrderDetail.jsx";

// ── AUTH PAGES ──[cite: 17]
import Login          from "../pages/Auth/Login.jsx";
import Register       from "../pages/Auth/Register.jsx";
import ForgotPassword from "../pages/Auth/ForgotPassword.jsx";

// ── ADMIN LAYOUT & PAGES ── (Tích hợp mới dựa trên kế hoạch)
import AdminLayout        from "../pages/Admin/AdminLayout.jsx";
import AdminDashboard     from "../pages/Admin/AdminDashboard.jsx";
import ProductManagement  from "../pages/Admin/ProductManagement.jsx";
import ProductEdit        from "../pages/Admin/ProductEdit.jsx";
import OrderManagement    from "../pages/Admin/OrderManagement.jsx";
import OrderDetailAdmin   from "../pages/Admin/OrderDetailAdmin.jsx";

const router = createBrowserRouter([
  // 1. Nhánh dành cho khách hàng (Customer Routes)[cite: 17]
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products",     element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart",         element: <Cart /> },
      { path: "checkout",     element: <Checkout /> },
      { path: "orders",       element: <OrderHistory /> },
      { path: "orders/:id",   element: <OrderDetail /> },
      
      {
        path: "auth",
        children: [
          { path: "login",           element: <Login /> },
          { path: "register",        element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
        ]
      },
    ],
  },

  // 2. Nhánh dành cho quản trị viên (Admin Routes)
  {
    path: "/admin",
    element: <AdminLayout />, // Layout bảo mật dành riêng cho Admin
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> }, // Chuyển hướng mặc định
      { path: "dashboard", element: <AdminDashboard /> },
      
      // Quản lý sản phẩm
      { path: "products", element: <ProductManagement /> },
      { path: "products/add", element: <ProductEdit /> }, // Chế độ thêm mới
      { path: "products/edit/:id", element: <ProductEdit /> }, // Chế độ chỉnh sửa
      
      // Quản lý đơn hàng
      { path: "orders", element: <OrderManagement /> },
      { path: "orders/:id", element: <OrderDetailAdmin /> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;