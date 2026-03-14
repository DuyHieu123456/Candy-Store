
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import Home       from "../pages/Home/Home.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [

      { index: true, element: <Home /> },


    ],
  },

]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;