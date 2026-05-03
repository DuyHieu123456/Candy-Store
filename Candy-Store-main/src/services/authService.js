import api from "./api";

const TOKEN_KEY = "candy_token";

const authService = {
    async login(credentials) {
        const response = await api.post("/auth/login", credentials);
        if (response.data.success) {
            // Lưu token vào localStorage để dùng cho các request sau
            localStorage.setItem(TOKEN_KEY, response.data.data.token);
        }
        return response.data;
    },

    async register(userData) {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "/auth/login";
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    async getProfile() {
        const response = await api.get("/auth/profile");
        return response.data;
    }
};

export default authService;