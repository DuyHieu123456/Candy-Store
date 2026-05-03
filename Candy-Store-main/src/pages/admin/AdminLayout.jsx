import { useEffect } from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Hook lấy thông tin người dùng
import "./AdminLayout.css";

/**
 * AdminLayout - Khung giao diện Quản trị
 * Cung cấp thanh điều hướng Sidebar và bảo vệ các tuyến đường (Route Protection)[cite: 19, 23].
 */
const AdminLayout = () => {
  const { user, logout } = useAuth(); // Lấy thông tin user và hàm đăng xuất
  const navigate = useNavigate();

  // Kiểm tra quyền truy cập: Chỉ Admin mới được vào[cite: 19, 23]
  useEffect(() => {
    if (!user || user.role !== "admin") {
      alert("Cảnh báo: Bạn không có quyền truy cập vào khu vực này! 🛑");
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    if (window.confirm("Xác nhận đăng xuất khỏi hệ thống quản trị?")) {
      logout();
      navigate("/auth/login");
    }
  };

  // Nếu không phải admin, không render nội dung (tránh rò rỉ UI)[cite: 23]
  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-container">
      {/* ── Sidebar: Thanh điều hướng quản trị ── */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Link to="/admin">
            <span className="logo-icon">🛡️</span>
            <div className="logo-text">
              <span className="logo-main">CANDY</span>
              <span className="logo-sub">ADMIN PANEL</span>
            </div>
          </Link>
        </div>

        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon">📊</span> Tổng quan
          </NavLink>
          
          <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon">🍭</span> Quản lý sản phẩm
          </NavLink>
          
          <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon">📦</span> Quản lý đơn hàng
          </NavLink>
          
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
            <span className="nav-icon">👥</span> Khách hàng
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="nav-item back-home">
            <span className="nav-icon">🏠</span> Về cửa hàng
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <span className="nav-icon">🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* ── Main Content: Vùng hiển thị nội dung chi tiết ── */}
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2>Hệ thống quản trị Candy Store 🍬</h2>
          </div>
          <div className="topbar-right">
            <div className="admin-profile-info">
              <span className="admin-name">{user.name}</span>
              <span className="admin-badge">Quản trị viên</span>
            </div>
          </div>
        </header>

        <section className="admin-content">
          {/* Outlet sẽ hiển thị các trang con như Dashboard, Products, v.v. */}
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;