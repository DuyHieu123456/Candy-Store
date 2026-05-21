const { sql, poolPromise } = require('../dbConfig');

// ── GET /api/products ──────────────────────────────────────
// Query params: page, limit, category, brand, min_price, max_price,
//               sort (price_asc|price_desc|newest|popular|rating),
//               search, featured, is_new
const getProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const {
      page = 1, limit = 12, category, brand,
      min_price, max_price, sort = 'newest',
      search, featured, is_new
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    let where = ['p.is_active = 1'];
    const request = pool.request();

    if (category) {
      where.push('c.slug = @category');
      request.input('category', sql.NVarChar, category);
    }
    if (brand) {
      where.push('b.slug = @brand');
      request.input('brand', sql.NVarChar, brand);
    }
    if (min_price) {
      where.push('p.price >= @min_price');
      request.input('min_price', sql.Decimal, parseFloat(min_price));
    }
    if (max_price) {
      where.push('p.price <= @max_price');
      request.input('max_price', sql.Decimal, parseFloat(max_price));
    }
    if (search) {
      where.push('(p.name LIKE @search OR p.tags LIKE @search OR p.short_desc LIKE @search)');
      request.input('search', sql.NVarChar, `%${search}%`);
    }
    if (featured === 'true') {
      where.push('p.is_featured = 1');
    }
    if (is_new === 'true') {
      where.push('p.is_new = 1');
    }

    const sortMap = {
      price_asc:  'p.price ASC',
      price_desc: 'p.price DESC',
      newest:     'p.created_at DESC',
      popular:    'p.sold_count DESC',
      rating:     'p.avg_rating DESC',
    };
    const orderBy = sortMap[sort] || 'p.created_at DESC';
    const whereStr = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Total count
    const countResult = await request.query(`
      SELECT COUNT(*) AS total
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Brands      b ON p.brand_id    = b.id
      ${whereStr}
    `);
    const total = countResult.recordset[0].total;

    // Products
    const request2 = pool.request();
    if (category)   request2.input('category',  sql.NVarChar, category);
    if (brand)      request2.input('brand',      sql.NVarChar, brand);
    if (min_price)  request2.input('min_price',  sql.Decimal,  parseFloat(min_price));
    if (max_price)  request2.input('max_price',  sql.Decimal,  parseFloat(max_price));
    if (search)     request2.input('search',     sql.NVarChar, `%${search}%`);
    request2.input('limit',  sql.Int, parseInt(limit));
    request2.input('offset', sql.Int, offset);

    const result = await request2.query(`
      SELECT p.id, p.name, p.slug, p.short_desc, p.price, p.sale_price,
             p.stock, p.images, p.is_featured, p.is_new, p.avg_rating,
             p.review_count, p.sold_count, p.created_at, p.country, p.dietary,
             c.name AS category_name, c.slug AS category_slug,
             b.name AS brand_name,    b.slug AS brand_slug
      FROM Products p
      LEFT JOIN Categories c ON p.category_id = c.id
      LEFT JOIN Brands      b ON p.brand_id    = b.id
      ${whereStr}
      ORDER BY ${orderBy}
      OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
    `);

    res.json({
      success: true,
      data: result.recordset,
      pagination: {
        total, page: parseInt(page), limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/products/featured ─────────────────────────────
const getFeaturedProducts = async (req, res) => {
  try {
    const pool = await poolPromise;
    const limit = parseInt(req.query.limit) || 8;
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit)
          p.id, p.name, p.slug, p.short_desc, p.price, p.sale_price,
          p.stock, p.images, p.is_featured, p.is_new, p.avg_rating,
          p.review_count, p.sold_count,
          c.name AS category_name, c.slug AS category_slug,
          b.name AS brand_name,    b.slug AS brand_slug
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Brands      b ON p.brand_id    = b.id
        WHERE p.is_active = 1 AND p.is_featured = 1
        ORDER BY p.sold_count DESC
      `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/products/new-arrivals ─────────────────────────
const getNewArrivals = async (req, res) => {
  try {
    const pool = await poolPromise;
    const limit = parseInt(req.query.limit) || 8;
    const result = await pool.request()
      .input('limit', sql.Int, limit)
      .query(`
        SELECT TOP (@limit)
          p.id, p.name, p.slug, p.short_desc, p.price, p.sale_price,
          p.stock, p.images, p.is_new, p.avg_rating, p.review_count,
          c.name AS category_name, c.slug AS category_slug,
          b.name AS brand_name,    b.slug AS brand_slug
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Brands      b ON p.brand_id    = b.id
        WHERE p.is_active = 1 AND p.is_new = 1
        ORDER BY p.created_at DESC
      `);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/products/:slug ────────────────────────────────
const getProductBySlug = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('slug', sql.NVarChar, req.params.slug)
      .query(`
        SELECT p.*,
               c.name AS category_name, c.slug AS category_slug,
               b.name AS brand_name,    b.slug AS brand_slug,  b.logo AS brand_logo
        FROM Products p
        LEFT JOIN Categories c ON p.category_id = c.id
        LEFT JOIN Brands      b ON p.brand_id    = b.id
        WHERE p.slug = @slug AND p.is_active = 1
      `);

    if (!result.recordset[0])
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm.' });

    // Reviews
    const reviews = await pool.request()
      .input('pid', sql.Int, result.recordset[0].id)
      .query(`
        SELECT r.id, r.rating, r.comment, r.created_at,
               u.name AS user_name, u.avatar AS user_avatar
        FROM Reviews r
        JOIN Users u ON r.user_id = u.id
        WHERE r.product_id = @pid AND r.is_approved = 1
        ORDER BY r.created_at DESC
      `);

    // Related products
    const related = await pool.request()
      .input('catId', sql.Int,      result.recordset[0].category_id)
      .input('pid',   sql.Int,      result.recordset[0].id)
      .query(`
        SELECT TOP 4
          p.id, p.name, p.slug, p.price, p.sale_price, p.images, p.avg_rating
        FROM Products p
        WHERE p.category_id = @catId AND p.id <> @pid AND p.is_active = 1
        ORDER BY p.sold_count DESC
      `);

    res.json({
      success: true,
      data: {
        ...result.recordset[0],
        reviews: reviews.recordset,
        related: related.recordset
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/products/:id/reviews ────────────────────────
const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ success: false, message: 'Vui lòng chọn số sao.' });

  try {
    const pool = await poolPromise;
    // Kiểm tra đã review chưa
    const existing = await pool.request()
      .input('pid', sql.Int, req.params.id)
      .input('uid', sql.Int, req.user.id)
      .query('SELECT id FROM Reviews WHERE product_id=@pid AND user_id=@uid');

    if (existing.recordset.length > 0)
      return res.status(400).json({ success: false, message: 'Bạn đã đánh giá sản phẩm này rồi.' });

    await pool.request()
      .input('pid',     sql.Int,      parseInt(req.params.id))
      .input('uid',     sql.Int,      req.user.id)
      .input('rating',  sql.TinyInt,  parseInt(rating))
      .input('comment', sql.NVarChar, comment || null)
      .query('INSERT INTO Reviews (product_id, user_id, rating, comment) VALUES (@pid, @uid, @rating, @comment)');

    // Cập nhật avg_rating
    await pool.request()
      .input('pid', sql.Int, parseInt(req.params.id))
      .query(`
        UPDATE Products SET
          avg_rating   = (SELECT AVG(CAST(rating AS DECIMAL(3,2))) FROM Reviews WHERE product_id=@pid AND is_approved=1),
          review_count = (SELECT COUNT(*) FROM Reviews WHERE product_id=@pid AND is_approved=1)
        WHERE id = @pid
      `);

    res.status(201).json({ success: true, message: 'Cảm ơn bạn đã đánh giá!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/products (admin) ─────────────────────────────
const createProduct = async (req, res) => {
  const { name, slug, description, short_desc, price, sale_price, stock, sku,
          weight, category_id, brand_id, images, tags, is_featured, is_new } = req.body;
  if (!name || !price)
    return res.status(400).json({ success: false, message: 'Tên và giá là bắt buộc.' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('name',        sql.NVarChar, name)
      .input('slug',        sql.NVarChar, slug || name.toLowerCase().replace(/\s+/g, '-'))
      .input('description', sql.NVarChar, description || null)
      .input('short_desc',  sql.NVarChar, short_desc  || null)
      .input('price',       sql.Decimal,  parseFloat(price))
      .input('sale_price',  sql.Decimal,  sale_price ? parseFloat(sale_price) : null)
      .input('stock',       sql.Int,      parseInt(stock) || 0)
      .input('sku',         sql.NVarChar, sku         || null)
      .input('weight',      sql.Decimal,  weight      ? parseFloat(weight) : null)
      .input('category_id', sql.Int,      category_id ? parseInt(category_id) : null)
      .input('brand_id',    sql.Int,      brand_id    ? parseInt(brand_id)    : null)
      .input('images',      sql.NVarChar, images      ? JSON.stringify(images) : null)
      .input('tags',        sql.NVarChar, tags        || null)
      .input('is_featured', sql.Bit,      is_featured ? 1 : 0)
      .input('is_new',      sql.Bit,      is_new      ? 1 : 0)
      .query(`INSERT INTO Products
                (name,slug,description,short_desc,price,sale_price,stock,sku,weight,category_id,brand_id,images,tags,is_featured,is_new)
              OUTPUT INSERTED.id
              VALUES (@name,@slug,@description,@short_desc,@price,@sale_price,@stock,@sku,@weight,@category_id,@brand_id,@images,@tags,@is_featured,@is_new)`);

    res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công!', data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/products/:id (admin) ─────────────────────────
const updateProduct = async (req, res) => {
  const fields = ['name','slug','description','short_desc','price','sale_price',
                  'stock','sku','weight','category_id','brand_id','images','tags',
                  'is_featured','is_new','is_active'];
  try {
    const pool = await poolPromise;
    const sets = [];
    const request = pool.request().input('id', sql.Int, parseInt(req.params.id));

    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        sets.push(`${f}=@${f}`);
        request.input(f, req.body[f]);
      }
    });

    if (sets.length === 0)
      return res.status(400).json({ success: false, message: 'Không có dữ liệu cần cập nhật.' });

    sets.push('updated_at=GETDATE()');
    await request.query(`UPDATE Products SET ${sets.join(',')} WHERE id=@id`);

    res.json({ success: true, message: 'Cập nhật sản phẩm thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/products/:id (admin) ──────────────────────
const deleteProduct = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, parseInt(req.params.id))
      .query('UPDATE Products SET is_active=0 WHERE id=@id');
    res.json({ success: true, message: 'Đã xóa sản phẩm.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProducts, getFeaturedProducts, getNewArrivals,
  getProductBySlug, addReview,
  createProduct, updateProduct, deleteProduct
};
