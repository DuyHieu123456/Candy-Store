import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false, // Lấy loading ra khỏi rest[cite: 19]
  onClick,
  type = "button",
  className = "",
  ...rest // Chỉ còn lại các thuộc tính HTML hợp lệ
}) => {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    loading ? "btn--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      type={type}
      disabled={disabled || loading} // Vô hiệu hóa khi đang load[cite: 19]
      onClick={onClick}
      {...rest}
    >
      {loading ? <span className="btn-spinner"></span> : children}
    </button>
  );
};

export default Button;