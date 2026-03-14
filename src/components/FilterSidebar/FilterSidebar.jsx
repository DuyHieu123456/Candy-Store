// src/components/FilterSidebar/FilterSidebar.jsx
import { CATEGORIES } from "../../data/categories";
import { PRICE_RANGES } from "../../services/productService";
import "./FilterSidebar.css";

const FilterSidebar = ({ filters, onCategory, onPriceRange, onSale, onReset }) => {
  return (
    <aside className="filter-sidebar">
      {/* ── Danh mục ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">📂 Danh mục</h3>
        <ul className="filter-sidebar__list">
          <li>
            <button
              className={`filter-sidebar__item ${!filters.category && !filters.sale ? "filter-sidebar__item--active" : ""}`}
              onClick={() => onCategory("")}
            >
              🏪 Tất cả
            </button>
          </li>
          {CATEGORIES.filter((c) => c.slug !== "sale").map((cat) => (
            <li key={cat.id}>
              <button
                className={`filter-sidebar__item ${filters.category === cat.slug ? "filter-sidebar__item--active" : ""}`}
                onClick={() => onCategory(cat.slug)}
              >
                {cat.emoji} {cat.name}
                <span className="filter-sidebar__count">{cat.count}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              className={`filter-sidebar__item ${filters.sale ? "filter-sidebar__item--active filter-sidebar__item--hot" : ""}`}
              onClick={() => onSale(!filters.sale)}
            >
              🏷️ Khuyến Mãi
            </button>
          </li>
        </ul>
      </div>

      {/* ── Khoảng giá ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">💰 Khoảng giá</h3>
        <ul className="filter-sidebar__list">
          {PRICE_RANGES.map((range, idx) => (
            <li key={idx}>
              <button
                className={`filter-sidebar__item ${filters.priceRange === idx ? "filter-sidebar__item--active" : ""}`}
                onClick={() => onPriceRange(filters.priceRange === idx ? null : idx)}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Reset ── */}
      <button className="filter-sidebar__reset" onClick={onReset}>
        🗑️ Xóa bộ lọc
      </button>
    </aside>
  );
};

export default FilterSidebar;
