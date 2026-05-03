import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import CartDrawer from "../components/CartDrawer/CartDrawer"; // Đảm bảo giỏ hàng luôn sẵn sàng
import "./MainLayout.css"; // Tích hợp phong cách bố cục linh hoạt

/**
 * MainLayout - Khung giao diện chính cho khu vực khách hàng.
 * Quản lý bố cục dạng cột (Flexbox) để đảm bảo Footer luôn ở dưới cùng[cite: 21, 22].
 */
const MainLayout = () => {
  return (
    <div className="main-layout">
      {/* 1. Thanh điều hướng: Chứa Logo, Menu kẹo và biểu đồ giỏ hàng */}
      <Navbar />

      {/* 2. Nội dung chính: Khu vực thay đổi linh hoạt theo đường dẫn (URL) */}
      <main className="main-layout__content">
        <Outlet /> 
      </main>

      {/* 3. Chân trang: Thông tin liên hệ và chính sách cửa hàng kẹo */}
      <Footer />
      
      /**
       * 4. Giỏ hàng trượt (Global Component): 
       * Được đặt ở đây để nhận dữ liệu từ CartProvider và hiển thị ở mọi trang[cite: 22].
       * Điều này cho phép khách hàng xem giỏ kẹo dù đang ở bất kỳ đâu.
       */
      <CartDrawer /> 
    </div>
  );
};

export default MainLayout;