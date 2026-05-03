import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/renderWithProviders";
import ProductGallery from "../ProductDetail/ProductGallery";
import ProductInfo from "../ProductDetail/ProductInfo";
import RelatedProducts from "../ProductDetail/RelatedProducts";
import { PRODUCTS } from "../../data/products";

const saleProduct = PRODUCTS.find((p) => p.isSale && p.originalPrice);
const newProduct = PRODUCTS.find((p) => p.isNew);
const candyProduct = PRODUCTS.find((p) => p.category === "candy");

describe("ProductDetail Page Components", () => {
  describe("ProductGallery", () => {
    it("renders product emoji", () => {
      renderWithProviders(<ProductGallery product={saleProduct} />);
      expect(screen.getByText(saleProduct.emoji)).toBeInTheDocument();
    });

    it("shows sale badge with discount", () => {
      renderWithProviders(<ProductGallery product={saleProduct} />);
      const pct = Math.round(
        (1 - saleProduct.price / saleProduct.originalPrice) * 100
      );
      expect(screen.getByText(`-${pct}%`)).toBeInTheDocument();
    });

    it("shows new badge", () => {
      renderWithProviders(<ProductGallery product={newProduct} />);
      expect(screen.getByText("Mới")).toBeInTheDocument();
    });
  });

  describe("ProductInfo", () => {
    it("renders product name and brand", () => {
      renderWithProviders(<ProductInfo product={saleProduct} />);
      expect(screen.getByText(saleProduct.name)).toBeInTheDocument();
      expect(screen.getByText(saleProduct.brand)).toBeInTheDocument();
    });

    it("renders price", () => {
      renderWithProviders(<ProductInfo product={saleProduct} />);
      expect(
        screen.getByText(`${saleProduct.price.toLocaleString("vi-VN")}đ`)
      ).toBeInTheDocument();
    });

    it("renders description", () => {
      renderWithProviders(<ProductInfo product={saleProduct} />);
      expect(screen.getByText(saleProduct.description)).toBeInTheDocument();
    });

    it("shows stock status", () => {
      renderWithProviders(<ProductInfo product={saleProduct} />);
      expect(screen.getByText(/Còn hàng/)).toBeInTheDocument();
    });

    it("increments quantity", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProductInfo product={saleProduct} />);
      const plusBtn = screen.getByText("+");
      await user.click(plusBtn);
      expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("does not decrement below 1", () => {
      renderWithProviders(<ProductInfo product={saleProduct} />);
      const minusBtn = screen.getByText("−");
      expect(minusBtn).toBeDisabled();
    });

    it("shows feedback after adding to cart", async () => {
      const user = userEvent.setup();
      renderWithProviders(<ProductInfo product={saleProduct} />);
      await user.click(screen.getByText(/Thêm vào giỏ hàng/));
      expect(screen.getByText(/Đã thêm vào giỏ/)).toBeInTheDocument();
    });
  });

  describe("RelatedProducts", () => {
    it("renders related products from same category", () => {
      renderWithProviders(
        <RelatedProducts productId={candyProduct.id} category="candy" />
      );
      expect(screen.getByText("Sản phẩm liên quan")).toBeInTheDocument();
    });

    it("does not render when no related products", () => {
      // gift has only 1 product
      const { container } = renderWithProviders(
        <RelatedProducts productId={8} category="gift" />
      );
      expect(container.innerHTML).toBe("");
    });
  });
});
