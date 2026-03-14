
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout     from "../layouts/MainLayout";
import Home           from "../pages/Home/Home.jsx";
import Products       from "../pages/Products/Products.jsx";
import ProductDetail  from "../pages/ProductDetail/ProductDetail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [

      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },

    ],
  },

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;