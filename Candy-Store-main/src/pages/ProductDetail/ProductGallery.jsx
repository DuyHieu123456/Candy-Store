// src/pages/ProductDetail/ProductGallery.jsx
import "./ProductGallery.css";

const ProductGallery = ({ product }) => {
  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-gallery">
      <div className="product-gallery__badges">
        {discountPct && (
          <span className="product-gallery__badge product-gallery__badge--sale">
            -{discountPct}%
          </span>
        )}
        {product.isNew && (
          <span className="product-gallery__badge product-gallery__badge--new">
            Mới
          </span>
        )}
        {product.isBestSeller && (
          <span className="product-gallery__badge product-gallery__badge--hot">
            Hot
          </span>
        )}
      </div>

      <div className="product-gallery__main">
        {product.emoji || "🍬"}
      </div>
    </div>
  );
};

export default ProductGallery;
