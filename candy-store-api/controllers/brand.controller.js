const { sql, poolPromise } = require('../dbConfig');

// ── GET /api/brands ────────────────────────────────────────
const getBrands = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT b.id, b.name, b.slug, b.logo, b.description, b.website,
             (SELECT COUNT(*) FROM Products p WHERE p.brand_id=b.id AND p.is_active=1) AS product_count
      FROM Brands b
      WHERE b.is_active=1
      ORDER BY b.name ASC
    `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/brands/:slug ──────────────────────────────────
const getBrandBySlug = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('slug', sql.NVarChar, req.params.slug)
      .query('SELECT * FROM Brands WHERE slug=@slug AND is_active=1');
    if (!result.recordset[0])
      return res.status(404).json({ success: false, message: 'Không tìm thấy thương hiệu.' });
    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/brands/:slug/products ────────────────────────
const getBrandProducts = async (req, res) => {
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
              JOIN Brands b ON p.brand_id=b.id WHERE b.slug=@slug AND p.is_active=1`);

    const prodRes = await pool.request()
      .input('slug', sql.NVarChar, req.params.slug)
      .input('limit', sql.Int, parseInt(limit))
      .input('offset', sql.Int, offset)
      .query(`
        SELECT p.id, p.name, p.slug, p.short_desc, p.price, p.sale_price,
               p.stock, p.images, p.is_new, p.avg_rating, p.review_count, p.sold_count,
               c.name AS category_name, c.slug AS category_slug
        FROM Products p
        JOIN Brands b ON p.brand_id=b.id
        LEFT JOIN Categories c ON p.category_id=c.id
        WHERE b.slug=@slug AND p.is_active=1
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

// ── POST /api/brands (admin) ───────────────────────────────
const createBrand = async (req, res) => {
  const { name, slug, logo, description, website } = req.body;
  if (!name || !slug)
    return res.status(400).json({ success: false, message: 'Tên và slug là bắt buộc.' });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('name',        sql.NVarChar, name)
      .input('slug',        sql.NVarChar, slug)
      .input('logo',        sql.NVarChar, logo        || null)
      .input('description', sql.NVarChar, description || null)
      .input('website',     sql.NVarChar, website     || null)
      .query('INSERT INTO Brands (name,slug,logo,description,website) VALUES (@name,@slug,@logo,@description,@website)');
    res.status(201).json({ success: true, message: 'Tạo thương hiệu thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/brands/:id (admin) ────────────────────────────
const updateBrand = async (req, res) => {
  const { name, slug, logo, description, website, is_active } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id',          sql.Int,      parseInt(req.params.id))
      .input('name',        sql.NVarChar, name)
      .input('slug',        sql.NVarChar, slug)
      .input('logo',        sql.NVarChar, logo        || null)
      .input('description', sql.NVarChar, description || null)
      .input('website',     sql.NVarChar, website     || null)
      .input('is_active',   sql.Bit,      is_active !== undefined ? (is_active ? 1 : 0) : 1)
      .query('UPDATE Brands SET name=@name,slug=@slug,logo=@logo,description=@description,website=@website,is_active=@is_active WHERE id=@id');
    res.json({ success: true, message: 'Cập nhật thương hiệu thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getBrands, getBrandBySlug, getBrandProducts, createBrand, updateBrand };
