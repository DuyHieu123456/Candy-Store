// src/pages/Home/Home.jsx
import HeroBanner          from "./components/HeroBanner";
import CategorySection     from "./components/CategorySection";
import PromoBanner         from "./components/PromoBanner";
import FlashSale           from "./components/FlashSale";
import FeaturedProducts    from "./components/FeaturedProducts";
import TestimonialsSection from "./components/TestimonialsSection";

const Home = () => (
  <>
    {/* 1. Slider banner chính */}
    <HeroBanner />

    {/* 2. Danh mục sản phẩm */}
    <CategorySection />

    {/* 3. Banner khuyến mãi */}
    <PromoBanner />

    {/* 4. Flash sale + đếm ngược */}
    <FlashSale />

    {/* 5. Sản phẩm nổi bật */}
    <FeaturedProducts />

    {/* 6. Đánh giá khách hàng */}
    <TestimonialsSection />
  </>
);

export default Home;