// src/pages/Products/ProductGrid.jsx
import ProductCard from "../../components/ProductCard/ProductCard";
import "./ProductGrid.css";

const ProductGrid = ({ products }) => {
  if (!products.length) {
    return (
      <div className="product-grid__empty">
        <span className="product-grid__empty-icon">😕</span>
        <p>Không tìm thấy sản phẩm nào</p>
        <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>
          Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
};

export default ProductGrid;
