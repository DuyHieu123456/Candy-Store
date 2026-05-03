import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import { formatPrice } from "../../utils/formatPrice";
import "./AdminDashboard.jsx"; // File CSS sẽ được khởi tạo ở bước tiếp theo

/**
 * AdminDashboard - Bảng điều khiển trung tâm
 * Hiển thị các chỉ số đo lường hiệu quả công việc (KPIs) và các đơn hàng mới nhất.
 */
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    productCount: 0,
    lowStockCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Lấy dữ liệu tổng hợp từ các services[cite: 5, 11]
      const [productsRes, ordersRes] = await Promise.all([
        productService.getAll(),
        orderService.getAllOrders()
      ]);

      if (productsRes.success && ordersRes.success) {
        const orders = ordersRes.data;
        const products = productsRes.data;

        // Tính toán thống kê[cite: 1, 12]
        const revenue = orders
          .filter(o => o.status === 'completed')
          .reduce((sum, o) => sum + o.total, 0);

        const lowStock = products.filter(p => p.stock <= 5).length;

        setStats({
          totalRevenue: revenue,
          orderCount: orders.length,
          productCount: products.length,
          lowStockCount: lowStock,
        });

        // Lấy 5 đơn hàng mới nhất để hiển thị nhanh[cite: 11]
        setRecentOrders(orders.slice(0, 5));
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="admin-loader">📊 Đang phân tích dữ liệu kinh doanh...</div>;

  return (
    <div className="admin-dashboard">
      <header className="page-header">
        <h1>Bảng Điều Khiển Tổng Quan</h1>
        <p>Chào mừng bạn quay lại! Dưới đây là tình hình kinh doanh hôm nay.</p>
      </header>

      {/* ── Khu vực Thẻ Thống Kê (Quick Stats) ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <span className="stat-label">Tổng doanh thu</span>
            <span className="stat-value">{formatPrice(stats.totalRevenue)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orders">📦</div>
          <div className="stat-info">
            <span className="stat-label">Đơn hàng</span>
            <span className="stat-value">{stats.orderCount}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon products">🍭</div>
          <div className="stat-info">
            <span className="stat-label">Sản phẩm</span>
            <span className="stat-value">{stats.productCount}</span>
          </div>
        </div>

        <div className={`stat-card ${stats.lowStockCount > 0 ? 'warning' : ''}`}>
          <div className="stat-icon stock">⚠️</div>
          <div className="stat-info">
            <span className="stat-label">Sắp hết hàng</span>
            <span className="stat-value">{stats.lowStockCount}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content-grid">
        {/* ── Bảng Đơn Hàng Gần Đây ── */}
        <section className="recent-activity-card">
          <div className="card-header">
            <h3>🛒 Đơn hàng mới nhất</h3>
            <Link to="/admin/orders" className="view-all-link">Xem tất cả</Link>
          </div>
          <div className="table-container">
            <table className="admin-table mini">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.order_number}</td>
                    <td>{order.recipient_name}</td>
                    <td className="price-cell">{formatPrice(order.total)}</td>
                    <td>
                      <span className={`status-badge status-${order.status} sm`}>
                        {order.status === 'pending' ? 'Chờ' : 'Xong'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Lối tắt quản trị nhanh (Quick Actions) ── */}
        <section className="quick-actions-card">
          <h3>⚡ Thao tác nhanh</h3>
          <div className="action-buttons">
            <Link to="/admin/products/add" className="action-btn">
              <span>➕</span> Thêm kẹo mới
            </Link>
            <Link to="/admin/products" className="action-btn">
              <span>🔍</span> Kiểm tra kho hàng
            </Link>
            <Link to="/admin/orders?status=pending" className="action-btn">
              <span>⏳</span> Xử lý đơn chờ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;