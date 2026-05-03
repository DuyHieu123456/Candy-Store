// src/pages/Home/Home.jsx
import HeroBanner          from "./components/HeroBanner";
import CategorySection     from "./components/CategorySection";
import PromoBanner         from "./components/PromoBanner";
import FlashSale           from "./components/FlashSale";
import FeaturedProducts    from "./components/FeaturedProducts";
import TestimonialsSection from "./components/TestimonialsSection";

// Import CSS riêng cho trang chủ (nếu bạn chưa có, hãy tạo file này)
import "./Home.css";

const Home = () => (
  <main className="home-funhouse">
    {/* 1. Slider banner chính - Điểm chạm thị giác đầu tiên */}
    <section className="home-section home-hero">
      <HeroBanner />
    </section>

    {/* 2. Danh mục sản phẩm - Giúp khách hàng phân loại kẹo nhanh chóng[cite: 20] */}
    <section className="home-section home-categories">
      <CategorySection />
    </section>

    {/* 3. Banner khuyến mãi - Thúc đẩy sự chú ý vào các ưu đãi lớn[cite: 20] */}
    <section className="home-section home-promo">
      <PromoBanner />
    </section>

    {/* 4. Flash sale + đếm ngược - Tạo cảm giác cấp bách để chốt đơn[cite: 20] */}
    <section className="home-section home-flash-sale">
      <FlashSale />
    </section>

    {/* 5. Sản phẩm nổi bật - Trưng bày những loại kẹo bán chạy nhất[cite: 20] */}
    <section className="home-section home-featured">
      <FeaturedProducts />
    </section>

    {/* 6. Đánh giá khách hàng - Xây dựng niềm tin thông qua trải nghiệm thực tế[cite: 20] */}
    <section className="home-section home-testimonials">
      <TestimonialsSection />
    </section>
  </main>
);

export default Home;