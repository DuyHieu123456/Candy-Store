// src/components/Loader/Loader.jsx
import "./Loader.css";

const Loader = ({ text = "Đang tải..." }) => (
  <div className="loader-wrap">
    <div className="loader-spinner" />
    {text && <p className="loader-text">{text}</p>}
  </div>
);

export default Loader;