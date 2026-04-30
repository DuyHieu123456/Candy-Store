import axios from 'axios';

// Khởi tạo một instance của axios
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Trỏ thẳng về Backend Node.js của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;