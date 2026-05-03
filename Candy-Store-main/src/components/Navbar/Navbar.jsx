import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useCart from "../../hooks/useCart"; // Lấy số lượng kẹo thực tế[cite: 33]
import useAuth from "../../hooks/useAuth"; // Lấy quyền Admin và trạng thái User[cite: 33]
import api from "../../services/api"; 
import "./Navbar.css";

/**
 * Navbar - Thành phần điều hướng trung tâm.
 * Đã khắc phục lỗi: Cập nhật trạng thái menuOpen một cách tối ưu.
 */
const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  const { totalItems, openDrawer } = useCart(); 
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Tải danh sách loại kẹo cho Mega Menu[cite: 33]
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        if (res.data.success) {
          setCategories(res.data.data);
        }
      } catch (err) {
        console.error("Không thể tải danh mục kẹo:", err);
      }
    };
    fetchCategories();
  }, []);

  /**
   * KHẮC PHỤC LỖI: Đóng menu khi route thay đổi mà không gọi setState đồng bộ trong effect.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const timeoutId = setTimeout(() => {
      setMenuOpen(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [location.pathname, menuOpen]); // Chỉ đóng menu khi route thay đổi nếu menu đang mở

  // 2. Xử lý tìm kiếm kẹo[cite: 33]
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
      if (menuOpen) setMenuOpen(false); // Đóng menu mobile sau khi tìm kiếm
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar__announce">
        🍬 Miễn phí vận chuyển từ 300K!&nbsp;
        <Link to="/products?sale=true">Mua Ngay →</Link>
      </div>

      <nav className="navbar">
        <div className="navbar__inner container">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">🍭</span>
            <div>
              <span className="navbar__logo-main">CANDY</span>
              <span className="navbar__logo-sub">STORE</span>
            </div>
          </Link>

          <form className="navbar__search" onSubmit={handleSearch}>
            <span className="navbar__search-prefix">✨</span>
            <input
              type="text"
              placeholder="Bạn muốn tìm loại kẹo nào?..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Tìm kiếm">🔍</button>
          </form>

          <div className="navbar__actions">
            {isAuthenticated ? (
              <div className="navbar__user-menu">
                <button className="navbar__user-btn">
                  <span className="navbar__user-icon">👤</span>
                  {/* Bảo vệ logic: Kiểm tra user tồn tại trước khi split name */}
                  <span className="navbar__user-name">
                    {user?.name ? user.name.split(" ").pop() : "User"}
                  </span>
                </button>
                <div className="navbar__dropdown">
                  {isAdmin && (
                    <Link to="/admin" className="admin-link">⚙️ Quản trị</Link>
                  )}
                  <Link to="/orders">📦 Đơn hàng</Link>
                  <button onClick={logout} className="logout-btn">🚪 Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link to="/auth/login" className="navbar__icon-btn">👤</Link>
            )}

            <div className="navbar__icon-btn navbar__cart-btn" onClick={openDrawer}>
              🛒
              {totalItems > 0 && <span className="navbar__cart-badge">{totalItems}</span>}
            </div>

            <button 
              className="navbar__hamburger" 
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>

        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <div className="navbar__links-inner container">
            <Link to="/products" className="navbar__link">Tất Cả</Link>
            <div className="navbar__mega-trigger">
              <span className="navbar__link">Loại Kẹo ▾</span>
              <div className="navbar__mega-menu">
                <div className="mega-menu__grid">
                  {categories.map((cat) => (
                    <Link key={cat.id} to={`/products?category=${cat.slug}`} className="mega-menu__item">
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/products?sale=true" className="navbar__link navbar__link--sale">🔥 Sale</Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;