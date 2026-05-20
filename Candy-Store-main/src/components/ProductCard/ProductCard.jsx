// src/components/ProductCard/ProductCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import useWishlist from "../../hooks/useWishlist";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart, openDrawer } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // Ảnh dự phòng chất lượng cao từ Unsplash
  const CANDY_FALLBACK = "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&h=400&auto=format&fit=crop";

  const discountPct = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    addToCart(product); 
    setJustAdded(true);
    
    setTimeout(() => {
      setJustAdded(false);
      openDrawer(); 
    }, 600);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__badges">
        {discountPct && (
          <span className="badge badge--sale">-{discountPct}%</span>
        )}
        {product.isNew && <span className="badge badge--new">Mới</span>}
        {product.isBestSeller && (
          <span className="badge badge--hot">🔥 Hot</span>
        )}
      </div>

      <button
        className={`product-card__wishlist ${inWishlist ? "product-card__wishlist--active" : ""}`}
        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
        aria-label={inWishlist ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
      >
        {inWishlist ? "♥" : "♡"}
      </button>

      <div className="product-card__img-wrap">
        <img
          src={product.image || CANDY_FALLBACK}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = CANDY_FALLBACK;
          }}
        />
      </div>

      <div className="product-card__info">
        <p className="product-card__brand">{product.brand || "Candy Funhouse"}</p>
        <h3 className="product-card__name">{product.name}</h3>

        <div className="product-card__rating">
          <span className="product-card__stars">
            {"★".repeat(Math.round(product.rating || 0))}
            {"☆".repeat(5 - Math.round(product.rating || 0))}
          </span>
          <span className="product-card__review-count">
            ({product.reviewCount || 0})
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