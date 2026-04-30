import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/authService";
import { registerService } from "../../services/authService";
import { useUser } from "../../store/userStore.jsx";
import useAuth from "../../hooks/useAuth";
import { validateRegisterForm } from "../../utils/validators";
import "./Auth.css";

export default function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register: registerUser } = useUser();
    const { login: loginAuth } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate form
        const errors = validateRegisterForm(form);
        if (errors) {
            setError(errors.name || errors.email || errors.password || errors.confirmPassword);
            return;
        }

        setLoading(true);
        try {
            const registerData = await registerService({
                name: form.name,
                email: form.email,
                password: form.password
            });

            const data = registerData?.user
                ? registerData
                : await loginService(form.email, form.password);

            registerUser(data.user);
            loginAuth(data.user);
            navigate("/");
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h2>Đăng ký</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Họ tên"
                    value={form.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mật khẩu"
                    value={form.password}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Nhập lại mật khẩu"
                    value={form.confirmPassword}
                    onChange={handleChange}
                />
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng ký..." : "Đăng ký"}
                </button>
            </form>
            <p>Đã có tài khoản? <a href="/login">Đăng nhập tại đây</a></p>
        </div>
    );
}
