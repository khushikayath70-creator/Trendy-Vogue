import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";

import { useShop } from "../context/ShopContext";

// const WISHLIST_ITEMS = [
//   {
//     id: 1,
//     name: "Minimal White Sneakers",
//     category: "Footwear",
//     badge: "Daily Luxe",
//     price: 4200,
//     oldPrice: 5600,
//     img: "https://i.pinimg.com/736x/79/88/6d/79886db8001ca1f1a2d85c98baa875ce.jpg",
//     description:
//       "Soft premium finish and everyday comfort crafted for modern minimal styling.",
//   },
//   {
//     id: 2,
//     name: "Classic Black Sunglasses",
//     category: "Accessories",
//     badge: "Trending",
//     price: 2899,
//     oldPrice: 3599,
//     img: "https://i.pinimg.com/1200x/f4/34/43/f4344392c6de351ec9b59282a4babadc.jpg",
//     description: "Refined black sunglasses with a sharp premium silhouette.",
//   },
//   {
//     id: 3,
//     name: "Ivory Co-ord Set",
//     category: "Cloths",
//     badge: "Best Seller",
//     price: 2499,
//     oldPrice: 3299,
//     img: "https://www.neola.ie/cdn/shop/files/ChatGPTImageMar3_2026_12_21_20PM.png?v=1772540493&width=900",
//     description: "Premium co-ord set with a polished luxury silhouette.",
//   },
// ];

export default function Wishlist() {
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const { wishlistItems, removeFromWishlist, addToCart } = useShop();

  // const [wishlistItems, setWishlistItems] = useState(WISHLIST_ITEMS);

  // const removeFromWishlist = (id) => {
  //   setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  // };

  return (
    <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
            Curated Wishlist
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4 text-[#111]">
            My Wishlist
          </h1>
          <p className="text-[#6f675f] text-lg max-w-2xl mx-auto leading-8">
            Save your favorite premium picks and shop them anytime.
          </p>
        </div>

        {wishlistItems.length > 0 ? (
          <>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
                  Saved Picks
                </p>
                <h3 className="mt-2 text-3xl font-bold text-[#1b1714]">
                  Wishlist Collection
                </h3>
              </div>

              <p className="text-sm text-[#7e7369]">
                Showing {wishlistItems.length} items
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-[24px] overflow-hidden border border-[#ece7df] shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition-all duration-500"
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.img || product.image}
                      alt={product.name}
                      className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />

                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 text-[#111] text-[9px] uppercase tracking-[0.25em] px-3 py-2 rounded-full">
                        {product.badge || product.label}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-4 right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-md bg-[#b6453c] text-white transition-all duration-300"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <button
                      onClick={() =>
  addToCart(
    product,
    1,
    product.sizes?.[0] || product.selectedSize || "",
    product.colors?.[0] || product.selectedColor || ""
  )
}
                      className="w-full bg-[#111] text-white py-2.5 rounded-full text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-2">
                        <ShoppingBag size={15} />
                        Add to Bag
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
                        onClick={() => removeFromWishlist(product.id)}
                        className="px-4 py-2 rounded-full border border-[#111] text-[#111] text-[10px] uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-all flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-[32px] border border-dashed border-[#d8ccc0] bg-[#faf7f3] px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-[#1b1714]">
              Your wishlist is empty
            </h3>
            <p className="mt-3 text-[#756b62]">
              Save your favorite products here to shop later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}