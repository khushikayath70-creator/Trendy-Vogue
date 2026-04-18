import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Cart() {
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const navigate = useNavigate();
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useShop();

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  }, [cartItems]);

  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  return (
    <div className="pt-40 pb-28 px-4 sm:px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">Curated Bag</p>
          <h1 className="font-serif text-5xl md:text-6xl font-light mb-4 text-[#111]">My Bag</h1>
          <p className="text-[#6f675f] text-lg max-w-2xl mx-auto leading-8">
            Review your selected premium items before checkout.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-8">
            {/* Cart Items */}
            <div className="space-y-5">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  className="bg-white rounded-[24px] border border-[#ece7df] p-4 sm:p-5 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                  onMouseEnter={handleHoverIn}
                  onMouseLeave={handleHoverOut}
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    <img
                      src={item.img || item.image}
                      alt={item.name}
                      className="w-full sm:w-[170px] h-[200px] sm:h-[170px] object-cover rounded-[20px]"
                    />

                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#9a7b52] mb-2">
                        {item.category}
                      </p>
                      <h2 className="font-serif text-2xl text-[#111] font-light mb-2">{item.name}</h2>
                      <p className="text-sm text-[#6d6d6d] mb-1">
                        Size: <span className="text-[#111]">{item.selectedSize || "Standard"}</span>
                      </p>
                      <p className="text-sm text-[#6d6d6d] mb-4">
                        Color: <span className="text-[#111]">{item.selectedColor || "Default"}</span>
                      </p>

                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-[#111] text-xl font-medium">₹{item.price}</span>
                        {item.oldPrice && (
                          <span className="text-[#999] text-sm line-through">₹{item.oldPrice}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex items-center rounded-full border border-[#ddd2c8] overflow-hidden bg-white">
                          <button
                            onClick={() => decreaseQty(item.id, item.selectedSize, item.selectedColor)}
                            className="px-4 py-2 text-lg hover:bg-[#f0ebe4] transition"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="px-5 py-2 text-sm min-w-[40px] text-center">{item.quantity || 1}</span>
                          <button
                            onClick={() => increaseQty(item.id, item.selectedSize, item.selectedColor)}
                            className="px-4 py-2 text-lg hover:bg-[#f0ebe4] transition"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
                          className="px-4 py-2 rounded-full border border-[#111] text-[#111] text-[10px] uppercase tracking-[0.18em] hover:bg-[#111] hover:text-white transition-all flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div
              className="h-fit bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            >
              <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80] mb-3">Order Summary</p>
              <h3 className="text-3xl font-bold text-[#1b1714] mb-6">Cart Total</h3>

              <div className="space-y-3 text-sm text-[#6f675f]">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="text-[#111] font-medium">₹{subtotal}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (18%)</span>
                  <span className="text-[#111] font-medium">₹{gst}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#ece7df] pt-4 text-base">
                  <span className="font-semibold text-[#111]">Total</span>
                  <span className="font-semibold text-[#111]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#222]"
              >
                <ShoppingBag size={16} />
                Proceed to Checkout
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="w-full mt-3 rounded-full border border-[#ddd2c8] py-3 text-[11px] uppercase tracking-[0.18em] text-[#111] hover:bg-[#f0ebe4] transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-[#d8ccc0] bg-[#faf7f3] px-6 py-16 text-center">
            <h3 className="text-2xl font-semibold text-[#1b1714]">Your bag is empty</h3>
            <p className="mt-3 text-[#756b62]">Add some premium products to continue shopping.</p>
            <button
              onClick={() => navigate("/shop")}
              className="mt-6 rounded-full bg-[#111] text-white px-8 py-3 text-sm uppercase tracking-[0.18em] hover:bg-[#222] transition"
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}