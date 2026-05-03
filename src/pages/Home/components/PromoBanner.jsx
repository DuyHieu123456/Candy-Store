// src/pages/Home/components/PromoBanner.jsx
import { Link } from "react-router-dom";
import "./PromoBanner.css";

const PROMOS = [
  {
    id: 1,
    tag: "Flash Sale",
    title: "Giảm 50%",
    subtitle: "Kẹo Haribo & Trolli",
    desc: "Chỉ hôm nay — số lượng có hạn!",
    cta: "Mua Ngay",
    to: "/products?sale=true",
    emoji: "⚡",
    gradient: "linear-gradient(135deg, #d63031, #e84393)",
  },
  {
    id: 2,
    tag: "Miễn Phí Ship",
    title: "Đơn Từ 300K",
    subtitle: "Toàn quốc",
    desc: "Áp dụng cho tất cả sản phẩm",
    cta: "Mua Ngay",
    to: "/products",
    emoji: "🚚",
    gradient: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
  },
  {
    id: 3,
    tag: "Quà Tặng",
    title: "Gói Quà Miễn Phí",
    subtitle: "Đơn từ 200K",
    desc: "Đóng gói đẹp, ship tận nhà",
    cta: "Chọn Quà",
    to: "/products?category=gift",
    emoji: "🎁",
    gradient: "linear-gradient(135deg, #00b894, #00cec9)",
  },
];

const PromoBanner = () => (
  <section className="promo-section">
    <div className="container">
      <div className="promo-grid">
        {PROMOS.map((p) => (
          <Link
            key={p.id}
            to={p.to}
            className="promo-card"
            style={{ background: p.gradient }}
          >
            <span className="promo-card__emoji">{p.emoji}</span>
            <div className="promo-card__body">
              <span className="promo-card__tag">{p.tag}</span>
              <h3 className="promo-card__title">{p.title}</h3>
              <p className="promo-card__subtitle">{p.subtitle}</p>
              <p className="promo-card__desc">{p.desc}</p>
              <span className="promo-card__cta">{p.cta} →</span>
            </div>
            <div className="promo-card__circle" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default PromoBanner;