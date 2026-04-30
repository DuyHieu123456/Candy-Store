// src/components/ProductCard/ProductCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      {/* ── Badges ── */}
      <div className="product-card__badges">
        {discountPct && (
          <span className="badge badge--sale">-{discountPct}%</span>
        )}
        {product.isNew && <span className="badge badge--new">Mới</span>}
        {product.isBestSeller && (
          <span className="badge badge--hot">🔥 Hot</span>
        )}
      </div>

      {/* ── Wishlist ── */}
      <button
        className="product-card__wishlist"
        onClick={(e) => e.preventDefault()}
        aria-label="Thêm vào yêu thích"
      >
        ♡
      </button>

      {/* ── Image ── */}
      <div className="product-card__img-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="product-card__img"
            loading="lazy"
          />
        ) : (
          <div className="product-card__img-placeholder">
            <span>{product.emoji || "🍬"}</span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="product-card__info">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__rating">
          <span className="product-card__stars">
            {"★".repeat(Math.round(product.rating))}
            {"☆".repeat(5 - Math.round(product.rating))}
          </span>
          <span className="product-card__review-count">
            ({product.reviewCount})
          </span>
        </div>

        <div className="product-card__price-row">
          <span className="product-card__price">
            {product.price.toLocaleString("vi-VN")}đ
          </span>
          {product.originalPrice && (
            <span className="product-card__original-price">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </span>
          )}
        </div>

        <button
          className={`product-card__add-btn ${justAdded ? "product-card__add-btn--added" : ""}`}
          onClick={handleAddToCart}
        >
          {justAdded ? "✓ Đã thêm!" : "🛒 Thêm vào giỏ"}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;