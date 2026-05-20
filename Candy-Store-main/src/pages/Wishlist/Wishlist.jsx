import { Link } from "react-router-dom";
import useWishlist from "../../hooks/useWishlist";
import useCart from "../../hooks/useCart";
import { formatPrice } from "../../utils/formatPrice";
import Button from "../../components/Button/Button";
import "./Wishlist.css";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart, openDrawer } = useCart();

  const CANDY_FALLBACK = "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=400&h=400&auto=format&fit=crop";

  const handleAddToCart = (product) => {
    addToCart(product);
    openDrawer();
  };

  if (items.length === 0) {
    return (
      <div className="wishlist-page container">
        <h1 className="wishlist-page__title">♡ Danh Sách Yêu Thích</h1>
        <div className="wishlist-empty">
          <div className="wishlist-empty__icon">💝</div>
          <h2>Chưa có sản phẩm yêu thích!</h2>
          <p>Hãy khám phá và thêm kẹo vào danh sách nhé</p>
          <Link to="/products">
            <Button size="lg">Khám Phá Sản Phẩm</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page container">
      <h1 className="wishlist-page__title">♡ Danh Sách Yêu Thích ({items.length})</h1>

      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-item">
            <Link to={`/products/${item.id}`} className="wishlist-item__img-wrap">
              <img
                src={item.image_url || item.image || CANDY_FALLBACK}
                alt={item.name}
                onError={(e) => { e.target.src = CANDY_FALLBACK; }}
              />
            </Link>
            <div className="wishlist-item__info">
              <Link to={`/products/${item.id}`} className="wishlist-item__name">
                {item.name}
              </Link>
              <p className="wishlist-item__price">{formatPrice(item.price)}</p>
              <div className="wishlist-item__actions">
                <Button size="sm" onClick={() => handleAddToCart(item)}>
                  🛒 Thêm vào giỏ
                </Button>
                <button
                  className="wishlist-item__remove"
                  onClick={() => removeFromWishlist(item.id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
