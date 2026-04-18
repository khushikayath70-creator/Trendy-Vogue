import { useState, useEffect, useMemo, useRef } from "react";
import {
  Heart,
  ShoppingBag,
  Search,
  SlidersHorizontal,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import API from "../api/api";

import { useShop } from "../context/ShopContext";

import { useNavigate, useOutletContext } from "react-router-dom";

const categories = ["All", "Cloths", "Footwear", "Accessories"];

const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Ivory Co-ord Set",
    category: "Cloths",
    subCategory: "Co-ord Set",
    badge: "Best Seller",
    price: 2499,
    oldPrice: 3299,
    img: "https://www.neola.ie/cdn/shop/files/ChatGPTImageMar3_2026_12_21_20PM.png?v=1772540493&width=900",
    description: "Premium co-ord set with a polished luxury silhouette.",
    colors: ["Ivory", "Black", "Beige"],
    sizes: ["XS", "S", "M", "L", "XL"],
    isNew: true,
  },
  {
    id: 2,
    name: "Rose Luxe Top",
    category: "Cloths",
    subCategory: "Top",
    badge: "Soft Glam",
    price: 1699,
    oldPrice: 2299,
    img: "https://i.pinimg.com/1200x/2e/da/d3/2edad3c9b0881d97feec358fe9f5979c.jpg",
    description: "Luxury-inspired top with soft texture and premium appeal.",
    colors: ["Rose", "Pink", "White"],
    sizes: ["S", "M", "L"],
  },
  {
    id: 3,
    name: "Black Evening Dress",
    category: "Cloths",
    subCategory: "Dresses",
    badge: "Elegant",
    price: 3199,
    oldPrice: 4099,
    img: "https://www.baoleely.com/cdn/shop/files/F_MCJ_U2YY_I_PMVO6LP.png?v=1761643542",
    description: "A refined black dress tailored for premium evening wear.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 4,
    name: "Minimal White Sneakers",
    category: "Footwear",
    subCategory: "Sneakers",
    badge: "Daily Luxe",
    price: 4200,
    oldPrice: 5600,
    img: "https://i.pinimg.com/736x/79/88/6d/79886db8001ca1f1a2d85c98baa875ce.jpg",
    description:
      "Soft premium finish and everyday comfort crafted for modern minimal styling.",
    colors: ["White", "Black"],
    sizes: ["6", "7", "8", "9", "10"],
    isNew: true,
  },
  {
    id: 5,
    name: "Modern Ankle Boots",
    category: "Footwear",
    subCategory: "Boots",
    badge: "Premium Pick",
    price: 7300,
    oldPrice: 8900,
    img: "https://i.pinimg.com/736x/ad/a7/19/ada7199deab33ff7db088dc1b90dcded.jpg",
    description:
      "Confident structure and luxe texture in a pair made for standout styling.",
    colors: ["Black", "Brown"],
    sizes: ["6", "7", "8", "9"],
  },
  {
    id: 6,
    name: "Pointed Toe Pumps",
    category: "Footwear",
    subCategory: "Heels",
    badge: "Editor Pick",
    price: 6100,
    oldPrice: 7600,
    img: "https://i.pinimg.com/1200x/1c/ff/7c/1cff7c959f16c0cd4d8f8f056803e4a6.jpg",
    description:
      "Sharp lines, graceful lift, and a sophisticated finish for occasion dressing.",
    colors: ["Black", "Red", "Nude"],
    sizes: ["5", "6", "7", "8"],
  },
  {
    id: 7,
    name: "Classic Black Sunglasses",
    category: "Accessories",
    subCategory: "Glasses",
    badge: "Trending",
    price: 2899,
    oldPrice: 3599,
    img: "https://i.pinimg.com/1200x/f4/34/43/f4344392c6de351ec9b59282a4babadc.jpg",
    description: "Refined black sunglasses with a sharp premium silhouette.",
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
  },
  {
    id: 8,
    name: "Minimal Leather Handbag",
    category: "Accessories",
    subCategory: "Bag",
    badge: "Best Seller",
    price: 5499,
    oldPrice: 6799,
    img: "https://i.pinimg.com/736x/70/9c/1d/709c1d9defcdf139a94f8e60dfa2738e.jpg",
    description: "Structured handbag crafted for elegant daily luxury looks.",
    colors: ["Tan", "Black", "Beige"],
    sizes: ["Standard"],
    isNew: true,
  },
  {
    id: 9,
    name: "Statement Gold Ring",
    category: "Accessories",
    subCategory: "Ring",
    badge: "Hot",
    price: 1899,
    oldPrice: 2599,
    img: "https://i.pinimg.com/736x/c4/25/96/c425969376dced89535ae52c8ef26e60.jpg",
    description: "A bold gold ring for elevated premium styling.",
    colors: ["Gold", "Rose Gold"],
    sizes: ["6", "7", "8", "9"],
  },
];

function parsePrice(value) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return parseInt(String(value).replace(/[^0-9]/g, ""), 10) || 0;
}

function normalizeMainCategory(category = "", subCategory = "") {
  const value = `${category} ${subCategory}`.toLowerCase();

  if (
    value.includes("shoe") ||
    value.includes("sneaker") ||
    value.includes("heel") ||
    value.includes("flat") ||
    value.includes("boot") ||
    value.includes("footwear") ||
    value.includes("pump") ||
    value.includes("sandal") ||
    value.includes("loafer")
  ) {
    return "Footwear";
  }

  if (
    value.includes("bag") ||
    value.includes("ring") ||
    value.includes("necklace") ||
    value.includes("bracelet") ||
    value.includes("anklet") ||
    value.includes("glasses") ||
    value.includes("accessories") ||
    value.includes("accessory") ||
    value.includes("jewellery") ||
    value.includes("jewelry") ||
    value.includes("set")
  ) {
    return "Accessories";
  }

  return "Cloths";
}

export default function Shop() {
  const navigate = useNavigate();
  
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const [products, setProducts] = useState(DUMMY_PRODUCTS);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  // const [wishlist, setWishlist] = useState([]);
  // const [cart, setCart] = useState([]);

  const { isWishlisted, toggleWishlist, addToCart, buyNow } = useShop();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const pageRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get("/products");
        const raw = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.products)
          ? response.data.products
          : [];

        if (raw.length > 0) {
          const mapped = raw
            .map((item, index) => {
              const rawCategory = item.category || "";
              const rawSubCategory =
                item.subCategory || item.type || item.product_type || rawCategory || "";

              const mainCategory = normalizeMainCategory(rawCategory, rawSubCategory);
              const image =
                item.img ||
                item.image ||
                item.images?.[0] ||
                item.thumbnail ||
                "";

              if (!image) return null;

              return {
                id: item._id || item.id || `api-${index + 1}`,
                name: item.name || item.title || "Untitled Product",
                category: mainCategory,
                subCategory: rawSubCategory || mainCategory,
                badge: item.badge || item.label || "Featured",
                price: parsePrice(item.price),
                oldPrice: parsePrice(item.oldPrice),
                img: image,
                description: item.description || "Premium fashion product.",
                colors: item.colors || ["Default"],
                sizes: item.sizes || ["Standard"],
                isNew: !!item.isNew,
              };
            })
            .filter(Boolean);

          setProducts([...DUMMY_PRODUCTS, ...mapped]);
        } else {
          setProducts(DUMMY_PRODUCTS);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(DUMMY_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!selectedProduct) {
        gsap.fromTo(
          filterRef.current?.children || [],
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.45,
            ease: "power3.out",
          }
        );

        gsap.fromTo(
          gridRef.current?.children || [],
          { opacity: 0, y: 24, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.05,
            duration: 0.55,
            ease: "power3.out",
            delay: 0.1,
          }
        );
      } else {
        gsap.fromTo(
          detailsRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, [selectedProduct]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, activeCategory, sortBy, searchTerm]);

  const similarProducts = useMemo(() => {
    if (!selectedProduct) return [];
    return products.filter(
      (item) =>
        item.id !== selectedProduct.id &&
        item.category === selectedProduct.category
    );
  }, [products, selectedProduct]);

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

  if (loading) {
    return (
      <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    const selectedWishlisted = isWishlisted(selectedProduct.id);

    return (
      <div
        ref={pageRef}
        className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen"
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
                src={selectedProduct.img}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {similarProducts.map((product) => {
                  const wishlisted = isWishlisted(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group bg-white rounded-[24px] overflow-hidden border border-[#ece7df] shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.img}
                          alt={product.name}
                          className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
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
      className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
            Curated Master Shop
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4 text-[#111]">
            Shop All
          </h1>
          <p className="text-[#6f675f] text-lg max-w-2xl mx-auto leading-8">
            Discover premium cloths, footwear, and accessories in one place.
          </p>
        </div>

        <div className="rounded-[32px] border border-[#eee4d9] bg-white/80 backdrop-blur-sm p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.04)] mb-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative overflow-hidden rounded-[28px] border border-[#efe5db] bg-gradient-to-br from-[#fffdfa] via-[#fcf8f3] to-[#f7f1ea] px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.035)]">
                <div className="relative z-10">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#a08f80]">
                    Explore by style
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold text-[#191512]">
                    Signature Shop
                  </h2>
                  <p className="mt-2 max-w-xl text-sm md:text-base leading-7 text-[#7a6d62]">
                    Cloths, premium footwear, and luxury accessories — all in one place.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_190px] xl:w-[540px]">
                <div className="group flex h-12 items-center gap-3 rounded-full border border-[#eadfd4] bg-[#fbf7f2] px-4 shadow-[0_6px_18px_rgba(0,0,0,0.03)]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e8de] text-[#9a8777]">
                    <Search size={15} />
                  </div>

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    placeholder="Search products..."
                    className="w-full border-0 bg-transparent p-0 text-[14px] text-[#2b2521] outline-none ring-0 placeholder:text-[#ab9b8d]"
                  />
                </div>

                <div className="group relative flex h-12 items-center gap-3 rounded-full border border-[#eadfd4] bg-[#fbf7f2] px-4 shadow-[0_6px_18px_rgba(0,0,0,0.03)]">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1e8de] text-[#9a8777]">
                    <SlidersHorizontal size={15} />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    className="w-full appearance-none border-0 bg-transparent pr-7 text-[13px] uppercase tracking-[0.12em] text-[#2b2521] outline-none ring-0 cursor-pointer"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price Low</option>
                    <option value="price-high">Price High</option>
                    <option value="name">Name A-Z</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8f7f72] text-xs">
                    ▼
                  </span>
                </div>
              </div>
            </div>

            <div ref={filterRef} className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const active = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-[#1b1714] text-white shadow-md"
                        : "border border-[#ddd2c8] bg-white text-[#1f1a17] hover:bg-[#1b1714] hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
              Curated Picks
            </p>
            <h3 className="mt-2 text-3xl font-bold text-[#1b1714]">
              Shop Collection
            </h3>
          </div>

          <p className="text-sm text-[#7e7369]">
            Showing {filteredProducts.length} items
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
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
                      src={product.img}
                      alt={product.name}
                      className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
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
        ) : (
          <div className="rounded-[32px] border border-dashed border-[#d8ccc0] bg-[#faf7f3] px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-[#1b1714]">
              No products found
            </h3>
            <p className="mt-3 text-[#756b62]">
              Try changing your search or filter selection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}