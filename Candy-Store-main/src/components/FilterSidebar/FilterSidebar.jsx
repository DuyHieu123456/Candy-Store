import { CATEGORIES } from "../../data/categories"; // Danh mục cố định hoặc từ API
import { PRICE_RANGES } from "../../services/productService"; // Hằng số giá đã tối ưu
import "./FilterSidebar.css"; // Tích hợp phong cách bố cục linh hoạt

/**
 * FilterSidebar - Bộ lọc kẹo đa năng.
 * Cho phép khách hàng tinh chỉnh danh sách kẹo theo loại, túi tiền và ưu đãi[cite: 40].
 */
const FilterSidebar = ({ filters, onCategory, onPriceRange, onSale, onReset }) => {
  
  // Xác định trạng thái "Tất cả": Khi không chọn loại kẹo cụ thể và không lọc giảm giá.
  const isAllActive = !filters.category && !filters.sale;

  return (
    <aside className="filter-sidebar">
      {/* ── Phần 1: Phân loại kẹo theo danh mục ── */}
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

          {/* Duyệt qua danh sách danh mục để tạo các nút lọc nhanh */}
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

          {/* Mục "Khuyến Mãi" được thiết kế nổi bật để kích thích mua sắm */}
          <li>
            <button
              className={`filter-sidebar__item filter-sidebar__item--hot ${
                filters.sale ? "filter-sidebar__item--active" : ""
              }`}
              onClick={() => onSale(!filters.sale)}
            >
              <span className="item-emoji">🏷️</span> Kẹo Giảm Giá 🔥
            </button>
          </li>
        </ul>
      </div>

      {/* ── Phần 2: Lọc theo ngân sách (Price Ranges) ── */}
      <div className="filter-sidebar__section">
        <h3 className="filter-sidebar__title">💰 KHOẢNG GIÁ</h3>
        <ul className="filter-sidebar__list">
          {PRICE_RANGES.map((range, idx) => (
            <li key={idx}>
              <button
                className={`filter-sidebar__item ${filters.priceRange === idx ? "filter-sidebar__item--active" : ""}`}
                // Logic Toggle: Nhấn vào khoảng giá đang chọn sẽ bỏ lọc giá đó.
                onClick={() => onPriceRange(filters.priceRange === idx ? null : idx)}
              >
                {range.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Phần 3: Thiết lập lại (Reset) ── */}
      <div className="filter-sidebar__footer">
        <button 
          className="filter-sidebar__reset" 
          onClick={onReset}
          title="Xóa tất cả các bộ lọc hiện tại"
        >
          🗑️ LÀM MỚI BỘ LỌC
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;