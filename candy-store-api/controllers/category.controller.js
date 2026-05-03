const { sql, poolPromise } = require('../dbConfig');

// ── GET /api/categories ────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT c.id, c.name, c.slug, c.description, c.image, c.parent_id, c.sort_order,
             (SELECT COUNT(*) FROM Products p WHERE p.category_id = c.id AND p.is_active=1) AS product_count
      FROM Categories c
      WHERE c.is_active = 1
      ORDER BY c.sort_order ASC, c.name ASC
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/categories/:slug ──────────────────────────────
const getCategoryBySlug = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('slug', sql.NVarChar, req.params.slug)
      .query('SELECT * FROM Categories WHERE slug=@slug AND is_active=1');

    if (!result.recordset[0])
      return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục.' });

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/categories/:slug/products ────────────────────
const getCategoryProducts = async (req, res) => {
  try {
    const pool  = await poolPromise;
    const { page = 1, limit = 12, sort = 'newest' } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const sortMap = {
      price_asc: 'p.price ASC', price_desc: 'p.price DESC',
      newest: 'p.created_at DESC', popular: 'p.sold_count DESC'
    };
    const orderBy = sortMap[sort] || 'p.created_at DESC';

    const countRes = await pool.request()
      .input('slug', sql.NVarChar, req.params.slug)
      .query(`SELECT COUNT(*) AS total FROM Products p
              JOIN Categories c ON p.category_id=c.id
              WHERE c.slug=@slug AND p.is_active=1`);

    const prodRes = await pool.request()
      .input('slug',   sql.NVarChar, req.params.slug)
      .input('limit',  sql.Int, parseInt(limit))
      .input('offset', sql.Int, offset)
      .query(`
        SELECT p.id, p.name, p.slug, p.short_desc, p.price, p.sale_price,
               p.stock, p.images, p.is_new, p.avg_rating, p.review_count, p.sold_count,
               b.name AS brand_name, b.slug AS brand_slug
        FROM Products p
        JOIN Categories c ON p.category_id=c.id
        LEFT JOIN Brands b ON p.brand_id=b.id
        WHERE c.slug=@slug AND p.is_active=1
        ORDER BY ${orderBy}
        OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
      `);

    const total = countRes.recordset[0].total;
    res.json({
      success: true, data: prodRes.recordset,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/categories (admin) ──────────────────────────
const createCategory = async (req, res) => {
  const { name, slug, description, image, parent_id, sort_order } = req.body;
  if (!name || !slug)
    return res.status(400).json({ success: false, message: 'Tên và slug là bắt buộc.' });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name',        sql.NVarChar, name)
      .input('slug',        sql.NVarChar, slug)
      .input('description', sql.NVarChar, description || null)
      .input('image',       sql.NVarChar, image       || null)
      .input('parent_id',   sql.Int,      parent_id   ? parseInt(parent_id) : null)
      .input('sort_order',  sql.Int,      sort_order  ? parseInt(sort_order) : 0)
      .query('INSERT INTO Categories (name,slug,description,image,parent_id,sort_order) VALUES (@name,@slug,@description,@image,@parent_id,@sort_order)');
    res.status(201).json({ success: true, message: 'Tạo danh mục thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/categories/:id (admin) ───────────────────────
const updateCategory = async (req, res) => {
  const { name, slug, description, image, parent_id, sort_order, is_active } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id',          sql.Int,      parseInt(req.params.id))
      .input('name',        sql.NVarChar, name)
      .input('slug',        sql.NVarChar, slug)
      .input('description', sql.NVarChar, description  || null)
      .input('image',       sql.NVarChar, image        || null)
      .input('parent_id',   sql.Int,      parent_id    ? parseInt(parent_id) : null)
      .input('sort_order',  sql.Int,      sort_order   ? parseInt(sort_order) : 0)
      .input('is_active',   sql.Bit,      is_active !== undefined ? (is_active ? 1 : 0) : 1)
      .query('UPDATE Categories SET name=@name,slug=@slug,description=@description,image=@image,parent_id=@parent_id,sort_order=@sort_order,is_active=@is_active WHERE id=@id');
    res.json({ success: true, message: 'Cập nhật danh mục thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCategories, getCategoryBySlug, getCategoryProducts, createCategory, updateCategory };
