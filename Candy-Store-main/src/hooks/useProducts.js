import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { filterProducts } from "../services/productService"; // Hàm đã tối ưu ở bước trước

/**
 * useProducts Hook - Quản lý trạng thái kẹo dựa trên URL.
 * Đồng bộ hóa bộ lọc (Lọc theo tên, loại, giá, khuyến mãi) vào SearchParams.
 */
export default function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  // 1. Trích xuất bộ lọc trực tiếp từ URL
  const category   = searchParams.get("category") || "";
  const search     = searchParams.get("search") || "";
  const sale       = searchParams.get("sale") === "true";
  const page       = Number(searchParams.get("page")) || 1;
  const priceRange = searchParams.get("priceRange") !== null 
                     ? Number(searchParams.get("priceRange")) 
                     : null;

  // 2. State lưu trữ kết quả trả về từ SQL Server
  const [result, setResult] = useState({ 
    products: [], 
    totalPages: 1, 
    totalCount: 0, 
    currentPage: 1 
  });
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Cập nhật URL Params thông minh.
   * Tự động xóa các tham số trống để URL luôn sạch sẽ.
   */
  const updateParams = useCallback(
    (updates) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([k, v]) => {
          if (v === null || v === undefined || v === "" || v === false) {
            next.delete(k);
          } else {
            next.set(k, String(v));
          }
        });
        return next;
      });
    },
    [setSearchParams]
  );

  // ── CÁC HÀM ĐIỀU KHIỂN BỘ LỌC ──[cite: 42]
  
  const setCategory = useCallback(
    (cat) => updateParams({ category: cat, sale: null, page: null }),
    [updateParams]
  );

  const setSearch = useCallback(
    (q) => updateParams({ search: q, page: null }),
    [updateParams]
  );

  const setSale = useCallback(
    (v) => updateParams({ sale: v || null, category: null, page: null }),
    [updateParams]
  );

  const setPage = useCallback(
    (p) => updateParams({ page: p > 1 ? p : null }),
    [updateParams]
  );

  const setPriceRange = useCallback(
    (idx) => updateParams({ priceRange: idx, page: null }),
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}); // Xóa sạch mọi bộ lọc trên URL[cite: 42]
  }, [setSearchParams]);

  /**
   * 3. Tự động tải dữ liệu khi URL thay đổi.
   * Kết nối với logic filterProducts trong productService[cite: 31, 42].
   */
  useEffect(() => {
    let isMounted = true; 

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Gọi hàm lọc đã được tối ưu hóa tên thuộc tính (image_url, stock...)[cite: 31, 42]
        const data = await filterProducts({ 
          category, 
          priceRange, 
          search, 
          sale, 
          page 
        });

        if (isMounted) {
          setResult(data);
        }
      } catch (error) {
        console.error("Lỗi Store: Không thể lấy danh sách kẹo từ Database", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => { isMounted = false; };
  }, [category, priceRange, search, sale, page]); // Lắng nghe mọi thay đổi từ URL[cite: 42]

  return {
    ...result, // Rải products, totalPages... cho Products.jsx sử dụng[cite: 42]
    isLoading,
    filters: { category, priceRange, search, sale },
    setCategory,
    setSearch,
    setSale,
    setPage,
    setPriceRange,
    resetFilters,
  };
}