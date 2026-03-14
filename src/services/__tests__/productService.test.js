import { describe, it, expect } from "vitest";
import { filterProducts, getRelatedProducts, PRICE_RANGES } from "../productService";

describe("productService", () => {
  describe("filterProducts", () => {
    it("returns all products when no filters", () => {
      const result = filterProducts({});
      expect(result.totalCount).toBe(12);
      expect(result.products.length).toBeLessThanOrEqual(8);
      expect(result.currentPage).toBe(1);
    });

    it("filters by category", () => {
      const result = filterProducts({ category: "candy" });
      expect(result.products.every((p) => p.category === "candy")).toBe(true);
      expect(result.totalCount).toBeGreaterThan(0);
    });

    it("filters by sale", () => {
      const result = filterProducts({ sale: true });
      expect(result.products.every((p) => p.isSale)).toBe(true);
    });

    it("filters by search (name)", () => {
      const result = filterProducts({ search: "Haribo" });
      expect(result.totalCount).toBe(1);
      expect(result.products[0].name).toContain("Haribo");
    });

    it("filters by search (brand, case-insensitive)", () => {
      const result = filterProducts({ search: "lindt" });
      expect(result.totalCount).toBe(1);
      expect(result.products[0].brand).toBe("Lindt");
    });

    it("filters by price range", () => {
      const result = filterProducts({ priceRange: 0 }); // Dưới 50K
      const range = PRICE_RANGES[0];
      expect(
        result.products.every((p) => p.price >= range.min && p.price < range.max)
      ).toBe(true);
    });

    it("combines category + price range", () => {
      const result = filterProducts({ category: "candy", priceRange: 0 });
      expect(
        result.products.every(
          (p) => p.category === "candy" && p.price < 50000
        )
      ).toBe(true);
    });

    it("paginates correctly (8 per page)", () => {
      const page1 = filterProducts({ page: 1 });
      const page2 = filterProducts({ page: 2 });
      expect(page1.products.length).toBe(8);
      expect(page2.products.length).toBe(4); // 12 total - 8 = 4
      expect(page1.totalPages).toBe(2);
    });

    it("clamps page to valid range", () => {
      const result = filterProducts({ page: 999 });
      expect(result.currentPage).toBe(result.totalPages);
    });

    it("returns empty for no matches", () => {
      const result = filterProducts({ search: "xyznotfound" });
      expect(result.totalCount).toBe(0);
      expect(result.products).toEqual([]);
      expect(result.totalPages).toBe(1);
    });
  });

  describe("getRelatedProducts", () => {
    it("returns products in same category excluding current", () => {
      const related = getRelatedProducts(1, "candy");
      expect(related.every((p) => p.category === "candy")).toBe(true);
      expect(related.every((p) => p.id !== 1)).toBe(true);
    });

    it("returns max 4 products", () => {
      const related = getRelatedProducts(1, "candy");
      expect(related.length).toBeLessThanOrEqual(4);
    });

    it("returns empty for category with single product", () => {
      // gift category has only 1 product (id: 8)
      const related = getRelatedProducts(8, "gift");
      expect(related).toEqual([]);
    });
  });
});
