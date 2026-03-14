// src/pages/Home/components/FlashSale.jsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";
import useCountdown from "../../../hooks/useCountdown";
import { getSaleProducts } from "../../../data/products";
import "./FlashSale.css";

const pad = (n) => String(n).padStart(2, "0");

const FlashSale = () => {
  // Target: end of today
  const endOfDay = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  }, []);

  const { h, m, s } = useCountdown(endOfDay);

  const products = useMemo(() => getSaleProducts(), []);

  return (
    <section className="flash-section">
      <div className="container">
        {/* Header */}
        <div className="flash-section__header">
          <div className="flash-section__title-wrap">
            <span className="flash-section__bolt">⚡</span>
            <h2 className="flash-section__title">FLASH SALE</h2>
            <span className="flash-section__bolt">⚡</span>
          </div>

          <div className="flash-section__countdown">
            <span className="flash-section__cd-label">Kết thúc sau:</span>
            <div className="flash-section__cd-boxes">
              {[{ v: h, u: "GIỜ" }, { v: m, u: "PHÚT" }, { v: s, u: "GIÂY" }].map(({ v, u }, i) => (
                <div key={u} className="flash-section__cd-item">
                  {i > 0 && <span className="flash-section__cd-sep">:</span>}
                  <div className="flash-section__cd-box">
                    <span className="flash-section__cd-num">{pad(v)}</span>
                    <span className="flash-section__cd-unit">{u}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/products?sale=true" className="flash-section__view-all">
            Xem Tất Cả →
          </Link>
        </div>

        {/* Products */}
        <div className="flash-section__grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;