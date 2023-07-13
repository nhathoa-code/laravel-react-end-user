import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, Navigate } from "react-router-dom";
import Loader from "../loader/Loader";
import Popup from "../popup/Popup";
import axios from "axios";
import "./OrderDetail.css";

const OrderDetail = () => {
  let subtotal = 0;
  const { id } = useParams("id");
  const [order, setOrder] = useState(null);
  const [coupons, setCoupons] = useState(null);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [reviewedProduct, setReviewProduct] = useState(null);
  const [imagesReview, setImagesReview] = useState([]);
  const [star, setStar] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const pttt = {
    vnpay: "Thanh toán online qua VNPay",
    cod: "Thanh toán khi nhận hàng",
  };

  useEffect(() => {
    if (order) {
      document
        .querySelector(".order-detail .modal-review-content")
        .addEventListener("transitionend", function (e) {
          if (!e.target.classList.contains("active")) {
            document
              .querySelector(".order-detail .modal-review")
              .classList.remove("is-active");
            e.target.style.overFlow = "hidden";
          } else {
            e.target.style.overFlow = "auto";
          }
        });
    }
  }, [order]);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/orders/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrder(res.data);
        if (res.data.order.coupons) {
          setCoupons(JSON.parse(res.data.order.coupons));
        }
        setBuyerInfo(JSON.parse(res.data.order.buyer_info));
      });
  }, []);

  const confirmEvaluate = (product_id) => {
    if (
      star === 0 ||
      document.querySelector(".comment-input").value.length < 20
    ) {
      return setPopup({
        message:
          "Vui lòng chọn đánh giá và nhập nội dung đánh giá(lớn hơn 20 ký tự)",
        action: () => {
          setPopup(null);
        },
        cancel: () => {},
        btn2: "Đóng",
      });
    }
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("star", star);
    formData.append("content", document.querySelector(".comment-input").value);
    if (imagesReview.length > 0) {
      for (let i = 0; i < imagesReview.length; i++) {
        formData.append("review_images[]", imagesReview[i]);
      }
    }
    setProcessing(true);
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/reviews_to_prove`, formData)
      .then((res) => {
        console.log(res.data);
        setProcessing(false);
        setPopup({
          message:
            "Cám ơn bạn đã đánh giá sản phẩm. Đánh giá của bạn sẽ được kiểm duyệt trước khi hiển thị",
          action: () => {
            setPopup(null);
          },
          cancel: () => {},
          btn2: "Đóng",
        });
        document
          .querySelector(".order-detail .modal-review-content")
          .classList.remove("active");
        setImagesReview([]);
        document.querySelector("#image").value = "";
      });
  };

  const previewImages = (e) => {
    let allowed_images = imagesReview.length;
    if (imagesReview.length > 7) {
      return alert("Bạn chỉ được tải tối đa 7 ảnh");
    }
    let files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      if (allowed_images + (i + 1) > 7) {
        alert("Bạn chỉ được tải tối đa 7 ảnh");
        break;
      }
      setImagesReview((prev) => {
        return [...prev, files[i]];
      });
    }
  };

  const removePreviewImage = (Index) => {
    setImagesReview((prev) => {
      return [...prev].filter((item, index) => index !== Index);
    });
  };

  const Evaluate = (star) => {
    setStar(star);
  };

  const handleOpenModal = (id) => {
    setStar(0);
    setImagesReview([]);
    document.querySelector("#image").value = "";
    document.querySelector(".comment-input").value = "";
    setReviewProduct(order.order_details.find((item) => item.id === id));
    document
      .querySelector(".order-detail .modal-review")
      .classList.add("is-active");
    setTimeout(() => {
      document
        .querySelector(".order-detail .modal-review-content")
        .classList.add("active");
    }, 1);
  };

  const handleCloseModal = () => {
    document
      .querySelector(".order-detail .modal-review-content")
      .classList.remove("active");
  };

  return (
    <>
      <div style={{ position: "relative" }} className="order-detail">
        {order ? (
          <>
            {popup && <Popup {...popup} />}
            <div class="cps-right-col">
              <div class="cps-detail-order-page">
                <div class="cps-order-detail-mobile">
                  <div class="bg-order-detail"></div>
                  <div class="top-nav-bar">
                    <div class="navbar-container is-flex is-align-items-center">
                      <div onClick={() => navigate(-1)}>
                        <div data-v-5170e23d="" class="icon-cps">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                          >
                            <path d="M447.1 256C447.1 273.7 433.7 288 416 288H109.3l105.4 105.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L109.3 224H416C433.7 224 447.1 238.3 447.1 256z"></path>
                          </svg>
                        </div>
                      </div>{" "}
                      <div class="nav-bar__title">Chi tiết đơn hàng</div>
                    </div>
                  </div>
                  <div class="cps-container">
                    <div class="block-order-detail">
                      <div class="order-detail__code">
                        <p class="code__name">
                          Mã đơn hàng: {order.order.id} - {order.order.status}
                        </p>
                        <p class="code__time">{order.order.created_at}</p>
                      </div>
                      <div class="order-detail__products">
                        <div class="mbaGbp">
                          {order.order_details.map((item) => {
                            subtotal +=
                              (item.price - item.discounted_price) *
                              item.quantity;
                            return (
                              <div class="hiXKxx">
                                <div>
                                  <div class="x0QT2k">
                                    <div class="FycaKn"></div>
                                    <a href="javascript:void(0)">
                                      <div class="_0OiaZ-">
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
                                                      <div class="shopee-image__content--blur">
                                                        {" "}
                                                      </div>
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
                                                      {item.color}
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
                                      </div>
                                    </a>
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
                                        (item.price - item.discounted_price) *
                                          item.quantity
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {order.order.status === "Hoàn thành" && (
                                  <div class="AM4Cxf">
                                    <div class="qtUncs">
                                      {/* <span>Không nhận được đánh giá</span> */}
                                    </div>
                                    <div class="EOjXew">
                                      <div class="PF0-AU">
                                        <button
                                          onClick={() => {
                                            handleOpenModal(item.id);
                                          }}
                                          class="stardust-button stardust-button--primary WgYvse"
                                        >
                                          Đánh giá
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div class="order-detail__shipping-status">
                        <div class="line-through">
                          <hr />
                        </div>
                        <div class="shipping-status__detail">
                          <div class="detail__title">Chi tiết thời gian:</div>
                          {order.order_tracker.map((item, index) => {
                            let last_index = order.order_tracker.length - 1;
                            let arr = item.created_at.split(" ");
                            let date = arr[0];
                            let time = arr[1];
                            return (
                              <div class="detail__item is-flex is-justify-content-space-between">
                                <div class="item__content is-flex">
                                  <div
                                    data-v-5170e23d=""
                                    class={`cps-icon active${
                                      index === last_index ? " last-status" : ""
                                    }`}
                                  >
                                    <svg
                                      width="30"
                                      height="30"
                                      viewBox="0 0 30 30"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M27.5 15C27.5 8.09644 21.9036 2.5 15 2.5C8.09644 2.5 2.5 8.09644 2.5 15C2.5 21.9036 8.09644 27.5 15 27.5C21.9036 27.5 27.5 21.9036 27.5 15Z"
                                        stroke="#26aa99"
                                        stroke-width="1.5"
                                      ></path>
                                      <path
                                        d="M20 15C20 12.2386 17.7614 10 15 10C12.2386 10 10 12.2386 10 15C10 17.7614 12.2386 20 15 20C17.7614 20 20 17.7614 20 15Z"
                                        fill="#26aa99"
                                        stroke="#26aa99"
                                      ></path>
                                    </svg>
                                  </div>
                                  <div class="content__text">
                                    {item.message}
                                  </div>
                                </div>
                                <div class="item__time is-flex is-flex-direction-column">
                                  <div class="date">{date}</div>
                                  <div class="time">{time}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div class="order-detail__payment-info">
                        <div class="payment-info">
                          <div class="payment-info__title is-flex is-align-items-center">
                            <p class="title__text">Thông tin đơn hàng</p>
                          </div>{" "}
                          <div class="RZJjTX">
                            <div class="TokOv1">
                              <div class="_8kMYJ3">
                                <span>Tổng tiền hàng</span>
                              </div>
                              <div class="CxyZBG">
                                <div>
                                  ₫
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(subtotal)}
                                </div>
                              </div>
                            </div>
                            <div class="TokOv1">
                              <div class="_8kMYJ3">
                                <span>Phí vận chuyển</span>
                              </div>
                              <div class="CxyZBG">
                                <div>
                                  ₫
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(order.order.shipping_fee)}
                                </div>
                              </div>
                            </div>
                            {coupons && (
                              <>
                                {coupons &&
                                  coupons.hasOwnProperty("free_ship") && (
                                    <>
                                      <div class="TokOv1">
                                        <div class="_8kMYJ3">
                                          <span>Giảm giá vận chuyển</span>
                                        </div>
                                        <div class="CxyZBG">
                                          <div>
                                            - ₫
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              coupons.free_ship.type === "fixed"
                                                ? coupons.free_ship.amount
                                                : coupons.free_ship.type ===
                                                  "percent"
                                                ? order.order.shipping_fee *
                                                    (coupons.free_ship.amount /
                                                      100) >
                                                  coupons.free_ship
                                                    .maximum_discount
                                                  ? coupons.free_ship
                                                      .maximum_discount
                                                  : order.order.shipping_fee *
                                                    (coupons.free_ship.amount /
                                                      100)
                                                : new Intl.NumberFormat({
                                                    style: "currency",
                                                  }).format(
                                                    order.order.shipping_fee
                                                  )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                {coupons &&
                                  coupons.hasOwnProperty("coupon") && (
                                    <>
                                      <div class="TokOv1">
                                        <div class="_8kMYJ3">
                                          <span>Mã giảm giá</span>
                                        </div>
                                        <div class="CxyZBG">
                                          <div>
                                            - ₫
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              coupons.coupon.type === "fixed"
                                                ? coupons.coupon.amount
                                                : subtotal *
                                                    (coupons.coupon.amount /
                                                      100) >
                                                  coupons.coupon
                                                    .maximum_discount
                                                ? coupons.coupon
                                                    .maximum_discount
                                                : subtotal *
                                                  (coupons.coupon.amount / 100)
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                              </>
                            )}

                            <div class="TokOv1 a59vwO">
                              <div class="_8kMYJ3 B6pCRN">
                                <span>Thành tiền</span>
                              </div>
                              <div class="CxyZBG">
                                <div class="_8ZGgbl">
                                  ₫
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(
                                    subtotal +
                                      order.order.shipping_fee -
                                      (coupons &&
                                      coupons.hasOwnProperty("coupon")
                                        ? coupons.coupon.type === "fixed"
                                          ? coupons.coupon.amount
                                          : subtotal *
                                              (coupons.coupon.amount / 100) >
                                            coupons.coupon.maximum_discount
                                          ? coupons.coupon.maximum_discount
                                          : subtotal *
                                            (coupons.coupon.amount / 100)
                                        : 0) -
                                      (coupons &&
                                      coupons.hasOwnProperty("free_ship")
                                        ? coupons.free_ship.type === "fixed"
                                          ? coupons.free_ship.amount
                                          : coupons.free_ship.type === "percent"
                                          ? order.order.shipping_fee *
                                              (coupons.free_ship.amount / 100) >
                                            coupons.free_ship.maximum_discount
                                            ? coupons.free_ship.maximum_discount
                                            : order.order.shipping_fee *
                                              (coupons.free_ship.amount / 100)
                                          : order.order.shipping_fee
                                        : 0)
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="TX9IwS">
                            <div class="O2KPzo">
                              <div class="mn7INg xFSVYg"> </div>
                              <div class="mn7INg EfbgJE"> </div>
                            </div>
                            <div class="TokOv1">
                              <div class="_8kMYJ3">
                                <span>
                                  <span class="JMmT2C">
                                    <span class="qyvpC4">
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
                                    </span>
                                  </span>
                                  <span class="_3Nh1BH">
                                    Phương thức Thanh toán
                                  </span>
                                </span>
                              </div>
                              <div class="CxyZBG">
                                <div>{pttt[order.order.pttt]}</div>
                              </div>
                            </div>
                          </div>
                        </div>{" "}
                        <div class="payment-info">
                          <div class="payment-info__title is-flex is-align-items-center">
                            <p class="title__text">Thông tin khách hàng</p>
                          </div>{" "}
                          <div class="payment-info__content">
                            <div class="content__item is-flex">
                              <div data-v-5170e23d="" class="cps-icon">
                                <svg
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15.75 5.41683C15.75 7.60296 13.9778 9.37516 11.7917 9.37516C9.60557 9.37516 7.83333 7.60296 7.83333 5.41683C7.83333 3.2307 9.60557 1.4585 11.7917 1.4585C13.9778 1.4585 15.75 3.2307 15.75 5.41683Z"
                                    stroke="#2E2E2E"
                                    stroke-width="1.5"
                                  ></path>{" "}
                                  <path
                                    d="M21 22V20C21 16.6863 18.3137 14 15 14H9C5.68629 14 3 16.6863 3 20V22"
                                    stroke="#2E2E2E"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>{" "}
                              <div class="item__text">
                                {buyerInfo.full_name}
                              </div>
                            </div>{" "}
                            <div class="content__item is-flex">
                              <div data-v-5170e23d="" class="cps-icon">
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2.67544 5.3624C3.30156 4.69223 4.32754 3.66779 5.17189 2.83517C5.95356 2.06437 7.20981 2.07945 7.98037 2.86136L9.93778 4.84762C10.5182 5.43658 10.4958 6.37193 9.96553 7.00642C8.35871 8.92912 8.65621 10.1294 11.2681 12.7413C13.8825 15.3556 15.0465 15.6152 16.9692 14.0004C17.6003 13.4704 18.5325 13.451 19.1195 14.0295L21.1385 16.0194C21.9209 16.7905 21.9353 18.0477 21.1637 18.8295C20.3329 19.6713 19.3111 20.6944 18.6387 21.3256C14.5751 25.1405 -1.13008 9.43566 2.67544 5.3624Z"
                                    stroke="#494949"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>{" "}
                              <div class="item__text">
                                {buyerInfo.phone_number}
                              </div>
                            </div>{" "}
                            <div class="content__item is-flex">
                              <div data-v-5170e23d="" class="cps-icon">
                                <svg
                                  width="26"
                                  height="26"
                                  viewBox="0 0 26 26"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M25 10.8182C25 18.4545 13 25 13 25C13 25 1 18.4545 1 10.8182C1 8.21424 2.26428 5.71695 4.51472 3.87568C6.76516 2.03441 9.8174 1 13 1C16.1826 1 19.2348 2.03441 21.4853 3.87568C23.7357 5.71695 25 8.21424 25 10.8182Z"
                                    stroke="#494949"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>{" "}
                                  <path
                                    d="M13 14.0914C15.2091 14.0914 17 12.6261 17 10.8186C17 9.01115 15.2091 7.5459 13 7.5459C10.7909 7.5459 9 9.01115 9 10.8186C9 12.6261 10.7909 14.0914 13 14.0914Z"
                                    stroke="#494949"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                </svg>
                              </div>{" "}
                              <div class="item__text">
                                {buyerInfo.address}, {buyerInfo.village},{" "}
                                {buyerInfo.district}, {buyerInfo.city}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="modal-review">
                    <div
                      onClick={() => handleCloseModal()}
                      class="modal-review-background"
                    ></div>
                    <div class="modal-review-content">
                      <div class="content__close-btn"></div>
                      <div class="content__close-btn-desk">
                        <div data-v-5170e23d="" class="close-icon">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 320 512"
                          >
                            <path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"></path>
                          </svg>
                        </div>
                      </div>
                      <div
                        style={{ position: "relative" }}
                        class="block-content"
                      >
                        {processing && <Loader />}
                        <div class="content">
                          <div class="content__title">Đánh giá sản phẩm</div>
                          <div className="block-order-item">
                            <div style={{ margin: "0 20px" }} class="x0QT2k">
                              <div class="FycaKn"></div>
                              <a href="/user/purchase/order/130071666213986?type=3">
                                <div class="_0OiaZ-">
                                  <div class="FbLutl">
                                    <div>
                                      <span
                                        style={{ paddingBottom: "12px" }}
                                        class="x7nENX"
                                      >
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
                                                  backgroundImage: `url("${
                                                    reviewedProduct &&
                                                    `${process.env.REACT_APP_SERVER_ROOT_URL}/${reviewedProduct.image}`
                                                  }")`,
                                                }}
                                              >
                                                <div class="shopee-image__content--blur">
                                                  {" "}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div class="_7uZf6Q">
                                            <div>
                                              <div class="iJlxsT">
                                                <span class="x5GTyN">
                                                  {reviewedProduct &&
                                                    reviewedProduct.name}
                                                </span>
                                              </div>
                                            </div>
                                            <div>
                                              <div class="vb0b-P">
                                                {reviewedProduct &&
                                                  reviewedProduct.color}
                                              </div>
                                              <div class="_3F1-5M">
                                                x
                                                {reviewedProduct &&
                                                  reviewedProduct.quantity}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div class="_9UJGhr">
                                          <div>
                                            {reviewedProduct && (
                                              <>
                                                {reviewedProduct.discounted_price >
                                                0 ? (
                                                  <>
                                                    <span class="j2En5+">
                                                      ₫
                                                      {new Intl.NumberFormat({
                                                        style: "currency",
                                                      }).format(
                                                        reviewedProduct.price
                                                      )}
                                                    </span>
                                                    <span class="-x3Dqh OkfGBc">
                                                      ₫
                                                      {new Intl.NumberFormat({
                                                        style: "currency",
                                                      }).format(
                                                        reviewedProduct.price -
                                                          reviewedProduct.discounted_price
                                                      )}
                                                    </span>
                                                  </>
                                                ) : (
                                                  <span class="-x3Dqh OkfGBc">
                                                    ₫
                                                    {new Intl.NumberFormat({
                                                      style: "currency",
                                                    }).format(
                                                      reviewedProduct.price
                                                    )}
                                                  </span>
                                                )}
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </span>
                                    </div>
                                    <div class="Cde7Oe"></div>
                                  </div>
                                </div>
                              </a>
                              <div class="B8+ewx"></div>
                              <div class="FycaKn"></div>
                            </div>
                          </div>
                          <div class="rating-title">
                            <p class="title">Sản phẩm của bạn như thế nào?</p>
                            <p class="sub-title">
                              Hãy để lại đánh giá và nhận xét của bạn
                            </p>
                          </div>
                          <div class="box-rating is-flex is-justify-content-space-evenly">
                            <div class="has-text-centered">
                              <div
                                onClick={() => Evaluate(1)}
                                data-v-5170e23d=""
                                icon="star"
                                class={`icon${star >= 1 ? " is-active" : ""}`}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.1157 2.81994C11.4824 2.07605 12.5431 2.07605 12.9097 2.81994L15.1881 7.44276C15.3338 7.73833 15.6157 7.94316 15.9418 7.99037L21.0001 8.72264C21.8194 8.84125 22.1481 9.84709 21.5568 10.4265L17.8802 14.0297C17.646 14.2592 17.5392 14.5889 17.5944 14.9121L18.4618 19.9969C18.6013 20.8149 17.7412 21.4372 17.0078 21.0487L12.4809 18.6502C12.1881 18.4951 11.8374 18.4951 11.5446 18.6502L7.0176 21.0487C6.28427 21.4372 5.42412 20.8149 5.56367 19.9969L6.43081 14.9135C6.48608 14.5896 6.37861 14.2591 6.14334 14.0296L2.45153 10.4281C1.85803 9.84917 2.18639 8.84098 3.00701 8.72258L8.0833 7.99016C8.4096 7.94308 8.69173 7.7382 8.83748 7.44249L11.1157 2.81994Z"
                                    stroke="#121219"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div class="has-text-centered">
                              <div
                                onClick={() => Evaluate(2)}
                                data-v-5170e23d=""
                                icon="star"
                                class={`icon${star >= 2 ? " is-active" : ""}`}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.1157 2.81994C11.4824 2.07605 12.5431 2.07605 12.9097 2.81994L15.1881 7.44276C15.3338 7.73833 15.6157 7.94316 15.9418 7.99037L21.0001 8.72264C21.8194 8.84125 22.1481 9.84709 21.5568 10.4265L17.8802 14.0297C17.646 14.2592 17.5392 14.5889 17.5944 14.9121L18.4618 19.9969C18.6013 20.8149 17.7412 21.4372 17.0078 21.0487L12.4809 18.6502C12.1881 18.4951 11.8374 18.4951 11.5446 18.6502L7.0176 21.0487C6.28427 21.4372 5.42412 20.8149 5.56367 19.9969L6.43081 14.9135C6.48608 14.5896 6.37861 14.2591 6.14334 14.0296L2.45153 10.4281C1.85803 9.84917 2.18639 8.84098 3.00701 8.72258L8.0833 7.99016C8.4096 7.94308 8.69173 7.7382 8.83748 7.44249L11.1157 2.81994Z"
                                    stroke="#121219"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div class="has-text-centered">
                              <div
                                onClick={() => Evaluate(3)}
                                data-v-5170e23d=""
                                icon="star"
                                class={`icon${star >= 3 ? " is-active" : ""}`}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.1157 2.81994C11.4824 2.07605 12.5431 2.07605 12.9097 2.81994L15.1881 7.44276C15.3338 7.73833 15.6157 7.94316 15.9418 7.99037L21.0001 8.72264C21.8194 8.84125 22.1481 9.84709 21.5568 10.4265L17.8802 14.0297C17.646 14.2592 17.5392 14.5889 17.5944 14.9121L18.4618 19.9969C18.6013 20.8149 17.7412 21.4372 17.0078 21.0487L12.4809 18.6502C12.1881 18.4951 11.8374 18.4951 11.5446 18.6502L7.0176 21.0487C6.28427 21.4372 5.42412 20.8149 5.56367 19.9969L6.43081 14.9135C6.48608 14.5896 6.37861 14.2591 6.14334 14.0296L2.45153 10.4281C1.85803 9.84917 2.18639 8.84098 3.00701 8.72258L8.0833 7.99016C8.4096 7.94308 8.69173 7.7382 8.83748 7.44249L11.1157 2.81994Z"
                                    stroke="#121219"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div class="has-text-centered">
                              <div
                                onClick={() => Evaluate(4)}
                                data-v-5170e23d=""
                                icon="star"
                                class={`icon${star >= 4 ? " is-active" : ""}`}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.1157 2.81994C11.4824 2.07605 12.5431 2.07605 12.9097 2.81994L15.1881 7.44276C15.3338 7.73833 15.6157 7.94316 15.9418 7.99037L21.0001 8.72264C21.8194 8.84125 22.1481 9.84709 21.5568 10.4265L17.8802 14.0297C17.646 14.2592 17.5392 14.5889 17.5944 14.9121L18.4618 19.9969C18.6013 20.8149 17.7412 21.4372 17.0078 21.0487L12.4809 18.6502C12.1881 18.4951 11.8374 18.4951 11.5446 18.6502L7.0176 21.0487C6.28427 21.4372 5.42412 20.8149 5.56367 19.9969L6.43081 14.9135C6.48608 14.5896 6.37861 14.2591 6.14334 14.0296L2.45153 10.4281C1.85803 9.84917 2.18639 8.84098 3.00701 8.72258L8.0833 7.99016C8.4096 7.94308 8.69173 7.7382 8.83748 7.44249L11.1157 2.81994Z"
                                    stroke="#121219"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                            <div class="has-text-centered">
                              <div
                                onClick={() => Evaluate(5)}
                                data-v-5170e23d=""
                                icon="star"
                                class={`icon${star >= 5 ? " is-active" : ""}`}
                                style={{ cursor: "pointer" }}
                              >
                                <svg
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.1157 2.81994C11.4824 2.07605 12.5431 2.07605 12.9097 2.81994L15.1881 7.44276C15.3338 7.73833 15.6157 7.94316 15.9418 7.99037L21.0001 8.72264C21.8194 8.84125 22.1481 9.84709 21.5568 10.4265L17.8802 14.0297C17.646 14.2592 17.5392 14.5889 17.5944 14.9121L18.4618 19.9969C18.6013 20.8149 17.7412 21.4372 17.0078 21.0487L12.4809 18.6502C12.1881 18.4951 11.8374 18.4951 11.5446 18.6502L7.0176 21.0487C6.28427 21.4372 5.42412 20.8149 5.56367 19.9969L6.43081 14.9135C6.48608 14.5896 6.37861 14.2591 6.14334 14.0296L2.45153 10.4281C1.85803 9.84917 2.18639 8.84098 3.00701 8.72258L8.0833 7.99016C8.4096 7.94308 8.69173 7.7382 8.83748 7.44249L11.1157 2.81994Z"
                                    stroke="#121219"
                                    stroke-width="1.5"
                                    stroke-miterlimit="10"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div class="rating-comment">
                            <textarea
                              type="text"
                              maxlength="999999"
                              placeholder="Chia sẻ cảm nhận của bạn về sản phẩm"
                              class="comment-input"
                            ></textarea>
                            <input
                              id="image"
                              accept="image/x-png,image/gif,image/jpeg"
                              multiple="multiple"
                              type="file"
                              class="is-hidden"
                              onChange={previewImages}
                            />
                            <label for="image" class="btn-add-img">
                              <div data-v-5170e23d="" class="input-icon">
                                <svg
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M15.7084 17.7082H4.29175C3.18718 17.7082 2.29175 16.8127 2.29175 15.7082V4.29151C2.29175 3.18694 3.18718 2.2915 4.29175 2.2915H15.7084C16.813 2.2915 17.7084 3.18693 17.7084 4.2915V15.7082C17.7084 16.8127 16.813 17.7082 15.7084 17.7082Z"
                                    stroke="#676767"
                                    stroke-width="1.5"
                                  ></path>
                                  <path
                                    d="M2.5 13.9634L6.72212 10.3064C7.47667 9.65288 8.5976 9.65579 9.34876 10.3132L17.0833 17.083"
                                    stroke="#676767"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></path>
                                  <path
                                    d="M15 6.25C15 5.55964 14.4404 5 13.75 5C13.0596 5 12.5 5.55964 12.5 6.25C12.5 6.94036 13.0596 7.5 13.75 7.5C14.4404 7.5 15 6.94036 15 6.25Z"
                                    stroke="#676767"
                                    stroke-width="1.5"
                                  ></path>
                                </svg>
                              </div>
                            </label>
                          </div>
                          {imagesReview.length > 0 && (
                            <div style={{ marginLeft: "20px" }}>
                              {imagesReview.map((item, index) => {
                                return (
                                  <div key={index} className="image_preview">
                                    <img src={`${URL.createObjectURL(item)}`} />
                                    <div
                                      onClick={() => removePreviewImage(index)}
                                      className="image_preview_remove"
                                    >
                                      x
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div class="line-through mx-5">
                            <hr />
                          </div>
                          <div class="rating-submit is-flex is-justify-content-space-around">
                            <div class="PF0-AU">
                              <button
                                onClick={() => {
                                  handleCloseModal();
                                }}
                                class="stardust-button stardust-button--primary WgYvse"
                              >
                                Hủy bỏ
                              </button>
                            </div>
                            <div class="PgtIur">
                              <button
                                onClick={() =>
                                  confirmEvaluate(
                                    reviewedProduct.product_id,
                                    reviewedProduct.id
                                  )
                                }
                                class="stardust-button stardust-button--secondary WgYvse"
                              >
                                Xác nhận
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default OrderDetail;
