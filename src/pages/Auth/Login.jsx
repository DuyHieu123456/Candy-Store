import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../../services/authService";
import { useUser } from "../../store/userStore.jsx";
import useAuth from "../../hooks/useAuth";
import { validateLoginForm } from "../../utils/validators";
import "./Auth.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login: loginUser } = useUser();
    const { login: loginAuth } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate form
        const errors = validateLoginForm(email, password);
        if (errors) {
            setError(errors.email || errors.password);
            return;
        }

        setLoading(true);
        try {
            const data = await loginService(email, password);
            loginUser(data.user);
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
            <h2>Đăng nhập</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                {error && <div className="error">{error}</div>}
                <button type="submit" disabled={loading}>
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
            </form>
            <p>Chưa có tài khoản? <a href="/register">Đăng ký tại đây</a></p>
        </div>
    );
}
