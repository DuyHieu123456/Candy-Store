import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useUser } from "../../store/userStore.jsx";
import "./Profile.css";

export default function Profile() {
    const { user, login: loginAuth } = useAuth();
    const { login: loginUser } = useUser();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [email] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [message, setMessage] = useState("");

    if (!user) {
        return (
            <section className="profile-page container">
                <div className="profile-empty">
                    <div className="profile-empty__icon">🔐</div>
                    <h2>Bạn chưa đăng nhập</h2>
                    <p>Vui lòng đăng nhập để xem và cập nhật thông tin tài khoản.</p>
                    <Link to="/login" className="profile-empty__link">
                        Đi đến trang đăng nhập
                    </Link>
                </div>
            </section>
        );
    }

    const handleSave = (e) => {
        e.preventDefault();
        const updatedUser = {
            ...user,
            name: name.trim() || user.name,
            phone: phone.trim(),
        };

        loginAuth(updatedUser);
        loginUser(updatedUser);
        setMessage("Cập nhật thông tin thành công.");
    };

    return (
        <section className="profile-page container">
            <header className="profile-page__header">
                <h1>Tài Khoản</h1>
                <p>Quản lý thông tin cá nhân và theo dõi trạng thái mua hàng của bạn.</p>
            </header>

            <form className="profile-card" onSubmit={handleSave}>
                <label className="profile-field">
                    <span>Họ và tên</span>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập họ tên"
                    />
                </label>

                <label className="profile-field">
                    <span>Email</span>
                    <input value={email} disabled />
                </label>

                <label className="profile-field">
                    <span>Số điện thoại</span>
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Nhập số điện thoại"
                    />
                </label>

                {message && <p className="profile-success">{message}</p>}

                <div className="profile-actions">
                    <button className="profile-btn profile-btn--primary" type="submit">
                        Lưu thay đổi
                    </button>
                    <button
                        className="profile-btn profile-btn--secondary"
                        type="button"
                        onClick={() => navigate("/orders")}
                    >
                        Xem đơn hàng
                    </button>
                </div>
            </form>
        </section>
    );
}
