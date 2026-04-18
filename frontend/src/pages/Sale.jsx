// frontend/src/pages/Sale.jsx
import { useState, useEffect, useMemo } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import API from "../api/api";
import { useShop } from "../context/ShopContext";

const categories = ["All", "Outerwear", "Dresses", "Footwear", "Accessories", "Jewellery"];

export default function Sale() {
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const navigate = useNavigate();
  const { isWishlisted, toggleWishlist, addToCart, buyNow } = useShop();

  const [saleProducts, setSaleProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("discount");

  // Product detail view state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchSaleItems = async () => {
      try {
        const response = await API.get("/saleItems");
        // Normalize sale items to have sizes/colors for cart
        const normalized = response.data.map((item) => ({
          ...item,
          id: item._id || item.id,
          price: parseInt(String(item.salePrice).replace(/[^0-9]/g, ""), 10) || 0,
          oldPrice: parseInt(String(item.originalPrice).replace(/[^0-9]/g, ""), 10) || 0,
          badge: item.discount ? `${item.discount} OFF` : "Sale",
          sizes: item.sizes || ["S", "M", "L", "XL"],
          colors: item.colors || ["Default"],
          description: item.description || `${item.category} — Limited time sale price.`,
        }));
        setSaleProducts(normalized);
      } catch (err) {
        console.error("Error fetching sale items:", err);
        setError("Failed to load sale items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchSaleItems();
  }, []);

  const filteredProducts = useMemo(() => {
    let result =
      activeCategory === "All"
        ? [...saleProducts]
        : saleProducts.filter((p) => p.category === activeCategory);

    if (sortBy === "price-low") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") result.sort((a, b) => b.price - a.price);
    if (sortBy === "discount")
      result.sort((a, b) => parseInt(b.discount) - parseInt(a.discount));

    return result;
  }, [saleProducts, activeCategory, sortBy]);

  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return saleProducts.filter(
      (item) =>
        String(item.id) !== String(selectedProduct.id) &&
        item.category === selectedProduct.category
    );
  }, [saleProducts, selectedProduct]);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || "");
    setSelectedColor(product.colors?.[0] || "Default");
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDetails = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-500">Loading sale items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // ── PRODUCT DETAIL VIEW ──────────────────────────────────────────────────
  if (selectedProduct) {
    const selWishlisted = isWishlisted(selectedProduct.id);

    return (
      <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={closeDetails}
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
            className="inline-flex items-center gap-2 rounded-full border border-[#ddd2c8] bg-white px-5 py-3 text-[11px] uppercase tracking-[0.2em] text-[#1b1714] transition-all duration-300 hover:bg-[#1b1714] hover:text-white mb-8"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start mb-16">
            {/* Image */}
            <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
              <div className="relative">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-full h-[520px] md:h-[700px] object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#b6453c] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {selectedProduct.badge}
                </span>
              </div>
            </div>

            {/* Details */}
            <div className="rounded-[30px] border border-[#eadfd4] bg-white p-6 md:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-[#9a8d81] mb-2">
                    {selectedProduct.category}
                  </p>
                  <h1 className="font-serif text-3xl md:text-5xl font-light text-[#1f1a17]">
                    {selectedProduct.name}
                  </h1>
                </div>

                <button
                  onClick={() => toggleWishlist(selectedProduct)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-[#ddd2c8] transition-all duration-300 ${
                    selWishlisted
                      ? "bg-[#b6453c] text-white"
                      : "bg-[#faf7f3] text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
                  }`}
                >
                  <Heart size={18} fill={selWishlisted ? "currentColor" : "none"} />
                </button>
              </div>

              <p className="text-[#6f675f] leading-8 mb-6 text-base">
                {selectedProduct.description}
              </p>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl font-semibold text-[#b6453c]">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
                <span className="text-base text-[#9c9085] line-through">
                  ₹{selectedProduct.oldPrice.toLocaleString()}
                </span>
                <span className="bg-[#fff0ee] text-[#b6453c] text-xs font-bold px-3 py-1 rounded-full">
                  {selectedProduct.badge}
                </span>
              </div>

              {/* Colors */}
              {!!selectedProduct.colors?.length && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-[#1b1714]">Color</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-full px-4 py-2 text-sm border transition-all ${
                          selectedColor === color
                            ? "bg-[#1b1714] text-white border-[#1b1714]"
                            : "bg-white text-[#1b1714] border-[#ddd2c8]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {!!selectedProduct.sizes?.length && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-[#1b1714]">Size</p>
                  <div className="flex flex-wrap gap-3">
                    {selectedProduct.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`rounded-full min-w-[52px] px-4 py-2 text-sm border transition-all ${
                          selectedSize === size
                            ? "bg-[#1b1714] text-white border-[#1b1714]"
                            : "bg-white text-[#1b1714] border-[#ddd2c8]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <p className="mb-3 text-sm font-medium text-[#1b1714]">Quantity</p>
                <div className="inline-flex items-center rounded-full border border-[#ddd2c8] overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 text-lg"
                  >
                    -
                  </button>
                  <span className="px-5 py-2 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-4 py-2 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() =>
                    addToCart(selectedProduct, quantity, selectedSize, selectedColor)
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#222]"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </button>

                <button
                  onClick={() =>
                    buyNow(selectedProduct, quantity, selectedSize, selectedColor, navigate)
                  }
                  className="inline-flex items-center justify-center rounded-full border border-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-[#111] transition-all duration-300 hover:bg-[#111] hover:text-white"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* Similar Products */}
          {!!similarProducts.length && (
            <div>
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
                  More Sale Picks
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-[#111]">
                  Similar Items
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarProducts.map((product) => (
                  <SaleCard
                    key={product.id}
                    product={product}
                    isWishlisted={isWishlisted}
                    toggleWishlist={toggleWishlist}
                    addToCart={addToCart}
                    buyNow={buyNow}
                    navigate={navigate}
                    openProductDetails={openProductDetails}
                    handleHoverIn={handleHoverIn}
                    handleHoverOut={handleHoverOut}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── MAIN SALE LIST VIEW ──────────────────────────────────────────────────
  return (
    <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="bg-[#1a1a1a] text-white p-12 md:p-20 text-center mb-16 rounded-[28px]">
          <p className="text-[#c9a96e] text-sm tracking-widest mb-3">Limited Time</p>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-4">Final Sale</h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Up to 30% off on select styles. Shop the season's best before they're gone.
          </p>
          <div className="mt-6 text-sm tracking-wider text-white/60">
            Use code: <span className="text-[#c9a96e] font-semibold">FINAL30</span>
          </div>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-6 border-b border-[#e0d5cc]">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                className={`px-5 py-2 rounded-full text-sm uppercase tracking-wide transition-all border ${
                  activeCategory === cat
                    ? "bg-[#1b1714] text-white border-[#1b1714]"
                    : "bg-white text-[#1b1714] border-[#ddd] hover:border-[#1b1714]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#ddd2c8] rounded-full px-5 py-2 text-sm uppercase tracking-wide outline-none"
          >
            <option value="discount">Biggest Discount</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-[32px] border border-dashed border-[#d8ccc0] bg-[#faf7f3] px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-[#1b1714]">No sale items available</h3>
            <p className="mt-3 text-[#756b62]">Check back soon for new deals.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">Limited Offers</p>
                <h3 className="mt-1 text-3xl font-bold text-[#1b1714]">Sale Collection</h3>
              </div>
              <p className="text-sm text-[#7e7369]">Showing {filteredProducts.length} items</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <SaleCard
                  key={product.id}
                  product={product}
                  isWishlisted={isWishlisted}
                  toggleWishlist={toggleWishlist}
                  addToCart={addToCart}
                  buyNow={buyNow}
                  navigate={navigate}
                  openProductDetails={openProductDetails}
                  handleHoverIn={handleHoverIn}
                  handleHoverOut={handleHoverOut}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-16 text-center text-xs text-[#9a8d81] uppercase tracking-wider">
          * Sale prices are valid while stocks last. No further discounts apply.
        </div>
      </div>
    </div>
  );
}

// ── SALE CARD COMPONENT ─────────────────────────────────────────────────────
function SaleCard({
  product,
  isWishlisted,
  toggleWishlist,
  addToCart,
  buyNow,
  navigate,
  openProductDetails,
  handleHoverIn,
  handleHoverOut,
}) {
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      className="group bg-white rounded-[24px] overflow-hidden border border-[#ece7df] shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Discount Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#b6453c] text-white text-[9px] uppercase tracking-[0.25em] px-3 py-2 rounded-full font-bold">
            {product.badge}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md transition-all duration-300 ${
            wishlisted
              ? "bg-[#b6453c] text-white"
              : "bg-white/85 text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
          }`}
        >
          <Heart size={18} fill={wishlisted ? "currentColor" : "none"} />
        </button>

        {/* Hover Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <button
            onClick={() =>
              addToCart(
                product,
                1,
                product.sizes?.[0] || "",
                product.colors?.[0] || "Default"
              )
            }
            className="w-full bg-[#111] text-white py-2.5 rounded-full text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a7b52] mb-2">
          {product.category}
        </p>

        <h2 className="font-serif text-xl text-[#111] font-light mb-2 leading-tight">
          {product.name}
        </h2>

        <p className="text-[#6d6d6d] text-xs leading-5 mb-4 min-h-[36px]">
          {product.description}
        </p>

        {/* Prices */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[#b6453c] text-base font-semibold">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-[#999] text-xs line-through">
            ₹{product.oldPrice.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() =>
              addToCart(
                product,
                1,
                product.sizes?.[0] || "",
                product.colors?.[0] || "Default"
              )
            }
            className="flex-1 py-2 rounded-full bg-[#111] text-white text-[10px] uppercase tracking-[0.18em] hover:bg-[#333] transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingBag size={13} />
            Cart
          </button>

          <button
            onClick={() =>
              buyNow(
                product,
                1,
                product.sizes?.[0] || "",
                product.colors?.[0] || "Default",
                navigate
              )
            }
            className="flex-1 py-2 rounded-full border border-[#111] text-[#111] text-[10px] uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-all"
          >
            Buy Now
          </button>

          <button
            onClick={() => openProductDetails(product)}
            className="px-3 py-2 rounded-full border border-[#ddd2c8] text-[#111] text-[10px] uppercase tracking-[0.18em] hover:bg-[#f0ebe4] transition-all"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}