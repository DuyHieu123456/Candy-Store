import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/renderWithProviders";
import ProductGrid from "../Products/ProductGrid";
import SearchResults from "../Products/SearchResults";
import Pagination from "../Products/Pagination";
import { PRODUCTS } from "../../data/products";

describe("Products Page Components", () => {
  describe("ProductGrid", () => {
    it("renders product cards", () => {
      renderWithProviders(<ProductGrid products={PRODUCTS.slice(0, 4)} />);
      expect(screen.getByText("Kẹo Gummy Bears Haribo 250g")).toBeInTheDocument();
      expect(screen.getByText("Socola Đen Lindt 70% 100g")).toBeInTheDocument();
    });

    it("shows empty state when no products", () => {
      renderWithProviders(<ProductGrid products={[]} />);
      expect(screen.getByText("Không tìm thấy sản phẩm nào")).toBeInTheDocument();
    });
  });

  describe("SearchResults", () => {
    it("shows 'Tất cả sản phẩm' with no filters", () => {
      renderWithProviders(
        <SearchResults
          filters={{ category: "", search: "", sale: false, priceRange: null }}
          totalCount={12}
        />
      );
      expect(screen.getByText("Tất cả sản phẩm")).toBeInTheDocument();
      expect(screen.getByText("12 sản phẩm")).toBeInTheDocument();
    });

    it("shows search query", () => {
      renderWithProviders(
        <SearchResults
          filters={{ category: "", search: "Haribo", sale: false, priceRange: null }}
          totalCount={1}
        />
      );
      expect(screen.getByText('Kết quả cho "Haribo"')).toBeInTheDocument();
    });

    it("shows category name", () => {
      renderWithProviders(
        <SearchResults
          filters={{ category: "candy", search: "", sale: false, priceRange: null }}
          totalCount={6}
        />
      );
      expect(screen.getByText(/Kẹo Ngọt/)).toBeInTheDocument();
    });

    it("shows sale heading", () => {
      renderWithProviders(
        <SearchResults
          filters={{ category: "", search: "", sale: true, priceRange: null }}
          totalCount={9}
        />
      );
      expect(screen.getByText(/Khuyến Mãi/)).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("renders page buttons", () => {
      const onPageChange = vi.fn();
      renderWithProviders(
        <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
      );
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("disables previous button on first page", () => {
      renderWithProviders(
        <Pagination currentPage={1} totalPages={3} onPageChange={() => {}} />
      );
      expect(screen.getByText("‹ Trước")).toBeDisabled();
    });

    it("disables next button on last page", () => {
      renderWithProviders(
        <Pagination currentPage={3} totalPages={3} onPageChange={() => {}} />
      );
      expect(screen.getByText("Sau ›")).toBeDisabled();
    });

    it("calls onPageChange when clicking a page", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithProviders(
        <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
      );
      await user.click(screen.getByText("2"));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with next page", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      renderWithProviders(
        <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />
      );
      await user.click(screen.getByText("Sau ›"));
      expect(onPageChange).toHaveBeenCalledWith(2);
    });
  });
});
