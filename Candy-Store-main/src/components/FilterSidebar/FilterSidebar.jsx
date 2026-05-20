import { CATEGORIES } from "../../data/categories";
import { COUNTRIES, DIETARY_OPTIONS } from "../../data/products";
import { PRICE_RANGES } from "../../services/productService";
import "./FilterSidebar.css";

const FilterSidebar = ({ filters, onCategory, onPriceRange, onSale, onCountry, onDietary, onReset }) => {
  const isAllActive = !filters.category && !filters.sale;

  return (
    <aside className="filter-sidebar">
      {/* ── Danh mục ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">📂 DANH MỤC KẸO</h3>
        <ul className="filter-sidebar__list">
          <li>
            <button
              className={`filter-sidebar__item ${isAllActive ? "filter-sidebar__item--active" : ""}`}
              onClick={() => onCategory("")}
            >
              <span className="item-emoji">🏪</span> Tất cả sản phẩm
            </button>
          </li>

          {CATEGORIES.filter((c) => c.slug !== "sale").map((cat) => (
            <li key={cat.id}>
              <button
                className={`filter-sidebar__item ${filters.category === cat.slug ? "filter-sidebar__item--active" : ""}`}
                onClick={() => onCategory(cat.slug)}
              >
                <span className="item-emoji">{cat.emoji}</span>
                <span className="item-name">{cat.name}</span>
                {cat.count > 0 && (
                  <span className="filter-sidebar__count">{cat.count}</span>
                )}
              </button>
            </li>
          ))}

          <li>
            <button
              className={`filter-sidebar__item filter-sidebar__item--hot ${filters.sale ? "filter-sidebar__item--active" : ""}`}
              onClick={() => onSale(!filters.sale)}
            >
              <span className="item-emoji">🏷️</span> Kẹo Giảm Giá 🔥
            </button>
          </li>
        </ul>
      </div>

      {/* ── Xuất xứ ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">🌍 XUẤT XỨ</h3>
        <ul className="filter-sidebar__list">
          {COUNTRIES.map((c) => (
            <li key={c.slug}>
              <button
                className={`filter-sidebar__item ${filters.country === c.slug ? "filter-sidebar__item--active" : ""}`}
                onClick={() => onCountry(filters.country === c.slug ? "" : c.slug)}
              >
                <span className="item-emoji">{c.emoji}</span> {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Chế độ ăn ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">🥗 CHẾ ĐỘ ĂN</h3>
        <ul className="filter-sidebar__list">
          {DIETARY_OPTIONS.map((d) => (
            <li key={d.slug}>
              <button
                className={`filter-sidebar__item ${filters.dietary === d.slug ? "filter-sidebar__item--active" : ""}`}
                onClick={() => onDietary(filters.dietary === d.slug ? "" : d.slug)}
              >
                <span className="item-emoji">{d.emoji}</span> {d.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Khoảng giá ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">💰 KHOẢNG GIÁ</h3>
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
      <div className="filter-sidebar__footer">
        <button className="filter-sidebar__reset" onClick={onReset}>
          🗑️ LÀM MỚI BỘ LỌC
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
