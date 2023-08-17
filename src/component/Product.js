import React, { useContext, useEffect, useState } from "react";
import Comment from "./Comment";
import Review from "./Review";
import axios from "axios";
import Countdown from "react-countdown";
import Loader from "./loader/Loader";
import parse from "html-react-parser";
import { useParams, Link, useNavigate } from "react-router-dom";
import Spinner from "./spinner/Spinner";
import { useCookies } from "react-cookie";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";

import Swal from "sweetalert2";

import "./Product.css";
import { AuthContext } from "../provider/AuthProvider";
import { AppStoreContext } from "../provider/AppStoreProvider";

const modal_style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Product = ({ props, ref }) => {
  /*========= reactjs modal mui ===========*/
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  /*========= reactjs modal mui ===========*/
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [product, setProduct] = useState({});
  const [technicalPreview, setTechnicalPreview] = useState([]);
  const [averageStar, setAverageStar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [changingVersion, setChangingVersion] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState(null);
  const [version, setVersion] = useState(null);
  const { slug } = useParams("slug");
  const [cookies, setCookie] = useCookies();
  const {
    setShoppingCart,
    products_to_compare,
    setProductsToCompare,
    setCompareCat,
  } = useContext(AppStoreContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleColorPicked = (e, color) => {
    const elements = document.querySelectorAll(".st-select-color__item");
    elements.forEach((element) => {
      if (element.classList.contains("active")) {
        element.classList.remove("active");
      }
    });
    e.currentTarget.classList.add("active");
    let Color = colors.find((item) => item.color.color === color);
    setGallery(Color.gallery);
  };

  const handleAddToCart = (e, order_now = false) => {
    if (!user) {
      return navigate(`/login?next=${encodeURI(window.location.pathname)}`);
    }
    if (order_now) {
      setProcessing(true);
    } else {
      setIsAddingToCart(true);
    }
    const button = e.currentTarget;
    button.style.pointerEvents = "none";
    let data = {
      product_id: product.id,
      image: color ? color.image : product.image,
    };
    if (color) {
      data.color_id = color.id;
    }
    if (version) {
      data.version = version;
    }
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/shopping_cart`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        setShoppingCart((prev) => {
          if (res.data.new) {
            let item = {
              ...res.data.cart_item,
              name: product.name,
              slug: product.slug,
              price: product.price,
              discounted_price: product.flash_sale
                ? product.flash_sale_discounted_price
                : product.discounted_price,
              isUpdate: false,
              purchase: false,
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
        if (order_now) {
          setShoppingCart((prev) => {
            return [...prev].map((item) => {
              if (item.id === res.data.cart_item.id) {
                item.purchase = true;
              } else {
                item.purchase = false;
              }
              return item;
            });
          });
          return navigate("/checkout");
        }
        setIsAddingToCart(false);
        button.style.pointerEvents = "auto";
        Swal.fire({
          title: "Sản phẩm đã được thêm vào giỏ hàng",
          confirmButtonText: "Đóng",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleColorSelected = (e) => {
    setColor({
      image: e.currentTarget.dataset.image,
      color: e.currentTarget.dataset.color,
      id: Number(e.currentTarget.dataset.id),
    });
  };

  const viewMoreOrLess = (e) => {
    const product_text = document.querySelector(".product-text");
    if (e.currentTarget.getAttribute("full-content")) {
      product_text.style.height = "652px";
      product_text.style.overflow = "hidden";
      e.currentTarget.innerText = "xem thêm";
      e.currentTarget.removeAttribute("full-content");
    } else {
      product_text.style.height = "auto";
      product_text.style.overflow = "auto";
      e.currentTarget.innerText = "thu gọn";
      e.currentTarget.setAttribute("full-content", true);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!isLoading) {
      setChangingVersion(true);
    }
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/products/slug/${slug}`)
      .then((res) => {
        if (isLoading) {
          setIsLoading(false);
        }
        if (!isLoading) {
          setChangingVersion(false);
        }

        let count = 0;
        const specification = JSON.parse(res.data.specification);
        setProduct(() => {
          res.data.specification = specification;
          return res.data;
        });
        if (!isLoading) {
          setTechnicalPreview([]);
        }

        for (let i = 0; i < specification.length; i++) {
          for (let y = 0; y < specification[i].technical_infos.length; y++) {
            count++;
            setTechnicalPreview((prev) => {
              return [...prev, specification[i].technical_infos[y]];
            });
            if (count === 10) {
              break;
            }
          }
          if (count === 10) {
            break;
          }
        }

        let reviews = res.data.reviews;
        if (reviews.length === 0) {
          setAverageStar(0);
        } else {
          var total_stars = 0;
          for (let i = 0; i < reviews.length; i++) {
            total_stars += reviews[i].star;
          }
          setAverageStar(total_stars / reviews.length);
        }

        if (res.data.hasOwnProperty("product_group")) {
          setVersion(res.data.product_group.version_name);
        }

        if (res.data.hasOwnProperty("colors")) {
          setGallery(res.data.colors[0].gallery);
          setColors(res.data.colors);
          setColor({
            image: res.data.colors[0].color.color,
            color: res.data.colors[0].color.color_name,
            id: res.data.colors[0].color.id,
          });
        } else if (res.data.hasOwnProperty("gallery")) {
          setGallery(res.data.gallery);
        }
        const expired_date = new Date();
        expired_date.setHours(expired_date.getHours() + 168);
        let recently_viewed_products = cookies.recently_viewed_products
          ? cookies.recently_viewed_products
          : [];
        if (!recently_viewed_products.find((item) => item.id === res.data.id)) {
          if (recently_viewed_products.length > 11) {
            recently_viewed_products.pop();
          }
          recently_viewed_products.unshift({
            id: res.data.id,
            name: res.data.name,
            slug: res.data.slug,
            image: res.data.image,
            price: res.data.price,
            discounted_price: res.data.discounted_price,
            reviews: {
              average_star: total_stars / reviews.length,
              total_reviews: reviews.length,
            },
          });
        }
        setCookie(
          "recently_viewed_products",
          JSON.stringify(recently_viewed_products),
          {
            path: "/",
            expires: expired_date,
          }
        );

        axios.post(
          `${process.env.REACT_APP_API_ENDPOINT}/products/increment_view/${res.data.id}`
        );
      })
      .catch(() => {});
  }, [slug]);

  const handleCompare = () => {
    setCompareCat(product.cats[product.cats.length - 1]);
    setProductsToCompare((prev) => {
      return [product];
    });
  };

  return (
    <>
      {changingVersion && <Loader fixed={true} />}
      {processing && <Loader fixed={true} />}
      <section id="main">
        {!isLoading ? (
          <div class="container">
            <div className="block-detail-product">
              <div class="box-header is-flex is-align-items-center box-header-desktop">
                <div class="box-product-name">
                  <h1> {product.name} </h1>
                </div>
                <div class="shopee-rating-stars">
                  <div class="shopee-rating-stars__stars">
                    {[1, 2, 3, 4, 5].map((item) => {
                      return (
                        <div class="shopee-rating-stars__star-wrapper">
                          <div
                            class="shopee-rating-stars__lit"
                            style={
                              averageStar > item
                                ? { width: "100%" }
                                : item - averageStar < 1
                                ? {
                                    width: `${
                                      (averageStar - (item - 1)) * 100
                                    }%`,
                                  }
                                : { width: "0%" }
                            }
                          >
                            <svg
                              enable-background="new 0 0 15 15"
                              viewBox="0 0 15 15"
                              x="0"
                              y="0"
                              class="shopee-svg-icon shopee-rating-stars__primary-star icon-rating-solid"
                            >
                              <polygon
                                points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-miterlimit="10"
                              ></polygon>
                            </svg>
                          </div>
                          <svg
                            enable-background="new 0 0 15 15"
                            viewBox="0 0 15 15"
                            x="0"
                            y="0"
                            class="shopee-svg-icon shopee-rating-stars__hollow-star icon-rating"
                          >
                            <polygon
                              fill="none"
                              points="7.5 .8 9.7 5.4 14.5 5.9 10.7 9.1 11.8 14.2 7.5 11.6 3.2 14.2 4.3 9.1 .5 5.9 5.3 5.4"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-miterlimit="10"
                            ></polygon>
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div class="IZIVH+">
                  <div class="nTpKes">{product.reviews.length} đánh giá</div>
                </div>
                <div
                  style={{
                    flex: "1",
                    textAlign: "right",
                  }}
                >
                  <Link
                    onClick={handleCompare}
                    to={`/compare/${product.slug}`}
                    class="re-link margin-left-2x"
                  >
                    <span class="ic-plus margin-right-sm"></span>So sánh
                  </Link>
                </div>
              </div>
              <hr />
            </div>
            <div className="product-detail">
              <div className="product-detail-left gallery-product-detail">
                <Swiper
                  style={{
                    "--swiper-navigation-color": "#fff",
                    "--swiper-pagination-color": "#fff",
                  }}
                  spaceBetween={10}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper2 gallery-slide gallery-top swiper-container"
                >
                  {gallery.map((item) => {
                    return (
                      <SwiperSlide key={item}>
                        <img
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item}`}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={10}
                  slidesPerView={12}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper thumbnail-slide swiper-container"
                >
                  {gallery.map((item) => {
                    return (
                      <SwiperSlide key={item}>
                        <img
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item}`}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
              <div className="product-detail-right">
                {product.flash_sale && (
                  <div style={{ marginBottom: "10px" }}>
                    <i
                      style={{ marginLeft: "0px", marginRight: "10px" }}
                      class="fa fa-bolt"
                      aria-hidden="true"
                    ></i>
                    <Countdown
                      date={new Date(product.flash_sale_end_time)}
                      zeroPadTime={2}
                      renderer={({
                        days,
                        hours,
                        minutes,
                        seconds,
                        completed,
                      }) => (
                        <>
                          <div class="timer" id="timer_6">
                            {days > 0 && (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  {days}
                                </strong>
                                <span
                                  style={{
                                    marginRight: "10px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  ngày
                                </span>
                              </>
                            )}
                            {hours < 10 ? (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  0
                                </strong>
                                <strong> {hours} </strong>
                              </>
                            ) : (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  {hours.toString().split("")[0]}
                                </strong>
                                <strong>{hours.toString().split("")[1]}</strong>
                              </>
                            )}
                            <span> : </span>
                            {minutes < 10 ? (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  0
                                </strong>
                                <strong> {minutes} </strong>
                              </>
                            ) : (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  {minutes.toString().split("")[0]}
                                </strong>
                                <strong>
                                  {minutes.toString().split("")[1]}
                                </strong>
                              </>
                            )}
                            <span> : </span>
                            {seconds < 10 ? (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  0
                                </strong>
                                <strong> {seconds} </strong>
                              </>
                            ) : (
                              <>
                                <strong style={{ marginRight: "5px" }}>
                                  {seconds.toString().split("")[0]}
                                </strong>
                                <strong>
                                  {seconds.toString().split("")[1]}
                                </strong>
                              </>
                            )}
                          </div>
                        </>
                      )}
                      onComplete={() => {
                        setProduct((prev) => {
                          return {
                            ...prev,
                            flash_sale: false,
                            flash_sale_discounted_price: null,
                          };
                        });
                      }}
                    />
                  </div>
                )}
                <div className="block-box-price">
                  <div class="box-info__box-price">
                    {product.discounted_price > 0 || product.flash_sale ? (
                      <>
                        <p class="product__price--show">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(
                            product.price -
                              (product.flash_sale
                                ? product.flash_sale_discounted_price
                                : product.discounted_price)
                          )}
                          &nbsp;₫
                        </p>
                        <p class="product__price--through">
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(product.price)}
                          &nbsp;₫
                        </p>
                      </>
                    ) : (
                      <p class="product__price--show">
                        {new Intl.NumberFormat({
                          style: "currency",
                        }).format(product.price)}
                        &nbsp;₫
                      </p>
                    )}
                  </div>
                </div>
                {product.hasOwnProperty("products_in_group") && (
                  <div data-v-40098ae8="" class="box-linked">
                    <div data-v-40098ae8="" class="list-linked">
                      {product.products_in_group.map((item) => {
                        return (
                          <Link
                            data-v-40098ae8=""
                            to={`/products/${item.slug}`}
                            class={`item-linked linked-undefined false${
                              product.id === item.product_id ? " active" : ""
                            }`}
                          >
                            <div data-v-40098ae8="">
                              <strong>{item.version_name}</strong>
                            </div>
                            <span data-v-40098ae8="">
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(
                                item.price - item.discounted_price
                              )}{" "}
                              đ
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div class="st-select-color">
                  {product.hasOwnProperty("colors") &&
                    product.colors.map((item, index) => {
                      return (
                        <div
                          onClick={(e) => {
                            handleColorPicked(e, item.color.color);
                            handleColorSelected(e);
                          }}
                          data-image={item.color.color}
                          data-color={item.color.color_name}
                          data-id={item.color.id}
                          class={`st-select-color__item js--select-color-item${
                            index === 0 ? " active" : ""
                          }`}
                        >
                          <div class="img">
                            <img
                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.color.color}`}
                              width="38"
                              height="38"
                              alt={item.color.color_name}
                            />
                          </div>
                          <p title={item.color.color_name}>
                            {item.color.color_name}
                          </p>
                        </div>
                      );
                    })}
                </div>
                <div class="box-order-button-container my-3">
                  <div class="is-flex is-justify-content-space-between">
                    <button
                      onClick={(e) => handleAddToCart(e, true)}
                      class="order-button is-flex is-justify-content-center is-align-items-center"
                    >
                      <p>MUA NGAY</p>
                    </button>
                    <button
                      onClick={handleAddToCart}
                      type="button"
                      class="btn btn-tinted btn--l iFo-rx QA-ylc"
                      aria-disabled="false"
                    >
                      {isAddingToCart ? (
                        <Spinner />
                      ) : (
                        <>
                          {" "}
                          <svg
                            enable-background="new 0 0 15 15"
                            viewBox="0 0 15 15"
                            x="0"
                            y="0"
                            class="shopee-svg-icon tDviDD icon-add-to-cart"
                          >
                            <g>
                              <g>
                                <polyline
                                  fill="none"
                                  points=".5 .5 2.7 .5 5.2 11 12.4 11 14.5 3.5 3.7 3.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-miterlimit="10"
                                ></polyline>
                                <circle
                                  cx="6"
                                  cy="13.5"
                                  r="1"
                                  stroke="none"
                                ></circle>
                                <circle
                                  cx="11.5"
                                  cy="13.5"
                                  r="1"
                                  stroke="none"
                                ></circle>
                              </g>
                              <line
                                fill="none"
                                stroke-linecap="round"
                                stroke-miterlimit="10"
                                x1="7.5"
                                x2="10.5"
                                y1="7"
                                y2="7"
                              ></line>
                              <line
                                fill="none"
                                stroke-linecap="round"
                                stroke-miterlimit="10"
                                x1="9"
                                x2="9"
                                y1="8.5"
                                y2="5.5"
                              ></line>
                            </g>
                          </svg>
                          <span>thêm vào giỏ hàng</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {product.suggestion.length > 0 && (
                  <div class="st-promoProduct">
                    <div class="title">Gợi ý sản phẩm mua kèm</div>
                    <div class="st-promoProduct__wrapper">
                      {product.suggestion.map((item) => {
                        return (
                          <div class="st-promoProduct__item">
                            <label class="img">
                              <span
                                class=" lazy-load-image-background opacity lazy-load-image-loaded"
                                style={{
                                  display: "inline-block",
                                  height: "58px",
                                  width: "58px",
                                }}
                              >
                                <img
                                  src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                  alt="Củ sạc Apple Power Adapter 20W Type-C"
                                  title="Củ sạc Apple Power Adapter 20W Type-C"
                                  width="68"
                                  height="68"
                                />
                              </span>
                            </label>
                            <div class="info">
                              <div class="top">
                                <Link
                                  to={`/products/${item.slug}`}
                                  target="blank"
                                >
                                  <span class="name">{item.name}</span>
                                </Link>
                              </div>
                              <div class="center">
                                {item.discounted_price > 0 ? (
                                  <>
                                    <div class="re-price re-red">
                                      {new Intl.NumberFormat({
                                        style: "currency",
                                      }).format(
                                        item.price - item.discounted_price
                                      )}
                                      ₫
                                    </div>
                                    <div class="re-price-strike">
                                      {new Intl.NumberFormat({
                                        style: "currency",
                                      }).format(item.price)}
                                      ₫
                                    </div>
                                  </>
                                ) : (
                                  <div class="re-price re-red">
                                    {new Intl.NumberFormat({
                                      style: "currency",
                                    }).format(item.price)}
                                    ₫
                                  </div>
                                )}
                                <Link
                                  target="blank"
                                  to={`/products/${item.slug}`}
                                >
                                  <div class="addToCard">Xem chi tiết</div>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div class="product-layout product-layout-grid">
              <div id="left">
                <div class="product-description">
                  <div
                    class="product-text"
                    id="productContent"
                    data-height="679"
                  >
                    {parse(product.description)}
                  </div>
                  <div class="view-more-container">
                    <a
                      onClick={(e) => {
                        viewMoreOrLess(e);
                      }}
                      id="viewMoreContent"
                    >
                      xem thêm
                    </a>
                  </div>
                </div>
                <Review
                  reviews={product.reviews}
                  averageStar={averageStar}
                  product_name={product.name}
                />
                <Comment product_id={product.id} />
              </div>
              {/**
               * ============ right ==============*
               */}
              <div id="right">
                <div class="product-specification">
                  <div class="modal">
                    <div class="modal-background"></div>
                    <div class="modal-background"></div>
                    <div class="modal-card">
                      <header class="modal-card-head technical-title-modal is-flex is-justify-content-space-between is-align-items-center px-4">
                        <p class="modal-card-title title is-5 p-0 m-0 has-text-white">
                          Thông số kỹ thuật
                        </p>
                        <button
                          onClick={() => {
                            document
                              .querySelector(".product-specification .modal")
                              .classList.remove("is-active");
                          }}
                          aria-label="close"
                          class="delete"
                        ></button>
                      </header>
                      <section class="modal-card-body">
                        <div class="modal-content">
                          <ul class="technical-content-modal">
                            {product.specification.map((item) => {
                              return (
                                <li class="technical-content-modal-item m-3">
                                  <p class="title is-6 m-2">{item.title}</p>
                                  <div class="modal-item-description mx-2">
                                    {item.technical_infos.map((item) => {
                                      return (
                                        <div class="px-3 py-2 is-flex is-align-items-center is-justify-content-space-between">
                                          <p>{parse(item.technical_info)}</p>
                                          <div>
                                            {item.technical_content
                                              .split("\n")
                                              .map((item) => {
                                                return (
                                                  <span
                                                    style={{
                                                      display: "block",
                                                    }}
                                                  >
                                                    {parse(item)}
                                                  </span>
                                                );
                                              })}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </section>{" "}
                      <footer class="modal-card-foot">
                        <button
                          onClick={() => {
                            document
                              .querySelector(".product-specification .modal")
                              .classList.remove("is-active");
                          }}
                          class="button close-button-modal is-flex is-align-items-center"
                        >
                          × Đóng
                        </button>
                      </footer>
                    </div>
                  </div>
                  <div class="product-specs">
                    <h3 style={{ lineHeight: "1.25rem" }}>
                      Thông số kỹ thuật {product.name}
                    </h3>

                    <div class="product-spect-img">
                      <img
                        src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${product.image}`}
                      />
                      <div
                        style={{ width: "60%", marginTop: "10px" }}
                        class="block-sforum_btn-showmore"
                      >
                        <a
                          href="javascript:void(0)"
                          class="btn-show-more button__link"
                          onClick={() => {
                            document
                              .querySelector(".product-specification .modal")
                              .classList.add("is-active");
                          }}
                        >
                          Cấu hình chi tiết
                        </a>
                      </div>
                    </div>

                    <div class="specs-special">
                      {technicalPreview.map((item) => {
                        return (
                          <ol>
                            <li>
                              <strong>{item.technical_info}: </strong>
                              <span>{item.technical_content}</span>
                            </li>
                          </ol>
                        );
                      })}
                    </div>
                  </div>
                </div>
                {/* {product.posts.length > 0 && (
                  <div class="block-sforum">
                    <div class="sforum__title">
                      <div class="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="15"
                          viewBox="0 0 20 15"
                        >
                          <path
                            id="newspaper"
                            d="M17.5,6.5V4H0V17.75A1.25,1.25,0,0,0,1.25,19H18.125A1.875,1.875,0,0,0,20,17.125V6.5ZM16.25,17.75h-15V5.25h15ZM2.5,7.75H15V9H2.5Zm7.5,2.5h5V11.5H10Zm0,2.5h5V14H10Zm0,2.5h3.75V16.5H10Zm-7.5-5H8.75V16.5H2.5Z"
                            transform="translate(0 -4)"
                            fill="#d70018"
                          ></path>
                        </svg>
                      </div>
                      Tin tức về sản phẩm
                    </div>
                    <div class="sforum__content">
                      {product.posts.map((item) => {
                        return (
                          <a
                            target="_blank"
                            href="https://cellphones.com.vn/sforum/thoi-nghe-26-5"
                            class="sforum__content-item button__link is-flex"
                          >
                            <img
                              src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.post_thumbnail}`}
                              alt={`${item.title}`}
                              loading="lazy"
                              class="content-item__img"
                            />
                            <div class="content-item__text">{item.title}</div>
                          </a>
                        );
                      })}
                    </div>
                    <div class="block-sforum_btn-showmore">
                      <a
                        target="_blank"
                        href="https://cellphones.com.vn/sforum/tag/apple-iphone-11"
                        class="btn-show-more button__link"
                      >
                        Xem tất cả bài viết 
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 448 512"
                            width="10"
                            height="10"
                          >
                            <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"></path>
                          </svg>
                        </div>
                      </a>
                    </div>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </section>
    </>
  );
};

export default Product;
