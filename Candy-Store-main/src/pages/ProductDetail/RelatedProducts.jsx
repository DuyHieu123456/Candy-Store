import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard/ProductCard";
import { getRelatedProducts } from "../../services/productService"; // Import hàm async đã tối ưu[cite: 31, 62]
import "./RelatedProducts.css";

/**
 * RelatedProducts - Thành phần hiển thị các loại kẹo cùng danh mục.
 * Đã sửa lỗi: Chuyển sang xử lý bất đồng bộ để khớp với API Backend[cite: 31].
 */
const RelatedProducts = ({ productId, category }) => {
  const [related, setRelated] = useState([]); // Khởi tạo mảng kẹo liên quan trống
  const [loading, setLoading] = useState(true);

  /**
   * Hiệu ứng: Tự động tìm kẹo tương tự khi xem một sản phẩm mới.
   * Category ở đây chính là category_id được truyền từ ProductDetail.
   */
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        // getRelatedProducts gọi API lấy tối đa 4 sản phẩm cùng loại[cite: 31]
        const data = await getRelatedProducts(productId, category, 4); 
        setRelated(data);
      } catch (error) {
        console.error("Không thể tải kẹo liên quan:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId && category) {
      fetchRelated();
    }
  }, [productId, category]);

  // Không hiển thị section nếu đang tải hoặc không có kẹo nào liên quan
  if (loading || related.length === 0) return null; 

  return (
    <section className="related-products">
      <h2 className="related-products__title">Có thể bạn cũng thích 🍬</h2>
      <div className="related-products__grid">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} /> 
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;