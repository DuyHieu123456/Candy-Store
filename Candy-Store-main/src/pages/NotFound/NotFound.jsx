import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

const NotFound = () => {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: "5rem", marginBottom: 16 }}>🍬</div>
      <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}>
        404 - Không Tìm Thấy
      </h1>
      <p style={{ color: "#666", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
        Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link to="/">
        <Button size="lg">Về Trang Chủ</Button>
      </Link>
    </div>
  );
};

export default NotFound;
