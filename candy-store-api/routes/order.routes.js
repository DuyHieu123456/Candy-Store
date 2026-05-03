const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
// Sử dụng đúng tên các hàm middleware đã được export
const { authMiddleware, optionalAuth } = require('../middleware/auth.middleware');

// 1. Đặt hàng: Dùng optionalAuth để ghi nhận user_id nếu khách đã đăng nhập
router.post('/', optionalAuth, orderController.createOrder);

// 2. Xem lịch sử đơn hàng: Bắt buộc đăng nhập để bảo mật dữ liệu cá nhân[cite: 22]
router.get('/my-orders', authMiddleware, orderController.getMyOrders);

// 3. Lấy chi tiết một đơn hàng cụ thể theo ID[cite: 22]
router.get('/:id', authMiddleware, orderController.getOrderById);

// 4. Hủy đơn hàng: Sử dụng PUT để thay đổi trạng thái đơn hàng[cite: 22]
// Đã đồng bộ với phương thức cancelOrder trong controller
router.put('/:id/cancel', authMiddleware, orderController.cancelOrder);

module.exports = router;