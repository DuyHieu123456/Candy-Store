import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { filterProducts } from "../services/productService";

export default function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sale = searchParams.get("sale") === "true";
  const page = Number(searchParams.get("page")) || 1;
  const [priceRange, setPriceRangeState] = useState(null);

  // 1. Thêm State để chứa dữ liệu bất đồng bộ từ SQL Server
  const [result, setResult] = useState({ 
    products: [], 
    totalPages: 1, 
    totalCount: 0, 
    currentPage: 1 
  });
  const [isLoading, setIsLoading] = useState(true);

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
    (idx) => {
      setPriceRangeState(idx);
      updateParams({ page: null });
    },
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
    setPriceRangeState(null);
  }, [setSearchParams]);

  // 2. Thay thế useMemo bằng useEffect để gọi hàm async
  useEffect(() => {
    let isMounted = true; // Biến cờ để tránh lỗi memory leak khi component bị unmount

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await filterProducts({ category, priceRange, search, sale, page });
        if (isMounted) {
          setResult(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho Store:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [category, priceRange, search, sale, page]);

  return {
    ...result, // Rải products, totalPages... ra cho giao diện hứng
    isLoading, // Trả thêm trạng thái loading nếu giao diện cần dùng để hiện xoay xoay
    filters: { category, priceRange, search, sale },
    setCategory,
    setSearch,
    setSale,
    setPage,
    setPriceRange,
    resetFilters,
  };
}