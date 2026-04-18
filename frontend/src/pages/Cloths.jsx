// frontend/src/pages/Cloths.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";

import { useShop } from "../context/ShopContext";

import { useNavigate, useOutletContext } from "react-router-dom";


const FILTERS = ["All", "Co-ord Set", "Bottom", "Top", "Dresses"];

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Ivory Co-ord Set",
    image:
      "https://www.neola.ie/cdn/shop/files/ChatGPTImageMar3_2026_12_21_20PM.png?v=1772540493&width=900",
    price: 2499,
    oldPrice: 3299,
    category: "Co-ord Set",
    badge: "Best Seller",
    description: "Premium co-ord set with a polished luxury silhouette.",
    colors: ["Ivory", "Black", "Beige"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Beige Luxe Set",
    image:
      "https://i.pinimg.com/736x/34/3a/1e/343a1e5bf3ceb0065dd05c2c48175ed2.jpg",
    price: 2699,
    oldPrice: 3499,
    category: "Co-ord Set",
    badge: "Luxury",
    description: "Soft tailored co-ord crafted for elevated everyday wear.",
    colors: ["Beige", "Brown", "Cream"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "Midnight Co-ord",
    image:
      "https://rukminim2.flixcart.com/image/1536/1536/xif0q/ethnic-set/3/6/q/xxl-f-ks-008-blk-all-citytalk-original-imahf57h57xwce7t.jpeg?q=90",
    price: 2899,
    oldPrice: 3699,
    category: "Co-ord Set",
    badge: "Trending",
    description: "Refined dark-tone set with a sleek premium finish.",
    colors: ["Black", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Black Wide Pants",
    image:
      "https://i.pinimg.com/1200x/43/78/55/437855105e53f2ff58531432dd4b77d5.jpg",
    price: 1899,
    oldPrice: 2499,
    category: "Bottom",
    badge: "Classic",
    description: "Wide-leg bottoms designed with elegant flow and comfort.",
    colors: ["Black", "Grey"],
    sizes: ["28", "30", "32", "34"],
  },
  {
    id: 5,
    name: "Denim Statement Bottom",
    image:
      "https://i.pinimg.com/1200x/63/84/a3/6384a34f4f6e96f87b6c13dbf3189506.jpg",
    price: 1999,
    oldPrice: 2599,
    category: "Bottom",
    badge: "Daily",
    description: "Contemporary denim essential with a structured fit.",
    colors: ["Blue", "Dark Blue"],
    sizes: ["28", "30", "32", "34"],
  },
  {
    id: 6,
    name: "Utility Cargo Bottom",
    image:
      "https://i.pinimg.com/736x/94/80/6e/94806ec8323a23370a3557fa5a83ba5f.jpg",
    price: 2099,
    oldPrice: 2799,
    category: "Bottom",
    badge: "Street",
    description: "Smart cargo bottom with a clean fashion-forward look.",
    colors: ["Olive", "Black", "Beige"],
    sizes: ["28", "30", "32", "34"],
  },
  {
    id: 7,
    name: "Silk Crop Top",
    image:
      "https://i.pinimg.com/1200x/30/ba/da/30bada252efe90830d7116a7c856627a.jpg",
    price: 1299,
    oldPrice: 1799,
    category: "Top",
    badge: "New",
    description: "Soft premium crop top with smooth finish and drape.",
    colors: ["Pink", "White", "Black"],
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: 8,
    name: "White Chic Shirt",
    image:
      "https://i.pinimg.com/1200x/1a/f9/99/1af99900431b7eb483badb59c5caf997.jpg",
    price: 1499,
    oldPrice: 2099,
    category: "Top",
    badge: "Minimal",
    description: "A timeless top tailored for effortless styling.",
    colors: ["White", "Blue"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 9,
    name: "Satin Evening Top",
    image:
      "https://i.pinimg.com/1200x/79/cd/2e/79cd2e5bd28fb46b6a7bfc23be0482ca.jpg",
    price: 1599,
    oldPrice: 2199,
    category: "Top",
    badge: "Premium",
    description:
      "Elegant satin top that brings subtle luxury to your wardrobe.",
    colors: ["Wine", "Black", "Champagne"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 10,
    name: "Red Midi Dress",
    image:
      "https://i.pinimg.com/736x/65/85/35/65853567192ec9c884874404c59d4114.jpg",
    price: 2999,
    oldPrice: 3899,
    category: "Dresses",
    badge: "Hot",
    description: "Graceful midi dress made for standout festive styling.",
    colors: ["Red", "Maroon"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 11,
    name: "Floral Day Dress",
    image:
      "https://i.pinimg.com/736x/17/b3/22/17b322a3ad5739100771ef76a8d3caaf.jpg",
    price: 2799,
    oldPrice: 3399,
    category: "Dresses",
    badge: "Fresh",
    description: "Soft floral dress with feminine movement and charm.",
    colors: ["Floral Pink", "Floral Blue"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 12,
    name: "Black Evening Dress",
    image:
      "https://www.baoleely.com/cdn/shop/files/F_MCJ_U2YY_I_PMVO6LP.png?v=1761643542",
    price: 3199,
    oldPrice: 4099,
    category: "Dresses",
    badge: "Elegant",
    description: "A refined black dress tailored for premium evening wear.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 13,
    name: "Olive Coord",
    image:
      "https://i.pinimg.com/736x/e7/d8/e2/e7d8e2fbe3897b72481c98ff8899ed93.jpg",
    price: 2599,
    oldPrice: 3299,
    category: "Co-ord Set",
    badge: "Editor Pick",
    description: "Modern olive co-ord with a sharp clean silhouette.",
    colors: ["Olive", "Sage"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 14,
    name: "Tailored Cream Bottom",
    image:
      "https://i.pinimg.com/736x/75/60/ee/7560ee4ff420d1cacf76cbde97e415c9.jpg",
    price: 2199,
    oldPrice: 2899,
    category: "Bottom",
    badge: "Refined",
    description: "Cream-tone tailored bottom with elevated minimal styling.",
    colors: ["Cream", "Beige"],
    sizes: ["28", "30", "32", "34"],
  },
  {
    id: 15,
    name: "Rose Luxe Top",
    image:
      "https://i.pinimg.com/1200x/2e/da/d3/2edad3c9b0881d97feec358fe9f5979c.jpg",
    price: 1699,
    oldPrice: 2299,
    category: "Top",
    badge: "Soft Glam",
    description: "Luxury-inspired top with soft texture and premium appeal.",
    colors: ["Rose", "Pink", "White"],
    sizes: ["S", "M", "L"],
  },
];

export default function Cloths() {
  const navigate = useNavigate();
  
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const [products] = useState(DUMMY_PRODUCTS);
  const [activeFilter, setActiveFilter] = useState("All");
  // const [wishlist, setWishlist] = useState([]);
  // const [cart, setCart] = useState([]);

const { isWishlisted, toggleWishlist, addToCart, buyNow } = useShop();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const pageRef = useRef(null);
  const headingRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!selectedProduct) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 35 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
        );

        gsap.fromTo(
          filterRef.current?.children || [],
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.06,
            duration: 0.5,
            ease: "power3.out",
            delay: 0.15,
          }
        );

        gsap.fromTo(
          gridRef.current?.children || [],
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.07,
            duration: 0.6,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      } else {
        gsap.fromTo(
          detailsRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "All") return products;
    return products.filter((item) => item.category === activeFilter);
  }, [products, activeFilter]);

  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (item) =>
        item.id !== selectedProduct.id &&
        item.category === selectedProduct.category
    );
  }, [products, selectedProduct]);

  useEffect(() => {
    if (!gridRef.current || selectedProduct) return;

    gsap.fromTo(
      gridRef.current.children,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power2.out",
      }
    );
  }, [activeFilter, selectedProduct]);

  // const toggleWishlist = (productId) => {
  //   setWishlist((prev) =>
  //     prev.includes(productId)
  //       ? prev.filter((id) => id !== productId)
  //       : [...prev, productId]
  //   );
  // };

  // const isWishlisted = (id) => wishlist.includes(id);

  // const addToCart = (
  //   product,
  //   qty = quantity,
  //   size = selectedSize,
  //   color = selectedColor
  // ) => {
  //   setCart((prev) => {
  //     const exists = prev.find((item) => item.id === product.id);
  //     if (exists) return prev;
  //     return [
  //       ...prev,
  //       { ...product, quantity: qty, selectedSize: size, selectedColor: color },
  //     ];
  //   });
  // };

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
      <div
        ref={pageRef}
        className="pt-40 pb-28 px-4 sm:px-6 md:px-10 lg:px-12 bg-[#f8f5ef] min-h-screen"
      >
        <div ref={detailsRef} className="max-w-7xl mx-auto">
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
                {selectedProduct.badge}
              </p>

              <p className="text-[#6f675f] leading-8 mb-6 text-base">
                {selectedProduct.description}
              </p>

              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl font-semibold text-[#1f1a17]">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.oldPrice ? (
                  <span className="text-base text-[#9c9085] line-through">
                    ₹{selectedProduct.oldPrice}
                  </span>
                ) : null}
              </div>

              {!!selectedProduct.colors?.length && (
                <div className="mb-6">
                  <p className="mb-3 text-sm font-medium text-[#1b1714]">
                    Color
                  </p>
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
                <p className="mb-3 text-sm font-medium text-[#1b1714]">
                  Quantity
                </p>
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
                            {product.badge}
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
    <div
      ref={pageRef}
      className="pt-40 pb-28 px-4 sm:px-6 md:px-10 lg:px-12 bg-[#f8f5ef] min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div ref={headingRef} className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
            Curated Wardrobe
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#111] mb-4">
            Cloths Collection
          </h1>
          <p className="text-[#6b6b6b] text-sm sm:text-base max-w-2xl mx-auto leading-7">
            Explore premium fashion essentials with clean lines, modern
            silhouettes, and refined details.
          </p>
        </div>

        <div
          ref={filterRef}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                className={`px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-[11px] uppercase tracking-[0.22em] transition-all duration-300 border ${
                  isActive
                    ? "bg-[#111] text-white border-[#111]"
                    : "bg-white text-[#222] border-[#ddd] hover:border-[#111] hover:text-[#111]"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6"
        >
          {filteredProducts.map((product) => {
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
                      {product.badge}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    className={`absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md transition-all duration-300 ${
                      wishlisted
                        ? "bg-[#b6453c] text-white"
                        : "bg-white/85 text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
                    }`}
                    aria-label="Toggle Wishlist"
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
                      onMouseEnter={handleHoverIn}
                      onMouseLeave={handleHoverOut}
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
                      onMouseEnter={handleHoverIn}
                      onMouseLeave={handleHoverOut}
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
    </div>
  );
}