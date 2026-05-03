import { useMemo } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../../../components/ProductCard/ProductCard";
import useCountdown from "../../../hooks/useCountdown";
import { getSaleProducts } from "../../../data/products";
import "./FlashSale.css";

const pad = (n) => String(n).padStart(2, "0");

const FlashSale = () => {
  // Giữ nguyên logic tính thời gian kết thúc ngày của bạn
  const endOfDay = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 0);
    return d;
  }, []);

  const { h, m, s } = useCountdown(endOfDay); // Hook đếm ngược từ code gốc

  // Lấy danh sách sản phẩm giảm giá từ Database/Data
  const products = useMemo(() => getSaleProducts(), []);

  return (
    <section className="flash-section">
      <div className="container">
        {/* Header được tái cấu trúc để hiển thị chuyên nghiệp hơn[cite: 19] */}
        <div className="flash-section__header">
          <div className="flash-section__title-group">
            <div className="flash-section__title-wrap">
              <span className="flash-section__bolt">⚡</span>
              <h2 className="flash-section__title">SĂN DEAL CHỚP NHOÁNG</h2>
              <span className="flash-section__bolt">⚡</span>
            </div>
            <p className="flash-section__subtitle">Giá cực sốc - Số lượng có hạn</p>
          </div>

          <div className="flash-section__countdown">
            <span className="flash-section__cd-label">Kết thúc sau:</span>
            <div className="flash-section__cd-boxes" aria-label="Đồng hồ đếm ngược">
              {[{ v: h, u: "GIỜ" }, { v: m, u: "PHÚT" }, { v: s, u: "GIÂY" }].map(({ v, u }, i) => (
                <div key={u} className="flash-section__cd-item">
                  <div className="flash-section__cd-box">
                    <span className="flash-section__cd-num">{pad(v)}</span>
                    <span className="flash-section__cd-unit">{u}</span>
                  </div>
                  {i < 2 && <span className="flash-section__cd-sep">:</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Nút Xem Tất Cả được sửa đổi để loại bỏ gạch chân[cite: 13, 19] */}
          <Link to="/products?sale=true" className="flash-section__view-all">
            XEM TẤT CẢ
          </Link>
        </div>

        {/* Lưới sản phẩm hiển thị các ProductCard đã được cải tiến ở bước trước[cite: 19] */}
        <div className="flash-section__grid">
          {products.length > 0 ? (
            products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          ) : (
            <p className="flash-empty">Kẹo sale đang được nạp thêm, vui lòng chờ nhé!</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlashSale;