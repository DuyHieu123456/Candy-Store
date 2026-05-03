import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Hook lấy thông tin người dùng[cite: 24]
import Button from "../../components/Button/Button";
import "./Profile.css";

/**
 * Trang Cá Nhân (Profile Page)
 * Hiển thị thông tin người dùng và cung cấp các lối tắt quản lý tài khoản[cite: 24, 31].
 */
const Profile = () => {
  const { user, logout, updateProfile } = useAuth(); // Lấy dữ liệu từ context auth[cite: 24]
  const navigate = useNavigate();

  // State quản lý chế độ chỉnh sửa và dữ liệu form
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    email: user?.email || "",
  });

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Cập nhật thông tin (Giả định có hàm updateProfile trong useAuth)
  const handleUpdate = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      alert("🍭 Cập nhật thông tin ngọt ngào thành công!");
      setIsEditing(false);
    }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    if (window.confirm("Bạn muốn rời khỏi thế giới kẹo ngọt sao? 😢")) {
      logout();
      navigate("/");
    }
  };

  if (!user) {
    return (
      <div className="profile-page container">
        <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>
      </div>
    );
  }

  return (
    <main className="profile-page container">
      <div className="profile-layout">
        
        {/* ── Sidebar: Ảnh đại diện và Menu nhanh ── */}
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            <span className="avatar-emoji">🧸</span>
          </div>
          <h2 className="profile-username">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          
          <nav className="profile-nav">
            <Link to="/orders" className="profile-nav__link">
              <span>📦</span> Lịch sử đơn hàng
            </Link>
            <Link to="/wishlist" className="profile-nav__link">
              <span>❤️</span> Kẹo yêu thích
            </Link>
            <button onClick={handleLogout} className="profile-nav__link logout-btn">
              <span>🚪</span> Đăng xuất
            </button>
          </nav>
        </aside>

        {/* ── Main Content: Form thông tin chi tiết ── */}
        <section className="profile-content">
          <div className="profile-card">
            <div className="profile-card__header">
              <h3>Thông Tin Tài Khoản</h3>
              <button 
                className="edit-toggle-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Hủy bỏ" : "Chỉnh sửa"}
              </button>
            </div>

            <form className="profile-form" onSubmit={handleUpdate}>
              <div className="profile-form__grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Email (Không thể thay đổi)</label>
                  <input 
                    type="email" 
                    value={formData.email} 
                    disabled={true} 
                  />
                </div>

                <div className="form-group full-width">
                  <label>Địa chỉ nhận kẹo mặc định</label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <Button type="submit">Lưu Thay Đổi</Button>
                </div>
              )}
            </form>
          </div>

          {/* ── Tóm tắt hoạt động gần đây ── */}
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-value">{user.orderCount || 0}</span>
              <span className="stat-label">Đơn hàng</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">0</span>
              <span className="stat-label">Voucher</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Profile;