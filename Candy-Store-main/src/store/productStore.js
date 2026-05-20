import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { filterProducts } from "../services/productService";

export default function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category   = searchParams.get("category") || "";
  const search     = searchParams.get("search") || "";
  const sale       = searchParams.get("sale") === "true";
  const page       = Number(searchParams.get("page")) || 1;
  const country    = searchParams.get("country") || "";
  const dietary    = searchParams.get("dietary") || "";
  const priceRange = searchParams.get("priceRange") !== null
                     ? Number(searchParams.get("priceRange"))
                     : null;

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
    (idx) => updateParams({ priceRange: idx, page: null }),
    [updateParams]
  );
  const setCountry = useCallback(
    (c) => updateParams({ country: c || null, page: null }),
    [updateParams]
  );
  const setDietary = useCallback(
    (d) => updateParams({ dietary: d || null, page: null }),
    [updateParams]
  );

  const resetFilters = useCallback(() => {
    setSearchParams({});
  }, [setSearchParams]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await filterProducts({ category, priceRange, search, sale, country, dietary, page });
        if (isMounted) {
          setResult(data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho Store:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, [category, priceRange, search, sale, country, dietary, page]);

  return {
    ...result,
    isLoading,
    filters: { category, priceRange, search, sale, country, dietary },
    setCategory,
    setSearch,
    setSale,
    setPage,
    setPriceRange,
    setCountry,
    setDietary,
    resetFilters,
  };
}
