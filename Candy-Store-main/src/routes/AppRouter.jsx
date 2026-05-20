import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import Loader from "../components/Loader/Loader";

// ── Eager load (layout + home) ──
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home.jsx";

// ── Lazy load pages ──
const Products       = lazy(() => import("../pages/Products/Products.jsx"));
const ProductDetail  = lazy(() => import("../pages/ProductDetail/ProductDetail.jsx"));
const Cart           = lazy(() => import("../pages/Cart/Cart.jsx"));
const Checkout       = lazy(() => import("../pages/Checkout/Checkout.jsx"));
const OrderHistory   = lazy(() => import("../pages/Orders/OrderHistory.jsx"));
const OrderDetail    = lazy(() => import("../pages/Orders/OrderDetail.jsx"));
const Wishlist       = lazy(() => import("../pages/Wishlist/Wishlist.jsx"));
const Profile        = lazy(() => import("../pages/Profile/Profile.jsx"));
const NotFound       = lazy(() => import("../pages/NotFound/NotFound.jsx"));

const Login          = lazy(() => import("../pages/Auth/Login.jsx"));
const Register       = lazy(() => import("../pages/Auth/Register.jsx"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword.jsx"));

const AdminLayout       = lazy(() => import("../pages/admin/AdminLayout.jsx"));
const AdminDashboard    = lazy(() => import("../pages/admin/AdminDashboard.jsx"));
const ProductManagement = lazy(() => import("../pages/admin/ProductManagement.jsx"));
const ProductEdit       = lazy(() => import("../pages/admin/ProductEdit.jsx"));
const OrderManagement   = lazy(() => import("../pages/admin/OrderManagement.jsx"));
const OrderDetailAdmin  = lazy(() => import("../pages/admin/OrderDetailAdmin.jsx"));

const Lazy = ({ children }) => (
  <Suspense fallback={<Loader text="Đang tải trang..." />}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorBoundary><NotFound /></ErrorBoundary>,
    children: [
      { index: true, element: <Home /> },
      { path: "products",     element: <Lazy><Products /></Lazy> },
      { path: "products/:id", element: <Lazy><ProductDetail /></Lazy> },
      { path: "cart",         element: <Lazy><Cart /></Lazy> },
      { path: "checkout",     element: <Lazy><Checkout /></Lazy> },
      { path: "orders",       element: <Lazy><OrderHistory /></Lazy> },
      { path: "orders/:id",   element: <Lazy><OrderDetail /></Lazy> },
      { path: "wishlist",     element: <Lazy><Wishlist /></Lazy> },
      { path: "profile",      element: <Lazy><Profile /></Lazy> },

      {
        path: "auth",
        children: [
          { path: "login",           element: <Lazy><Login /></Lazy> },
          { path: "register",        element: <Lazy><Register /></Lazy> },
          { path: "forgot-password", element: <Lazy><ForgotPassword /></Lazy> },
        ]
      },

      { path: "*", element: <Lazy><NotFound /></Lazy> },
    ],
  },

  {
    path: "/admin",
    element: <Lazy><AdminLayout /></Lazy>,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Lazy><AdminDashboard /></Lazy> },
      { path: "products", element: <Lazy><ProductManagement /></Lazy> },
      { path: "products/add", element: <Lazy><ProductEdit /></Lazy> },
      { path: "products/edit/:id", element: <Lazy><ProductEdit /></Lazy> },
      { path: "orders", element: <Lazy><OrderManagement /></Lazy> },
      { path: "orders/:id", element: <Lazy><OrderDetailAdmin /></Lazy> },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
