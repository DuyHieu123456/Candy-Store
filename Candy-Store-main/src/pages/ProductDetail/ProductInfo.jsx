import { useState } from "react";
import useCart from "../../hooks/useCart"; // Hook đã tối ưu ở các bước trước[cite: 12, 20]
import "./ProductInfo.css";

/**
 * ProductInfo - Hiển thị thông tin chi tiết và bộ chọn mua hàng.
 * Đã khắc phục: Đồng bộ hàm addToCart và tối ưu hóa logic thêm vào giỏ[cite: 12, 67].
 */
const ProductInfo = ({ product }) => {
  // 1. Trích xuất đúng các hàm từ CartContext[cite: 12, 20]
  const { addToCart, openDrawer } = useCart(); 
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Tính toán tỷ lệ giảm giá (yêu cầu Backend cung cấp originalPrice)[cite: 67]
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  /**
   * Xử lý thêm vào giỏ hàng.
   * Cải tiến: Gọi addToCart một lần với tham số quantity thay vì dùng vòng lặp.
   */
  const handleAdd = () => {
    if (product.stock <= 0) return;

    addToCart(product, qty); // Truyền số lượng đã chọn
    setJustAdded(true);
    
    // Tạo hiệu ứng phản hồi và tự động mở Drawer giỏ hàng[cite: 12, 67]
    setTimeout(() => {
      setJustAdded(false);
      if (openDrawer) openDrawer(); 
    }, 800);
  };

  return (
    <div className="product-info">
      {/* Thương hiệu và Tên kẹo đã chuẩn hóa */}
      <p className="product-info__brand">{product.brand || "CANDY STORE"}</p>
      <h1 className="product-info__name">{product.name}</h1>

      {/* Đánh giá sao (Dữ liệu bổ trợ từ Backend)[cite: 67] */}
      <div className="product-info__rating">
        <span className="product-info__stars">
          {"★".repeat(Math.round(product.rating || 0))}
          {"☆".repeat(5 - Math.round(product.rating || 0))}
        </span>
        <span className="product-info__review-count">
          ({product.reviewCount || 0} ĐÁNH GIÁ)
        </span>
      </div>

      {/* Giá kẹo định dạng VNĐ[cite: 67] */}
      <div className="product-info__price-row">
        <span className="product-info__price">
          {product.price.toLocaleString("vi-VN")}đ
        </span>
        {product.originalPrice && (
          <>
            <span className="product-info__original-price">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
            {discountPct && (
              <span className="product-info__discount">TIẾT KIỆM {discountPct}%</span>
            )}
          </>
        )}
      </div>

      <p className="product-info__desc">{product.description}</p>

      {/* Hiển thị tồn kho thực tế từ Database[cite: 31, 67] */}
      <p
        className={`product-info__stock ${
          product.stock > 0 ? "product-info__stock--in" : "product-info__stock--out"
        }`}
      >
        {product.stock > 0 
          ? `✓ CÒN HÀNG (CHỈ CÒN ${product.stock} TÚI)` 
          : "✕ HIỆN ĐANG HẾT HÀNG"}
      </p>

      {/* Bộ điều khiển số lượng và nút mua hàng[cite: 67] */}
      <div className="product-info__actions">
        <div className="product-info__qty">
          <button
            className="product-info__qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1 || product.stock <= 0}
          >
            −
          </button>
          <span className="product-info__qty-val">{qty}</span>
          <button
            className="product-info__qty-btn"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={qty >= product.stock || product.stock <= 0}
          >
            +
          </button>
        </div>

        <button
          className={`product-info__add-btn ${justAdded ? "product-info__add-btn--added" : ""}`}
          onClick={handleAdd}
          disabled={product.stock <= 0}
        >
          {justAdded ? "✓ ĐÃ THÊM VÀO GIỎ!" : "THÊM VÀO GIỎ HÀNG"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;