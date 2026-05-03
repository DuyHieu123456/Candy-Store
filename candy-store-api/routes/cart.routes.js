const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
// Đã sửa: Đường dẫn chính xác và sử dụng optionalAuth[cite: 24, 28]
const { optionalAuth } = require('../middleware/auth.middleware'); 

// Lấy giỏ hàng: dùng optionalAuth để hỗ trợ cả khách và thành viên[cite: 16, 20]
router.get('/', optionalAuth, cartController.getCart);

// Thêm kẹo vào giỏ[cite: 16, 20]
router.post('/', optionalAuth, cartController.addToCart);

// Làm trống giỏ hàng[cite: 17, 20]
router.delete('/', optionalAuth, cartController.clearCart);

module.exports = router;