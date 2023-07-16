import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, json, useNavigate } from "react-router-dom";
import Popup from "./popup/Popup";
import CouponPopup from "./coupon_popup/CouponPopup";
import "./ShoppingCart.css";
import CircularProcessing from "../component/CircularProgress";
import { AppStoreContext } from "../provider/AppStoreProvider";
import { AuthContext } from "../provider/AuthProvider";
const ShoppingCart = () => {
  let subtotal = 0;
  const [popup, setPopup] = useState(null);
  const [couponPopup, setCouponPopup] = useState(false);
  const { user } = useContext(AuthContext);
  const {
    shopping_cart,
    setShoppingCart,
    chosenCoupon,
    setChosenCoupon,
    chosenFreeShip,
    setChosenFreeShip,
  } = useContext(AppStoreContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [purchaseAll, setPurchaseAll] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    navigate(`/login?next=${encodeURI(window.location.pathname)}`);
  }

  useEffect(() => {
    let purchaseAll = true;
    for (let i = 0; i < shopping_cart.length; i++) {
      if (!shopping_cart[i].purchase) {
        purchaseAll = false;
        break;
      }
    }
    setPurchaseAll(purchaseAll);
    let cart_subtotal = 0;
    shopping_cart.forEach((item) => {
      if (item.purchase) {
        cart_subtotal += item.quantity * (item.price - item.discounted_price);
      }
    });
    console.log(cart_subtotal);

    if (chosenCoupon && chosenCoupon.minimum_spend >= cart_subtotal) {
      console.log(chosenCoupon.minimum_spend);
      setChosenCoupon(null);
    }
    if (chosenFreeShip && chosenFreeShip.minimum_spend >= cart_subtotal) {
      console.log(chosenFreeShip.minimum_spend);
      setChosenFreeShip(null);
    }
  }, [shopping_cart]);

  useEffect(() => {
    if (shopping_cart.length > 0) {
      document.getElementById("main").scrollIntoView({ behavior: "smooth" });
    }
    localStorage.setItem("back_up_items", JSON.stringify(shopping_cart));
    return () => {
      localStorage.removeItem("back_up_items");
    };
  }, []);

  const handleDecrease = (id) => {
    let cart_item = shopping_cart.find((item) => item.id == id);
    if (cart_item.isUpdate) {
      return setShoppingCart((prev) => {
        return [...prev].map((item) => {
          if (item.id == id) {
            item.quantity = item.quantity - 1;
            return item;
          } else {
            return item;
          }
        });
      });
    }
    const quantity = document.querySelector("#quantity_" + id);
    quantity.value = Number(quantity.value) - 1;
    setIsUpdating(true);
    axios
      .put(
        `${process.env.REACT_APP_API_ENDPOINT}/shopping_cart/${id}`,
        {
          action: "-",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then((res) => {
        setShoppingCart((prev) => {
          return [...prev].map((item) => {
            if (item.id === id) {
              item.quantity = item.quantity - 1;
              update_back_up_item(id, "-");
              return item;
            } else {
              return item;
            }
          });
        });
        setIsUpdating(false);
      });
  };

  const handleIncrease = (id) => {
    let cart_item = shopping_cart.find((item) => item.id == id);
    if (cart_item.isUpdate) {
      return setShoppingCart((prev) => {
        return [...prev].map((item) => {
          if (item.id == id) {
            item.quantity = item.quantity + 1;
            return item;
          } else {
            return item;
          }
        });
      });
    }
    setIsUpdating(true);
    const quantity = document.querySelector("#quantity_" + id);
    quantity.value = Number(quantity.value) + 1;
    axios
      .put(
        `${process.env.REACT_APP_API_ENDPOINT}/shopping_cart/${id}`,
        {
          action: "+",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then((res) => {
        setShoppingCart((prev) => {
          return [...prev].map((item) => {
            if (item.id === id) {
              item.quantity = item.quantity + 1;
              update_back_up_item(id, "+");
              return item;
            } else {
              return item;
            }
          });
        });
        setIsUpdating(false);
      });
  };

  const update_back_up_item = (item_id, sign) => {
    let back_up_items = JSON.parse(localStorage.getItem("back_up_items"));
    let back_up_item = back_up_items.find((item) => item.id == item_id);
    if (sign === "+") {
      back_up_item.quantity = back_up_item.quantity + 1;
    } else if (sign === "-") {
      back_up_item.quantity = back_up_item.quantity - 1;
    }
    localStorage.setItem("back_up_items", JSON.stringify(back_up_items));
  };

  const handleDelete = (id) => {
    setIsUpdating(true);
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/shopping_cart/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        setShoppingCart((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
        setIsUpdating(false);
      });
  };

  const handleDeleteItems = () => {
    let items_to_delete = [];
    shopping_cart.forEach((item) => {
      if (item.purchase) {
        items_to_delete.push(item.id);
      }
    });

    if (items_to_delete.length === 0) {
      setPopup({
        message: "Vui lòng chọn sản phẩm bạn muốn xóa!",
        action: () => {
          setPopup(null);
        },
        cancel: () => {},
        btn2: "Trở về",
      });
      return;
    }
    setIsUpdating(true);
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/shopping_cart/delete_items`,
        { items_to_delete: items_to_delete },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then((res) => {
        setShoppingCart((prev) => {
          return [...prev].filter((item) => {
            if (items_to_delete.includes(item.id)) {
              return false;
            } else {
              return true;
            }
          });
        });
        setIsUpdating(false);
      });
  };

  const handleUpdateColor = (e) => {
    const item_id = e.target.dataset.item_id;
    const color = e.target.dataset.color;
    const color_name = e.target.dataset.color_name;
    setShoppingCart((prev) => {
      return [...prev].map((item) => {
        if (item.id == item_id) {
          item.image = color;
          item.color = color_name;
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleUpdateVersion = (e) => {
    const item_id = e.currentTarget.dataset.item_id;
    const version = e.currentTarget.dataset.version;
    const item_version = shopping_cart
      .find((item) => item.id == item_id)
      .options.versions.find((item) => item.version_name == version);
    setShoppingCart((prev) => {
      return [...prev].map((item) => {
        if (item.id == item_id) {
          item.product_id = item_version.product_id;
          item.options.colors = item_version.colors;
          for (let i = 0; i < item_version.colors.length; i++) {
            if (
              !shopping_cart.find(
                (item) =>
                  item.product_id === item_version.product_id &&
                  item.color === item_version.colors[i].color_name
              )
            ) {
              item.color = item_version.colors[i].color_name;
              item.image = item_version.colors[i].color;
              break;
            }
          }
          item.version = version;
          item.price = item_version.price;
          item.discounted_price = item_version.discounted_price;
          item.name = item_version.name;
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleCancelUpdate = (item_id) => {
    let cart_item = JSON.parse(localStorage.getItem("back_up_items")).find(
      (item) => item.id == item_id
    );
    setShoppingCart((prev) => {
      return [...prev].map((item) => {
        if (item.id == item_id) {
          cart_item.isUpdate = false;
          cart_item.purchase = item.purchase;
          return cart_item;
        } else {
          return item;
        }
      });
    });
  };

  const handleUpdateItem = (item_id) => {
    let back_up_item = JSON.parse(localStorage.getItem("back_up_items")).find(
      (item) => item.id == item_id
    );
    let cart_item = shopping_cart.find((item) => item.id == item_id);
    let data = {
      item_id: item_id,
    };
    if (back_up_item.version !== cart_item.version) {
      data.image = cart_item.image;
      data.color = cart_item.color;
      data.product_id = cart_item.product_id;
      data.name = cart_item.name;
      data.price = cart_item.price;
      data.discounted_price = cart_item.discounted_price;
      data.version = cart_item.version;
    } else if (back_up_item.color !== cart_item.color) {
      data.image = cart_item.image;
      data.color = cart_item.color;
    } else {
      return closeModal();
    }
    if (back_up_item.quantity != cart_item.quantity) {
      data.quantity = cart_item.quantity;
    }
    setIsUpdating(true);
    axios
      .put(
        `${process.env.REACT_APP_API_ENDPOINT}/shopping_cart/${item_id}?update`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then((res) => {
        setIsUpdating(false);
        let back_up_items = JSON.parse(localStorage.getItem("back_up_items"));
        back_up_items = back_up_items.map((item) => {
          if (item.id == item_id) {
            return shopping_cart.find((item) => item.id == item_id);
          } else {
            return item;
          }
        });
        localStorage.setItem("back_up_items", JSON.stringify(back_up_items));
        closeModal();
        console.log(res.data);
      });
  };

  const openModal = (item_id) => {
    setShoppingCart((prev) => {
      return [...prev].map((item) => {
        if (item.id == item_id) {
          if (item.isUpdate === true) {
            let back_up_item = JSON.parse(
              localStorage.getItem("back_up_items")
            ).find((item) => item.id == item_id);
            if (JSON.stringify(back_up_item) !== JSON.stringify(item)) {
              item = { ...back_up_item, purchase: item.purchase };
            }
            item.isUpdate = false;
          } else {
            item.isUpdate = true;
          }
          return item;
        } else {
          if (item.isUpdate === true) {
            let back_up_item = JSON.parse(
              localStorage.getItem("back_up_items")
            ).find((bkup_item) => bkup_item.id == item.id);
            back_up_item.isUpdate = false;
            return back_up_item;
          } else {
            return item;
          }
        }
      });
    });
  };

  const closeModal = () => {
    setShoppingCart((prev) => {
      return [...prev].map((item) => {
        item.isUpdate = false;
        return item;
      });
    });
  };

  const handleCheck = (item_id) => {
    setShoppingCart((prev) => {
      return [...prev].map((item) => {
        if (item.id == item_id) {
          if (item.purchase) {
            item.purchase = false;
          } else {
            item.purchase = true;
          }
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleCheckAll = (e) => {
    if (e.target.checked) {
      setPurchaseAll(true);
      setShoppingCart((prev) => {
        return [...prev].map((item) => {
          item.purchase = true;
          return item;
        });
      });
    } else {
      setPurchaseAll(false);
      setShoppingCart((prev) => {
        return [...prev].map((item) => {
          item.purchase = false;
          return item;
        });
      });
    }
  };

  const handleCheckout = () => {
    if (!shopping_cart.find((item) => item.purchase)) {
      return setPopup({
        message: "Vui lòng chọn sản phẩm bạn muốn thanh toán",
        action: () => {
          setPopup(null);
        },
        cancel: () => {},
        btn2: "Trở về",
      });
    }
    navigate("/checkout");
  };

  return (
    <section id="main" class="entire_width">
      {popup && <Popup {...popup} />}
      {couponPopup && (
        <CouponPopup
          setCouponPopup={setCouponPopup}
          shopping_cart={shopping_cart}
        />
      )}
      {shopping_cart.length === 0 ? (
        <div class="c-cart">
          <div class="empty">
            <img src="/images/empty-cart.png" alt="" />
            <div class="text">Không có sản phẩm nào trong giỏ hàng</div>
            <Link to={"/"} className="btn btn-primary btn-lg">
              VỀ TRANG CHỦ
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div
            id="layover"
            style={
              isUpdating
                ? { display: "flex", position: "fixed" }
                : { display: "none" }
            }
          >
            <div id="layover_content" style={{ top: "45%" }}>
              <CircularProcessing size={40} />
            </div>
          </div>
          <div class="container_12">
            <div class="grid_12">
              <h1 class="page_title">Giỏ Hàng</h1>

              <div class="container shopping_cart">
                <div role="main" class="if-swd" style={{ marginBottom: "0px" }}>
                  <div class="rtM2Xz">
                    <svg
                      height="12"
                      viewBox="0 0 20 12"
                      width="20"
                      class="shopee-svg-icon MCA-wE icon-free-shipping"
                    >
                      <g fill="none" fill-rule="evenodd" transform="">
                        <rect
                          fill="#00bfa5"
                          fill-rule="evenodd"
                          height="9"
                          rx="1"
                          width="12"
                          x="4"
                        ></rect>
                        <rect
                          height="8"
                          rx="1"
                          stroke="#00bfa5"
                          width="11"
                          x="4.5"
                          y=".5"
                        ></rect>
                        <rect
                          fill="#00bfa5"
                          fill-rule="evenodd"
                          height="7"
                          rx="1"
                          width="7"
                          x="13"
                          y="2"
                        ></rect>
                        <rect
                          height="6"
                          rx="1"
                          stroke="#00bfa5"
                          width="6"
                          x="13.5"
                          y="2.5"
                        ></rect>
                        <circle cx="8" cy="10" fill="#00bfa5" r="2"></circle>
                        <circle cx="15" cy="10" fill="#00bfa5" r="2"></circle>
                        <path
                          d="m6.7082481 6.7999878h-.7082481v-4.2275391h2.8488017v.5976563h-2.1405536v1.2978515h1.9603297v.5800782h-1.9603297zm2.6762505 0v-3.1904297h.6544972v.4892578h.0505892c.0980164-.3134765.4774351-.5419922.9264138-.5419922.0980165 0 .2276512.0087891.3003731.0263672v.6210938c-.053751-.0175782-.2624312-.038086-.3762568-.038086-.5122152 0-.8758247.3017578-.8758247.75v1.8837891zm3.608988-2.7158203c-.5027297 0-.8536919.328125-.8916338.8261719h1.7390022c-.0158092-.5009766-.3446386-.8261719-.8473684-.8261719zm.8442065 1.8544922h.6544972c-.1549293.571289-.7050863.9228515-1.49238.9228515-.9864885 0-1.5903965-.6269531-1.5903965-1.6464843 0-1.0195313.6165553-1.6669922 1.5872347-1.6669922.9580321 0 1.5366455.6064453 1.5366455 1.6083984v.2197266h-2.4314412v.0351562c.0221328.5595703.373095.9140625.9169284.9140625.4110369 0 .6924391-.1376953.8189119-.3867187zm2.6224996-1.8544922c-.5027297 0-.853692.328125-.8916339.8261719h1.7390022c-.0158091-.5009766-.3446386-.8261719-.8473683-.8261719zm.8442064 1.8544922h.6544972c-.1549293.571289-.7050863.9228515-1.49238.9228515-.9864885 0-1.5903965-.6269531-1.5903965-1.6464843 0-1.0195313.6165553-1.6669922 1.5872347-1.6669922.9580321 0 1.5366455.6064453 1.5366455 1.6083984v.2197266h-2.4314412v.0351562c.0221328.5595703.373095.9140625.9169284.9140625.4110369 0 .6924391-.1376953.8189119-.3867187z"
                          fill="#fff"
                        ></path>
                        <path d="m .5 8.5h3.5v1h-3.5z" fill="#00bfa5"></path>
                        <path d="m0 10.15674h3.5v1h-3.5z" fill="#00bfa5"></path>
                        <circle cx="8" cy="10" fill="#047565" r="1"></circle>
                        <circle cx="15" cy="10" fill="#047565" r="1"></circle>
                      </g>
                    </svg>
                    <span class="bXROAg">
                      Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí
                      vận chuyển bạn nhé!
                    </span>
                  </div>
                  <div class="BjIo5w">
                    <div class="mcsiKT">
                      <label
                        class={`stardust-checkbox${
                          purchaseAll ? " stardust-checkbox--checked" : ""
                        }`}
                      >
                        <input
                          onChange={handleCheckAll}
                          class="stardust-checkbox__input"
                          type="checkbox"
                          checked={purchaseAll ? true : false}
                        />
                        <div class="stardust-checkbox__box"></div>
                      </label>
                    </div>
                    <div class="yl931K">Sản Phẩm</div>
                    <div class="pZMZa7">Đơn Giá</div>
                    <div class="lKFOxX">Số Lượng</div>
                    <div class="_5f317z">Số Tiền</div>
                    <div class="+4E7yJ">Thao Tác</div>
                  </div>
                  {shopping_cart.map((item) => {
                    if (item.purchase) {
                      subtotal +=
                        item.quantity * (item.price - item.discounted_price);
                    }
                    let duplicated_colors = shopping_cart
                      .filter(
                        (cart_item) =>
                          cart_item.product_id === item.product_id &&
                          cart_item.id !== item.id
                      )
                      .map((item) => item.color);

                    return (
                      <div key={item.id} class="_48e0yS">
                        <div class="Eb+POp">
                          <div class="VPZ9zs">
                            <div class="zoXdNN">
                              <div class="lgcEHJ">
                                {/* stardust-checkbox--checked */}
                                <label
                                  class={`stardust-checkbox${
                                    item.purchase
                                      ? " stardust-checkbox--checked"
                                      : ""
                                  }`}
                                >
                                  <input
                                    onChange={() => {
                                      handleCheck(item.id);
                                    }}
                                    class="stardust-checkbox__input"
                                    type="checkbox"
                                  />
                                  <div class="stardust-checkbox__box"></div>
                                </label>
                              </div>
                              <div class="eUrDQm">
                                <div class="LAQKxn">
                                  <Link
                                    title={`${item.name}`}
                                    to={`/products/${item.slug}`}
                                  >
                                    <div
                                      class="WanNdG"
                                      style={{
                                        backgroundImage: `url(${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image})`,
                                      }}
                                    ></div>
                                  </Link>
                                  <div class="TyNN8t">
                                    <Link
                                      class="JB57cn"
                                      title={`${item.name}`}
                                      to={`/products/${item.slug}`}
                                    >
                                      {item.name}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              <div class="o7pJBk">
                                {item.hasOwnProperty("options") && (
                                  <div class="MBOFLv">
                                    <div
                                      onClick={() => {
                                        openModal(item.id);
                                      }}
                                      class="S-Rdfh"
                                      role="button"
                                      tabindex="0"
                                    >
                                      <div class="rcEQuz">
                                        Phân loại hàng:
                                        <button class="_75YZdf"></button>
                                      </div>
                                      {item.version && (
                                        <div class="dcPz7Y">
                                          <span style={{ fontWeight: "bold" }}>
                                            Phiên bản:
                                          </span>{" "}
                                          {item.version}
                                        </div>
                                      )}
                                      {item.color && (
                                        <div class="dcPz7Y">
                                          <span style={{ fontWeight: "bold" }}>
                                            Màu:
                                          </span>{" "}
                                          {item.color}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      {item.isUpdate && (
                                        <div class="k6euw5 shopee-modal__transition-enter-done">
                                          <div class="shopee-arrow-box__container">
                                            <div class="shopee-arrow-box__arrow shopee-arrow-box__arrow--center">
                                              <div class="shopee-arrow-box__arrow-outer">
                                                <div class="shopee-arrow-box__arrow-inner"></div>
                                              </div>
                                            </div>
                                            <div class="shopee-arrow-box__content">
                                              <div class="CGxlYZ">
                                                <div class="_5Nnpso">
                                                  {item.options.hasOwnProperty(
                                                    "versions"
                                                  ) && (
                                                    <div class="o0HTfE">
                                                      <div class="_08kYJL">
                                                        Phiên bản:
                                                      </div>
                                                      {item.options.versions.map(
                                                        (Item) => {
                                                          let duplicated_version = true;
                                                          for (
                                                            let i = 0;
                                                            i <
                                                            Item.colors.length;
                                                            i++
                                                          ) {
                                                            if (
                                                              !shopping_cart.find(
                                                                (item) =>
                                                                  item.product_id ===
                                                                    Item.product_id &&
                                                                  item.color ===
                                                                    Item.colors[
                                                                      i
                                                                    ].color_name
                                                              )
                                                            ) {
                                                              duplicated_version = false;
                                                            }
                                                          }
                                                          if (
                                                            duplicated_version &&
                                                            item.product_id !==
                                                              Item.product_id
                                                          ) {
                                                            return (
                                                              <button className="product-variation product-variation--disabled">
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    alignItems:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  <span>
                                                                    {
                                                                      Item.version_name
                                                                    }
                                                                  </span>
                                                                  <span>
                                                                    {new Intl.NumberFormat(
                                                                      {
                                                                        style:
                                                                          "currency",
                                                                      }
                                                                    ).format(
                                                                      Item.price
                                                                    )}
                                                                  </span>
                                                                </div>
                                                              </button>
                                                            );
                                                          } else {
                                                            return (
                                                              <button
                                                                onClick={
                                                                  handleUpdateVersion
                                                                }
                                                                class={`product-variation${
                                                                  Item.version_name ===
                                                                  item.version
                                                                    ? " product-variation--selected"
                                                                    : ""
                                                                }`}
                                                                aria-label="Trắng"
                                                                aria-disabled="false"
                                                                data-version={
                                                                  Item.version_name
                                                                }
                                                                data-item_id={
                                                                  item.id
                                                                }
                                                              >
                                                                <div
                                                                  style={{
                                                                    display:
                                                                      "flex",
                                                                    flexDirection:
                                                                      "column",
                                                                    alignItems:
                                                                      "center",
                                                                  }}
                                                                >
                                                                  <span>
                                                                    {
                                                                      Item.version_name
                                                                    }
                                                                  </span>
                                                                  <span>
                                                                    {new Intl.NumberFormat(
                                                                      {
                                                                        style:
                                                                          "currency",
                                                                      }
                                                                    ).format(
                                                                      Item.price
                                                                    )}
                                                                  </span>
                                                                </div>
                                                                {Item.version_name ===
                                                                  item.version && (
                                                                  <div class="product-variation__tick">
                                                                    <svg
                                                                      enable-background="new 0 0 12 12"
                                                                      viewBox="0 0 12 12"
                                                                      x="0"
                                                                      y="0"
                                                                      class="shopee-svg-icon icon-tick-bold"
                                                                    >
                                                                      <g>
                                                                        <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                                                                      </g>
                                                                    </svg>
                                                                  </div>
                                                                )}
                                                              </button>
                                                            );
                                                          }
                                                        }
                                                      )}
                                                    </div>
                                                  )}
                                                  {item.options.hasOwnProperty(
                                                    "colors"
                                                  ) && (
                                                    <div class="o0HTfE">
                                                      <div class="_08kYJL">
                                                        Màu:
                                                      </div>
                                                      {item.options.colors.map(
                                                        (Item) => {
                                                          if (
                                                            duplicated_colors.includes(
                                                              Item.color_name
                                                            )
                                                          ) {
                                                            return (
                                                              <button className="product-variation product-variation--disabled">
                                                                {
                                                                  Item.color_name
                                                                }
                                                              </button>
                                                            );
                                                          } else {
                                                            return (
                                                              <button
                                                                onClick={
                                                                  handleUpdateColor
                                                                }
                                                                class={`product-variation${
                                                                  Item.color_name ===
                                                                  item.color
                                                                    ? " product-variation--selected"
                                                                    : ""
                                                                }`}
                                                                aria-label="37"
                                                                aria-disabled="false"
                                                                data-color_name={
                                                                  Item.color_name
                                                                }
                                                                data-color={
                                                                  Item.color
                                                                }
                                                                data-item_id={
                                                                  item.id
                                                                }
                                                              >
                                                                {
                                                                  Item.color_name
                                                                }
                                                                {Item.color_name ===
                                                                  item.color && (
                                                                  <div class="product-variation__tick">
                                                                    <svg
                                                                      enable-background="new 0 0 12 12"
                                                                      viewBox="0 0 12 12"
                                                                      x="0"
                                                                      y="0"
                                                                      class="shopee-svg-icon icon-tick-bold"
                                                                    >
                                                                      <g>
                                                                        <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                                                                      </g>
                                                                    </svg>
                                                                  </div>
                                                                )}
                                                              </button>
                                                            );
                                                          }
                                                        }
                                                      )}
                                                    </div>
                                                  )}

                                                  <div class="u2ASRs">
                                                    <button
                                                      onClick={() => {
                                                        handleCancelUpdate(
                                                          item.id
                                                        );
                                                      }}
                                                      class="cancel-btn"
                                                    >
                                                      Trở Lại
                                                    </button>
                                                    <button
                                                      onClick={() => {
                                                        handleUpdateItem(
                                                          item.id
                                                        );
                                                      }}
                                                      class="shopee-button-solid shopee-button-solid--primary"
                                                    >
                                                      Xác nhận
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div class="G7E4B7">
                                <div>
                                  {item.discounted_price > 0 ? (
                                    <>
                                      <span class="M-AAFK vWt6ZL">
                                        ₫
                                        {new Intl.NumberFormat({
                                          style: "currency",
                                        }).format(item.price)}
                                      </span>
                                      <span class="M-AAFK">
                                        ₫
                                        {new Intl.NumberFormat({
                                          style: "currency",
                                        }).format(
                                          item.price - item.discounted_price
                                        )}
                                      </span>
                                    </>
                                  ) : (
                                    <span class="M-AAFK">
                                      ₫
                                      {new Intl.NumberFormat({
                                        style: "currency",
                                      }).format(item.price)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div class="MRh9G6">
                                <div class="mXmGu+ shopee-input-quantity">
                                  <button
                                    onClick={() => {
                                      handleDecrease(item.id);
                                    }}
                                    class="mJX7hG"
                                    style={
                                      item.quantity === 1
                                        ? {
                                            pointerEvents: "none",
                                            opacity: "0.5",
                                          }
                                        : {}
                                    }
                                  >
                                    <svg
                                      enable-background="new 0 0 10 10"
                                      viewBox="0 0 10 10"
                                      x="0"
                                      y="0"
                                      class="shopee-svg-icon"
                                    >
                                      <polygon points="4.5 4.5 3.5 4.5 0 4.5 0 5.5 3.5 5.5 4.5 5.5 10 5.5 10 4.5"></polygon>
                                    </svg>
                                  </button>
                                  <input
                                    readOnly
                                    value={item.quantity}
                                    class="mJX7hG _8BP9GU"
                                    type="text"
                                    role="spinbutton"
                                    aria-valuenow="1"
                                    id={"quantity_" + item.id}
                                  />
                                  <button
                                    onClick={() => {
                                      handleIncrease(item.id);
                                    }}
                                    class="mJX7hG"
                                  >
                                    <svg
                                      enable-background="new 0 0 10 10"
                                      viewBox="0 0 10 10"
                                      x="0"
                                      y="0"
                                      class="shopee-svg-icon icon-plus-sign"
                                    >
                                      <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"></polygon>
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div class="ofQLuG">
                                <span>
                                  ₫
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(
                                    item.quantity *
                                      (item.price - item.discounted_price)
                                  )}
                                </span>
                              </div>
                              <div class="mhcjog _0p-F-m">
                                <button
                                  onClick={() => {
                                    handleDelete(item.id);
                                  }}
                                  style={{ color: "black" }}
                                  class="fX1Y2g"
                                >
                                  Xóa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div class="rnocow">
                  <div class="exGqmz WjgNv5">
                    <svg
                      fill="none"
                      viewBox="0 -2 23 22"
                      class="shopee-svg-icon icon-voucher-line"
                    >
                      <g filter="url(#voucher-filter0_d)">
                        <mask id="a" fill="#fff">
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1 2h18v2.32a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75V16H1v-2.12a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75V2z"
                          ></path>
                        </mask>
                        <path
                          d="M19 2h1V1h-1v1zM1 2V1H0v1h1zm18 2.32l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zM19 16v1h1v-1h-1zM1 16H0v1h1v-1zm0-2.12l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zM19 1H1v2h18V1zm1 3.32V2h-2v2.32h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zM20 16v-2.13h-2V16h2zM1 17h18v-2H1v2zm-1-3.12V16h2v-2.12H0zm1.4.91a2.5 2.5 0 001.5-2.29h-2a.5.5 0 01-.3.46l.8 1.83zm1.5-2.29a2.5 2.5 0 00-1.5-2.3l-.8 1.84c.18.08.3.26.3.46h2zM0 10.48v.65h2v-.65H0zM.9 9.1a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 9.1h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 8.65zM0 7.08v.65h2v-.65H0zM.9 5.7a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 5.7h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 5.25zM0 2v2.33h2V2H0z"
                          mask="url(#a)"
                        ></path>
                      </g>
                      <path
                        clip-rule="evenodd"
                        d="M6.49 14.18h.86v-1.6h-.86v1.6zM6.49 11.18h.86v-1.6h-.86v1.6zM6.49 8.18h.86v-1.6h-.86v1.6zM6.49 5.18h.86v-1.6h-.86v1.6z"
                      ></path>
                      <defs>
                        <filter
                          id="voucher-filter0_d"
                          x="0"
                          y="1"
                          width="20"
                          height="16"
                          filterUnits="userSpaceOnUse"
                          color-interpolation-filters="sRGB"
                        >
                          <feFlood
                            flood-opacity="0"
                            result="BackgroundImageFix"
                          ></feFlood>
                          <feColorMatrix
                            in="SourceAlpha"
                            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                          ></feColorMatrix>
                          <feOffset></feOffset>
                          <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"></feColorMatrix>
                          <feBlend
                            in2="BackgroundImageFix"
                            result="effect1_dropShadow"
                          ></feBlend>
                          <feBlend
                            in="SourceGraphic"
                            in2="effect1_dropShadow"
                            result="shape"
                          ></feBlend>
                        </filter>
                      </defs>
                    </svg>
                    <div class="C9vN6U">Mã giảm giá</div>
                    <div class="GdUwdD"></div>
                    <span onClick={() => setCouponPopup(true)} class="ORcGEd">
                      Chọn mã
                    </span>
                  </div>
                  {(chosenCoupon || chosenFreeShip) && (
                    <div style={{ justifyContent: "flex-end" }} class="exGqmz">
                      <div style={{ marginRight: "1.875rem" }} class="C9vN6U">
                        {chosenCoupon && (
                          <span class="choosen_vc">
                            - ₫
                            {new Intl.NumberFormat({
                              style: "currency",
                            }).format(
                              chosenCoupon.type === "fixed"
                                ? chosenCoupon.amount
                                : subtotal * (chosenCoupon.amount / 100) >
                                  chosenCoupon.maximum_discount
                                ? chosenCoupon.maximum_discount
                                : subtotal * (chosenCoupon.amount / 100)
                            )}
                          </span>
                        )}

                        {chosenFreeShip && (
                          <span class="free_ship">Giảm Phí Vận Chuyển</span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* <div class="h-Ivjs _1Xi-wS"></div> */}
                  <div class="h-Ivjs ivEpTY"></div>
                  <div class="s1Gxkq c2pfrq">
                    <div class="wqjloc">
                      <label
                        class={`stardust-checkbox${
                          purchaseAll ? " stardust-checkbox--checked" : ""
                        }`}
                      >
                        <input
                          onChange={handleCheckAll}
                          class="stardust-checkbox__input"
                          type="checkbox"
                          checked={purchaseAll ? true : false}
                        />
                        <div class="stardust-checkbox__box"></div>
                      </label>
                    </div>
                    <button
                      data-check_all={purchaseAll ? true : false}
                      onClick={(e) => {
                        if (e.target.dataset.check_all === "true") {
                          setPurchaseAll(false);
                          setShoppingCart((prev) => {
                            return [...prev].map((item) => {
                              item.purchase = false;
                              return item;
                            });
                          });
                        } else if (e.target.dataset.check_all === "false") {
                          setPurchaseAll(true);
                          setShoppingCart((prev) => {
                            return [...prev].map((item) => {
                              item.purchase = true;
                              return item;
                            });
                          });
                        }
                      }}
                      class="iGlIrs clear-btn-style"
                    >
                      Chọn Tất Cả ({shopping_cart.length})
                    </button>
                    <button
                      onClick={handleDeleteItems}
                      class="clear-btn-style ukPYq9"
                    >
                      Xóa
                    </button>
                    <div class=""></div>
                    <div class="UlxAss"></div>
                    <div class="UQv8V6">
                      <div class="fyYBP1">
                        <div class="aiyQAr">
                          <div class="A-CcKC">
                            Tổng thanh toán (
                            {
                              shopping_cart.filter((item) => item.purchase)
                                .length
                            }{" "}
                            Sản phẩm):
                          </div>
                          <div class="WC0us+">
                            ₫
                            {new Intl.NumberFormat({
                              style: "currency",
                            }).format(
                              chosenCoupon
                                ? chosenCoupon.type === "fixed"
                                  ? subtotal - chosenCoupon.amount
                                  : subtotal * (chosenCoupon.amount / 100) >
                                    chosenCoupon.maximum_discount
                                  ? subtotal - chosenCoupon.maximum_discount
                                  : subtotal -
                                    subtotal * (chosenCoupon.amount / 100)
                                : subtotal
                            )}
                          </div>
                        </div>
                      </div>
                      <div class="onR5FG"></div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      class="shopee-button-solid shopee-button-solid--primary"
                    >
                      <span class="TTXpRG">Mua hàng</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="clear"></div>
          </div>
        </>
      )}
    </section>
  );
};

export default ShoppingCart;
