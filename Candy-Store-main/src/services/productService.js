import api from './api'; // Import instance axios chúng ta đã tạo ở bước trước

const PRICE_RANGES = [
  { label: "Dưới 50K", min: 0, max: 50000 },
  { label: "50K - 100K", min: 50000, max: 100000 },
  { label: "100K - 200K", min: 100000, max: 200000 },
  { label: "Trên 200K", min: 200000, max: Infinity },
];

const PER_PAGE = 8;

/**
 * Hàm phụ: Gọi API lấy dữ liệu từ Backend và đồng bộ hóa tên key
 * Chuyển đổi từ PascalCase (SQL) sang camelCase (Frontend đang dùng)
 */
async function fetchAndNormalizeProducts() {
  try {
    const response = await api.get('/products');
    const dbProducts = response.data;

    return dbProducts.map(p => ({
      id: p.Id,
      name: p.Name,
      category: p.CategoryId, // Hiện tại đang dùng ID làm category
      price: p.Price,
      brand: "", // Trong DB chưa có bảng Brand, tạm để trống
      isSale: p.IsFeatured, // Tạm dùng cờ IsFeatured làm điều kiện giảm giá/nổi bật
      image: p.ImageUrl || "https://via.placeholder.com/150", // Ảnh mặc định nếu DB null
      slug: p.Slug
    }));
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu từ Database:", error);
    return []; // Trả về mảng rỗng nếu sập server để app không bị crash
  }
}

// Thêm từ khóa "async" vào trước hàm
async function filterProducts({ category, priceRange, search, sale, page = 1 }) {
  // 1. Lấy dữ liệu THẬT từ Database thay vì biến tĩnh PRODUCTS
  let results = await fetchAndNormalizeProducts();

  // 2. Các logic lọc bên dưới được giữ nguyên vẹn như cũ của bạn
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

// Đổi thành hàm async
async function getProductById(productId) {
  const products = await fetchAndNormalizeProducts();
  return products.find((p) => p.id === Number(productId));
}

// Đổi thành hàm async
async function getRelatedProducts(productId, category, limit = 4) {
  const products = await fetchAndNormalizeProducts();
  return products
    .filter((p) => p.category === category && p.id !== Number(productId))
    .slice(0, limit);
}

export { PRICE_RANGES, PER_PAGE, filterProducts, getRelatedProducts, getProductById };