import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./component/Home";
import NotFound from "./component/NotFound";
import MainLayout from "./layout/MainLayout";
import Product from "./component/Product";
import ProductList from "./component/ProductList";
import Register from "./component/Register";
import Login from "./component/Login";
import LoginGoogle from "./component/LoginGoogle";
import "./App.css";
import ShoppingCart from "./component/ShoppingCart";
import Checkout from "./component/Checkout";
import Account from "./component/account/Account";
import Profile from "./component/account/Profile";
import Address from "./component/account/Address";
import OrderHistory from "./component/account/OrderHistory";
import OrderDetail from "./component/account/OrderDetail";
import Review from "./component/account/Review";
import Recent from "./component/account/Recent";
import { AuthContext } from "./provider/AuthProvider";
import { useContext } from "react";
import NotIfAlreadyAuth from "./component/NotIfAlreadyAuth";
import RequireAuth from "./component/RequireAuth";
import Loader from "./component/loader/Loader";
import VnpReturn from "./component/online_payment/VnpReturn";
import Notifications from "./component/account/Notifications";
import Coupons from "./component/account/Coupons";
import Accessory from "./component/Accessory";
import SmartHome from "./component/SmartHome";
import LinhKien from "./component/LinhKien";
import SearchResult from "./component/SearchResult";
import Compare from "./component/Compare";
import BuildPc from "./component/BuildPc";
import PDF from "./component/PDF";
import News from "./component/news/News";
import New from "./component/news/New";
import NewsCategory from "./component/news/NewsCategory";
import NewsLayout from "./component/news/NewsLayout";

function App() {
  const { isLogginChecked } = useContext(AuthContext);

  return (
    <>
      {isLogginChecked ? (
        <BrowserRouter>
          <Routes>
            <Route path="/online_payment/vnpay" element={<VnpReturn />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="products/:slug" element={<Product />} />
              <Route path="cart" element={<ShoppingCart />} />
              <Route element={<RequireAuth />}>
                <Route path="checkout" element={<Checkout />} />
              </Route>
              <Route element={<RequireAuth />}>
                <Route path="account" element={<Account />}>
                  <Route index element={<Profile />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders_history" element={<OrderHistory />} />
                  <Route path="order/:id" element={<OrderDetail />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="address" element={<Address />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="reviews" element={<Review />} />
                  <Route path="recent" element={<Recent />} />
                  <Route path="coupons" element={<Coupons />} />
                </Route>
              </Route>
              <Route path="/tin-tuc" element={<NewsLayout />}>
                <Route index element={<News />} />
                <Route path=":slug" element={<NewsCategory />} />
                <Route path="bai-viet/:slug" element={<New />} />
              </Route>
              <Route path="/tin-tuc/:slug" element={<New />} />
              <Route path="/search" element={<SearchResult />} />
              <Route path="/compare/:slugs" element={<Compare />} />
              <Route path="/build-pc" element={<BuildPc />} />
              <Route path="/phu-kien/:slug?" element={<Accessory />} />
              <Route path="/gia-dung/:slug?" element={<SmartHome />} />
              <Route path="/linh-kien/:slug?" element={<LinhKien />} />
              <Route path=":slug" element={<ProductList />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<NotIfAlreadyAuth />}>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/loginGoogle" element={<LoginGoogle />} />
            </Route>
          </Routes>
        </BrowserRouter>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default App;
