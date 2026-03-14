// src/pages/Products/Products.jsx
import { useState } from "react";
import useProducts from "../../store/productStore";
import SearchBar from "../../components/SearchBar/SearchBar";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import SearchResults from "./SearchResults";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";
import "./Products.css";

const Products = () => {
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

  const handleFilterAction = (fn) => (...args) => {
    fn(...args);
    setDrawerOpen(false);
  };

  return (
    <section className="products-page">
      <div className="container">
        {/* ── Search ── */}
        <div className="products-page__search">
          <SearchBar value={filters.search} onSearch={setSearch} />
        </div>

        {/* ── Mobile filter toggle ── */}
        <button
          className="products-page__filter-toggle"
          onClick={() => setDrawerOpen(true)}
        >
          ☰ Bộ lọc
        </button>

        {/* ── Mobile filter drawer ── */}
        <div
          className={`products-page__filter-overlay ${drawerOpen ? "products-page__filter-overlay--open" : ""}`}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="products-page__filter-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="products-page__filter-close"
              onClick={() => setDrawerOpen(false)}
              aria-label="Đóng bộ lọc"
            >
              ✕
            </button>
            <FilterSidebar
              filters={filters}
              onCategory={handleFilterAction(setCategory)}
              onPriceRange={handleFilterAction(setPriceRange)}
              onSale={handleFilterAction(setSale)}
              onReset={handleFilterAction(resetFilters)}
            />
          </div>
        </div>

        {/* ── Body ── */}
        <div className="products-page__body">
          <div className="products-page__sidebar">
            <FilterSidebar
              filters={filters}
              onCategory={setCategory}
              onPriceRange={setPriceRange}
              onSale={setSale}
              onReset={resetFilters}
            />
          </div>

          <div className="products-page__main">
            <SearchResults filters={filters} totalCount={totalCount} />
            <ProductGrid products={products} />
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
    </section>
  );
};

export default Products;
