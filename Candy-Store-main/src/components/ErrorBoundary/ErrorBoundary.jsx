import { Component } from "react";
import { Link } from "react-router-dom";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16 }}>😵</div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: 8 }}>
            Oops! Có lỗi xảy ra
          </h1>
          <p style={{ color: "#666", marginBottom: 24 }}>
            Trang gặp sự cố. Vui lòng thử tải lại.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              display: "inline-block",
              padding: "12px 24px",
              background: "var(--color-primary, #aa3bff)",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Về Trang Chủ
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
