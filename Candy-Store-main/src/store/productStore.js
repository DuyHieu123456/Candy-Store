import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchAndNormalizeProducts, PRICE_RANGES, PER_PAGE } from "../services/productService";

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

  const [allProducts, setAllProducts] = useState([]);
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
        const products = await fetchAndNormalizeProducts();
        if (isMounted) {
          setAllProducts(products);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu cho Store:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let results = [...allProducts];

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
  }, [allProducts, search, category, sale, country, dietary, priceRange, page]);

  return {
    ...filtered,
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
