import { useState } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Heart,
  Package,
  X,
  Camera,
  Save,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import AuthPopup from "../components/AuthPopup";
import API from "../api/api";

export default function Profile() {
  const outletContext = useOutletContext() || {};
  const handleHoverIn = outletContext.handleHoverIn || (() => {});
  const handleHoverOut = outletContext.handleHoverOut || (() => {});

  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { wishlistItems, cartItems } = useShop();

  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    location: user?.location || "India",
  });

  const profile = {
    name: user?.name || "Guest User",
    email: user?.email || "No Email",
    phone: user?.phone || "Not added",
    address: user?.address || "Not added",
    location: user?.location || "India",
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    if (saveMessage) setSaveMessage("");
  };

const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setSaving(true);
  setSaveMessage("");

  try {
    const token = localStorage.getItem("token");

    const res = await API.put("/auth/update-profile", editForm, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    updateProfile(res.data.user);
    setEditOpen(false);
    setEditSuccess(true);
  } catch (error) {
    setSaveMessage(
      error?.response?.data?.message || "Server not connected"
    );
  } finally {
    setSaving(false);
  }
};

  return (
    <>
      <div className="pt-40 pb-28 px-4 sm:px-6 md:px-12 bg-[#f8f5ef] min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#9f7a49] mb-3">
              Personal Space
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-light mb-4 text-[#111]">
              My Profile
            </h1>
            <p className="text-[#6f675f] text-lg max-w-2xl mx-auto leading-8">
              Manage your personal details, saved items, and shopping activity.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[0.8fr_1.2fr] gap-8">
            {/* Profile Card */}
            <div
              className="bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
              onMouseEnter={handleHoverIn}
              onMouseLeave={handleHoverOut}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-[#f3ece5] flex items-center justify-center text-[#111] mb-4">
                  <User size={36} />
                </div>
                <h2 className="font-serif text-3xl text-[#111] font-light mb-1">
                  {profile.name}
                </h2>
                <p className="text-sm text-[#7e7369]">Premium Member</p>
              </div>

              <div className="space-y-4 text-sm text-[#6f675f]">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-[#111] flex-shrink-0" />
                  <span className="break-all">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-[#111] flex-shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin
                    size={16}
                    className="text-[#111] mt-0.5 flex-shrink-0"
                  />
                  <span>{profile.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#111] flex-shrink-0" />
                  <span>{profile.location}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditForm({
                    name: user?.name || "",
                    phone: user?.phone || "",
                    address: user?.address || "",
                    location: user?.location || "India",
                  });
                  setEditOpen(true);
                }}
                className="w-full mt-6 rounded-full border border-[#111] px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#111] transition-all duration-300 hover:bg-[#111] hover:text-white"
              >
                Edit Profile
              </button>

              <button
                onClick={() => setConfirmLogout(true)}
                className="w-full mt-3 rounded-full border border-red-400 px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-red-500 transition-all duration-300 hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link
                to="/wishlist"
                className="bg-white no-underline rounded-[24px] border border-[#ece7df] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all block"
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-[#f3ece5] flex items-center justify-center">
                    <Heart size={18} className="text-[#b6463a]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
                    Wishlist
                  </p>
                </div>
                <h3 className="text-3xl font-bold text-[#1b1714]">
                  {wishlistItems.length} Items
                </h3>
                <p className="mt-2 text-sm text-[#6f675f]">
                  Your saved premium favorites.
                </p>
              </Link>

              <Link
                to="/cart"
                className="bg-white no-underline rounded-[24px] border border-[#ece7df] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all block"
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-[#f3ece5] flex items-center justify-center">
                    <ShoppingBag size={18} className="text-[#111]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
                    Cart
                  </p>
                </div>
                <h3 className="text-3xl font-bold text-[#1b1714]">
                  {cartItems.length} Items
                </h3>
                <p className="mt-2 text-sm text-[#6f675f]">
                  Products in your bag.
                </p>
              </Link>

              <Link
                to="/my-orders"
                className="bg-white no-underline rounded-[24px] border border-[#ece7df] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all block"
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-[#f3ece5] flex items-center justify-center">
                    <Package size={18} className="text-[#111]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
                    Orders
                  </p>
                </div>
                <h3 className="text-3xl font-bold text-[#1b1714]">View All</h3>
                <p className="mt-2 text-sm text-[#6f675f]">
                  Your order history.
                </p>
              </Link>

              <div
                className="bg-white rounded-[24px] border border-[#ece7df] p-6 shadow-[0_10px_28px_rgba(0,0,0,0.04)]"
                onMouseEnter={handleHoverIn}
                onMouseLeave={handleHoverOut}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-11 w-11 rounded-full bg-[#f3ece5] flex items-center justify-center">
                    <User size={18} className="text-[#111]" />
                  </div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#a08f80]">
                    Account
                  </p>
                </div>
                <h3 className="text-3xl font-bold text-[#1b1714]">Active</h3>
                <p className="mt-2 text-sm text-[#6f675f]">
                  Your account is in good standing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation */}
      <AuthPopup
        open={confirmLogout}
        type="confirm"
        title="Logout?"
        message="Are you sure you want to logout from your account?"
        showCancel
        cancelText="No"
        confirmText="Yes, Logout"
        onClose={() => setConfirmLogout(false)}
        onConfirm={() => {
          setConfirmLogout(false);
          logout();
          setLogoutSuccess(true);
        }}
      />

      <AuthPopup
        open={logoutSuccess}
        title="Logged Out"
        message="You have been logged out successfully."
        confirmText="Continue"
        onClose={() => {
          setLogoutSuccess(false);
          navigate("/login");
        }}
      />

      {/* Edit Profile Success */}
      <AuthPopup
        open={editSuccess}
        title="Profile Updated ✓"
        message="Your profile has been updated successfully."
        confirmText="Great!"
        onClose={() => setEditSuccess(false)}
      />

      {/* NEW EDIT PROFILE MODAL - Clean Card Design */}
  {editOpen && (
  <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-hidden">
    {/* Fixed width, no overflow */}
    <div className="w-[90vw] max-w-[400px] max-h-[85vh] bg-white rounded-[24px] shadow-2xl flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="relative bg-[#f8f5ef] px-6 pt-6 pb-6 flex-shrink-0">
        <div className="absolute top-2 right-4 w-12 h-12 rounded-full bg-[#ece7df] opacity-50"></div>
        
        <div className="relative flex flex-col items-center">
          <div className="relative group cursor-pointer mb-2">
            <div className="h-16 w-16 rounded-full bg-white border-4 border-[#f8f5ef] shadow-lg flex items-center justify-center text-[#9f7a49] overflow-hidden">
              <User size={28} strokeWidth={1.5} />
            </div>
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="text-white w-5 h-5" />
            </div>
            <div className="absolute bottom-0 right-0 h-5 w-5 bg-[#111] rounded-full flex items-center justify-center shadow-md">
              <Camera size={10} className="text-white" />
            </div>
          </div>
          
          <h2 className="font-serif text-xl text-[#111] font-light">
            Edit Profile
          </h2>
          <p className="text-[#7e7369] text-xs mt-0.5">
            Update your personal information
          </p>
        </div>

        <button
          onClick={() => {
            setEditOpen(false);
            setSaveMessage("");
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-[#6f675f] hover:text-[#111] transition-all duration-200 shadow-sm"
        >
          <X size={16} />
        </button>
      </div>

      {/* Form - box-sizing border-box ke saath */}
      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
        <form onSubmit={handleProfileUpdate} className="space-y-3 w-full box-border">
          
          {/* Full Name - width fix */}
          <div className="space-y-1 w-full">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#9f7a49] font-medium">
              Full Name
            </label>
            <div className="relative w-full">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08f80] pointer-events-none" />
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                placeholder="Enter your name"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#ece7df] bg-[#faf9f7] text-[#111] text-sm placeholder:text-[#a08f80] focus:border-[#9f7a49] focus:bg-white focus:outline-none box-border"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1 w-full">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#9f7a49] font-medium">
              Phone Number
            </label>
            <div className="relative w-full">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08f80] pointer-events-none" />
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
                placeholder="Add phone number"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#ece7df] bg-[#faf9f7] text-[#111] text-sm placeholder:text-[#a08f80] focus:border-[#9f7a49] focus:bg-white focus:outline-none box-border"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1 w-full">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#9f7a49] font-medium">
              Location
            </label>
            <div className="relative w-full">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a08f80] pointer-events-none" />
              <input
                type="text"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
                placeholder="City, Country"
                className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#ece7df] bg-[#faf9f7] text-[#111] text-sm placeholder:text-[#a08f80] focus:border-[#9f7a49] focus:bg-white focus:outline-none box-border"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1 w-full">
            <label className="text-[10px] uppercase tracking-[0.2em] text-[#9f7a49] font-medium">
              Address
            </label>
            <div className="relative w-full">
              <MapPin size={16} className="absolute left-3 top-3 text-[#a08f80] pointer-events-none" />
              <textarea
                name="address"
                value={editForm.address}
                onChange={handleEditChange}
                placeholder="Enter your complete address"
                rows={2}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-[#ece7df] bg-[#faf9f7] text-[#111] text-sm placeholder:text-[#a08f80] focus:border-[#9f7a49] focus:bg-white focus:outline-none resize-none box-border"
              />
            </div>
          </div>

          {/* Error */}
          {saveMessage && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs text-center w-full box-border">
              {saveMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-1 w-full">
            <button
              type="button"
              onClick={() => {
                setEditOpen(false);
                setSaveMessage("");
              }}
              className="flex-1 h-11 rounded-xl border border-[#ece7df] text-[#6f675f] font-medium uppercase tracking-[0.12em] text-xs hover:bg-[#f8f5ef] transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 h-11 rounded-xl bg-[#111] text-white font-medium uppercase tracking-[0.12em] text-xs flex items-center justify-center gap-2 hover:bg-[#333] disabled:opacity-60 transition-all duration-200 shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}
    </>
  );
}