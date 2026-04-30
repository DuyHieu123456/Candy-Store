const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { poolPromise } = require('./dbConfig');

const app = express();

// Middleware
app.use(cors()); // Cho phép Frontend (cổng 5173) gọi tới Backend (cổng 5000)
app.use(express.json()); 

// API Endpoint: Lấy danh sách sản phẩm
app.get('/api/products', async (req, res) => {
    try {
        const pool = await poolPromise;
        // Chạy câu lệnh SQL lấy danh sách kẹo đang được bán
        const result = await pool.request()
            .query('SELECT * FROM Products WHERE IsActive = 1');
        
        // Trả kết quả về dưới dạng JSON
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi server khi lấy dữ liệu' });
    }
});

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server Backend đang chạy tại http://localhost:${PORT}`);
});