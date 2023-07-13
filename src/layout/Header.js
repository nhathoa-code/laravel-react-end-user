import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import parse from "html-react-parser";
import Loader from "../component/loader/Loader";
import SearchForm from "../component/SearchForm";
import { AuthContext } from "../provider/AuthProvider";
import { AppStoreContext } from "../provider/AppStoreProvider";
import CircularProcessing from "../component/CircularProgress";
import "./Header.css";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const [processing, setProcessing] = useState(false);
  const { shopping_cart, setShoppingCart } = useContext(AppStoreContext);
  const [total_cart_items, setTotalCartItems] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const { setChosenPostCategory } = useContext(AppStoreContext);

  const handleLogout = () => {
    setProcessing(true);
    axios.post(`${process.env.REACT_APP_API_ENDPOINT}/logout`).then(() => {
      setProcessing(false);
      setUser(null);
      setShoppingCart([]);
    });
  };

  useEffect(() => {
    let total_cart_items = 0;
    shopping_cart.forEach((item) => {
      total_cart_items += item.quantity;
    });
    setTotalCartItems(total_cart_items);
  }, [shopping_cart]);

  const handleDeleteCartItem = (id) => {
    setIsDeleting(true);
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/shopping_cart/${id}`)
      .then((res) => {
        setIsDeleting(false);
        setShoppingCart((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

  return (
    <header id="branding">
      {processing && <Loader fixed={true} />}
      <div className="grid_2">
        <hgroup style={{ display: "flex", alignItems: "center" }}>
          <Link
            to={"/"}
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              style={{ width: "80px", height: "auto" }}
              src="/images/logo.png"
            />
          </Link>
        </hgroup>
      </div>

      <div className="grid_5">
        <SearchForm />
      </div>

      <div className="grid_5">
        <ul id="cart_nav">
          <li>
            <Link to={"cart"} className="cart_li">
              Giỏ hàng <span>({total_cart_items})</span>
            </Link>

            <ul className="cart_cont">
              <div
                id="layover"
                style={
                  isDeleting
                    ? { display: "flex", position: "absolute" }
                    : { display: "none" }
                }
              >
                <div id="layover_content" style={{ top: "45%" }}>
                  <CircularProcessing size={30} />
                </div>
              </div>
              {shopping_cart.length === 0 ? (
                <p
                  style={{
                    width: "270px",
                    lineHeight: "100px",
                    textAlign: "center",
                  }}
                >
                  Không có sản phẩm nào trong giỏ hàng
                </p>
              ) : (
                <>
                  <li className="no_border">
                    <p>Những sản phẩm đã thêm vào giỏ hàng</p>
                  </li>
                  {shopping_cart.map((item) => {
                    return (
                      <li>
                        <Link
                          to={`/products/${item.slug}`}
                          className="prev_cart"
                        >
                          <div className="cart_vert">
                            <img
                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                              alt="image"
                            />
                          </div>
                        </Link>
                        <div className="cont_cart">
                          <h4>{item.name}</h4>
                          <div className="price">
                            {item.quantity} x ₫
                            {new Intl.NumberFormat({
                              style: "currency",
                            }).format(item.price)}
                          </div>
                        </div>
                        <a
                          title="delete"
                          className="close"
                          href="javascript:void(0)"
                          onClick={() => {
                            handleDeleteCartItem(item.id);
                          }}
                        ></a>
                        <div className="clear"></div>
                      </li>
                    );
                  })}
                  <li className="no_border">
                    <Link to={`/cart`} className="view_cart">
                      Xem giỏ hàng
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>
        </ul>

        <nav className="private">
          <ul>
            <li>
              <Link
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "14px",
                }}
                onClick={() => setChosenPostCategory(null)}
                to={`/tin-tuc`}
                title={"Tin Tức"}
              >
                {parse(
                  `<svg id="tech_news" width="40px" height="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.01 17.01"><defs><style>.cls-1,.cls-2{fill:none;stroke:#231f20;stroke-miterlimit:10;}.cls-1{stroke-width:1.07px;}.cls-2{stroke-linecap:round;}.cls-3{fill:#231f20;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><rect class="cls-1" x="0.54" y="0.54" width="15.93" height="15.93" rx="2.54"/><line class="cls-2" x1="3.1" y1="8.71" x2="6.77" y2="8.71"/><line class="cls-2" x1="3.1" y1="10.94" x2="6.77" y2="10.94"/><line class="cls-2" x1="3.1" y1="13.18" x2="6.77" y2="13.18"/><rect class="cls-3" x="8.23" y="7.45" width="6.28" height="7.18" rx="1"/><path d="M4.57,5.85H4L3.18,4.39V5.85H2.61V3.5h.57L4,5V3.5h.56Z"/><path d="M7.38,4.85H6.49v.56h1v.44H5.92V3.5H7.54v.44h-1v.49h.89Z"/><path d="M10.58,5l.26-1.47h.57l-.5,2.35h-.59L10,4.51,9.7,5.85H9.11L8.61,3.5h.57L9.45,5,9.77,3.5h.48Z"/><path d="M13.83,5.22A.22.22,0,0,0,13.74,5a.82.82,0,0,0-.31-.14,2.18,2.18,0,0,1-.36-.15.69.69,0,0,1-.46-.61.55.55,0,0,1,.12-.35.65.65,0,0,1,.32-.23,1.16,1.16,0,0,1,.47-.08,1.1,1.1,0,0,1,.45.09.7.7,0,0,1,.31.25.65.65,0,0,1,.11.38h-.56A.29.29,0,0,0,13.74,4a.36.36,0,0,0-.24-.08.43.43,0,0,0-.24.07.2.2,0,0,0-.08.17.19.19,0,0,0,.09.16,1.57,1.57,0,0,0,.34.16,2,2,0,0,1,.4.16.67.67,0,0,1,.38.61.59.59,0,0,1-.23.48,1,1,0,0,1-.64.18A1.19,1.19,0,0,1,13,5.77a.71.71,0,0,1-.35-.28.69.69,0,0,1-.12-.41h.57a.34.34,0,0,0,.1.28.44.44,0,0,0,.31.09.39.39,0,0,0,.23-.06A.21.21,0,0,0,13.83,5.22Z"/></g></g></svg>`
                )}
                Tin tức
              </Link>
            </li>
            <li class="separator">|</li>
            {!user ? (
              <>
                <li>
                  <Link to={"/login"}>Đăng Nhập</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={"/account"}>
                    <div class="navbar__link--account__container">
                      <div class="shopee-avatar">
                        <div class="shopee-avatar__placeholder">
                          <svg
                            enable-background="new 0 0 15 15"
                            viewBox="0 0 15 15"
                            x="0"
                            y="0"
                            class="shopee-svg-icon icon-headshot"
                          >
                            <g>
                              <circle
                                cx="7.5"
                                cy="4.5"
                                fill="none"
                                r="3.8"
                                stroke-miterlimit="10"
                              ></circle>
                              <path
                                d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6"
                                fill="none"
                                stroke-linecap="round"
                                stroke-miterlimit="10"
                              ></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div class="navbar__username">
                        {user.profile.nickname}
                      </div>
                    </div>
                  </Link>
                </li>
                <li class="separator">|</li>
                <li>
                  <a onClick={handleLogout} href="javascript:void(0)">
                    Đăng xuất
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
