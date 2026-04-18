import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { useShop } from "../context/ShopContext";

const navLinks = [
  { label: "New In", path: "/newin" },
  { label: "Shop", path: "/shop" },
  { label: "Cloths", path: "/cloths" },
  { label: "Accessories", path: "/accessories" },
  { label: "Foot Wear", path: "/footWear" },
  { label: "Sale", path: "/sale" },
];

export default function Navbar({ onHoverIn, onHoverOut }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { wishlistCount, cartCount } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-[100] px-5 md:px-10 lg:px-12 h-[72px] md:h-[82px] flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-[#f8f4ee]/90 backdrop-blur-xl border-b border-[#e8dfd5] shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
            : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link
          to="/"
          onMouseEnter={onHoverIn}
          onMouseLeave={onHoverOut}
          className="font-serif text-[1.7rem] md:text-[1.9rem] font-normal tracking-[0.18em] uppercase text-[#1f1a17] no-underline flex-shrink-0"
        >
          V<span className="text-[#b6463a]">●</span>GUE
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-8 list-none">
          {navLinks.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link
                  to={item.path}
                  onMouseEnter={onHoverIn}
                  onMouseLeave={onHoverOut}
                  className={`text-[0.75rem] font-semibold tracking-[0.18em] uppercase no-underline relative pb-[4px] transition-colors duration-300 ${
                    isActive ? "text-[#b6463a]" : "text-[#2a2521] hover:text-[#b6463a]"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-0 bottom-0 h-[1px] bg-[#b6463a] transition-all duration-300 ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </motion.li>
            );
          })}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Search - hidden on mobile */}
          <motion.div
            animate={{ width: searchFocused ? 230 : 190 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex items-center h-11 rounded-full border border-[#e6ddd3] bg-white/80 backdrop-blur-md px-4 shadow-sm"
          >
            <Search size={17} className="text-[#7c7268] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onMouseEnter={onHoverIn}
              onMouseLeave={onHoverOut}
              className="w-full bg-transparent outline-none border-none text-[0.84rem] text-[#2a2521] placeholder:text-[#9c9186] ml-2"
            />
          </motion.div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            className="relative h-10 w-10 md:h-11 md:w-11 rounded-full border border-[#e6ddd3] bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2a2521] shadow-sm hover:bg-[#1f1a17] hover:text-white transition-all duration-300"
          >
            <Heart size={17} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b6463a] text-white text-[9px] font-semibold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            className="relative h-10 w-10 md:h-11 md:w-11 rounded-full border border-[#e6ddd3] bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2a2521] shadow-sm hover:bg-[#1f1a17] hover:text-white transition-all duration-300"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#b6463a] text-white text-[9px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile - hidden on mobile */}
          <Link
            to="/profile"
            onMouseEnter={onHoverIn}
            onMouseLeave={onHoverOut}
            className="hidden md:flex h-11 w-11 rounded-full border border-[#e6ddd3] bg-white/80 backdrop-blur-md items-center justify-center text-[#2a2521] shadow-sm hover:bg-[#1f1a17] hover:text-white transition-all duration-300"
          >
            <User size={17} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden h-10 w-10 rounded-full border border-[#e6ddd3] bg-white/80 backdrop-blur-md flex items-center justify-center text-[#2a2521] shadow-sm"
          >
            <Menu size={20} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="fixed top-0 right-0 bottom-0 z-[160] w-[280px] bg-[#faf7f3] shadow-2xl lg:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#ece7df]">
                <span className="font-serif text-xl tracking-[0.18em] uppercase text-[#1f1a17]">
                  V<span className="text-[#b6463a]">●</span>GUE
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="h-9 w-9 rounded-full border border-[#e6ddd3] flex items-center justify-center text-[#2a2521]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="px-6 py-4 border-b border-[#ece7df]">
                <div className="flex items-center h-11 rounded-full border border-[#e6ddd3] bg-white px-4">
                  <Search size={16} className="text-[#9c9186] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full bg-transparent outline-none border-none text-[0.84rem] text-[#2a2521] placeholder:text-[#9c9186] ml-2"
                  />
                </div>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 px-6 py-4 overflow-y-auto">
                <ul className="space-y-1 list-none">
                  {navLinks.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <li key={item.label}>
                        <Link
                          to={item.path}
                          className={`block px-4 py-3 rounded-xl text-sm font-semibold tracking-[0.15em] uppercase transition-all duration-200 ${
                            isActive
                              ? "bg-[#1f1a17] text-white"
                              : "text-[#2a2521] hover:bg-[#f0ebe4]"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 pt-6 border-t border-[#ece7df] space-y-1 list-none">
                  <Link
                    to="/wishlist"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2a2521] hover:bg-[#f0ebe4] transition-all"
                  >
                    <Heart size={17} />
                    Wishlist {wishlistCount > 0 && <span className="ml-auto text-xs bg-[#b6463a] text-white rounded-full px-2 py-0.5">{wishlistCount}</span>}
                  </Link>
                  <Link
                    to="/cart"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2a2521] hover:bg-[#f0ebe4] transition-all"
                  >
                    <ShoppingBag size={17} />
                    Cart {cartCount > 0 && <span className="ml-auto text-xs bg-[#b6463a] text-white rounded-full px-2 py-0.5">{cartCount}</span>}
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#2a2521] hover:bg-[#f0ebe4] transition-all"
                  >
                    <User size={17} />
                    Profile
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}