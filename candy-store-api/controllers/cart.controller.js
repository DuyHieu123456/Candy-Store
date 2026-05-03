const { sql, poolPromise } = require('../dbConfig');

// Hàm bổ trợ: Tìm hoặc tạo giỏ hàng
const getOrCreateCartId = async (pool, userId, sessionId) => {
  const request = pool.request();
  if (userId) {
    request.input('uid', sql.Int, userId);
    const res = await request.query('SELECT id FROM Carts WHERE user_id=@uid');
    if (res.recordset[0]) return res.recordset[0].id;
  } else {
    request.input('sid', sql.NVarChar, sessionId);
    const res = await request.query('SELECT id FROM Carts WHERE session_id=@sid');
    if (res.recordset[0]) return res.recordset[0].id;
  }

  const insert = await pool.request()
    .input('u', sql.Int, userId || null)
    .input('s', sql.NVarChar, sessionId || null)
    .query('INSERT INTO Carts (user_id, session_id) OUTPUT INSERTED.id VALUES (@u, @s)');
  return insert.recordset[0].id;
};

// ── GET /api/cart: Lấy danh sách kẹo trong giỏ[cite: 16]
const getCart = async (req, res) => {
  try {
    const pool = await poolPromise;
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;

    const cartId = await getOrCreateCartId(pool, userId, sessionId);
    const result = await pool.request()
      .input('cartId', sql.Int, cartId)
      .query(`
        SELECT ci.id AS cart_item_id, ci.quantity,
               p.id, p.name, p.slug, p.price, p.sale_price, p.stock, p.images,
               b.name AS brand_name
        FROM CartItems ci
        JOIN Products p ON ci.product_id=p.id
        LEFT JOIN Brands b ON p.brand_id=b.id
        WHERE ci.cart_id=@cartId AND p.is_active=1
        ORDER BY ci.added_at DESC
      `);

    const items = result.recordset;
    const total = items.reduce((sum, i) => sum + (i.sale_price || i.price) * i.quantity, 0);
    const count = items.reduce((s, i) => s + i.quantity, 0);

    res.json({ success: true, data: { items, total: parseFloat(total.toFixed(2)), count, cart_id: cartId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/cart: Thêm kẹo vào giỏ[cite: 16]
const addToCart = async (req, res) => {
  const { product_id, quantity = 1 } = req.body;
  try {
    const pool = await poolPromise;
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;

    // Kiểm tra tồn kho trước khi thêm[cite: 16]
    const stock = await pool.request()
      .input('pid', sql.Int, product_id)
      .query('SELECT stock, name FROM Products WHERE id=@pid AND is_active=1');
    
    if (!stock.recordset[0]) return res.status(404).json({ success: false, message: 'Kẹo không tồn tại.' });
    if (stock.recordset[0].stock < quantity) return res.status(400).json({ success: false, message: 'Không đủ hàng.' });

    const cartId = await getOrCreateCartId(pool, userId, sessionId);

    // Nếu đã có trong giỏ thì tăng số lượng, nếu chưa thì tạo mới[cite: 16]
    const existing = await pool.request()
      .input('cartId', sql.Int, cartId)
      .input('pid', sql.Int, product_id)
      .query('SELECT id, quantity FROM CartItems WHERE cart_id=@cartId AND product_id=@pid');

    if (existing.recordset.length > 0) {
      await pool.request()
        .input('id', sql.Int, existing.recordset[0].id)
        .input('qty', sql.Int, existing.recordset[0].quantity + parseInt(quantity))
        .query('UPDATE CartItems SET quantity=@qty WHERE id=@id');
    } else {
      await pool.request()
        .input('cartId', sql.Int, cartId)
        .input('pid', sql.Int, product_id)
        .input('qty', sql.Int, quantity)
        .query('INSERT INTO CartItems (cart_id, product_id, quantity) VALUES (@cartId, @pid, @qty)');
    }
    res.status(201).json({ success: true, message: 'Đã thêm vào giỏ!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/cart: Làm trống giỏ (Dùng sau khi thanh toán)[cite: 17]
const clearCart = async (req, res) => {
  try {
    const pool = await poolPromise;
    const cartId = await getOrCreateCartId(pool, req.user?.id, req.headers['x-session-id']);
    await pool.request().input('cartId', sql.Int, cartId).query('DELETE FROM CartItems WHERE cart_id=@cartId');
    res.json({ success: true, message: 'Giỏ hàng đã sạch kẹo!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCart, addToCart, clearCart };