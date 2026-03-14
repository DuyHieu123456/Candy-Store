// src/pages/Home/components/TestimonialsSection.jsx
import { useState } from "react";
import { TESTIMONIALS } from "../../../data/testimonials";
import "./TestimonialsSection.css";

const TestimonialsSection = () => {
  const [active, setActive] = useState(0);
  const total = TESTIMONIALS.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  // Show 3 cards (center is highlighted)
  const visible = [0, 1, 2].map((offset) => TESTIMONIALS[(active + offset) % total]);

  return (
    <section className="testi-section">
      <div className="container">
        <div className="testi-section__header">
          <h2 className="testi-section__title">Khách Hàng Nói Gì? 💬</h2>
          <p className="testi-section__sub">Hơn 10.000 khách hàng hài lòng trên toàn quốc</p>
        </div>

        <div className="testi-section__wrapper">
          <button className="testi-section__arrow" onClick={prev} aria-label="Trước">‹</button>

          <div className="testi-section__grid">
            {visible.map((r, i) => (
              <div key={r.id} className={`testi-card ${i === 1 ? "testi-card--featured" : ""}`}>
                <div className="testi-card__stars">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </div>
                <p className="testi-card__comment">"{r.comment}"</p>
                <p className="testi-card__product">🛒 {r.product}</p>
                <div className="testi-card__author">
                  <span className="testi-card__avatar">{r.avatar}</span>
                  <div>
                    <p className="testi-card__name">{r.name}</p>
                    <p className="testi-card__loc">📍 {r.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="testi-section__arrow" onClick={next} aria-label="Tiếp">›</button>
        </div>

        <div className="testi-section__dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`testi-section__dot ${i === active ? "testi-section__dot--active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Đánh giá ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;