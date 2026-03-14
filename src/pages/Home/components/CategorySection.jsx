// src/pages/Home/components/CategorySection.jsx
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../../data/categories";
import "./CategorySection.css";

const CategorySection = () => (
  <section className="cat-section">
    <div className="container">
      <div className="cat-section__header">
        <h2 className="cat-section__title">Danh Mục Sản Phẩm</h2>
        <p className="cat-section__sub">Khám phá thế giới bánh kẹo đa dạng 🍭</p>
      </div>

      <div className="cat-section__grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={cat.slug === "sale" ? "/products?sale=true" : `/products?category=${cat.slug}`}
            className="cat-card"
            style={{ "--cc": cat.color, "--cbg": cat.bg }}
          >
            {cat.hot && <span className="cat-card__hot">HOT</span>}

            <div className="cat-card__icon-wrap">
              <span className="cat-card__icon">{cat.emoji}</span>
            </div>

            <span className="cat-card__name">{cat.name}</span>
            <span className="cat-card__count">
              {cat.count > 0 ? `${cat.count}+ sp` : "Đang sale"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategorySection;