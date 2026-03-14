// src/services/productService.js
import { PRODUCTS, getProductById, getProductsByCategory } from "../data/products";

const PRICE_RANGES = [
  { label: "Dưới 50K", min: 0, max: 50000 },
  { label: "50K - 100K", min: 50000, max: 100000 },
  { label: "100K - 200K", min: 100000, max: 200000 },
  { label: "Trên 200K", min: 200000, max: Infinity },
];

const PER_PAGE = 8;

function filterProducts({ category, priceRange, search, sale, page = 1 }) {
  let results = [...PRODUCTS];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
    );
  }

  if (category) {
    results = results.filter((p) => p.category === category);
  }

  if (sale) {
    results = results.filter((p) => p.isSale);
  }

  if (priceRange !== null && priceRange !== undefined) {
    const range = PRICE_RANGES[priceRange];
    if (range) {
      results = results.filter((p) => p.price >= range.min && p.price < range.max);
    }
  }

  const totalCount = results.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PER_PAGE;
  const products = results.slice(start, start + PER_PAGE);

  return { products, totalPages, totalCount, currentPage: safePage };
}

function getRelatedProducts(productId, category, limit = 4) {
  return getProductsByCategory(category)
    .filter((p) => p.id !== Number(productId))
    .slice(0, limit);
}

export { PRICE_RANGES, PER_PAGE, filterProducts, getRelatedProducts, getProductById };
