// src/components/SearchBar/SearchBar.jsx
import { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ value = "", onSearch, placeholder = "Tìm kiếm sản phẩm..." }) => {
  const [query, setQuery] = useState(value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <span className="search-bar__icon">🔍</span>
      <input
        className="search-bar__input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Tìm kiếm sản phẩm"
      />
      {query && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={handleClear}
          aria-label="Xóa tìm kiếm"
        >
          ✕
        </button>
      )}
      <button type="submit" className="search-bar__btn">
        Tìm
      </button>
    </form>
  );
};

export default SearchBar;
