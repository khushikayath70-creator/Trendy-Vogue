import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NewIn from "./pages/NewIn";
import Shop from "./pages/Shop";
import Cloths from "./pages/Cloths";
import Accessories from "./pages/Accessories";
import Foot_wear from "./pages/Foot_wear";
import Sale from "./pages/Sale";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import { ShopProvider, useShop } from "./context/ShopContext";
import LoginRequiredModal from "./components/LoginRequiredModal";

function AppRoutes() {
  const { showLoginModal, setShowLoginModal } = useShop();

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="newin" element={<NewIn />} />
          <Route path="shop" element={<Shop />} />
          <Route path="cloths" element={<Cloths />} />
          <Route path="accessories" element={<Accessories />} />
          <Route path="footwear" element={<Foot_wear />} />
          <Route path="sale" element={<Sale />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      <LoginRequiredModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppRoutes />
    </ShopProvider>
  );
}