import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./OrderHistory.css";
import Popup from "../popup/Popup";
import Loader from "../loader/Loader";
import { AppStoreContext } from "../../provider/AppStoreProvider";

const OrderHistory = () => {
  const [popup, setPopup] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchParams] = useSearchParams();
  const { setShoppingCart, countOrders, setCountOrders } =
    useContext(AppStoreContext);
  const [status, setStatus] = useState(
    searchParams.get("status") ? searchParams.get("status") : "0"
  );
  const navigate = useNavigate();
  const [orders, setOrders] = useState({});
  const status_list = [
    { status_code: 1, status: "Chờ xác nhận" },
    { status_code: 2, status: "Chờ lấy hàng" },
    { status_code: 3, status: "Đang giao" },
    { status_code: 4, status: "Đã giao" },
    { status_code: 7, status: "Đã hủy" },
  ];
  useEffect(() => {
    switch (status) {
      case "0":
        if (!orders[0]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?status=0`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            })
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 0: res.data };
              });
            });
        }
        break;
      case "1":
        if (!orders[1]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?status=1`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            })
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 1: res.data };
              });
            });
        }
        break;
      case "2":
        if (!orders[2]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?status=2`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            })
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 2: res.data };
              });
            });
        }
        break;
      case "3":
        if (!orders[3]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?status=3`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            })
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 3: res.data };
              });
            });
        }
        break;
      case "4":
        if (!orders[4]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?status=4`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            })
            .then((res) => {
              console.log(res.data);
              setOrders((prev) => {
                return { ...prev, 4: res.data };
              });
            });
        }
        break;
      case "7":
        if (!orders[7]) {
          axios
            .get(`${process.env.REACT_APP_API_ENDPOINT}/orders?status=7`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            })
            .then((res) => {
              setOrders((prev) => {
                return { ...prev, 7: res.data };
              });
            });
        }
        break;
      default:
        setStatus("0");
    }
    document.querySelector("#block_nav_primary").style.position = "relative";
    return () => {
      document.querySelector("#block_nav_primary").style.position = "sticky";
    };
  }, [status]);

  const handleCancelOrder = (order_id) => {
    setProcessing(true);
    setPopup();
    axios
      .put(
        `${process.env.REACT_APP_API_ENDPOINT}/orders/${order_id}?order_cancel`,
        {
          canceled_by: "0",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then(() => {
        setProcessing(false);
        setCountOrders((prev) => {
          return { ...prev, status_1: countOrders.status_1 - 1 };
        });
        let order_canceled;
        let updated_orders = orders[status].filter((item) => {
          if (item.order.id !== order_id) {
            return true;
          } else {
            order_canceled = item;
            order_canceled.order.status = 7;
            return false;
          }
        });

        if (status == 0) {
          if (orders[1]) {
            let updated_orders = orders[1].filter(
              (item) => item.order.id !== order_id
            );
            setOrders((prev) => {
              return { ...prev, 1: updated_orders };
            });
          }
        } else {
          if (orders[0]) {
            let updated_orders = orders[status].filter(
              (item) => item.order.id !== order_id
            );
            setOrders((prev) => {
              return { ...prev, 0: updated_orders };
            });
          }
        }

        setOrders((prev) => {
          if (orders[7]) {
            return {
              ...prev,
              [status]: updated_orders,
              7: [order_canceled, ...orders[7]],
            };
          } else {
            return {
              ...prev,
              [status]: updated_orders,
            };
          }
        });
      });
  };

  const handleReBuy = (order_details) => {
    console.log(order_details);
    const post_reqs = [];
    order_details.forEach((item) => {
      let data = {
        product_id: item.product_id,
        image: item.image,
      };
      if (item.color_id) {
        data.color_id = item.color_id;
      }
      if (item.version != "") {
        data.version = item.version;
      }
      post_reqs.push(
        axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/shopping_cart`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        )
      );
    });
    setProcessing(true);
    axios
      .all(post_reqs)
      .then(
        axios.spread((...responses) => {
          setProcessing(false);
          responses.forEach((res) => {
            setShoppingCart((prev) => {
              if (res.data.new) {
                let item = {
                  ...res.data.cart_item,
                  name: res.data.product.name,
                  slug: res.data.product.slug,
                  price: res.data.product.price,
                  discounted_price: res.data.product.discounted_price,
                  isUpdate: false,
                  purchase: true,
                };
                if (res.data.hasOwnProperty("options")) {
                  item.options = res.data.options;
                }
                return [...prev, item];
              } else {
                return [...prev].map((item) => {
                  if (item.id === res.data.cart_item.id) {
                    item.quantity = res.data.cart_item.quantity;
                    return item;
                  } else {
                    return item;
                  }
                });
              }
            });
          });
          navigate("/cart");
        })
      )
      .catch((err) => {
        setProcessing(false);
      });
  };

  return (
    <div class="--tO6n">
      {processing && <Loader />}
      {popup && <Popup {...popup} />}
      <div></div>
      <div class="VYJdTQ">
        <Link
          onClick={() => setStatus("0")}
          class={`OFl2GI${status == 0 ? " gAImis " : ""}`}
          to={`?status=0`}
        >
          <span class="_20hgQK">Tất cả</span>
        </Link>
        <Link
          onClick={() => setStatus("1")}
          class={`OFl2GI${status == 1 ? " gAImis " : ""}`}
          to={`?status=1`}
        >
          <span class="_20hgQK">Chờ xác nhận</span>
          {countOrders && countOrders.status_1 > 0 && (
            <span class="fSW3m4">({countOrders.status_1})</span>
          )}
        </Link>
        <Link
          onClick={() => setStatus("2")}
          class={`OFl2GI${status == 2 ? " gAImis " : ""}`}
          to={`?status=2`}
        >
          <span class="_20hgQK">Chờ lấy hàng</span>
          {countOrders && countOrders.status_2 > 0 && (
            <span class="fSW3m4">({countOrders.status_2})</span>
          )}
        </Link>
        <Link
          onClick={() => setStatus("3")}
          class={`OFl2GI${status == 3 ? " gAImis " : ""}`}
          to={`?status=3`}
        >
          <span class="_20hgQK">Đang giao</span>
          {countOrders && countOrders.status_3 > 0 && (
            <span class="fSW3m4">({countOrders.status_3})</span>
          )}
        </Link>
        <Link
          onClick={() => setStatus("4")}
          class={`OFl2GI${status == 4 ? " gAImis " : ""}`}
          to={`?status=4`}
        >
          <span class="_20hgQK">Đã giao</span>
        </Link>
        <Link
          onClick={() => setStatus("7")}
          class={`OFl2GI${status == 7 ? " gAImis " : ""}`}
          to={`?status=7`}
        >
          <span class="_20hgQK">Đã hủy</span>
        </Link>
      </div>
      <div></div>
      {orders[status] ? (
        orders[status].length > 0 ? (
          <>
            <div>
              {orders[status].map((item) => {
                const coupons = JSON.parse(item.order.coupons);
                return (
                  <div class="hiXKxx">
                    <div>
                      <div class="x0QT2k">
                        <div class="KrPQEI">
                          <div class="EQko8g">
                            <div class="V+w7Xs">
                              {
                                status_list.find(
                                  (Item) =>
                                    Item.status_code == item.order.status
                                ).status
                              }
                            </div>
                            {(status == 1 ||
                              (status == 0 && item.order.status == 1)) &&
                              item.order.pttt === "vnpay" && (
                                <div class="PF0-AU">
                                  <button
                                    onClick={() => {
                                      window.location.href =
                                        item.order.repay_link;
                                    }}
                                    class="stardust-button stardust-button--primary WgYvse"
                                  >
                                    Thanh toán lại
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                        <div class="FycaKn"></div>
                        <Link to={`/account/order/${item.order.id}`}>
                          <div class="_0OiaZ-">
                            {item.order_details.map((item) => {
                              return (
                                <div class="FbLutl">
                                  <div>
                                    <span class="x7nENX">
                                      <div></div>
                                      <div class="aybVBK">
                                        <div class="rGP9Yd">
                                          <div class="shopee-image__wrapper">
                                            <div class="shopee-image__place-holder">
                                              <svg
                                                enable-background="new 0 0 15 15"
                                                viewBox="0 0 15 15"
                                                x="0"
                                                y="0"
                                                class="shopee-svg-icon icon-loading-image"
                                              >
                                                <g>
                                                  <rect
                                                    fill="none"
                                                    height="8"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    width="10"
                                                    x="1"
                                                    y="4.5"
                                                  ></rect>
                                                  <line
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    x1="1"
                                                    x2="11"
                                                    y1="6.5"
                                                    y2="6.5"
                                                  ></line>
                                                  <rect
                                                    fill="none"
                                                    height="3"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    width="3"
                                                    x="11"
                                                    y="6.5"
                                                  ></rect>
                                                  <line
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    x1="1"
                                                    x2="11"
                                                    y1="14.5"
                                                    y2="14.5"
                                                  ></line>
                                                  <line
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    x1="6"
                                                    x2="6"
                                                    y1=".5"
                                                    y2="3"
                                                  ></line>
                                                  <line
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    x1="3.5"
                                                    x2="3.5"
                                                    y1="1"
                                                    y2="3"
                                                  ></line>
                                                  <line
                                                    fill="none"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-miterlimit="10"
                                                    x1="8.5"
                                                    x2="8.5"
                                                    y1="1"
                                                    y2="3"
                                                  ></line>
                                                </g>
                                              </svg>
                                            </div>
                                            <div
                                              class="shopee-image__content"
                                              style={{
                                                backgroundImage: `url("${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}")`,
                                              }}
                                            >
                                              <div class="shopee-image__content--blur"></div>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="_7uZf6Q">
                                          <div>
                                            <div class="iJlxsT">
                                              <span class="x5GTyN">
                                                {item.name}
                                              </span>
                                            </div>
                                          </div>
                                          <div>
                                            <div class="vb0b-P">
                                              Phân loại hàng: {item.color}
                                            </div>
                                            <div class="_3F1-5M">
                                              x{item.quantity}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="_9UJGhr">
                                        <div>
                                          {item.discounted_price > 0 ? (
                                            <>
                                              <span class="j2En5+">
                                                ₫
                                                {new Intl.NumberFormat({
                                                  style: "currency",
                                                }).format(item.price)}
                                              </span>
                                              <span class="-x3Dqh OkfGBc">
                                                ₫
                                                {new Intl.NumberFormat({
                                                  style: "currency",
                                                }).format(
                                                  item.price -
                                                    item.discounted_price
                                                )}
                                              </span>
                                            </>
                                          ) : (
                                            <span class="-x3Dqh OkfGBc">
                                              ₫
                                              {new Intl.NumberFormat({
                                                style: "currency",
                                              }).format(item.price)}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </span>
                                  </div>
                                  <div class="Cde7Oe"></div>
                                </div>
                              );
                            })}
                          </div>
                        </Link>
                        <div class="B8+ewx"></div>
                      </div>
                    </div>
                    <div class="O2KPzo">
                      <div class="mn7INg xFSVYg"> </div>
                      <div class="mn7INg EfbgJE"> </div>
                    </div>
                    <div class="kvXy0c">
                      <div class="-78s2g">
                        <span class="JMmT2C">
                          <div class="IlORNJ">
                            <svg
                              width="16"
                              height="17"
                              viewBox="0 0 253 263"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M126.5 0.389801C126.5 0.389801 82.61 27.8998 5.75 26.8598C5.08763 26.8507 4.43006 26.9733 3.81548 27.2205C3.20091 27.4677 2.64159 27.8346 2.17 28.2998C1.69998 28.7657 1.32713 29.3203 1.07307 29.9314C0.819019 30.5425 0.688805 31.198 0.689995 31.8598V106.97C0.687073 131.07 6.77532 154.78 18.3892 175.898C30.003 197.015 46.7657 214.855 67.12 227.76L118.47 260.28C120.872 261.802 123.657 262.61 126.5 262.61C129.343 262.61 132.128 261.802 134.53 260.28L185.88 227.73C206.234 214.825 222.997 196.985 234.611 175.868C246.225 154.75 252.313 131.04 252.31 106.94V31.8598C252.31 31.1973 252.178 30.5414 251.922 29.9303C251.667 29.3191 251.292 28.7649 250.82 28.2998C250.35 27.8358 249.792 27.4696 249.179 27.2225C248.566 26.9753 247.911 26.852 247.25 26.8598C170.39 27.8998 126.5 0.389801 126.5 0.389801Z"
                                fill="#041e3a"
                              ></path>
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M207.7 149.66L119.61 107.03C116.386 105.472 113.914 102.697 112.736 99.3154C111.558 95.9342 111.772 92.2235 113.33 88.9998C114.888 85.7761 117.663 83.3034 121.044 82.1257C124.426 80.948 128.136 81.1617 131.36 82.7198L215.43 123.38C215.7 120.38 215.85 117.38 215.85 114.31V61.0298C215.848 60.5592 215.753 60.0936 215.57 59.6598C215.393 59.2232 215.128 58.8281 214.79 58.4998C214.457 58.1705 214.063 57.909 213.63 57.7298C213.194 57.5576 212.729 57.4727 212.26 57.4798C157.69 58.2298 126.5 38.6798 126.5 38.6798C126.5 38.6798 95.31 58.2298 40.71 57.4798C40.2401 57.4732 39.7735 57.5602 39.3376 57.7357C38.9017 57.9113 38.5051 58.1719 38.1709 58.5023C37.8367 58.8328 37.5717 59.2264 37.3913 59.6604C37.2108 60.0943 37.1186 60.5599 37.12 61.0298V108.03L118.84 147.57C121.591 148.902 123.808 151.128 125.129 153.884C126.45 156.64 126.797 159.762 126.113 162.741C125.429 165.72 123.755 168.378 121.363 170.282C118.972 172.185 116.006 173.221 112.95 173.22C110.919 173.221 108.915 172.76 107.09 171.87L40.24 139.48C46.6407 164.573 62.3785 186.277 84.24 200.16L124.49 225.7C125.061 226.053 125.719 226.24 126.39 226.24C127.061 226.24 127.719 226.053 128.29 225.7L168.57 200.16C187.187 188.399 201.464 170.892 209.24 150.29C208.715 150.11 208.2 149.9 207.7 149.66Z"
                                fill="#fff"
                              ></path>
                            </svg>
                          </div>
                        </span>
                        <div class="_0NMXyN">Thành tiền:</div>
                        <div class="DeWpya">
                          ₫
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(
                            item.order.subtotal +
                              item.order.shipping_fee -
                              (coupons && coupons.hasOwnProperty("coupon")
                                ? coupons.coupon.type === "fixed"
                                  ? coupons.coupon.amount
                                  : item.order.subtotal *
                                      (coupons.coupon.amount / 100) >
                                    coupons.coupon.maximum_discount
                                  ? coupons.coupon.maximum_discount
                                  : item.order.subtotal *
                                    (coupons.coupon.amount / 100)
                                : 0) -
                              (coupons && coupons.hasOwnProperty("free_ship")
                                ? coupons.free_ship.type === "fixed"
                                  ? coupons.free_ship.amount
                                  : coupons.free_ship.type === "percent"
                                  ? item.order.shipping_fee *
                                      (coupons.free_ship.amount / 100) >
                                    coupons.free_ship.maximum_discount
                                    ? coupons.free_ship.maximum_discount
                                    : item.order.shipping_fee *
                                      (coupons.free_ship.amount / 100)
                                  : item.order.shipping_fee
                                : 0)
                          )}
                        </div>
                      </div>
                    </div>
                    {item.order.status == 1 && (
                      <div class="AM4Cxf">
                        <div class="qtUncs">
                          <span></span>
                        </div>
                        <div class="EOjXew">
                          <div class="PgtIur">
                            <button
                              onClick={() => {
                                setPopup({
                                  message: "Bạn thực sự muốn hủy đơn hàng này?",
                                  action: () => {
                                    handleCancelOrder(item.order.id);
                                  },
                                  cancel: () => {
                                    setPopup(null);
                                  },
                                  btn2: "Xác nhận",
                                  btn1: "Trở về",
                                });
                              }}
                              class="stardust-button stardust-button--secondary WgYvse"
                            >
                              Hủy đơn
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    {(item.order.status == 7 || item.order.status == 4) && (
                      <div class="AM4Cxf">
                        <div class="qtUncs">
                          {item.order.status == 7 && (
                            <span>
                              {item.order.canceled_by == 0
                                ? "Đã hủy bởi bạn"
                                : "Đã hủy bởi người bán"}
                            </span>
                          )}
                        </div>
                        <div class="EOjXew">
                          <div class="PgtIur">
                            <button
                              onClick={() => handleReBuy(item.order_details)}
                              class="stardust-button stardust-button--primary WgYvse"
                            >
                              Mua lại
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div class="vFPgNG">
            <div class="FK6kaK">
              <div
                class="bi4dk5"
                style={{
                  backgroundImage:
                    "url(/images/5fafbb923393b712b96488590b8f781f.png)",
                }}
              ></div>
              <div class="dYtuu1">Chưa có đơn hàng</div>
            </div>
          </div>
        )
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default OrderHistory;
