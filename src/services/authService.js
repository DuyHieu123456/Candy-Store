import api from "./api";
import { mockLoginService, mockRegisterService } from "./mockAuthService";

// Toggle: đổi true/false để dùng mock hoặc real API
const USE_MOCK_API = true;

export async function loginService(email, password) {
    try {
        const res = USE_MOCK_API
            ? await mockLoginService(email, password)
            : await api.post("/auth/login", { email, password });

        const { user, token } = res;
        if (token) {
            localStorage.setItem("token", token);
        }
        return res;
    } catch (err) {
        throw err.message || "Đăng nhập thất bại";
    }
}

export async function registerService(data) {
    try {
        const res = USE_MOCK_API
            ? await mockRegisterService(data)
            : await api.post("/auth/register", data);

        const { user, token } = res;
        if (token) {
            localStorage.setItem("token", token);
        }
        return res;
    } catch (err) {
        throw err.message || "Đăng ký thất bại";
    }
}

export function logoutService() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
