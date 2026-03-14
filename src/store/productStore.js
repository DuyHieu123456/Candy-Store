// src/store/productStore.js
import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { filterProducts } from "../services/productService";

export default function useProducts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sale = searchParams.get("sale") === "true";
  const page = Number(searchParams.get("page")) || 1;
  const [priceRange, setPriceRangeState] = useState(null);

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

  const result = useMemo(
    () => filterProducts({ category, priceRange, search, sale, page }),
    [category, priceRange, search, sale, page]
  );

  return {
    ...result,
    filters: { category, priceRange, search, sale },
    setCategory,
    setSearch,
    setSale,
    setPage,
    setPriceRange,
    resetFilters,
  };
}
