import api from './api';

export const PRICE_RANGES = [
  { label: "Dưới 50K", min: 0, max: 50000 },
  { label: "50K - 100K", min: 50000, max: 100000 },
  { label: "100K - 200K", min: 100000, max: 200000 },
  { label: "Trên 200K", min: 200000, max: Infinity },
];

export const PER_PAGE = 8;

export async function fetchAndNormalizeProducts() {
  try {
    const response = await api.get('/products', { params: { limit: 100 } });
    const dbProducts = response.data.data || [];

    return dbProducts.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category_id: p.category_id,
      category_slug: p.category_slug || "",
      category_name: p.category_name || "",
      brand: p.brand_name || "",
      brand_slug: p.brand_slug || "",
      country: p.country || "",
      dietary: p.dietary ? (typeof p.dietary === 'string' ? JSON.parse(p.dietary) : p.dietary) : [],
      price: p.sale_price || p.price,
      originalPrice: p.sale_price ? p.price : null,
      stock: p.stock || 0,
      isSale: !!p.sale_price,
      isNew: !!p.is_new,
      isBestSeller: !!p.is_featured,
      image_url: p.images ? JSON.parse(p.images)[0] : null,
      image: p.images ? JSON.parse(p.images)[0] : null,
      description: p.short_desc || p.description || "",
      rating: p.avg_rating || 0,
      reviewCount: p.review_count || 0,
      soldCount: p.sold_count || 0,
    }));
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Database:", error);
    return [];
  }
}

export async function getRelatedProducts(productId, category, limit = 4) {
  const products = await fetchAndNormalizeProducts();
  return products
    .filter((p) => p.category_slug === category && p.id !== Number(productId))
    .slice(0, limit);
}

export async function filterProducts({ category, priceRange, search, sale, country, dietary, page = 1 }) {
  let results = await fetchAndNormalizeProducts();

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
    );
  }

  if (category) {
    results = results.filter((p) => p.category_slug === category);
  }

  if (sale) {
    results = results.filter((p) => p.isSale);
  }

  if (country) {
    results = results.filter((p) => p.country === country);
  }

  if (dietary) {
    results = results.filter((p) => p.dietary && p.dietary.includes(dietary));
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

export async function getProductById(productId) {
  try {
    const response = await api.get(`/products/${productId}`);
    if (response.data.success) {
      const p = response.data.data;
      let images = [];
      try { images = p.images ? JSON.parse(p.images) : []; } catch { images = []; }

      return {
        success: true,
        data: {
          ...p,
          image_url: images[0] || null,
          images,
          brand: p.brand_name || "",
          category_slug: p.category_slug || "",
        }
      };
    }
    return { success: false };
  } catch {
    return { success: false };
  }
}

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
