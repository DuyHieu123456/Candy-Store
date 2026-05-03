import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import productService from "../../services/productService"; // Service kết nối API[cite: 5, 10]
import Button from "../../components/Button/Button";
import "./ProductEdit.css";

/**
 * Trang Thêm / Chỉnh sửa sản phẩm kẹo
 * Logic: Nếu có ID trên URL -> Chế độ Sửa. Không có ID -> Chế độ Thêm mới[cite: 5, 10].
 */
const ProductEdit = () => {
  const { id } = useParams(); // Lấy ID từ URL nếu đang ở chế độ chỉnh sửa
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category_id: "1",
    description: "",
    image_url: "",
  });

  // 1. Nếu là chế độ Sửa, tải dữ liệu cũ của kẹo lên form[cite: 5, 10]
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const res = await productService.getById(id); // API: GET /api/products/:id[cite: 5]
          if (res.success) {
            setFormData(res.data);
          }
        } catch {
          alert("Không thể tải thông tin kẹo này! 🍬❌");
          navigate("/admin/products");
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode, navigate]);

  // 2. Xử lý thay đổi input[cite: 10]
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Xử lý gửi dữ liệu (Submit) kèm Ràng buộc logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra ràng buộc (Constraints) - Cột quan trọng nhất
    if (parseFloat(formData.price) <= 0) return alert("Giá kẹo phải lớn hơn 0 đồng!");
    if (parseInt(formData.stock) < 0) return alert("Số lượng tồn kho không được âm!");

    setLoading(true);
    try {
      let res;
      if (isEditMode) {
        res = await productService.updateProduct(id, formData); // API: PUT[cite: 5]
      } else {
        res = await productService.createProduct(formData); // API: POST[cite: 5]
      }

      if (res.success) {
        alert(isEditMode ? "Đã cập nhật kẹo thành công! ✨" : "Đã thêm kẹo mới vào kho! 🍭");
        navigate("/admin/products");
      }
    } catch (err) {
      alert("Lỗi hệ thống: " + (err.response?.data?.message || "Không thể lưu dữ liệu"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-edit-page">
      <header className="page-header">
        <Link to="/admin/products" className="back-btn">← Quay lại danh sách</Link>
        <h1>{isEditMode ? "Chỉnh Sửa Kẹo" : "Thêm Kẹo Mới"}</h1>
      </header>

      <form className="product-form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          
          {/* Cột trái: Thông tin cơ bản */}
          <div className="form-column">
            <div className="form-group">
              <label>Tên loại kẹo</label>
              <input 
                type="text" name="name" required 
                value={formData.name} onChange={handleChange}
                placeholder="Ví dụ: Kẹo dẻo gấu vị dâu"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giá bán (VNĐ)</label>
                <input 
                  type="number" name="price" required 
                  value={formData.price} onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Số lượng kho</label>
                <input 
                  type="number" name="stock" required 
                  value={formData.stock} onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Danh mục kẹo</label>
              <select name="category_id" value={formData.category_id} onChange={handleChange}>
                <option value="1">Kẹo Dẻo</option>
                <option value="2">Kẹo Cứng</option>
                <option value="3">Socola</option>
                <option value="4">Kẹo Mút</option>
              </select>
            </div>
          </div>

          {/* Cột phải: Hình ảnh & Mô tả */}
          <div className="form-column">
            <div className="form-group">
              <label>Đường dẫn ảnh (URL)</label>
              <input 
                type="text" name="image_url" required 
                value={formData.image_url} onChange={handleChange}
                placeholder="https://example.com/keo.jpg"
              />
              {formData.image_url && (
                <div className="image-preview">
                  <img src={formData.image_url} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Mô tả hương vị</label>
              <textarea 
                name="description" rows="5"
                value={formData.description} onChange={handleChange}
                placeholder="Mô tả sự ngọt ngào của loại kẹo này..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditMode ? "Lưu thay đổi" : "Tạo sản phẩm ngay"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;