// frontend/src/pages/MyOrders.jsx
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Package, ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import AuthPopup from "../components/AuthPopup";
import API from "../api/api";

const STATUS_STYLES = {
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-yellow-50 text-yellow-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function MyOrders() {
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const { user } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState({ open: false, orderId: null });
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // FIX: was missing setOrders
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCancelConfirm({ open: false, orderId: null });
      setCancelSuccess(true);
      fetchOrders();
    } catch (err) {
      console.error("Cancel failed", err);
    }
  };

  if (loading) {
    return (
      <div className="pt-40 pb-28 bg-[#f8f5ef] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <>
      <div className="pt-40 pb-28 px-4 sm:px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">Order History</p>
            <h1 className="font-serif text-5xl md:text-6xl font-light mb-4 text-[#111]">My Orders</h1>
            <p className="text-[#6f675f] text-lg max-w-2xl mx-auto leading-8">
              Track and manage all your orders in one place.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-[#d8ccc0] bg-[#faf7f3] px-6 py-16 text-center">
              <Package size={48} className="mx-auto text-[#c9b8a8] mb-4" />
              <h3 className="text-2xl font-semibold text-[#1b1714]">No orders yet</h3>
              <p className="mt-3 text-[#756b62]">Start shopping to see your orders here.</p>
              <button
                onClick={() => navigate("/shop")}
                className="mt-6 rounded-full bg-[#111] text-white px-8 py-3 text-sm uppercase tracking-[0.18em] hover:bg-[#222] transition"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[24px] border border-[#ece7df] shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[#9a8d81] mb-1">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-[#1b1714]">
                        #{order._id.slice(-10).toUpperCase()}
                      </p>
                      <p className="text-xs text-[#9a8d81] mt-1">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"}`}>
                        {order.status}
                      </span>
                      <span className="text-base font-bold text-[#1b1714]">₹{order.total}</span>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="flex items-center gap-1.5 rounded-full border border-[#ddd2c8] px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-[#1b1714] hover:bg-[#f0ebe4] transition"
                      >
                        {expandedOrder === order._id ? "Hide" : "Details"}
                        {expandedOrder === order._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden border-t border-[#ece7df]"
                      >
                        <div className="p-5 sm:p-6 space-y-4">
                          <div className="space-y-3">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 items-center">
                                <img
                                  src={item.img || item.image}
                                  alt={item.name}
                                  className="w-14 h-14 rounded-xl object-cover border border-[#ece7df]"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#1b1714] truncate">{item.name}</p>
                                  <p className="text-xs text-[#9a8d81]">
                                    {item.selectedSize && `Size: ${item.selectedSize}`}
                                    {item.selectedColor && ` · Color: ${item.selectedColor}`}
                                    {` · Qty: ${item.quantity || 1}`}
                                  </p>
                                </div>
                                <p className="text-sm font-medium text-[#1b1714]">₹{item.price * (item.quantity || 1)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-[#ece7df]">
                            <div className="bg-[#faf7f3] rounded-2xl p-4">
                              <p className="text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-2">Shipped To</p>
                              <p className="text-sm text-[#1b1714] font-medium">{order.shippingAddress?.name}</p>
                              <p className="text-xs text-[#6f675f] mt-1">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                              <p className="text-xs text-[#6f675f]">{order.shippingAddress?.state} - {order.shippingAddress?.zip}</p>
                            </div>
                            <div className="bg-[#faf7f3] rounded-2xl p-4">
                              <p className="text-xs uppercase tracking-[0.18em] text-[#9a8d81] mb-2">Payment</p>
                              <p className="text-sm text-[#1b1714] font-medium capitalize">
                                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
                              </p>
                              <div className="flex justify-between mt-2 text-xs text-[#6f675f]">
                                <span>Total (incl. GST)</span>
                                <span className="font-semibold text-[#1b1714]">₹{order.total}</span>
                              </div>
                            </div>
                          </div>

                          {order.status === "processing" && (
                            <button
                              onClick={() => setCancelConfirm({ open: true, orderId: order._id })}
                              className="flex items-center gap-2 rounded-full border border-red-300 px-4 py-2 text-xs uppercase tracking-[0.15em] text-red-600 hover:bg-red-50 transition"
                            >
                              <X size={13} />
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AuthPopup
        open={cancelConfirm.open}
        type="confirm"
        title="Cancel Order?"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        showCancel
        cancelText="No, Keep"
        confirmText="Yes, Cancel"
        onClose={() => setCancelConfirm({ open: false, orderId: null })}
        onConfirm={() => handleCancel(cancelConfirm.orderId)}
      />

      <AuthPopup
        open={cancelSuccess}
        title="Order Cancelled"
        message="Your order has been successfully cancelled."
        confirmText="OK"
        onClose={() => setCancelSuccess(false)}
      />
    </>
  );
}