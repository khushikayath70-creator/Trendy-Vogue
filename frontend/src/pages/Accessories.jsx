import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { gsap } from "gsap";

import { useShop } from "../context/ShopContext";

import { useNavigate, useOutletContext } from "react-router-dom";


const FILTERS = [
  "All",
  "Glasses",
  "Bag",
  "Anklet",
  "Ring",
  "Necklace",
  "Set",
  "Bracelet",
];

const featuredAccessory = {
  id: 101,
  name: "Gold Ring",
  title: "Gold Ring",
  excerpt:
    "A refined finishing touch designed to elevate both minimal and occasion looks with timeless shine and a premium statement feel.",
  description:
    "A refined finishing touch designed to elevate both minimal and occasion looks with timeless shine and a premium statement feel.",
  image:
    "https://i.pinimg.com/736x/f1/ae/31/f1ae315820d76b12ee008ca9e8f401d3.jpg",
  date: "March 2025",
  readTime: "Luxury Pick",
  category: "Ring",
  badge: "Luxury Pick",
  price: 3800,
  oldPrice: 4600,
  colors: ["Gold", "Rose Gold", "Silver"],
  sizes: ["6", "7", "8", "9"],
};

const ACCESSORIES = [
  {
    id: 1,
    name: "Classic Black Sunglasses",
    image:
      "https://i.pinimg.com/1200x/f4/34/43/f4344392c6de351ec9b59282a4babadc.jpg",
    price: 2899,
    oldPrice: 3599,
    category: "Glasses",
    badge: "Trending",
    description: "Refined black sunglasses with a sharp premium silhouette.",
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
  },
  {
    id: 2,
    name: "Luxury Brown Frame Glasses",
    image:
      "https://i.pinimg.com/736x/5b/22/3a/5b223ac89e47d9862ddaabf915d51d20.jpg",
    price: 3199,
    oldPrice: 3999,
    category: "Glasses",
    badge: "New",
    description: "A sophisticated everyday eyewear pick with timeless styling.",
    colors: ["Brown", "Black"],
    sizes: ["Standard"],
  },
  {
    id: 3,
    name: "Minimal Leather Handbag",
    image:
      "https://i.pinimg.com/736x/70/9c/1d/709c1d9defcdf139a94f8e60dfa2738e.jpg",
    price: 5499,
    oldPrice: 6799,
    category: "Bag",
    badge: "Best Seller",
    description: "Structured handbag crafted for elegant daily luxury looks.",
    colors: ["Tan", "Black", "Beige"],
    sizes: ["Standard"],
  },
  {
    id: 4,
    name: "Cream Luxe Shoulder Bag",
    image:
      "https://i.pinimg.com/736x/86/78/f1/8678f1a3886c44a67a1a6cee33291561.jpg",
    price: 5899,
    oldPrice: 7299,
    category: "Bag",
    badge: "Premium",
    description: "Soft neutral handbag with a polished premium finish.",
    colors: ["Cream", "Beige"],
    sizes: ["Standard"],
  },
  {
    id: 5,
    name: "Delicate Silver Anklet",
    image:
      "https://i.pinimg.com/736x/c1/4f/0f/c14f0f3389f966038592fb82d06475cd.jpg",
    price: 1599,
    oldPrice: 2199,
    category: "Anklet",
    badge: "Soft Glam",
    description: "A subtle silver anklet designed for graceful styling.",
    colors: ["Silver", "Gold"],
    sizes: ["Standard"],
  },
  {
    id: 6,
    name: "Pearl Charm Anklet",
    image:
      "https://i.pinimg.com/736x/89/e1/79/89e179a8f35fa16c5201a306ed6cf695.jpg",
    price: 1799,
    oldPrice: 2399,
    category: "Anklet",
    badge: "Fresh",
    description: "Pearl-detailed anklet with a soft luxury aesthetic.",
    colors: ["Pearl White", "Silver"],
    sizes: ["Standard"],
  },
  {
    id: 7,
    name: "Statement Gold Ring",
    image:
      "https://i.pinimg.com/736x/c4/25/96/c425969376dced89535ae52c8ef26e60.jpg",
    price: 1899,
    oldPrice: 2599,
    category: "Ring",
    badge: "Hot",
    description: "A bold gold ring for elevated premium styling.",
    colors: ["Gold", "Rose Gold"],
    sizes: ["6", "7", "8", "9"],
  },
  {
    id: 8,
    name: "Minimal Crystal Ring",
    image:
      "https://i.pinimg.com/736x/15/75/c0/1575c0e55c0afa954464d41e0e8b0bfd.jpg",
    price: 2099,
    oldPrice: 2799,
    category: "Ring",
    badge: "Elegant",
    description: "Clean crystal ring with a sleek luxury-inspired finish.",
    colors: ["Silver", "Gold"],
    sizes: ["6", "7", "8"],
  },
  {
    id: 9,
    name: "Statement Gold Necklace",
    image:
      "https://i.pinimg.com/736x/b5/1d/54/b51d54377881806e0bb72019260fb5f4.jpg",
    price: 3299,
    oldPrice: 4199,
    category: "Necklace",
    badge: "Luxury",
    description: "A timeless necklace that completes both modern and festive looks.",
    colors: ["Gold", "Rose Gold"],
    sizes: ["Standard"],
  },
  {
    id: 10,
    name: "Layered Pearl Necklace",
    image:
      "https://i.pinimg.com/736x/2b/0a/95/2b0a95459ab0d3de17d0ed39bc794fd3.jpg",
    price: 3499,
    oldPrice: 4399,
    category: "Necklace",
    badge: "Editor Pick",
    description: "Layered pearl detailing with an elegant premium presence.",
    colors: ["Pearl White", "Gold"],
    sizes: ["Standard"],
  },
  {
    id: 11,
    name: "Diamond Set",
    image:
      "https://i.pinimg.com/736x/15/ef/fa/15effa2339f7b7adeb2d025345106248.jpg",
    price: 6999,
    oldPrice: 8499,
    category: "Set",
    badge: "Signature",
    description: "An ornate jewellery set designed for rich statement styling.",
    colors: ["Silver", "Gold"],
    sizes: ["Standard"],
  },
  {
    id: 12,
    name: "Modern Gold Set",
    image:
      "https://i.pinimg.com/1200x/59/15/f6/5915f62689ca399c272a17bfd3e3aa3d.jpg",
    price: 6299,
    oldPrice: 7899,
    category: "Set",
    badge: "Refined",
    description: "Contemporary jewellery set with premium golden detailing.",
    colors: ["Gold", "Rose Gold"],
    sizes: ["Standard"],
  },
  {
    id: 13,
    name: "Elegant Gold Bracelet",
    image:
      "https://i.pinimg.com/736x/f3/78/03/f37803d38c5129bdd672a2eea045d33f.jpg",
    price: 2299,
    oldPrice: 2999,
    category: "Bracelet",
    badge: "Minimal",
    description: "A polished bracelet for understated premium styling.",
    colors: ["Gold", "Silver"],
    sizes: ["Standard"],
  },
  {
    id: 14,
    name: "Crystal Charm Bracelet",
    image:
      "https://i.pinimg.com/1200x/42/87/e1/4287e1d4309695bbf77e07420a4daeec.jpg",
    price: 2499,
    oldPrice: 3199,
    category: "Bracelet",
    badge: "New Arrival",
    description: "Crystal-detailed bracelet with a graceful modern finish.",
    colors: ["Silver", "Gold"],
    sizes: ["Standard"],
  },
  {
    id: 15,
    name: "Premium Cat-Eye Glasses",
    image:
      "https://i.pinimg.com/1200x/f9/76/17/f9761726b1531dff055ab8e6d9e89cfb.jpg",
    price: 3399,
    oldPrice: 4199,
    category: "Glasses",
    badge: "Soft Glam",
    description: "Cat-eye glasses with a chic luxury-inspired look.",
    colors: ["Black", "Brown"],
    sizes: ["Standard"],
  },
];

export default function Accessories() {

  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const [products] = useState(ACCESSORIES);
  const [activeFilter, setActiveFilter] = useState("All");
  // const [wishlist, setWishlist] = useState([]);
  // const [cart, setCart] = useState([]);

  const {
  wishlistItems,
  cartItems,
  isWishlisted,
  toggleWishlist,
  addToCart,
  buyNow
} = useShop();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const pageRef = useRef(null);
  const filterRef = useRef(null);
  const gridRef = useRef(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!selectedProduct) {
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
        className="min-h-screen bg-gradient-to-b from-[#fbf8f4] via-[#f8f4ee] to-[#f5efe8] pt-36 pb-24 px-6 md:px-12"
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
            <div className="overflow-hidden rounded-[34px] border border-[#eadfd4] bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-[520px] md:h-[700px] object-cover"
              />
            </div>

            <div className="rounded-[34px] border border-[#eadfd4] bg-white p-6 md:p-8 shadow-[0_12px_35px_rgba(0,0,0,0.04)]">
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

  const isFeaturedWishlisted = isWishlisted(featuredAccessory.id);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-gradient-to-b from-[#fbf8f4] via-[#f8f4ee] to-[#f5efe8] pt-36 pb-24 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          <p className="text-[11px] md:text-xs uppercase tracking-[0.35em] text-[#a38f7d] mb-4">
            Premium Accessories Edit
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light mb-5 text-[#1f1a17]">
            Accessories
          </h1>
          <p className="text-[#6f675f] text-base md:text-lg leading-8 max-w-2xl mx-auto">
            Discover timeless jewellery, elegant bags, eyewear, and refined accents
            crafted to complete every look with quiet sophistication.
          </p>
        </motion.div>

        <motion.div
          className="mb-20 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 items-center"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div
            className="group relative overflow-hidden rounded-[34px]"
            onMouseEnter={handleHoverIn}
            onMouseLeave={handleHoverOut}
          >
            <img
              src={featuredAccessory.image}
              alt={featuredAccessory.title}
              className="h-[520px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />

            <button
              onClick={() => toggleWishlist(featuredAccessory)}
              className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md transition-all duration-300 ${
                isFeaturedWishlisted
                  ? "bg-[#b6453c] text-white"
                  : "bg-white/85 text-[#2b2521] hover:bg-[#1b1714] hover:text-white"
              }`}
              aria-label="Toggle Wishlist"
            >
              <Heart
                size={18}
                fill={isFeaturedWishlisted ? "currentColor" : "none"}
              />
            </button>

            <div className="absolute left-5 bottom-5">
              <span className="inline-flex rounded-full bg-white/85 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-[#6a5d52] backdrop-blur-md">
                {featuredAccessory.category}
              </span>
            </div>
          </div>

          <div className="rounded-[34px] border border-[#eadfd4] bg-white/70 backdrop-blur-sm p-8 md:p-10 shadow-[0_14px_40px_rgba(0,0,0,0.05)]">
            <p className="text-sm uppercase tracking-[0.28em] text-[#a78e75] mb-3">
              Featured Accessory
            </p>

            <h2 className="font-serif text-3xl md:text-5xl font-light text-[#1f1a17] leading-tight mb-4">
              {featuredAccessory.title}
            </h2>

            <p className="text-[#6f675f] leading-8 mb-6 text-base md:text-lg">
              {featuredAccessory.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.18em] text-[#85796e] mb-6">
              <span>{featuredAccessory.date}</span>
              <span>•</span>
              <span>{featuredAccessory.readTime}</span>
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-semibold text-[#1f1a17]">
                ₹{featuredAccessory.price}
              </span>
              <span className="rounded-full bg-[#f4ebe2] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#8b7766]">
                Signature Pick
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() =>
                  addToCart(
                    featuredAccessory,
                    1,
                    featuredAccessory.sizes?.[0] || "",
                    featuredAccessory.colors?.[0] || ""
                  )
                }
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#222]"
              >
                <ShoppingBag size={16} />
                Add to Cart
              </button>

              <button
                onClick={() => openProductDetails(featuredAccessory)}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-[#111] transition-all duration-300 hover:bg-[#111] hover:text-white"
              >
                Buy Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
            Curated Categories
          </p>
          <h3 className="font-serif text-3xl md:text-4xl font-light text-[#111] mb-4">
            Signature Accessories
          </h3>
          <p className="text-[#6b6b6b] text-sm sm:text-base max-w-2xl mx-auto leading-7">
            Explore premium finishing touches across glasses, bags, anklets,
            rings, necklaces, sets, and bracelets.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#444] flex-wrap">
            <span>{filteredProducts.length} Products</span>
            <span className="w-1 h-1 rounded-full bg-[#999]"></span>
            <span>{wishlistItems.length} Wishlist</span>
            <span className="w-1 h-1 rounded-full bg-[#999]"></span>
            <span>{cartItems.length} Cart</span>
          </div>
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
                Finishing Touch
              </p>
              <h4 className="mt-2 font-serif text-3xl text-[#1b1714]">
                Crafted to complete the look
              </h4>
              <p className="mt-3 max-w-2xl text-[#6f655c] leading-7">
                Explore elegant details that bring polish, personality, and timeless
                luxury to every wardrobe edit.
              </p>
            </div>

            <button
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
              className="rounded-full border border-[#1b1714] px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#1b1714] transition-all duration-300 hover:bg-[#1b1714] hover:text-white"
            >
              Shop Accessories
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}