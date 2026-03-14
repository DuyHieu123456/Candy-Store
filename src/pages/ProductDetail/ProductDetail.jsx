// src/pages/ProductDetail/ProductDetail.jsx
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/productService";
import { CATEGORIES } from "../../data/categories";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";
import RelatedProducts from "./RelatedProducts";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id);

  if (!product) {
    return (
      <section className="product-detail">
        <div className="container">
          <div className="product-detail__not-found">
            <span className="product-detail__not-found-icon">😕</span>
            <h2>Không tìm thấy sản phẩm</h2>
            <p>
              <Link to="/products" style={{ color: "var(--accent)" }}>
                ← Quay lại cửa hàng
              </Link>
            </p>
          </div>
        </div>
      </section>
    );
  }

  const cat = CATEGORIES.find((c) => c.slug === product.category);

  return (
    <section className="product-detail">
      <div className="container">
        {/* ── Breadcrumb ── */}
        <nav className="product-detail__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="product-detail__breadcrumb-sep">›</span>
          <Link to="/products">Sản phẩm</Link>
          {cat && (
            <>
              <span className="product-detail__breadcrumb-sep">›</span>
              <Link to={`/products?category=${cat.slug}`}>{cat.name}</Link>
            </>
          )}
          <span className="product-detail__breadcrumb-sep">›</span>
          <span className="product-detail__breadcrumb-current">{product.name}</span>
        </nav>

        {/* ── Gallery + Info ── */}
        <div className="product-detail__top">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {/* ── Related ── */}
        <RelatedProducts productId={product.id} category={product.category} />
      </div>
    </section>
  );
};

export default ProductDetail;
