import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useProducts from "../../store/productStore"; // Quản lý trạng thái kẹo toàn cục
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import SearchResults from "./SearchResults";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import "./Products.css"; // Tích hợp phong cách bố cục linh hoạt

/**
 * Products Page - Trung tâm mua sắm kẹo.
 * Kết nối logic lọc từ productService và hiển thị sản phẩm theo phân trang.
 */
const Products = () => {
  // 1. Lấy dữ liệu và các hàm điều khiển từ Store[cite: 40]
  const {
    products,
    totalPages,
    totalCount,
    currentPage,
    filters,
    setCategory,
    setSearch,
    setSale,
    setPage,
    setPriceRange,
    resetFilters,
  } = useProducts();

  const [drawerOpen, setDrawerOpen] = useState(false);

  /**
   * 2. Hiệu ứng cuộn: Tự động đưa khách hàng lên đầu danh sách kẹo 
   * khi họ chuyển trang hoặc thay đổi bộ lọc[cite: 40].
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, filters]);

  // Đóng Drawer lọc sau khi khách chọn một tiêu chí (Dành cho Mobile)[cite: 40]
  const handleFilterAction = (filterFn) => (...args) => {
    filterFn(...args);
    setDrawerOpen(false);
  };

  return (
    <main className="products-page">
      <div className="container">
        {/* ── Breadcrumb: Giúp khách dễ dàng quay lại trang chủ ── */}
        <nav className="products-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">Thế giới kẹo</span>
        </nav>

        {/* ── Header: Tiêu đề và Tìm kiếm kẹo nhanh ── */}
        <header className="products-page__header">
          <div className="products-page__title-group">
            <h1 className="products-page__title">THẾ GIỚI KẸO NGỌT</h1>
            <p className="products-page__subtitle">
              Khám phá {totalCount} loại kẹo thơm ngon đang sẵn sàng phục vụ bạn[cite: 40]
            </p>
          </div>
          <div className="products-page__search">
            <SearchBar value={filters.search} onSearch={setSearch} />
          </div>
        </header>

        {/* ── Mobile Actions: Nút bật bộ lọc khi dùng điện thoại[cite: 39] ── */}
        <div className="products-page__mobile-actions">
          <button
            className="products-page__filter-toggle"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="toggle-icon">🔍</span> Lọc & Phân loại kẹo
          </button>
        </div>

        {/* ── Mobile Filter Drawer: Bộ lọc dạng ngăn kéo[cite: 39, 40] ── */}
        <div
          className={`products-page__filter-overlay ${drawerOpen ? "products-page__filter-overlay--open" : ""}`}
          onClick={() => setDrawerOpen(false)}
        >
          <aside
            className="products-page__filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-drawer__header">
              <h3>BỘ LỌC KẸO</h3>
              <button
                className="products-page__filter-close"
                onClick={() => setDrawerOpen(false)}
              >
                ✕
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onCategory={handleFilterAction(setCategory)}
              onPriceRange={handleFilterAction(setPriceRange)}
              onSale={handleFilterAction(setSale)}
              onReset={handleFilterAction(resetFilters)}
            />
          </aside>
        </div>

        {/* ── Main Content Layout ── */}
        <div className="products-page__body">
          {/* Sidebar cố định trên Desktop[cite: 39, 40] */}
          <aside className="products-page__sidebar">
            <FilterSidebar
              filters={filters}
              onCategory={setCategory}
              onPriceRange={setPriceRange}
              onSale={setSale}
              onReset={resetFilters}
            />
          </aside>

          {/* Danh sách kẹo hiển thị linh hoạt theo bộ lọc[cite: 38, 40] */}
          <div className="products-page__main">
            <SearchResults filters={filters} totalCount={totalCount} />
            
            <div className="products-page__grid-container">
              <ProductGrid products={products} />
            </div>

            {/* Hệ thống phân trang (Source 36): Chỉ hiện khi kẹo vượt quá giới hạn trang[cite: 31, 36] */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;