
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home.jsx";
import Products from "../pages/Products/Products.jsx";
import ProductDetail from "../pages/ProductDetail/ProductDetail.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import Checkout from "../pages/Checkout/Checkout.jsx";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import OrderHistory from "../pages/Orders/OrderHistory.jsx";
import OrderDetail from "../pages/Orders/OrderDetail.jsx";
import Profile from "../pages/Profile/Profile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [

      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },
      { path: "cart", element: <Cart /> },
      { path: "checkout", element: <Checkout /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "orders", element: <OrderHistory /> },
      { path: "orders/:id", element: <OrderDetail /> },
      { path: "profile", element: <Profile /> },

    ],
  },

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;