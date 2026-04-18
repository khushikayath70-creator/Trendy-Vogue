import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useOutletContext, useNavigate } from "react-router-dom";

const footwearData = [
  {
    id: 1,
    name: "Trendy Heeled Sandals",
    category: "Heels",
    label: "Signature Pair",
    price: 5200,
    oldPrice: 6900,
    image:
      "https://i.pinimg.com/1200x/6c/ce/30/6cce300e444812cb37cd2dc0881c0bd2.jpg",
    description:
      "Elegant heels with a refined silhouette designed for evening edits and elevated daywear.",
    featured: true,
    colors: ["Black", "Nude", "Gold"],
    sizes: ["5", "6", "7", "8", "9"],
  },
  {
    id: 2,
    name: "Minimal White Sneakers",
    category: "Sneakers",
    label: "Daily Luxe",
    price: 4200,
    oldPrice: 5600,
    image:
      "https://i.pinimg.com/736x/79/88/6d/79886db8001ca1f1a2d85c98baa875ce.jpg",
    description:
      "Soft premium finish and everyday comfort crafted for modern minimal styling.",
    colors: ["White", "Black"],
    sizes: ["6", "7", "8", "9", "10"],
  },
  {
    id: 3,
    name: "Classic Leather Loafers",
    category: "Flats",
    label: "Best Seller",
    price: 4800,
    oldPrice: 6200,
    image:
      "https://i.pinimg.com/1200x/07/1e/d3/071ed31e0fae6a3207547d618e721382.jpg",
    description:
      "Timeless loafers with polished detailing for structured and effortless looks.",
    colors: ["Brown", "Black"],
    sizes: ["5", "6", "7", "8", "9"],
  },
  {
    id: 4,
    name: "Pointed Toe Pumps",
    category: "Heels",
    label: "Editor Pick",
    price: 6100,
    oldPrice: 7600,
    image:
      "https://i.pinimg.com/1200x/1c/ff/7c/1cff7c959f16c0cd4d8f8f056803e4a6.jpg",
    description:
      "Sharp lines, graceful lift, and a sophisticated finish for occasion dressing.",
    colors: ["Black", "Red", "Nude"],
    sizes: ["5", "6", "7", "8"],
  },
  {
    id: 5,
    name: "Chunky Street Sneakers",
    category: "Sneakers",
    label: "Trending",
    price: 4500,
    oldPrice: 5900,
    image:
      "https://i.pinimg.com/736x/95/53/ee/9553ee6e21962102b79a60b9796889e2.jpg",
    description:
      "A statement sneaker balancing bold attitude with premium comfort.",
    colors: ["White", "Grey", "Black"],
    sizes: ["6", "7", "8", "9", "10"],
  },
  {
    id: 6,
    name: "Soft Strap Flats",
    category: "Flats",
    label: "New Arrival",
    price: 3200,
    oldPrice: 4400,
    image:
      "https://i.pinimg.com/1200x/e8/12/44/e81244e809be11f3dad8a7cee903dfe3.jpg",
    description:
      "Lightweight flats designed to complement both everyday and polished wardrobes.",
    colors: ["Tan", "Black", "Cream"],
    sizes: ["5", "6", "7", "8", "9"],
  },
  {
    id: 7,
    name: "Modern Ankle Boots",
    category: "Boots",
    label: "Premium Pick",
    price: 7300,
    oldPrice: 8900,
    image:
      "https://i.pinimg.com/736x/ad/a7/19/ada7199deab33ff7db088dc1b90dcded.jpg",
    description:
      "Confident structure and luxe texture in a pair made for standout styling.",
    colors: ["Black", "Brown"],
    sizes: ["6", "7", "8", "9"],
  },
  {
    id: 8,
    name: "Sculpted Party Heels",
    category: "Heels",
    label: "Occasion Wear",
    price: 6700,
    oldPrice: 8200,
    image:
      "https://i.pinimg.com/736x/b4/f0/19/b4f019ebd4c45c844728594ebc97c104.jpg",
    description:
      "An elevated party essential with sculpted lines and a luxe statement finish.",
    colors: ["Silver", "Black", "Rose Gold"],
    sizes: ["5", "6", "7", "8"],
  },
];

const categoryFilters = ["All", "Heels", "Sneakers", "Flats", "Boots"];

export default function Foot_wear() {

  const navigate = useNavigate(); 

  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  // const [wishlist, setWishlist] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("default");

  const { isWishlisted, toggleWishlist, addToCart, buyNow } = useShop();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // const toggleWishlist = (product) => {
  //   setWishlist((prev) =>
  //     prev.includes(product.id)
  //       ? prev.filter((id) => id !== product.id)
  //       : [...prev, product.id]
  //   );
  // };

  // const isWishlisted = (id) => wishlist.includes(id);

  // const addToCart = (product, qty = 1, size = "", color = "") => {
  //   console.log("Added to cart:", {
  //     product,
  //     quantity: qty,
  //     size,
  //     color,
  //   });
  //   alert(`${product.name} added to cart`);
  // };

  const featuredProduct = footwearData.find((item) => item.featured);
  const regularProducts = footwearData.filter((item) => !item.featured);

  const filteredProducts = useMemo(() => {
    let updated = [...regularProducts];

    if (activeFilter !== "All") {
      updated = updated.filter((item) => item.category === activeFilter);
    }

    if (searchTerm.trim()) {
      updated = updated.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortType === "low-to-high") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortType === "high-to-low") {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortType === "discount") {
      updated.sort((a, b) => b.oldPrice - b.price - (a.oldPrice - a.price));
    } else if (sortType === "name") {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    }

    return updated;
  }, [activeFilter, searchTerm, sortType, regularProducts]);

  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return footwearData.filter(
      (item) =>
        item.id !== selectedProduct.id &&
        item.category === selectedProduct.category
    );
  }, [selectedProduct]);

  const openProductDetails = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes?.[0] || "");
    setSelectedColor(product.colors?.[0] || "");
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDetails = () => {
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (selectedProduct) {
    const selectedWishlisted = isWishlisted(selectedProduct.id);

    return (
      <div className="pt-36 pb-24 px-6 md:px-12 bg-gradient-to-b from-[#fbf8f4] via-[#f8f4ee] to-[#f4eee7] min-h-screen">
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
            <div className="overflow-hidden rounded-[30px] border border-[#eadfd4] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-[520px] md:h-[700px] object-cover"
              />
            </div>

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
                    selectedWishlisted
                      ? "bg-[#b6453c] text-white"
                      : "bg-[#faf7f3] text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
                  }`}
                >
                  <Heart
                    size={18}
                    fill={selectedWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <p className="text-sm uppercase tracking-[0.18em] text-[#9a8d81] mb-4">
                {selectedProduct.label}
              </p>

              <p className="text-[#6f675f] leading-8 mb-6 text-base">
                {selectedProduct.description}
              </p>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl font-semibold text-[#1f1a17]">
                  ₹{selectedProduct.price}
                </span>
                <span className="text-base text-[#9c9085] line-through">
                  ₹{selectedProduct.oldPrice}
                </span>
              </div>

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
                    addToCart(
                      selectedProduct,
                      quantity,
                      selectedSize,
                      selectedColor
                    )
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

          {!!similarProducts.length && (
            <div>
              <div className="mb-8">
                <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
                  More To Explore
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-light text-[#111]">
                  Similar Products
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
                {similarProducts.map((product) => {
                  const wishlisted = isWishlisted(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-[24px] overflow-hidden border border-[#ece7df] shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-[300px] sm:h-[340px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />

                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 text-[#111] text-[9px] uppercase tracking-[0.25em] px-3 py-2 rounded-full">
                            {product.label}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md transition-all duration-300 ${
                            wishlisted
                              ? "bg-[#b6453c] text-white"
                              : "bg-white/85 text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
                          }`}
                        >
                          <Heart
                            size={18}
                            fill={wishlisted ? "currentColor" : "none"}
                          />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <button
                            onClick={() =>
                              addToCart(
                                product,
                                1,
                                product.sizes?.[0] || "",
                                product.colors?.[0] || ""
                              )
                            }
                            className="w-full bg-[#111] text-white py-2.5 rounded-full text-[10px] uppercase tracking-[0.25em]"
                          >
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

                        <p className="text-[#6d6d6d] text-xs leading-5 mb-4 min-h-[40px]">
                          {product.description}
                        </p>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#111] text-base font-medium">
                              ₹{product.price}
                            </span>
                            {product.oldPrice ? (
                              <span className="text-[#999] text-xs line-through">
                                ₹{product.oldPrice}
                              </span>
                            ) : null}
                          </div>

                          <button
                            onClick={() => openProductDetails(product)}
                            className="px-4 py-2 rounded-full border border-[#111] text-[#111] text-[10px] uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-all"
                          >
                            Buy
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-36 pb-24 px-6 md:px-12 bg-gradient-to-b from-[#fbf8f4] via-[#f8f4ee] to-[#f4eee7] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#a28e7c] mb-4">
            Premium Footwear Edit
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-4 text-[#1f1a17]">
            Foot Wear
          </h1>
          <p className="text-[#6f675f] text-lg max-w-2xl mx-auto leading-8">
            Discover statement heels, timeless flats, luxury sneakers, and modern
            boots designed to elevate every step with comfort and elegance.
          </p>
        </motion.div>

        {featuredProduct && (
          <motion.div
            className="mb-16 grid grid-cols-1 lg:grid-cols-[1.12fr_0.88fr] gap-8 items-center"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div
              className="group relative overflow-hidden rounded-[34px]"
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            >
              <img
                src={featuredProduct.image}
                alt={featuredProduct.name}
                className="w-full h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />

              <button
                onClick={() => toggleWishlist(featuredProduct)}
                className={`absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md transition-all duration-300 ${
                  isWishlisted(featuredProduct.id)
                    ? "bg-[#b6453c] text-white"
                    : "bg-white/85 text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
                }`}
              >
                <Heart
                  size={18}
                  fill={isWishlisted(featuredProduct.id) ? "currentColor" : "none"}
                />
              </button>

              <div className="absolute left-5 bottom-5">
                <span className="inline-flex rounded-full bg-white/85 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#675c52] backdrop-blur-md">
                  {featuredProduct.category}
                </span>
              </div>
            </div>

            <div className="rounded-[34px] border border-[#eadfd4] bg-white/75 backdrop-blur-sm p-8 md:p-10 shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
              <p className="text-sm uppercase tracking-[0.28em] text-[#a78e75] mb-3">
                Featured Footwear
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1f1a17] leading-tight mb-3">
                {featuredProduct.name}
              </h2>
              <p className="text-[#b6453c] text-sm uppercase tracking-[0.2em] mb-4">
                {featuredProduct.label}
              </p>
              <p className="text-[#6f675f] leading-8 mb-6 text-base md:text-lg">
                {featuredProduct.description}
              </p>

              <div className="flex items-center gap-3 mb-7">
                <span className="text-2xl font-semibold text-[#1f1a17]">
                  ₹{featuredProduct.price}
                </span>
                <span className="text-base text-[#9c9085] line-through">
                  ₹{featuredProduct.oldPrice}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    addToCart(
                      featuredProduct,
                      1,
                      featuredProduct.sizes?.[0] || "",
                      featuredProduct.colors?.[0] || ""
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#222]"
                >
                  <ShoppingBag size={16} />
                  Add to Cart
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => openProductDetails(featuredProduct)}
                  className="rounded-full border border-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-[#111] transition-all duration-300 hover:bg-[#111] hover:text-white"
                >
                  Buy
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <section className="py-2 mb-10">
          <div className="rounded-[32px] border border-[#eee4d9] bg-white/80 backdrop-blur-sm p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative overflow-hidden rounded-[28px] border border-[#efe5db] bg-gradient-to-br from-[#fffdfa] via-[#fcf8f3] to-[#f7f1ea] px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.035)]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.95),transparent_35%)]" />
                  <div className="relative z-10">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-[#a08f80]">
                      Explore by style
                    </p>
                    <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#191512]">
                      Signature Footwear
                    </h2>
                    <p className="mt-2 max-w-xl text-sm md:text-base leading-7 text-[#7a6d62]">
                      Elegant heels, luxe sneakers, polished flats, and standout boots curated for every occasion.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_220px] xl:w-[580px]">
                  <div className="group flex h-14 items-center gap-3 rounded-full border border-[#eadfd4] bg-[#fbf7f2] px-4 shadow-[0_6px_18px_rgba(0,0,0,0.03)] transition-all duration-300 focus-within:border-[#d7c4b2] focus-within:bg-white">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e8de] text-[#9a8777] transition-all duration-300 group-focus-within:bg-[#1b1714] group-focus-within:text-white">
                      <Search size={17} />
                    </div>

                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onMouseEnter={handleHoverIn}
                      onMouseLeave={handleHoverOut}
                      placeholder="Search heels, sneakers..."
                      className="w-full border-0 bg-transparent p-0 text-[15px] text-[#2b2521] outline-none ring-0 placeholder:text-[#ab9b8d] focus:outline-none focus:ring-0"
                    />
                  </div>

                  <div className="group relative flex h-14 items-center gap-3 rounded-full border border-[#eadfd4] bg-[#fbf7f2] px-4 shadow-[0_6px_18px_rgba(0,0,0,0.03)] transition-all duration-300 focus-within:border-[#d7c4b2] focus-within:bg-white">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1e8de] text-[#9a8777] transition-all duration-300 group-focus-within:bg-[#1b1714] group-focus-within:text-white">
                      <SlidersHorizontal size={17} />
                    </div>

                    <select
                      value={sortType}
                      onChange={(e) => setSortType(e.target.value)}
                      onMouseEnter={handleHoverIn}
                      onMouseLeave={handleHoverOut}
                      className="w-full appearance-none border-0 bg-transparent pr-8 text-[15px] text-[#2b2521] outline-none ring-0 focus:outline-none focus:ring-0"
                    >
                      <option value="default">Sort By</option>
                      <option value="low-to-high">Price: Low to High</option>
                      <option value="high-to-low">Price: High to Low</option>
                      <option value="discount">Best Discount</option>
                      <option value="name">Name A-Z</option>
                    </select>

                    <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#8f7f72] text-sm">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {categoryFilters.map((item) => {
                  const active = activeFilter === item;
                  return (
                    <button
                      key={item}
                      onClick={() => setActiveFilter(item)}
                      onMouseEnter={handleHoverIn}
                      onMouseLeave={handleHoverOut}
                      className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                        active
                          ? "bg-[#1b1714] text-white shadow-md"
                          : "border border-[#ddd2c8] bg-white text-[#1f1a17] hover:bg-[#1b1714] hover:text-white"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
              Curated Picks
            </p>
            <h3 className="mt-2 text-3xl font-bold text-[#1b1714]">
              Footwear You’ll Love
            </h3>
          </div>

          <p className="text-sm text-[#7e7369]">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const wishlisted = isWishlisted(product.id);

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-[24px] overflow-hidden border border-[#ece7df] shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-[300px] sm:h-[340px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />

                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-[#111] text-[9px] uppercase tracking-[0.25em] px-3 py-2 rounded-full">
                        {product.label}
                      </span>
                    </div>

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

                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <button
                        onClick={() =>
                          addToCart(
                            product,
                            1,
                            product.sizes?.[0] || "",
                            product.colors?.[0] || ""
                          )
                        }
                        className="w-full bg-[#111] text-white py-2.5 rounded-full text-[10px] uppercase tracking-[0.25em]"
                      >
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

                    <p className="text-[#6d6d6d] text-xs leading-5 mb-4 min-h-[40px]">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[#111] text-base font-medium">
                          ₹{product.price}
                        </span>
                        {product.oldPrice ? (
                          <span className="text-[#999] text-xs line-through">
                            ₹{product.oldPrice}
                          </span>
                        ) : null}
                      </div>

                      <button
                        onClick={() => openProductDetails(product)}
                        className="px-4 py-2 rounded-full border border-[#111] text-[#111] text-[10px] uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-all"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-[#d8ccc0] bg-[#faf7f3] px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-[#1b1714]">
              No footwear found
            </h3>
            <p className="mt-3 text-[#756b62]">
              Try changing your search or filter selection.
            </p>
          </div>
        )}

        <motion.div
          className="mt-20 rounded-[34px] border border-[#eadfd4] bg-gradient-to-r from-[#f7f2ec] via-[#fcf8f4] to-[#f3ece5] px-8 py-10 shadow-[0_12px_35px_rgba(0,0,0,0.03)]"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-[#9e8d7d]">
                Step Into Style
              </p>
              <h4 className="mt-2 font-serif text-3xl text-[#1b1714]">
                Crafted for modern elegance
              </h4>
              <p className="mt-3 max-w-2xl text-[#6f655c] leading-7">
                Explore footwear designed to combine comfort, statement style,
                and timeless luxury in every step.
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-[#1b1714] px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#1b1714] transition-all duration-300 hover:bg-[#1b1714] hover:text-white"
            >
              Shop Footwear
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}