const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();

// Cấu hình Middleware
app.use(cors()); // Cho phép gọi API từ trình duyệt (Fix CORS)
app.use(express.json()); // Hỗ trợ đọc dữ liệu JSON từ body request

// 1. Phục vụ các file tĩnh (CSS, JS, Hình ảnh) nằm trong thư mục src
app.use(express.static(__dirname));

// 2. Route cho trang chủ (Deposit Studio)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 3. Route cho trang Payout Studio
app.get('/payout', (req, res) => {
    res.sendFile(path.join(__dirname, 'payout.html'));
});

// 4. Logic Proxy - Trạm trung chuyển để gọi API đích
app.post('/proxy', async (req, res) => {
    const { targetUrl, payload, isForm } = req.body;

    console.log(`📡 [Proxy] Đang chuyển tiếp request tới: ${targetUrl}`);

    try {
        const config = {
            headers: { 
                // Tự động chuyển đổi Content-Type tùy theo yêu cầu của API đích
                'Content-Type': isForm ? 'application/x-www-form-urlencoded' : 'application/json' 
            },
            timeout: 15000 // Ngắt kết nối sau 15 giây nếu server không phản hồi
        };

        const response = await axios.post(targetUrl, payload, config);
        
        console.log(`✅ [Proxy] Thành công! Trạng thái: ${response.status}`);
        res.status(response.status).json(response.data);

    } catch (error) {
        const status = error.response ? error.response.status : 500;
        const errorData = error.response ? error.response.data : { message: error.message };
        
        console.error(`❌ [Proxy] Lỗi: ${status}`);
        res.status(status).json(errorData);
    }
});

// Khởi chạy server trên cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log('==================================================');
    console.log('🚀 AESTHETICA PROXY SERVER IS READY!');
    console.log('==================================================');
    console.log(`📥 Deposit : https://julies.jsmart.qzz.io/`);
    console.log(`📤 Payout  : https://julies.jsmart.qzz.io/payout`);
    console.log('--------------------------------------------------');
});