require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: false, // Để false vì chúng ta đang chạy local trên máy tính
        trustServerCertificate: true 
    }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('✅ Đã kết nối thành công tới SQL Server!');
    return pool;
  })
  .catch(err => {
      console.log('❌ Lỗi kết nối Database: ', err.message);
  });

module.exports = { sql, poolPromise };