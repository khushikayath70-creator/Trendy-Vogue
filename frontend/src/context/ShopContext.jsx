// frontend/src/context/ShopContext.jsx
import { createContext, useContext, useState, useMemo, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

const ShopContext = createContext();

const BASE_URL = "https://trendy-vogue.onrender.com/api";

export const ShopProvider = ({ children }) => {
  const { user } = useAuth();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast({ open: false, message: "", type: "success" }), 2500);
  }, []);

  const getToken = () => localStorage.getItem("token");

  // Fetch cart and wishlist whenever user changes (login/logout)
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (!user || !token) {
        setWishlistItems([]);
        setCartItems([]);
        return;
      }

      try {
        const [wishlistRes, cartRes] = await Promise.all([
          fetch(`${BASE_URL}/wishlist`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BASE_URL}/cart`, {
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
  }, [user]);

  const requireAuth = () => {
    const token = getToken();
    if (!user || !token) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Helper: normalize any product id to string
  const normalizeId = (id) => String(id ?? "");

  const toggleWishlist = async (product) => {
    if (!requireAuth()) return;
    const token = getToken();
    // Support both id and _id
    const productId = normalizeId(product.id || product._id);

    // Optimistic update
    const alreadyIn = wishlistItems.some(
      (item) => normalizeId(item.id || item._id) === productId
    );

    if (alreadyIn) {
      setWishlistItems((prev) =>
        prev.filter((item) => normalizeId(item.id || item._id) !== productId)
      );
    } else {
      setWishlistItems((prev) => [...prev, { ...product, id: productId }]);
    }

    try {
      const payload = { ...product, id: productId };

      const res = await fetch(`${BASE_URL}/wishlist/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      // Sync with server response
      const newItems = Array.isArray(data) ? data : [];
      setWishlistItems(newItems);
      showToast(alreadyIn ? "Removed from wishlist" : "Added to wishlist ❤️");
    } catch (error) {
      console.error("Failed to update wishlist", error);
      // Revert optimistic update on error
      setWishlistItems((prev) =>
        alreadyIn
          ? [...prev, { ...product, id: productId }]
          : prev.filter((item) => normalizeId(item.id || item._id) !== productId)
      );
    }
  };

  // Check if a product is wishlisted — handles both id and _id
  const isWishlisted = useCallback(
    (id) => {
      const normalizedId = normalizeId(id);
      return wishlistItems.some(
        (item) => normalizeId(item.id || item._id) === normalizedId
      );
    },
    [wishlistItems]
  );

  const addToCart = async (product, qty = 1, size = "", color = "") => {
    if (!requireAuth()) return;
    const token = getToken();
    const productId = normalizeId(product.id || product._id);

    const payload = {
      ...product,
      id: productId,
      quantity: qty,
      selectedSize: size,
      selectedColor: color,
    };

    // Optimistic update
    setCartItems((prev) => {
      const exists = prev.find(
        (item) =>
          normalizeId(item.id || item._id) === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (exists) {
        return prev.map((item) =>
          normalizeId(item.id || item._id) === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
            ? { ...item, quantity: (item.quantity || 1) + qty }
            : item
        );
      }
      return [...prev, payload];
    });

    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
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

  const buyNow = async (product, qty = 1, size = "", color = "", navigateFn) => {
    if (!requireAuth()) return;
    const token = getToken();
    const productId = normalizeId(product.id || product._id);

    const payload = {
      ...product,
      id: productId,
      quantity: qty,
      selectedSize: size,
      selectedColor: color,
    };

    try {
      const res = await fetch(`${BASE_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
      if (navigateFn) navigateFn("/checkout");
    } catch (error) {
      console.error("Failed to buy now", error);
      // Still navigate on error — cart was saved locally
      if (navigateFn) navigateFn("/checkout");
    }
  };

  const removeFromWishlist = async (id) => {
    if (!requireAuth()) return;
    const token = getToken();
    const normalizedId = normalizeId(id);

    // Optimistic update
    setWishlistItems((prev) =>
      prev.filter((item) => normalizeId(item.id || item._id) !== normalizedId)
    );

    try {
      const res = await fetch(`${BASE_URL}/wishlist/${normalizedId}`, {
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
    const token = getToken();
    const normalizedId = normalizeId(id);

    // Optimistic update
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            normalizeId(item.id || item._id) === normalizedId &&
            item.selectedSize === size &&
            item.selectedColor === color
          )
      )
    );

    try {
      const res = await fetch(`${BASE_URL}/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: normalizedId, selectedSize: size, selectedColor: color }),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to remove cart item", error);
    }
  };

  const increaseQty = async (id, size, color) => {
    if (!requireAuth()) return;
    const token = getToken();
    const normalizedId = normalizeId(id);

    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        normalizeId(item.id || item._id) === normalizedId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );

    try {
      const res = await fetch(`${BASE_URL}/cart/qty`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: normalizedId, selectedSize: size, selectedColor: color, type: "increase" }),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to increase quantity", error);
    }
  };

  const decreaseQty = async (id, size, color) => {
    if (!requireAuth()) return;
    const token = getToken();
    const normalizedId = normalizeId(id);

    // Optimistic update
    setCartItems((prev) =>
      prev.map((item) =>
        normalizeId(item.id || item._id) === normalizedId &&
        item.selectedSize === size &&
        item.selectedColor === color
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) }
          : item
      )
    );

    try {
      const res = await fetch(`${BASE_URL}/cart/qty`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: normalizedId, selectedSize: size, selectedColor: color, type: "decrease" }),
      });

      const data = await res.json();
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to decrease quantity", error);
    }
  };

  // clearCart only clears local state (server clears on order create)
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