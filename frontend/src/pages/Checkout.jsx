// frontend/src/pages/Checkout.jsx
import { useState, useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, CreditCard, Truck } from "lucide-react";
import { useShop } from "../context/ShopContext";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup";
import API from "../api/api";

export default function Checkout() {
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const navigate = useNavigate();
  const { cartItems, clearCart } = useShop();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "cod",
  });

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [cartItems]
  );
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + gst;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zip) {
      alert("Please fill all shipping details");
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const orderPayload = {
        items: cartItems,
        shippingAddress: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
        paymentMethod: form.paymentMethod,
        subtotal,
        total,
      };

      const res = await API.post("/orders/create", orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrderId(res.data._id);
      clearCart();
      setOrderSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Order placement failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <div className="pt-40 pb-28 px-6 md:px-12 bg-[#f8f5ef] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-[#1b1714] mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/shop")}
            className="rounded-full bg-[#111] text-white px-8 py-3 text-sm uppercase tracking-[0.18em]"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="pt-36 pb-24 px-4 sm:px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">Secure Checkout</p>
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#111]">Checkout</h1>
          </div>

          {/* Steps */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {["Address", "Payment", "Review"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <button
                  onClick={() => i + 1 <= step && setStep(i + 1)}
                  className={`h-8 w-8 rounded-full text-sm font-semibold flex items-center justify-center transition-all ${
                    step === i + 1
                      ? "bg-[#111] text-white"
                      : step > i + 1
                      ? "bg-[#b6463a] text-white"
                      : "bg-[#e8dfd5] text-[#9a8d81]"
                  }`}
                >
                  {i + 1}
                </button>
                <span className={`text-sm hidden sm:block ${step === i + 1 ? "text-[#111] font-medium" : "text-[#9a8d81]"}`}>{s}</span>
                {i < 2 && <div className="w-8 h-[1px] bg-[#e8dfd5]" />}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div className="space-y-6">
              {/* Step 1: Address */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin size={20} className="text-[#b6463a]" />
                    <h2 className="font-serif text-2xl font-light text-[#111]">Shipping Address</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { name: "name", label: "Full Name", type: "text" },
                      { name: "email", label: "Email", type: "email" },
                      { name: "phone", label: "Phone", type: "text" },
                      { name: "zip", label: "Zip / Pincode", type: "text" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-2">{field.label}</label>
                        <input
                          name={field.name}
                          type={field.type}
                          value={form[field.name]}
                          onChange={handleChange}
                          className="w-full border border-[#ddd2c8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111] transition"
                          required
                        />
                      </div>
                    ))}
                    <div className="sm:col-span-2">
                      <label className="block text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-2">Address</label>
                      <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full border border-[#ddd2c8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111] transition resize-none"
                        required
                      />
                    </div>
                    {[
                      { name: "city", label: "City" },
                      { name: "state", label: "State" },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-2">{field.label}</label>
                        <input
                          name={field.name}
                          value={form[field.name]}
                          onChange={handleChange}
                          className="w-full border border-[#ddd2c8] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#111] transition"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zip) {
                        alert("Please fill all fields");
                        return;
                      }
                      setStep(2);
                    }}
                    onMouseEnter={handleHoverIn}
                    onMouseLeave={handleHoverOut}
                    className="mt-6 w-full rounded-full bg-[#111] text-white py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-[#222] transition"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <CreditCard size={20} className="text-[#b6463a]" />
                    <h2 className="font-serif text-2xl font-light text-[#111]">Payment Method</h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵" },
                      { value: "online", label: "Online Payment", desc: "UPI / Card / Net Banking", icon: "💳" },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          form.paymentMethod === method.value
                            ? "border-[#111] bg-[#f8f5ef]"
                            : "border-[#ddd2c8] bg-white hover:border-[#bbb]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={form.paymentMethod === method.value}
                          onChange={handleChange}
                          className="accent-[#111]"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#1b1714]">{method.label}</p>
                          <p className="text-xs text-[#9a8d81] mt-0.5">{method.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 rounded-full border border-[#ddd2c8] py-3 text-[11px] uppercase tracking-[0.18em] text-[#111] hover:bg-[#f0ebe4] transition">Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 rounded-full bg-[#111] text-white py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-[#222] transition">Review Order</button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Truck size={20} className="text-[#b6463a]" />
                    <h2 className="font-serif text-2xl font-light text-[#111]">Review & Place Order</h2>
                  </div>

                  <div className="rounded-2xl bg-[#faf7f3] border border-[#ece7df] p-4 mb-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-2">Shipping To</p>
                    <p className="text-sm text-[#1b1714] font-medium">{form.name}</p>
                    <p className="text-sm text-[#6f675f]">{form.address}, {form.city}, {form.state} - {form.zip}</p>
                    <p className="text-sm text-[#6f675f]">{form.phone} · {form.email}</p>
                  </div>

                  <div className="rounded-2xl bg-[#faf7f3] border border-[#ece7df] p-4 mb-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-1">Payment</p>
                    <p className="text-sm text-[#1b1714] font-medium">
                      {form.paymentMethod === "cod" ? "💵 Cash on Delivery" : "💳 Online Payment"}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-3 items-center">
                        <img src={item.img || item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover border border-[#ece7df]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1b1714] truncate">{item.name}</p>
                          <p className="text-xs text-[#9a8d81]">
                            {item.selectedSize && `Size: ${item.selectedSize}`}
                            {item.selectedColor && ` · ${item.selectedColor}`}
                            {` · Qty: ${item.quantity || 1}`}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-[#1b1714]">₹{item.price * (item.quantity || 1)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 rounded-full border border-[#ddd2c8] py-3 text-[11px] uppercase tracking-[0.18em] text-[#111] hover:bg-[#f0ebe4] transition">Back</button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={submitting}
                      className="flex-1 rounded-full bg-[#b6463a] text-white py-3 text-[11px] uppercase tracking-[0.22em] hover:bg-[#9d3b31] transition disabled:opacity-60"
                    >
                      {submitting ? "Placing..." : "Place Order"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Order Summary */}
            <div className="h-fit bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <ShoppingBag size={18} className="text-[#b6463a]" />
                <h3 className="font-serif text-xl font-light text-[#111]">Order Summary</h3>
              </div>

              <div className="space-y-3 mb-5">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between text-sm">
                    <span className="text-[#6f675f] truncate mr-2">{item.name} × {item.quantity || 1}</span>
                    <span className="text-[#1b1714] font-medium flex-shrink-0">₹{item.price * (item.quantity || 1)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#ece7df] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#6f675f]"><span>Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between text-[#6f675f]"><span>GST (18%)</span><span>₹{gst}</span></div>
                <div className="flex justify-between text-[#6f675f]"><span>Delivery</span><span className="text-green-600 font-medium">Free</span></div>
                <div className="flex justify-between text-base font-semibold text-[#1b1714] border-t border-[#ece7df] pt-3 mt-1">
                  <span>Total</span><span>₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthPopup
        open={orderSuccess}
        title="Order Placed! 🎉"
        message={`Your order has been placed successfully. Order ID: ${orderId ? orderId.slice(-8).toUpperCase() : ""}`}
        confirmText="View My Orders"
        onClose={() => {
          setOrderSuccess(false);
          navigate("/my-orders");
        }}
      />
    </>
  );
}