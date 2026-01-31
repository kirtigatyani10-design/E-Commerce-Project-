import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Products from "./components/Products/Products";
import TopProducts from "./components/TopProducts/TopProducts";
import Banner from "./components/Banner/Banner";
import Subscribe from "./components/Subscribe/Subscribe";
import Testimonials from "./components/Testimonials/Testimonials";
import Footer from "./components/Footer/Footer";
import ProductsPage from "./components/Products/ProductsPage";
import SingleProduct from "./components/Products/SingleProduct";
import OrderReceipt from "./components/Order/OrderReceipt";

import OrderPopup from "./components/Popup/Popup";
import LoginPopup from "./components/Popup/LoginPopup";
import RegisterPopup from "./components/Popup/RegisterPopup";

import AOS from "aos";
import "aos/dist/aos.css";
import Cart from "./components/Cart/Cart";
import Profile from "./components/Profile/Profile";
import ProtectedRoute from "./route/ProtectedRoute";
import Account from "./components/Profile/Account";
import Checkout from "./components/Checkout/Checkout";
import Order from "./components/Order/Order";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "./components/Wishlist/Wishlist";
import CategoryProducts from "./components/Categories/CategoryProducts";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import OAuthSuccess from "./components/Popup/authsuccess";
import Login from "./components/Login/Login";
import TermsAndConditions from "./pages/TermsAndConditions";

function initGuestCartId() {
  let token = localStorage.getItem("token");
  let guestId = localStorage.getItem("guestCartId");

  if (!guestId) {
    guestId = crypto.randomUUID(); // unique cart id
    localStorage.setItem("guestCartId", guestId);
  }

  return guestId;
}

const App = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    initGuestCartId();
    console.log("env var=>", import.meta.env.VITE_API_URL);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        console.log("Query changed:", query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  function getQuery(e) {
    setQuery(e.target.value);
    console.log(e.target.value);
  }

  // POPUP STATES
  const [OrderPopupState, setOrderPopupState] = useState(false);
  const [LoginPopupState, setLoginPopupState] = useState(false);
  const [RegisterPopupState, setRegisterPopupState] = useState(false);

  // POPUP HANDLERS
  const handleOrderPopup = () => {
    setOrderPopupState(true);
  };

  const handleLoginPopup = () => {
    setLoginPopupState(true);
    setRegisterPopupState(false);
  };

  const handleRegisterPopup = () => {
    setRegisterPopupState(true);
    setLoginPopupState(false);
  };

  // HOME PAGE
  const Home = () => (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">

      <Hero handleOrderPopup={handleOrderPopup} />
      <Products />
      <TopProducts handleOrderPopup={handleOrderPopup} />
      <Banner />
      <Subscribe />
      <Products />
      <Testimonials />
    </div>
  );

  // OTHER PAGES
  const Categories = () => (
    <div className="mt-24 text-center text-3xl font-bold 
    bg-white dark:bg-gray-900 dark:text-white duration-200">
      Category Page
    </div>
  );

  const AllProductsPage = () => (
    <div className="mt-24 bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Products />
    </div>
  );

  // AOS
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  // ROUTES
  return (
    <WishlistProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar 
            handleOrderPopup={handleOrderPopup}
            handleLoginPopup={handleLoginPopup}
            handleRegisterPopup={handleRegisterPopup}
            query={query}
            setQuery={setQuery}
          />

          {/* POPUPS */}
          <LoginPopup
            loginPopup={LoginPopupState}
            setLoginPopup={setLoginPopupState}
            setRegisterPopup={setRegisterPopupState}
          />

          <OrderPopup
            orderPopup={OrderPopupState}
            setOrderPopup={setOrderPopupState}
          />

          <RegisterPopup
            registerPopup={RegisterPopupState}
            setRegisterPopup={setRegisterPopupState}
            setLoginPopup={setLoginPopupState}
          />

          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<SingleProduct />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Order />} />
            <Route path="/order-receipt/:orderId" element={<OrderReceipt />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/categories/:slug" element={<CategoryProducts />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/order-receipt" element={<OrderReceipt />} />
            <Route path="/login" element={<LoginPopup
            loginPopup={LoginPopupState}
            setLoginPopup={setLoginPopupState}
            setRegisterPopup={setRegisterPopupState} />} />

            {/* ERROR / 404 ROUTE */}
            <Route path="*" element={<ErrorPage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute setLoginPopup={setLoginPopupState}>
                  <Checkout />
                </ProtectedRoute>
              }
            />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </WishlistProvider>
  );
};

export default App;
