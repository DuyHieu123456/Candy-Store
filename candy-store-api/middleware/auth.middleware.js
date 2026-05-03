const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'candystore_secret_key_2024';

// ── Xác thực token bắt buộc ────────────────────────────────
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, message: 'Không có token, vui lòng đăng nhập.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

// ── Chỉ cho admin ──────────────────────────────────────────
const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Bạn không có quyền thực hiện thao tác này.' });
  }
  next();
};

// ── Token tuỳ chọn (không bắt buộc) ───────────────────────
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (_) {}
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware, optionalAuth };