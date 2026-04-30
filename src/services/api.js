const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            ...options.headers,
        };

        // Thêm token vào header
        const token = localStorage.getItem("token");
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (response.status === 401) {
                // Token hết hạn hoặc không hợp lệ
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = "/login";
            }

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `HTTP Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }

    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: "GET" });
    }

    post(endpoint, data, options) {
        return this.request(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
        });
    }

    put(endpoint, data, options) {
        return this.request(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(data),
        });
    }

    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: "DELETE" });
    }
}

const api = new ApiClient(API_URL);

export default api;
