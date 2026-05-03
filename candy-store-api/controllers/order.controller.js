const { sql, poolPromise } = require('../dbConfig');

// Tạo số hóa đơn chuyên nghiệp theo ngày và mã ngẫu nhiên
const genOrderNumber = () => {
  const d = new Date();
  const date = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `ORD-${date}-${rand}`;
};

// ── POST /api/orders: Đặt hàng (Sử dụng Transaction để bảo toàn dữ liệu)
const createOrder = async (req, res) => {
  const { items, recipient_name, recipient_phone, shipping_address, city, payment_method, note } = req.body;
  
  if (!items?.length || !recipient_name || !recipient_phone || !shipping_address) {
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin giao hàng.' });
  }

  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();
    let subtotal = 0;
    const orderItems = [];

    // Kiểm tra kho và tính giá
    for (const item of items) {
      const prodRes = await new sql.Request(transaction)
        .input('id', sql.Int, item.product_id)
        .query('SELECT id, name, price, sale_price, stock, images FROM Products WHERE id=@id AND is_active=1');

      const p = prodRes.recordset[0];
      if (!p) throw new Error(`Sản phẩm (ID: ${item.product_id}) không tồn tại hoặc đã ngừng bán.`);
      if (p.stock < item.quantity) throw new Error(`Sản phẩm "${p.name}" chỉ còn ${p.stock} sản phẩm trong kho.`);

      const unitPrice = p.sale_price || p.price;
      subtotal += unitPrice * item.quantity;

      // Xử lý lấy ảnh đầu tiên an toàn[cite: 21]
      let firstImg = null;
      try {
        if (p.images) {
          const imgArr = JSON.parse(p.images);
          firstImg = Array.isArray(imgArr) ? imgArr[0] : imgArr;
        }
      } catch (e) { firstImg = p.images; }

      orderItems.push({
        product_id: p.id,
        product_name: p.name,
        product_img: firstImg,
        quantity: item.quantity,
        unit_price: unitPrice,
        total_price: unitPrice * item.quantity
      });
    }

    // Phí vận chuyển: Miễn phí cho đơn từ 300k, còn lại 30k[cite: 21]
    const shipping_fee = subtotal >= 300000 ? 0 : 30000;
    const order_number = genOrderNumber();

    // Lưu vào bảng Orders[cite: 21]
    const orderRes = await new sql.Request(transaction)
      .input('user_id', sql.Int, req.user?.id || null) // Hỗ trợ cả khách vãng lai nếu middleware là optionalAuth[cite: 22, 23]
      .input('order_number', sql.NVarChar, order_number)
      .input('subtotal', sql.Decimal, subtotal)
      .input('shipping_fee', sql.Decimal, shipping_fee)
      .input('total', sql.Decimal, subtotal + shipping_fee)
      .input('status', sql.NVarChar, 'pending') // Trạng thái mặc định: Chờ xử lý
      .input('recipient_name', sql.NVarChar, recipient_name)
      .input('recipient_phone', sql.NVarChar, recipient_phone)
      .input('shipping_address', sql.NVarChar, shipping_address)
      .input('city', sql.NVarChar, city || 'VN')
      .input('payment_method', sql.NVarChar, payment_method || 'cod')
      .input('note', sql.NVarChar, note || null)
      .query(`INSERT INTO Orders (user_id, order_number, subtotal, shipping_fee, total, status, recipient_name, recipient_phone, shipping_address, city, payment_method, note)
              OUTPUT INSERTED.id 
              VALUES (@user_id, @order_number, @subtotal, @shipping_fee, @total, @status, @recipient_name, @recipient_phone, @shipping_address, @city, @payment_method, @note)`);

    const orderId = orderRes.recordset[0].id;

    // Lưu chi tiết đơn hàng và cập nhật tồn kho[cite: 21]
    for (const oi of orderItems) {
      await new sql.Request(transaction)
        .input('order_id', sql.Int, orderId)
        .input('product_id', sql.Int, oi.product_id)
        .input('product_name', sql.NVarChar, oi.product_name)
        .input('product_img', sql.NVarChar, oi.product_img)
        .input('quantity', sql.Int, oi.quantity)
        .input('unit_price', sql.Decimal, oi.unit_price)
        .input('total_price', sql.Decimal, oi.total_price)
        .query(`INSERT INTO OrderItems (order_id, product_id, product_name, product_img, quantity, unit_price, total_price)
                VALUES (@order_id, @product_id, @product_name, @product_img, @quantity, @unit_price, @total_price)`);

      await new sql.Request(transaction)
        .input('pid', sql.Int, oi.product_id)
        .input('qty', sql.Int, oi.quantity)
        .query('UPDATE Products SET stock = stock - @qty, sold_count = sold_count + @qty WHERE id = @pid');
    }

    await transaction.commit();
    res.status(201).json({ 
      success: true, 
      message: 'Đặt hàng thành công!',
      data: { order_id: orderId, order_number, finalTotal: subtotal + shipping_fee } 
    });
  } catch (err) {
    if (transaction) await transaction.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/orders/my-orders: Xem lịch sử đơn hàng của tôi[cite: 21, 23]
const getMyOrders = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('uid', sql.Int, req.user.id)
      .query(`SELECT id, order_number, status, total, payment_method, created_at 
              FROM Orders WHERE user_id=@uid ORDER BY created_at DESC`);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/orders/:id: Lấy chi tiết một đơn hàng[cite: 21, 23]
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    const orderRes = await pool.request()
      .input('id', sql.Int, id)
      .input('uid', sql.Int, req.user.id)
      .query(`SELECT * FROM Orders WHERE id=@id AND user_id=@uid`);

    if (!orderRes.recordset[0]) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng.' });
    }

    const itemsRes = await pool.request()
      .input('orderId', sql.Int, id)
      .query(`SELECT * FROM OrderItems WHERE order_id=@orderId`);

    const order = orderRes.recordset[0];
    order.items = itemsRes.recordset;

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/orders/:id/cancel: Hủy đơn hàng (Chỉ khi đang chờ xử lý)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    // 1. Kiểm tra đơn hàng có thuộc về user và đang ở trạng thái pending không
    const orderCheck = await pool.request()
      .input('id', sql.Int, id)
      .input('uid', sql.Int, req.user.id)
      .query('SELECT status FROM Orders WHERE id=@id AND user_id=@uid');

    if (!orderCheck.recordset[0]) return res.status(404).json({ success: false, message: 'Đơn hàng không tồn tại.' });
    if (orderCheck.recordset[0].status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý.' });
    }

    // 2. Cập nhật trạng thái và hoàn lại kho (Transaction)
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      await new sql.Request(transaction)
        .input('id', sql.Int, id)
        .query("UPDATE Orders SET status = 'cancelled' WHERE id = @id");

      // Hoàn trả số lượng vào kho
      const items = await new sql.Request(transaction)
        .input('oid', sql.Int, id)
        .query('SELECT product_id, quantity FROM OrderItems WHERE order_id = @oid');

      for (const item of items.recordset) {
        await new sql.Request(transaction)
          .input('pid', sql.Int, item.product_id)
          .input('qty', sql.Int, item.quantity)
          .query('UPDATE Products SET stock = stock + @qty, sold_count = sold_count - @qty WHERE id = @pid');
      }

      await transaction.commit();
      res.json({ success: true, message: 'Hủy đơn hàng thành công và đã hoàn trả kho.' });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder };