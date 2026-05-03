import api from './api'; // Import instance axios đã cấu hình

// ── CẤU HÌNH HẰNG SỐ ──
export const PRICE_RANGES = [
  { label: "Dưới 50K", min: 0, max: 50000 },
  { label: "50K - 100K", min: 50000, max: 100000 },
  { label: "100K - 200K", min: 100000, max: 200000 },
  { label: "Trên 200K", min: 200000, max: Infinity },
];

export const PER_PAGE = 8;

/**
 * 1. Hàm nội bộ: Gọi API và đồng bộ hóa dữ liệu từ SQL Server.
 */
export async function fetchAndNormalizeProducts() {
  try {
    const response = await api.get('/products');
    const dbProducts = response.data.data || [];

    return dbProducts.map(p => ({
      id: p.Id || p.id,
      name: p.Name || p.name,
      category_id: p.CategoryId || p.category_id,
      price: p.Price || p.price,
      stock: p.Stock || p.stock || 0,
      brand: p.BrandName || "",
      isSale: p.IsFeatured || p.is_featured,
      image_url: p.ImageUrl || p.image || "https://via.placeholder.com/150",
      description: p.Description || p.description || "",
      slug: p.Slug || p.slug
    }));
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Database:", error);
    return [];
  }
}

/**
 * 2. Lấy sản phẩm liên quan.
 * Xuất bản định danh để sửa lỗi "does not provide an export named 'getRelatedProducts'".
 */
export async function getRelatedProducts(productId, category, limit = 4) {
  const products = await fetchAndNormalizeProducts();
  return products
    .filter((p) => String(p.category_id) === String(category) && p.id !== Number(productId))
    .slice(0, limit);
}

/**
 * 3. Logic lọc sản phẩm.
 */
export async function filterProducts({ category, priceRange, search, sale, page = 1 }) {
  let results = await fetchAndNormalizeProducts();

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q))
    );
  }

  if (category) {
    results = results.filter((p) => String(p.category_id) === String(category));
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
  const start = (Math.min(page, totalPages) - 1) * PER_PAGE;
  const products = results.slice(start, start + PER_PAGE);

  return { products, totalPages, totalCount, currentPage: page };
}

export async function getProductById(productId) {
  const products = await fetchAndNormalizeProducts();
  const found = products.find((p) => p.id === Number(productId));
  return found ? { success: true, data: found } : { success: false };
}

/**
 * 4. Đối tượng productService (Dành cho Admin & Default Import).
 */
const productService = {
  getAll: async function() {
    const data = await fetchAndNormalizeProducts();
    return { success: true, data };
  },
  filterProducts,
  getRelatedProducts,
  getById: getProductById,
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export default productService;