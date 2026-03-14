// src/pages/ProductDetail/RelatedProducts.jsx
import ProductCard from "../../components/ProductCard/ProductCard";
import { getRelatedProducts } from "../../services/productService";
import "./RelatedProducts.css";

const RelatedProducts = ({ productId, category }) => {
  const related = getRelatedProducts(productId, category);

  if (!related.length) return null;

  return (
    <section className="related-products">
      <h2 className="related-products__title">Sản phẩm liên quan</h2>
      <div className="related-products__grid">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
