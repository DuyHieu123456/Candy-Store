import "./ProductGallery.css"; // Tích hợp các hiệu ứng hiển thị và bo góc[cite: 71, 72]

/**
 * ProductGallery - Thành phần hiển thị hình ảnh và nhãn trạng thái của kẹo.
 * Tối ưu: Hiển thị ảnh thực tế từ SQL Server và tự động tính toán nhãn giảm giá.
 */
const ProductGallery = ({ product }) => {
  /**
   * 1. Tính toán tỷ lệ giảm giá (%).
   * Chỉ hiển thị nếu có giá gốc (originalPrice) cao hơn giá hiện tại.
   */
  const discountPct = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-gallery">
      {/* 2. Hệ thống nhãn trạng thái (Badges) treo trên ảnh[cite: 71, 72] */}
      <div className="product-gallery__badges">
        {discountPct && (
          <span className="product-gallery__badge product-gallery__badge--sale">
            -{discountPct}%
          </span>
        )}
        {product.isNew && (
          <span className="product-gallery__badge product-gallery__badge--new">
            Mới về
          </span>
        )}
        {product.isBestSeller && (
          <span className="product-gallery__badge product-gallery__badge--hot">
            Bán chạy
          </span>
        )}
      </div>

      {/* 3. Khu vực hiển thị ảnh chính[cite: 71, 72] */}
      <div className="product-gallery__main">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="product-gallery__img"
            loading="lazy" 
          />
        ) : (
          /* Fallback: Hiển thị Emoji nếu kẹo chưa có ảnh trên Database[cite: 31, 72] */
          <span className="product-gallery__placeholder-icon">
            {product.emoji || "🍬"}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;