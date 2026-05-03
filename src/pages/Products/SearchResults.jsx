// src/pages/Products/SearchResults.jsx
import { CATEGORIES } from "../../data/categories";

const SearchResults = ({ filters, totalCount }) => {
  let heading = "Tất cả sản phẩm";

  if (filters.search) {
    heading = `Kết quả cho "${filters.search}"`;
  } else if (filters.sale) {
    heading = "🏷️ Khuyến Mãi";
  } else if (filters.category) {
    const cat = CATEGORIES.find((c) => c.slug === filters.category);
    heading = cat ? `${cat.emoji} ${cat.name}` : filters.category;
  }

  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
      <h2 style={{ margin: 0 }}>{heading}</h2>
      <span style={{ fontSize: "0.85rem", color: "var(--text)", opacity: 0.7 }}>
        {totalCount} sản phẩm
      </span>
    </div>
  );
};

export default SearchResults;
