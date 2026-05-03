import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api"; // Import axios instance đã có Token
import "./HeroBanner.css";

const EMOJI_POS = [
  { top: "10%", left: "38%" }, { top: "33%", left: "8%" },
  { top: "62%", left: "28%" }, { top: "18%", left: "68%" },
  { top: "65%", left: "65%" },
];

const HeroBanner = () => {
  const [banners, setBanners] = useState([]); 
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimatig] = useState(false); // Trạng thái hỗ trợ hiệu ứng chuyển cảnh

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/banners?position=hero");
        if (res.data.success) setBanners(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy banner:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Tự động chuyển slide mỗi 5 giây
  useEffect(() => {
    if (banners.length > 0) {
      const t = setInterval(() => {
        handleNext();
      }, 5000);
      return () => clearInterval(t);
    }
  }, [banners, current]);

  const handleNext = () => {
    setAnimatig(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
      setAnimatig(false);
    }, 300); // Khớp với thời gian transition opacity trong CSS
  };

  if (loading || banners.length === 0) return <div className="hero-loader">Đang nạp kẹo...</div>;

  const slide = banners[current];
  // Sử dụng màu nền từ database hoặc gradient mặc định chuẩn Funhouse
  const dynamicBg = slide.background_color || "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)";

  return (
    <section className="hero" style={{ background: dynamicBg }}>
      <div className={`hero__content container ${animating ? "hero__content--out" : "hero__content--in"}`}>
        <div className="hero__text">
          <span className="hero__badge">🍬 {slide.badge_text || "Mới Nhất"}</span>
          <h1 className="hero__title">
            {/* Tách title để tạo hiệu ứng highlight nếu cần */}
            {slide.title}
          </h1>
          <p className="hero__subtitle">{slide.subtitle}</p>
          
          <div className="hero__cta">
            <Link to={slide.link || "/products"} className="hero__btn-primary">
              {slide.btn_text || "MUA NGAY"} →
            </Link>
            {/* Thêm nút phụ nếu trang mẫu có chương trình song song */}
            <Link to="/products?sale=true" className="hero__btn-secondary">
              KHÁM PHÁ THÊM
            </Link>
          </div>

          <div className="hero__stats">
            <div className="hero__stat-group">
              <div className="hero__stat">
                <span className="hero__stat-num">500+</span>
                <span className="hero__stat-label">Loại kẹo</span>
              </div>
              <div className="hero__stat-sep" />
              <div className="hero__stat">
                <span className="hero__stat-num">24h</span>
                <span className="hero__stat-label">Giao hàng</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phần visual giữ nguyên hiệu ứng emoji đặc trưng của bạn */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__circle" />
          <div className="hero__emojis">
            {["🍭", "🍬", "🍫", "🧁", "🍰"].map((em, i) => (
              <span 
                key={i} 
                className="hero__emoji" 
                style={{ 
                  top: EMOJI_POS[i].top, 
                  left: EMOJI_POS[i].left, 
                  "--i": i 
                }}
              >
                {em}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero__controls">
        <div className="hero__dots">
          {banners.map((_, i) => (
            <button 
              key={i} 
              className={`hero__dot ${i === current ? "hero__dot--active" : ""}`} 
              onClick={() => {
                setAnimatig(true);
                setTimeout(() => {
                  setCurrent(i);
                  setAnimatig(false);
                }, 300);
              }}
              aria-label={`Chuyển đến slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;