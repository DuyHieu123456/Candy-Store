import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

const NAV_LINKS = [
  { label: "Tất Cả",     path: "/products" },
  { label: "Kẹo Ngọt",  path: "/products?category=candy" },
  { label: "Socola",    path: "/products?category=chocolate" },
  { label: "Snack",     path: "/products?category=snack" },
  { label: "Bánh Quy",  path: "/products?category=cookie" },
  { label: "Combo Quà", path: "/products?category=gift" },
  { label: "🔥 Sale",   path: "/products?sale=true" },
];

const Navbar = () => {
  const [searchQuery, setSearchQuery]   = useState("");
  const [menuOpen,    setMenuOpen]      = useState(false);
  const { totalItems }                  = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
      setMenuOpen(false);
    }
  };

  return (
    <header className="navbar-wrapper">
      {/* ── Announcement ── */}
      <div className="navbar__announce">
        🍬 Miễn phí vận chuyển đơn từ 300K!&nbsp;
        <Link to="/products?sale=true">Mua Ngay →</Link>
      </div>

      {/* ── Main bar ── */}
      <nav className="navbar">
        <div className="navbar__inner container">
          {/* Logo */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-icon">🍭</span>
            <div>
              <span className="navbar__logo-main">CANDY</span>
              <span className="navbar__logo-sub">STORE</span>
            </div>
          </Link>

          {/* Search */}
          <form className="navbar__search" onSubmit={handleSearch}>
            <span className="navbar__search-prefix">✨</span>
            <input
              type="text"
              placeholder="Tìm kiếm bánh kẹo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Tìm kiếm">🔍</button>
          </form>

          {/* Actions */}
          <div className="navbar__actions">
            <Link to="/wishlist" className="navbar__icon-btn" aria-label="Yêu thích">♡</Link>

            {isAuthenticated ? (
              <div className="navbar__user-menu">
                <button className="navbar__icon-btn navbar__user-btn">
                  👤 <span>{user.name?.split(" ").pop()}</span>
                </button>
                <div className="navbar__dropdown">
                  {isAdmin && <Link to="/admin">⚙️ Quản trị</Link>}
                  <Link to="/orders">📦 Đơn hàng</Link>
                  <Link to="/profile">👤 Tài khoản</Link>
                  <button onClick={logout}>🚪 Đăng xuất</button>
                </div>
              </div>
            ) : (
              <Link to="/auth/login" className="navbar__icon-btn" aria-label="Đăng nhập">👤</Link>
            )}

            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Giỏ hàng">
              🛒
              {totalItems > 0 && (
                <span className="navbar__cart-badge">{totalItems}</span>
              )}
            </Link>

            <button
              className="navbar__hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              <span className={menuOpen ? "open" : ""} />
              <span className={menuOpen ? "open" : ""} />
              <span className={menuOpen ? "open" : ""} />
            </button>
          </div>
        </div>

        {/* ── Nav links ── */}
        <div className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <div className="navbar__links-inner container">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="navbar__link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;