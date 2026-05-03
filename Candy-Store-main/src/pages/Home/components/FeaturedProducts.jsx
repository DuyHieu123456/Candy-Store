import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";
import api from "../../../services/api"; // Kết nối trực tiếp port 5000
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        // Gọi API lấy kẹo có nhãn is_featured = 1
        const res = await api.get("/products/featured"); 
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Lỗi lấy sản phẩm nổi bật:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Giao diện khi đang tải dữ liệu để tránh trang bị trống[cite: 16]
  if (loading) {
    return (
      <div className="container featured-loading">
        <div className="loader-candy">🍭</div>
        <p>Đang tìm kẹo ngon cho bạn...</p>
      </div>
    );
  }

  return (
    <section className="featured-section">
      <div className="container">
        {/* Tiêu đề được thiết kế lại để thu hút sự chú ý[cite: 16] */}
        <div className="featured-section__header">
          <div className="featured-section__title-group">
            <h2 className="featured-section__title">SẢN PHẨM NỔI BẬT ⭐</h2>
            <div className="featured-section__divider"></div>
            <p className="featured-section__sub">Những cực phẩm kẹo ngọt không thể bỏ qua</p>
          </div>
          <Link to="/products" className="featured-section__view-all">
            XEM TẤT CẢ
          </Link>
        </div>

        {/* Lưới sản phẩm sử dụng ProductCard đã được cải thiện[cite: 16] */}
        <div className="featured-section__grid">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <p className="featured-empty">Hiện chưa có sản phẩm nổi bật nào.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;