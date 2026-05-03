const { sql, poolPromise } = require('../dbConfig');

// ── GET /api/banners?position=hero ────────────────────────
const getBanners = async (req, res) => {
  try {
    const pool = await poolPromise;
    const { position } = req.query;
    let query = 'SELECT * FROM Banners WHERE is_active=1';
    const request = pool.request();
    if (position) {
      query += ' AND position=@position';
      request.input('position', sql.NVarChar, position);
    }
    query += ' ORDER BY sort_order ASC';
    const result = await request.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/banners (admin) ─────────────────────────────
const createBanner = async (req, res) => {
  const { title, subtitle, image, link, btn_text, position = 'hero', sort_order = 0 } = req.body;
  if (!image) return res.status(400).json({ success: false, message: 'image là bắt buộc.' });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('title',      sql.NVarChar, title     || null)
      .input('subtitle',   sql.NVarChar, subtitle  || null)
      .input('image',      sql.NVarChar, image)
      .input('link',       sql.NVarChar, link      || null)
      .input('btn_text',   sql.NVarChar, btn_text  || null)
      .input('position',   sql.NVarChar, position)
      .input('sort_order', sql.Int,      parseInt(sort_order))
      .query('INSERT INTO Banners (title,subtitle,image,link,btn_text,position,sort_order) VALUES (@title,@subtitle,@image,@link,@btn_text,@position,@sort_order)');
    res.status(201).json({ success: true, message: 'Tạo banner thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/banners/:id (admin) ──────────────────────────
const updateBanner = async (req, res) => {
  const { title, subtitle, image, link, btn_text, position, sort_order, is_active } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id',         sql.Int,      parseInt(req.params.id))
      .input('title',      sql.NVarChar, title     || null)
      .input('subtitle',   sql.NVarChar, subtitle  || null)
      .input('image',      sql.NVarChar, image)
      .input('link',       sql.NVarChar, link      || null)
      .input('btn_text',   sql.NVarChar, btn_text  || null)
      .input('position',   sql.NVarChar, position)
      .input('sort_order', sql.Int,      parseInt(sort_order) || 0)
      .input('is_active',  sql.Bit,      is_active ? 1 : 0)
      .query('UPDATE Banners SET title=@title,subtitle=@subtitle,image=@image,link=@link,btn_text=@btn_text,position=@position,sort_order=@sort_order,is_active=@is_active WHERE id=@id');
    res.json({ success: true, message: 'Cập nhật banner thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/banners/:id (admin) ───────────────────────
const deleteBanner = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('DELETE FROM Banners WHERE id=@id');
    res.json({ success: true, message: 'Đã xóa banner.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
