// src/layouts/MainLayout.jsx
import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./MainLayout.css";

const MainLayout = () => (
  <div className="main-layout">
    <Navbar />
    <main className="main-layout__content">
      <Outlet />
    </main>
    <Footer />
    <ScrollRestoration />
  </div>
);

export default MainLayout;