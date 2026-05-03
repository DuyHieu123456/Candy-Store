// src/pages/Home/components/FeaturedProducts.jsx
import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";
import { getFeaturedProducts } from "../../../data/products";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const products = useMemo(() => getFeaturedProducts(), []);

  return (
    <section className="featured-section">
      <div className="container">
        <div className="featured-section__header">
          <div>
            <h2 className="featured-section__title">Sản Phẩm Nổi Bật ⭐</h2>
            <p className="featured-section__sub">Những sản phẩm được yêu thích nhất tuần này</p>
          </div>
          <Link to="/products" className="featured-section__view-all">
            Xem Tất Cả →
          </Link>
        </div>

        <div className="featured-section__grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;