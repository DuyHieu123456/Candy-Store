const bcrypt          = require('bcryptjs');
const { sql, poolPromise } = require('../dbConfig');
const { generateToken }    = require('../utils/jwt');

// ── POST /api/auth/register ────────────────────────────────
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });

  try {
    const pool = await poolPromise;
    // kiểm tra email đã tồn tại
    const existing = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM Users WHERE email = @email');

    if (existing.recordset.length > 0)
      return res.status(400).json({ success: false, message: 'Email đã được sử dụng.' });

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.request()
      .input('name',     sql.NVarChar, name)
      .input('email',    sql.NVarChar, email)
      .input('password', sql.NVarChar, hashed)
      .input('phone',    sql.NVarChar, phone || null)
      .query(`INSERT INTO Users (name, email, password, phone)
              OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role
              VALUES (@name, @email, @password, @phone)`);

    const user  = result.recordset[0];
    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({ success: true, message: 'Đăng ký thành công!', data: { user, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/login ───────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu.' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    const user = result.recordset[0];
    if (!user)
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    const { password: _, ...userSafe } = user;
    res.json({ success: true, message: 'Đăng nhập thành công!', data: { user: userSafe, token } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/auth/profile ──────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT id, name, email, phone, address, role, avatar, created_at FROM Users WHERE id = @id');

    if (!result.recordset[0])
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });

    res.json({ success: true, data: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/auth/profile ──────────────────────────────────
const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('id',      sql.Int,      req.user.id)
      .input('name',    sql.NVarChar, name    || null)
      .input('phone',   sql.NVarChar, phone   || null)
      .input('address', sql.NVarChar, address || null)
      .query(`UPDATE Users SET name=@name, phone=@phone, address=@address, updated_at=GETDATE()
              WHERE id=@id`);

    res.json({ success: true, message: 'Cập nhật thông tin thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/auth/change-password ─────────────────────────
const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ thông tin.' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.Int, req.user.id)
      .query('SELECT password FROM Users WHERE id = @id');

    const isMatch = await bcrypt.compare(oldPassword, result.recordset[0].password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: 'Mật khẩu cũ không đúng.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('id',       sql.Int,      req.user.id)
      .input('password', sql.NVarChar, hashed)
      .query('UPDATE Users SET password=@password WHERE id=@id');

    res.json({ success: true, message: 'Đổi mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// ── POST /api/auth/forgot-password ───────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const pool = await poolPromise;
    const userRes = await pool.request()
      .input('email', sql.NVarChar, email)
      .query('SELECT id FROM Users WHERE email = @email');

    if (!userRes.recordset[0]) 
      return res.status(404).json({ success: false, message: 'Email không tồn tại.' });

    // Tạo mã ngẫu nhiên 6 số (đơn giản nhất)
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3600000); // Hết hạn sau 1 giờ

    await pool.request()
      .input('email', sql.NVarChar, email)
      .input('token', sql.NVarChar, resetToken)
      .input('exp',   sql.DateTime, expiry)
      .query('UPDATE Users SET reset_token=@token, reset_expiry=@exp WHERE email=@email');

    // Ở đây bạn nên dùng Nodemailer để gửi resetToken qua email khách
    res.json({ success: true, message: 'Mã khôi phục đã được tạo (Giả lập gửi qua Email): ' + resetToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/auth/reset-password ────────────────────────
const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  try {
    const pool = await poolPromise;
    const userRes = await pool.request()
      .input('email', sql.NVarChar, email)
      .input('token', sql.NVarChar, token)
      .query('SELECT id FROM Users WHERE email=@email AND reset_token=@token AND reset_expiry > GETDATE()');

    if (!userRes.recordset[0])
      return res.status(400).json({ success: false, message: 'Mã xác nhận không đúng hoặc đã hết hạn.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.request()
      .input('id',       sql.Int,      userRes.recordset[0].id)
      .input('password', sql.NVarChar, hashed)
      .query('UPDATE Users SET password=@password, reset_token=NULL, reset_expiry=NULL WHERE id=@id');

    res.json({ success: true, message: 'Đặt lại mật khẩu thành công!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, forgotPassword, resetPassword };
