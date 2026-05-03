import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

// Dữ liệu các liên kết quan trọng trong Footer
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
    { label: "Chính sách bảo mật", to: "/privacy" },
  ],
};

// Liên kết mạng xã hội với các biểu tượng cảm xúc đồng bộ
const SOCIAL = [
  { icon: "📘", label: "Facebook",  href: "https://facebook.com" },
  { icon: "📸", label: "Instagram", href: "https://instagram.com" },
  { icon: "▶️", label: "YouTube",   href: "https://youtube.com" },
  { icon: "🐦", label: "Twitter",   href: "https://twitter.com" },
];

// Các phương thức thanh toán được hỗ trợ[cite: 33]
const PAYMENTS = ["VISA", "Mastercard", "MoMo", "ZaloPay", "COD"];

/**
 * Thành phần Chân trang (Footer)
 * Cung cấp thông tin doanh nghiệp, điều hướng nhanh và đăng ký bản tin.
 */
const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Xử lý logic đăng ký nhận ưu đãi[cite: 33]
  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Đăng ký email:", email);
      setSubscribed(true);
      setEmail("");
      // Tự động ẩn thông báo sau 5 giây
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="footer" role="contentinfo">
      {/* ── Phần trên: Thông tin và Liên kết ── */}
      <div className="footer__top">
        <div className="footer__grid container">
          
          {/* Thương hiệu và Giới thiệu ngắn[cite: 32, 33] */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="logo-emoji">🍭</span>
              <div className="logo-text">
                <span className="footer__logo-main">CANDY</span>
                <span className="footer__logo-sub">STORE</span>
              </div>
            </Link>
            <p className="footer__desc">
              Thiên đường bánh kẹo ngọt ngào — nơi mỗi chiếc kẹo mang lại nụ cười và niềm vui cho mọi lứa tuổi! 🍬
            </p>
            <nav className="footer__social" aria-label="Liên kết mạng xã hội">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className="footer__social-link"
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {s.icon}
                </a>
              ))}
            </nav>
          </div>

          {/* Các nhóm liên kết điều hướng[cite: 32, 33] */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="footer__link-group">
              <h4 className="footer__link-title">{title}</h4>
              <ul className="footer__list">
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

          {/* Đăng ký nhận tin (Newsletter)[cite: 32, 33] */}
          <div className="footer__newsletter">
            <h4 className="footer__link-title">ƯU ĐÃI NGỌT NGÀO 🎁</h4>
            <p className="footer__newsletter-desc">
              Để lại email để nhận voucher 15% cho đơn hàng đầu tiên của bạn!
            </p>
            {subscribed ? (
              <div className="newsletter-success">
                ✨ Cảm ơn bạn đã đăng ký thành công!
              </div>
            ) : (
              <form className="footer__newsletter-form" onSubmit={handleNewsletter}>
                <input 
                  type="email" 
                  placeholder="Nhập email của bạn..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  aria-label="Đăng ký nhận tin"
                />
                <button type="submit">GỬI NGAY</button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ── Phần dưới: Bản quyền và Thanh toán ── */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner container">
          <p className="copyright">
            © 2026 <strong>Candy Store</strong>. Được tạo ra với 🍭 bởi Team Phát triển.
          </p>
          <div className="footer__payments" aria-label="Phương thức thanh toán">
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