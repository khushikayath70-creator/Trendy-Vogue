// frontend/src/context/ShopContext.jsx
import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const token = localStorage.getItem("token");

  const showToast = useCallback((message, type = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: "", type: "success" }), 2500);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !token) {
        setWishlistItems([]);
        setCartItems([]);
        return;
      }

      try {
        const [wishlistRes, cartRes] = await Promise.all([
          fetch("http://localhost:5000/api/wishlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/cart", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const wishlistData = await wishlistRes.json();
        const cartData = await cartRes.json();

        setWishlistItems(Array.isArray(wishlistData) ? wishlistData : []);
        setCartItems(Array.isArray(cartData) ? cartData : []);
      } catch (error) {
        console.error("Failed to fetch cart/wishlist", error);
      }
    };

    fetchUserData();
  }, [user, token]);

  const requireAuth = () => {
    if (!user || !token) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  const toggleWishlist = async (product) => {
    if (!requireAuth()) return;

    const productId = String(product.id || product._id);

    try {
      const payload = { ...product, id: productId };

      const res = await fetch("http://localhost:5000/api/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const newItems = Array.isArray(data) ? data : [];
      setWishlistItems(newItems);

      const wasInWishlist = wishlistItems.some((item) => String(item.id) === productId);
      showToast(wasInWishlist ? "Removed from wishlist" : "Added to wishlist ❤️");
    } catch (error) {
      console.error("Failed to update wishlist", error);
    }
  };

  const isWishlisted = (id) => {
    return wishlistItems.some((item) => String(item.id) === String(id));
  };

  const addToCart = async (product, qty = 1, size = "", color = "") => {
    if (!requireAuth()) return;

    const productId = String(product.id || product._id);

    const payload = {
      ...product,
      id: productId,
      quantity: qty,
      selectedSize: size,
      selectedColor: color,
    };

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
      showToast(`${product.name} added to bag 🛍️`);
    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  // NEW: buyNow - adds to cart then navigates to checkout
  // Returns true if auth ok (caller navigates), false if not authed
  const buyNow = async (product, qty = 1, size = "", color = "", navigateFn) => {
    if (!requireAuth()) return;

    const productId = String(product.id || product._id);

    const payload = {
      ...product,
      id: productId,
      quantity: qty,
      selectedSize: size,
      selectedColor: color,
    };

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);

      // Navigate to checkout
      if (navigateFn) navigateFn("/checkout");
    } catch (error) {
      console.error("Failed to buy now", error);
    }
  };

  const removeFromWishlist = async (id) => {
    if (!requireAuth()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to remove wishlist item", error);
    }
  };

  const removeFromCart = async (id, size, color) => {
    if (!requireAuth()) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart/remove", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, selectedSize: size, selectedColor: color }),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to remove cart item", error);
    }
  };

  const increaseQty = async (id, size, color) => {
    if (!requireAuth()) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart/qty", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, selectedSize: size, selectedColor: color, type: "increase" }),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to increase quantity", error);
    }
  };

  const decreaseQty = async (id, size, color) => {
    if (!requireAuth()) return;

    try {
      const res = await fetch("http://localhost:5000/api/cart/qty", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, selectedSize: size, selectedColor: color, type: "decrease" }),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to decrease quantity", error);
    }
  };

  const clearCart = () => setCartItems([]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  );

  return (
    <ShopContext.Provider
      value={{
        wishlistItems,
        cartItems,
        toggleWishlist,
        isWishlisted,
        addToCart,
        buyNow,
        removeFromWishlist,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartCount,
        wishlistCount: wishlistItems.length,
        showLoginModal,
        setShowLoginModal,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);