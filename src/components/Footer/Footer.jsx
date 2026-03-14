// src/components/Footer/Footer.jsx
import { Link } from "react-router-dom";
import "./Footer.css";

const FOOTER_LINKS = {
  "Danh Mục": [
    { label: "Kẹo Ngọt",  to: "/products?category=candy" },
    { label: "Socola",    to: "/products?category=chocolate" },
    { label: "Snack",     to: "/products?category=snack" },
    { label: "Bánh Quy",  to: "/products?category=cookie" },
    { label: "Combo Quà", to: "/products?category=gift" },
  ],
  "Hỗ Trợ": [
    { label: "Câu hỏi thường gặp",    to: "/faq" },
    { label: "Chính sách vận chuyển", to: "/shipping" },
    { label: "Đổi trả hàng",          to: "/returns" },
    { label: "Liên hệ",               to: "/contact" },
    { label: "Tra cứu đơn hàng",      to: "/orders" },
  ],
  "Về Chúng Tôi": [
    { label: "Giới thiệu",  to: "/about" },
    { label: "Blog Candy",  to: "/blog" },
    { label: "Chính sách", to: "/privacy" },
  ],
};

const SOCIAL = [
  { icon: "📘", label: "Facebook",  href: "#" },
  { icon: "📸", label: "Instagram", href: "#" },
  { icon: "▶️", label: "YouTube",   href: "#" },
  { icon: "🐦", label: "Twitter",   href: "#" },
];

const PAYMENTS = ["VISA", "Mastercard", "MoMo", "ZaloPay", "COD"];

const Footer = () => {
  const handleNewsletter = (e) => {
    e.preventDefault();
    // TODO: connect to API
  };

  return (
    <footer className="footer">
      {/* ── Top ── */}
      <div className="footer__top">
        <div className="footer__grid container">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span>🍭</span>
              <div>
                <span className="footer__logo-main">CANDY</span>
                <span className="footer__logo-sub">STORE</span>
              </div>
            </Link>
            <p className="footer__desc">
              Thiên đường bánh kẹo ngọt ngào — nơi mỗi chiếc kẹo mang lại nụ cười! 🍬
            </p>
            <div className="footer__social">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer__social-link"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="footer__link-group">
              <h4 className="footer__link-title">{title}</h4>
              <ul>
                {links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="footer__link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h4 className="footer__link-title">Đăng Ký Nhận Ưu Đãi 🎁</h4>
            <p className="footer__newsletter-desc">
              Nhận ngay voucher 15% cho đơn đầu tiên!
            </p>
            <form className="footer__newsletter-form" onSubmit={handleNewsletter}>
              <input type="email" placeholder="Email của bạn..." required />
              <button type="submit">Đăng Ký</button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Bottom ── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <p>© 2025 Candy Store. Made with 🍭 by Team.</p>
          <div className="footer__payments">
            {PAYMENTS.map((p) => (
              <span key={p} className="footer__payment-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;