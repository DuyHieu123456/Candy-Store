// src/pages/Products/Pagination.jsx
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="pagination" aria-label="Phân trang">
      <button
        className="pagination__btn"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        ‹ Trước
      </button>

      <div className="pagination__pages">
        {pages.map((p) => (
          <button
            key={p}
            className="pagination__page"
            style={
              p === currentPage
                ? { background: "#d63031", borderColor: "#d63031", color: "#fff" }
                : undefined
            }
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="pagination__btn"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Sau ›
      </button>
    </nav>
  );
};

export default Pagination;
