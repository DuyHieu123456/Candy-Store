// src/pages/ProductDetail/ProductInfo.jsx
import { useState } from "react";
import useCart from "../../hooks/useCart";
import "./ProductInfo.css";

const ProductInfo = ({ product }) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div className="product-info">
      <p className="product-info__brand">{product.brand}</p>
      <h1 className="product-info__name">{product.name}</h1>

      <div className="product-info__rating">
        <span className="product-info__stars">
          {"★".repeat(Math.round(product.rating))}
          {"☆".repeat(5 - Math.round(product.rating))}
        </span>
        <span className="product-info__review-count">
          ({product.reviewCount} đánh giá)
        </span>
      </div>

      <div className="product-info__price-row">
        <span className="product-info__price">
          {product.price.toLocaleString("vi-VN")}đ
        </span>
        {product.originalPrice && (
          <span className="product-info__original-price">
            {product.originalPrice.toLocaleString("vi-VN")}đ
          </span>
        )}
        {discountPct && (
          <span className="product-info__discount">-{discountPct}%</span>
        )}
      </div>

      <p className="product-info__desc">{product.description}</p>

      <p
        className={`product-info__stock ${product.stock > 0 ? "product-info__stock--in" : "product-info__stock--out"}`}
      >
        {product.stock > 0 ? `✓ Còn hàng (${product.stock})` : "✕ Hết hàng"}
      </p>

      <div className="product-info__actions">
        <div className="product-info__qty">
          <button
            className="product-info__qty-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="product-info__qty-val">{qty}</span>
          <button
            className="product-info__qty-btn"
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            disabled={qty >= product.stock}
          >
            +
          </button>
        </div>

        <button
          className={`product-info__add-btn ${justAdded ? "product-info__add-btn--added" : ""}`}
          onClick={handleAdd}
          disabled={product.stock <= 0}
        >
          {justAdded ? "✓ Đã thêm vào giỏ!" : "🛒 Thêm vào giỏ hàng"}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
