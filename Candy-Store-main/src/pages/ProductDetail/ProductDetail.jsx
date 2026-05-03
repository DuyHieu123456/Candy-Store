import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../../services/productService"; // Sử dụng hàm đã tối ưu[cite: 31, 48]
import { CATEGORIES } from "../../data/categories"; //
import ProductGallery from "./ProductGallery"; //[cite: 48, 50]
import ProductInfo from "./ProductInfo"; //[cite: 48, 52]
import RelatedProducts from "./RelatedProducts"; //[cite: 48, 54]
import "./ProductDetail.css"; //[cite: 47, 48]

/**
 * ProductDetail - Trang chi tiết sản phẩm kẹo.
 * Quản lý việc lấy dữ liệu chi tiết và hiển thị bố cục trang[cite: 41, 48].
 */
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Hiệu ứng: Lấy dữ liệu từ API và cuộn lên đầu trang mỗi khi ID thay đổi[cite: 31, 40, 48].
   */
  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        // productService.getById trả về object { success, data }
        const res = await getProductById(id); 
        if (res.success) {
          setProduct(res.data); // Gán dữ liệu sản phẩm đã chuẩn hóa
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Lỗi lấy dữ liệu kẹo:", error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
    window.scrollTo(0, 0); // Đảm bảo luôn bắt đầu từ đầu trang
  }, [id]);

  // Trạng thái chờ dữ liệu[cite: 48]
  if (isLoading) {
    return (
      <section className="product-detail">
        <div className="container" style={{ textAlign: "center", padding: "80px" }}>
          <span style={{ fontSize: "2rem" }}>🍬</span>
          <p>Đang mở túi kẹo của bạn...</p>
        </div>
      </section>
    );
  }

  // Trạng thái không tìm thấy kẹo[cite: 48]
  if (!product) {
    return (
      <section className="product-detail">
        <div className="container">
          <div className="product-detail__not-found">
            <span className="product-detail__not-found-icon">😕</span>
            <h2>Không tìm thấy loại kẹo này</h2>
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

  /**
   * Tìm danh mục dựa trên category_id đã chuẩn hóa từ Database[cite: 31, 48].
   */
  const cat = CATEGORIES.find((c) => String(c.id) === String(product.category_id));

  return (
    <section className="product-detail">
      <div className="container">
        {/* ── Breadcrumb động: Giúp điều hướng linh hoạt[cite: 41, 48] ── */}
        <nav className="product-detail__breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="product-detail__breadcrumb-sep">›</span>
          <Link to="/products">Cửa hàng</Link>
          {cat && (
            <>
              <span className="product-detail__breadcrumb-sep">›</span>
              <Link to={`/products?category=${cat.slug}`}>{cat.name}</Link>
            </>
          )}
          <span className="product-detail__breadcrumb-sep">›</span>
          <span className="product-detail__breadcrumb-current">{product.name}</span>
        </nav>

        {/* ── Khu vực chính: Hình ảnh và Thông tin mua sắm[cite: 41, 48] ── */}
        <div className="product-detail__top">
          <ProductGallery product={product} />
          <ProductInfo product={product} />
        </div>

        {/* ── Các sản phẩm liên quan cùng danh mục[cite: 31, 48, 54] ── */}
        <RelatedProducts productId={product.id} category={product.category_id} />
      </div>
    </section>
  );
};

export default ProductDetail;