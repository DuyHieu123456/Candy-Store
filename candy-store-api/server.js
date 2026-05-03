require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth.routes'));
app.use('/api/products',   require('./routes/product.routes'));
app.use('/api/categories', require('./routes/category.routes'));
app.use('/api/brands',     require('./routes/brand.routes'));
app.use('/api/cart',       require('./routes/cart.routes'));
app.use('/api/orders',     require('./routes/order.routes'));
app.use('/api/banners',    require('./routes/banner.routes'));

// ── Health check ───────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🍬 Candy Store API is running!', version: '1.0.0' });
});

// ── 404 handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Error handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

// ── Start ──────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});