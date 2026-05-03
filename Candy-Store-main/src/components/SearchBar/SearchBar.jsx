import { useState, useEffect } from "react";
import "./SearchBar.css";

/**
 * Thanh tìm kiếm sản phẩm (Search Bar)
 * Cung cấp giao diện nhập liệu hiện đại với tính năng xóa nhanh và đồng bộ bộ lọc.
 */
const SearchBar = ({ value = "", onSearch, placeholder = "Tìm kẹo Haribo, Skittles..." }) => {
  // Khởi tạo state nội bộ để quản lý việc nhập liệu mượt mà
  const [query, setQuery] = useState(value);

  // QUAN TRỌNG: Đồng bộ lại query khi giá trị từ Store thay đổi (ví dụ: Reset Filters)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  /**
   * Xử lý khi nhấn Enter hoặc nút Tìm
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Loại bỏ khoảng trắng thừa trước khi gửi yêu cầu tìm kiếm[cite: 33]
    onSearch(query.trim());
  };

  /**
   * Xóa nhanh nội dung đang nhập[cite: 33]
   */
  const handleClear = () => {
    setQuery("");
    onSearch(""); // Trả về danh sách tất cả sản phẩm ngay lập tức
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      {/* Biểu tượng kính lúp đặc trưng[cite: 32, 33] */}
      <span className="search-bar__icon" aria-hidden="true">🔍</span>
      
      <input
        className="search-bar__input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Tìm kiếm kẹo trong cửa hàng"
        autoComplete="off"
      />

      {/* Nút xóa nhanh: Chỉ xuất hiện khi có nội dung[cite: 33] */}
      {query && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Xóa từ khóa tìm kiếm"
          title="Xóa tìm kiếm"
        >
          ✕
        </button>
      )}

      {/* Nút hành động chính: Thiết kế dạng viên thuốc đồng bộ */}
      <button type="submit" className="search-bar__btn">
        TÌM KIẾM
      </button>
    </form>
  );
};

export default SearchBar;