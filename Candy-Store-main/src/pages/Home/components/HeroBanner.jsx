// src/pages/Home/components/HeroBanner.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./HeroBanner.css";

const SLIDES = [
  {
    id: 1,
    badge: "🔥 Mới Ra Mắt",
    title: "NGỌT NGÀO",
    highlight: "VÔ TẬN",
    subtitle: "Khám phá hàng trăm loại kẹo, socola, snack nhập khẩu từ khắp nơi trên thế giới.",
    ctaPrimary: { label: "Mua Ngay",    to: "/products" },
    ctaSecond:  { label: "Xem Tất Cả", to: "/products" },
    emojis: ["🍭", "🍬", "🍫", "🧁", "🍰"],
    bg: "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #ff9ff3 100%)",
  },
  {
    id: 2,
    badge: "⚡ Flash Sale",
    title: "GIẢM ĐẾN",
    highlight: "50%",
    subtitle: "Chương trình khuyến mãi đặc biệt — số lượng có hạn, nhanh tay nào!",
    ctaPrimary: { label: "Săn Sale Ngay", to: "/products?sale=true" },
    ctaSecond:  { label: "Xem Chi Tiết", to: "/products?sale=true" },
    emojis: ["🎁", "🎉", "🎊", "✨", "💝"],
    bg: "linear-gradient(135deg, #6c5ce7 0%, #a29bfe 50%, #fd79a8 100%)",
  },
  {
    id: 3,
    badge: "🎁 Quà Tặng",
    title: "COMBO QUÀ",
    highlight: "ĐẶC BIỆT",
    subtitle: "Tặng quà ngọt ngào cho người thân — Sinh nhật, Lễ Tết, Valentine...",
    ctaPrimary: { label: "Chọn Quà Ngay",    to: "/products?category=gift" },
    ctaSecond:  { label: "Gói Quà Miễn Phí", to: "/products?category=gift" },
    emojis: ["🎀", "🍫", "💝", "🎂", "🧁"],
    bg: "linear-gradient(135deg, #00b894 0%, #00cec9 50%, #74b9ff 100%)",
  },
];

const STATS = [
  { num: "500+",  label: "Sản phẩm" },
  { num: "10K+",  label: "Khách hàng" },
  { num: "4.9⭐", label: "Đánh giá" },
];

const EMOJI_POS = [
  { top: "10%", left: "38%" },
  { top: "33%", left: "8%"  },
  { top: "62%", left: "28%" },
  { top: "18%", left: "68%" },
  { top: "65%", left: "65%" },
];

const HeroBanner = () => {
  const [current,   setCurrent]   = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const t = setInterval(() => goTo((prev) => (prev + 1) % SLIDES.length), 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (idxOrFn) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idxOrFn);
      setAnimating(false);
    }, 280);
  };

  const slide = SLIDES[current];

  return (
    <section className="hero" style={{ background: slide.bg }}>
      <div className={`hero__content container ${animating ? "hero__content--out" : "hero__content--in"}`}>
        {/* Text */}
        <div className="hero__text">
          <span className="hero__badge">{slide.badge}</span>

          <h1 className="hero__title">
            {slide.title}{" "}
            <span className="hero__highlight">{slide.highlight}</span>
          </h1>

          <p className="hero__subtitle">{slide.subtitle}</p>

          <div className="hero__cta">
            <Link to={slide.ctaPrimary.to} className="hero__btn-primary">
              {slide.ctaPrimary.label} →
            </Link>
            <Link to={slide.ctaSecond.to} className="hero__btn-secondary">
              {slide.ctaSecond.label}
            </Link>
          </div>

          <div className="hero__stats">
            {STATS.map((s, i) => (
              <div key={s.label} className="hero__stat-group">
                {i > 0 && <span className="hero__stat-sep" />}
                <div className="hero__stat">
                  <span className="hero__stat-num">{s.num}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__circle" />
          <div className="hero__emojis">
            {slide.emojis.map((em, i) => (
              <span
                key={i}
                className="hero__emoji"
                style={{ top: EMOJI_POS[i].top, left: EMOJI_POS[i].left, "--i": i }}
              >
                {em}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="hero__controls">
        <button
          className="hero__arrow"
          onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Slide trước"
        >
          ‹
        </button>

        <div className="hero__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === current ? "hero__dot--active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          className="hero__arrow"
          onClick={() => goTo((current + 1) % SLIDES.length)}
          aria-label="Slide tiếp"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default HeroBanner;