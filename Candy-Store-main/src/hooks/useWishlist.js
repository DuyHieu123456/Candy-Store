import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";

const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist phải được sử dụng bên trong WishlistProvider");
  }
  return context;
};

export default useWishlist;
