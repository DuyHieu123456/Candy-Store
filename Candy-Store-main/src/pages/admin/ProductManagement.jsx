import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService"; // Giả định service quản lý API sản phẩm[cite: 5, 17]
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import "./ProductManagement.css";

/**
 * Trang Quản lý Sản phẩm (Admin)
 * Hiển thị danh sách kẹo trong kho và các công cụ quản lý[cite: 1, 5].
 */
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Tải danh sách kẹo từ Database khi vào trang[cite: 5, 17]
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getAll(); // API: GET /api/products[cite: 5]
      if (res.success) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách sản phẩm:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Logic Xóa sản phẩm với cảnh báo bảo mật[cite: 1, 16]
  const handleDelete = async (id, name) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa kẹo "${name}" khỏi cửa hàng? 🍬❌`)) {
      try {
        const res = await productService.deleteProduct(id); // API: DELETE /api/products/:id[cite: 5]
        if (res.success) {
          alert("Đã xóa sản phẩm thành công!");
          fetchProducts(); // Cập nhật lại danh sách
        }
      } catch  {
        alert("Không thể xóa sản phẩm này. Có thể sản phẩm đang nằm trong một đơn hàng cũ.");
      }
    }
  };

  // 3. Lọc sản phẩm theo tên kẹo khi quản trị viên tìm kiếm[cite: 15]
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loader">🍭 Đang kiểm kê kho kẹo...</div>;

  return (
    <div className="product-management">
      <header className="page-header">
        <div className="header-left">
          <h1>Quản Lý Sản Phẩm</h1>
          <p>Hiện có <strong>{products.length}</strong> loại kẹo trong hệ thống</p>
        </div>
        <Link to="/admin/products/add">
          <Button variant="primary">➕ Thêm Kẹo Mới</Button>
        </Link>
      </header>

      {/* Thanh công cụ: Tìm kiếm và Lọc */}
      <div className="table-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input 
            type="text" 
            placeholder="Tìm tên kẹo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bảng danh sách sản phẩm chính xác theo đặc tả */}
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá niêm yết</th>
              <th>Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <td>
                    <img src={p.image_url} alt={p.name} className="product-thumb" />
                  </td>
                  <td className="product-name-cell">{p.name}</td>
                  <td><span className="category-tag">{p.category_name}</span></td>
                  <td className="price-cell">{formatPrice(p.price)}</td>
                  <td>
                    <span className={`stock-status ${p.stock <= 5 ? 'low-stock' : ''}`}>
                      {p.stock} sản phẩm
                    </span>
                  </td>
                  <td className="actions-cell">
                    <Link to={`/admin/products/edit/${p.id}`} className="btn-edit" title="Chỉnh sửa">✏️</Link>
                    <button 
                      className="btn-delete" 
                      onClick={() => handleDelete(p.id, p.name)}
                      title="Xóa"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="empty-row">Không tìm thấy loại kẹo nào phù hợp 🏜️</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;