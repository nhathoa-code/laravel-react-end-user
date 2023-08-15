import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Countdown from "react-countdown";
import Loader from "./loader/Loader";
import { AppStoreContext } from "../provider/AppStoreProvider";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/grid";
import "swiper/css/pagination";

import "./Home.css";

// import required modules
import { Grid, FreeMode, Navigation, Thumbs } from "swiper";

const Home = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  // const [productsCategories, setProductsCategories] = useState([]);
  const {
    categories,
    productsCategories,
    setProductsCategories,
    banners,
    setBanners,
    flash_saled_products,
    setFlashSaledProducts,
  } = useContext(AppStoreContext);

  const [isLoading, setIsLoading] = useState(false);
  // const [banners, setBanners] = useState([]);
  let averageStar = 0;
  useEffect(() => {
    if (banners.length > 0 && productsCategories.length > 0) {
      return;
    }
    setIsLoading(true);
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/products`),
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/banners`),
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/flash_sales`),
      ])
      .then(
        axios.spread(async (res1, res2, res3) => {
          setProductsCategories(res1.data);
          setBanners(res2.data);
          setFlashSaledProducts(res3.data);
          setIsLoading(false);
        })
      );
  }, []);

  return (
    <>
      <div className="container_12">
        <div className="grid_12">
          {banners.length > 0 && (
            <div id="banners">
              <Swiper
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                  height: "375px",
                }}
                loop={true}
                speed={500}
                spaceBetween={10}
                navigation={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper2 banner-slide swiper-container"
              >
                {banners.map((b) => {
                  return (
                    <SwiperSlide>
                      <Link to={`${b.link_to}`}>
                        <img
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${b.image}`}
                        />
                      </Link>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                allowTouchMove={false}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
                style={{ marginTop: "10px" }}
              >
                {banners.map((b) => {
                  return (
                    <SwiperSlide
                      style={{
                        textAlign: "center",
                        cursor: "pointer",
                        height: "65px",
                        overflowY: "hidden",
                        boxSizing: "border-box",
                      }}
                      className="banner-short-description"
                    >
                      {b.short_description.split("\r\n").map((item, index) => (
                        <p
                          style={
                            index === 0
                              ? { fontSize: "15px" }
                              : { fontSize: "small" }
                          }
                        >
                          {item}
                        </p>
                      ))}
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}

          <div className="clear"></div>
        </div>
      </div>
      <div className="clear"></div>
      <section id="main" class="home">
        {!isLoading ? (
          <>
            <div class="container_12">
              {flash_saled_products.length > 0 &&
                new Date(flash_saled_products[0].end_time) >
                  new Date().getTime() && (
                  <div
                    style={{ backgroundColor: "#041e3a" }}
                    className="product_list"
                  >
                    <h2
                      style={{ color: "#fff" }}
                      className="product-list-title"
                    >
                      FLASH SALE
                      <span style={{ color: "#fff" }}>
                        <Countdown
                          daysInHours={true}
                          date={new Date(flash_saled_products[0].end_time)}
                          renderer={({ days, hours, minutes, seconds }) => (
                            <>
                              <span>
                                {new Date().getTime() <
                                new Date(flash_saled_products[0].start_time)
                                  ? "Bắt đầu sau: "
                                  : "Kết thúc sau: "}
                              </span>
                              <div class="timer" id="timer_6">
                                {days > 0 && (
                                  <>
                                    <strong style={{ marginRight: "5px" }}>
                                      {days}
                                    </strong>
                                    <span style={{ marginRight: "10px" }}>
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
                                    <strong>
                                      {hours.toString().split("")[1]}
                                    </strong>
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
                        />
                      </span>
                    </h2>
                    <Swiper
                      slidesPerView={5}
                      grid={{
                        rows: flash_saled_products.length > 15 ? 2 : 1,
                        fill: "row",
                      }}
                      navigation={true}
                      spaceBetween={15}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Grid, Navigation]}
                      className="product-list-swiper"
                      style={{ padding: "10px" }}
                    >
                      {flash_saled_products.map((item) => {
                        let averageStar = item.reviews.average_star;
                        let total_reviews = item.reviews.total_reviews;
                        return (
                          <SwiperSlide>
                            <div
                              style={{ height: "100%" }}
                              class="product-info-container"
                            >
                              <div class="product-info">
                                <Link
                                  to={`/products/${item.slug}`}
                                  class="product__link"
                                >
                                  <div class="product__image">
                                    <img
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                      width="358"
                                      height="358"
                                      alt="Laptop Asus Gaming Rog Strix G15 G513IH HN015W"
                                      class="product__img"
                                    />
                                  </div>
                                  <div class="product__name">
                                    <h3>{item.name}</h3>
                                  </div>
                                  <div class="block-box-price">
                                    <span
                                      class="title-price"
                                      style={{ display: "none" }}
                                    >
                                      :
                                    </span>
                                    <div class="box-info__box-price">
                                      {item.discounted_price > 0 ? (
                                        <>
                                          <p class="product__price--show">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              item.price - item.discounted_price
                                            )}
                                            &nbsp;₫
                                          </p>{" "}
                                          <p class="product__price--through">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(item.price)}
                                            &nbsp;₫
                                          </p>{" "}
                                          <div class="product__price--percent">
                                            <p class="product__price--percent-detail">
                                              Giảm&nbsp;
                                              {Math.round(
                                                (item.discounted_price /
                                                  item.price) *
                                                  100
                                              )}
                                              %
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <p class="product__price--show">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.price)}
                                          &nbsp;₫
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {item.discounted_price > 0 && (
                                    <div class="css-14q2k9d">
                                      <div class="css-zb7zul">
                                        <div class="css-1bqeu8f">TIẾT KIỆM</div>
                                        <div class="css-1rdv2qd">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.discounted_price)}
                                          &nbsp;₫
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div
                                    class="product__promotions"
                                    style={{ display: "none" }}
                                  >
                                    <div class="promotion">
                                      <p class="gift-cont"></p>
                                    </div>
                                  </div>
                                </Link>
                                <div class="product__box-rating">
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
                                                        (averageStar -
                                                          (item - 1)) *
                                                        100
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
                                      <p
                                        style={{
                                          fontSize: "0.9rem",
                                          marginLeft: "5px",
                                          color: "#999",
                                        }}
                                      >
                                        ({total_reviews})
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                )}

              {productsCategories.length > 0 && (
                <>
                  <div className="product_list">
                    <h2 className="product-list-title">
                      ĐIỆN THOẠI NỔI BẬT{" "}
                      <span>
                        <Link to={`/${productsCategories[0].slug}`}>
                          Xem tất cả
                        </Link>
                      </span>
                    </h2>

                    <Swiper
                      slidesPerView={5}
                      grid={{
                        rows: 2,
                        fill: "row",
                      }}
                      navigation={true}
                      spaceBetween={15}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Grid, Navigation]}
                      className="product-list-swiper"
                      style={{ padding: "10px" }}
                    >
                      {productsCategories[0].products.map((item) => {
                        let averageStar = item.reviews.average_star;
                        let total_reviews = item.reviews.total_reviews;
                        return (
                          <SwiperSlide>
                            <div
                              style={{ height: "100%" }}
                              class="product-info-container"
                            >
                              <div class="product-info">
                                <Link
                                  to={`/products/${item.slug}`}
                                  class="product__link"
                                >
                                  <div class="product__image">
                                    <img
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                      width="358"
                                      height="358"
                                      alt="Laptop Asus Gaming Rog Strix G15 G513IH HN015W"
                                      class="product__img"
                                    />
                                  </div>
                                  <div class="product__name">
                                    <h3>{item.name}</h3>
                                  </div>
                                  <div class="block-box-price">
                                    <span
                                      class="title-price"
                                      style={{ display: "none" }}
                                    >
                                      :
                                    </span>
                                    <div class="box-info__box-price">
                                      {item.discounted_price > 0 ? (
                                        <>
                                          <p class="product__price--show">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              item.price - item.discounted_price
                                            )}
                                            &nbsp;₫
                                          </p>{" "}
                                          <p class="product__price--through">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(item.price)}
                                            &nbsp;₫
                                          </p>{" "}
                                          <div class="product__price--percent">
                                            <p class="product__price--percent-detail">
                                              Giảm&nbsp;
                                              {Math.round(
                                                (item.discounted_price /
                                                  item.price) *
                                                  100
                                              )}
                                              %
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <p class="product__price--show">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.price)}
                                          &nbsp;₫
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {item.discounted_price > 0 && (
                                    <div class="css-14q2k9d">
                                      <div class="css-zb7zul">
                                        <div class="css-1bqeu8f">TIẾT KIỆM</div>
                                        <div class="css-1rdv2qd">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.discounted_price)}
                                          &nbsp;₫
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div
                                    class="product__promotions"
                                    style={{ display: "none" }}
                                  >
                                    <div class="promotion">
                                      <p class="gift-cont"></p>
                                    </div>
                                  </div>
                                </Link>
                                <div class="product__box-rating">
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
                                                        (averageStar -
                                                          (item - 1)) *
                                                        100
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
                                      <p
                                        style={{
                                          fontSize: "0.9rem",
                                          marginLeft: "5px",
                                          color: "#999",
                                        }}
                                      >
                                        ({total_reviews})
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                  <div className="product_list">
                    <h2 className="product-list-title">
                      LAPTOP NỔI BẬT{" "}
                      <span>
                        <Link to={`/${productsCategories[1].slug}`}>
                          Xem tất cả
                        </Link>
                      </span>
                    </h2>

                    <Swiper
                      slidesPerView={5}
                      grid={{
                        rows: 2,
                        fill: "row",
                      }}
                      navigation={true}
                      spaceBetween={15}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Grid, Navigation]}
                      className="product-list-swiper"
                      style={{ padding: "10px" }}
                    >
                      {productsCategories[1].products.map((item) => {
                        let averageStar = item.reviews.average_star;
                        let total_reviews = item.reviews.total_reviews;
                        return (
                          <SwiperSlide>
                            <div
                              style={{ height: "100%" }}
                              class="product-info-container"
                            >
                              <div class="product-info">
                                <Link
                                  to={`/products/${item.slug}`}
                                  class="product__link"
                                >
                                  <div class="product__image">
                                    <img
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                      width="358"
                                      height="358"
                                      alt="Laptop Asus Gaming Rog Strix G15 G513IH HN015W"
                                      class="product__img"
                                    />
                                  </div>
                                  <div class="product__name">
                                    <h3>{item.name}</h3>
                                  </div>
                                  <div class="block-box-price">
                                    <span
                                      class="title-price"
                                      style={{ display: "none" }}
                                    >
                                      :
                                    </span>
                                    <div class="box-info__box-price">
                                      {item.discounted_price > 0 ? (
                                        <>
                                          <p class="product__price--show">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              item.price - item.discounted_price
                                            )}
                                            &nbsp;₫
                                          </p>{" "}
                                          <p class="product__price--through">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(item.price)}
                                            &nbsp;₫
                                          </p>{" "}
                                          <div class="product__price--percent">
                                            <p class="product__price--percent-detail">
                                              Giảm&nbsp;
                                              {Math.round(
                                                (item.discounted_price /
                                                  item.price) *
                                                  100
                                              )}
                                              %
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <p class="product__price--show">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.price)}
                                          &nbsp;₫
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {item.discounted_price > 0 && (
                                    <div class="css-14q2k9d">
                                      <div class="css-zb7zul">
                                        <div class="css-1bqeu8f">TIẾT KIỆM</div>
                                        <div class="css-1rdv2qd">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.discounted_price)}
                                          &nbsp;₫
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div
                                    class="product__promotions"
                                    style={{ display: "none" }}
                                  >
                                    <div class="promotion">
                                      <p class="gift-cont"></p>
                                    </div>
                                  </div>
                                </Link>
                                <div class="product__box-rating">
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
                                                        (averageStar -
                                                          (item - 1)) *
                                                        100
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
                                      <p
                                        style={{
                                          fontSize: "0.9rem",
                                          marginLeft: "5px",
                                          color: "#999",
                                        }}
                                      >
                                        ({total_reviews})
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                  <div className="product_list">
                    <h2 className="product-list-title">
                      TABLET NỔI BẬT{" "}
                      <span>
                        <Link to={`/${productsCategories[2].slug}`}>
                          Xem tất cả
                        </Link>
                      </span>
                    </h2>

                    <Swiper
                      slidesPerView={5}
                      grid={{
                        rows: 2,
                        fill: "row",
                      }}
                      navigation={true}
                      spaceBetween={15}
                      pagination={{
                        clickable: true,
                      }}
                      modules={[Grid, Navigation]}
                      className="product-list-swiper"
                      style={{ padding: "10px" }}
                    >
                      {productsCategories[2].products.map((item) => {
                        let averageStar = item.reviews.average_star;
                        let total_reviews = item.reviews.total_reviews;
                        return (
                          <SwiperSlide>
                            <div
                              style={{ height: "100%" }}
                              class="product-info-container"
                            >
                              <div class="product-info">
                                <Link
                                  to={`/products/${item.slug}`}
                                  class="product__link"
                                >
                                  <div class="product__image">
                                    <img
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                      width="358"
                                      height="358"
                                      alt="Laptop Asus Gaming Rog Strix G15 G513IH HN015W"
                                      class="product__img"
                                    />
                                  </div>
                                  <div class="product__name">
                                    <h3>{item.name}</h3>
                                  </div>
                                  <div class="block-box-price">
                                    <span
                                      class="title-price"
                                      style={{ display: "none" }}
                                    >
                                      :
                                    </span>
                                    <div class="box-info__box-price">
                                      {item.discounted_price > 0 ? (
                                        <>
                                          <p class="product__price--show">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              item.price - item.discounted_price
                                            )}
                                            &nbsp;₫
                                          </p>{" "}
                                          <p class="product__price--through">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(item.price)}
                                            &nbsp;₫
                                          </p>{" "}
                                          <div class="product__price--percent">
                                            <p class="product__price--percent-detail">
                                              Giảm&nbsp;
                                              {Math.round(
                                                (item.discounted_price /
                                                  item.price) *
                                                  100
                                              )}
                                              %
                                            </p>
                                          </div>
                                        </>
                                      ) : (
                                        <p class="product__price--show">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.price)}
                                          &nbsp;₫
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  {item.discounted_price > 0 && (
                                    <div class="css-14q2k9d">
                                      <div class="css-zb7zul">
                                        <div class="css-1bqeu8f">TIẾT KIỆM</div>
                                        <div class="css-1rdv2qd">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.discounted_price)}
                                          &nbsp;₫
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                  <div
                                    class="product__promotions"
                                    style={{ display: "none" }}
                                  >
                                    <div class="promotion">
                                      <p class="gift-cont"></p>
                                    </div>
                                  </div>
                                </Link>
                                <div class="product__box-rating">
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
                                                        (averageStar -
                                                          (item - 1)) *
                                                        100
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
                                      <p
                                        style={{
                                          fontSize: "0.9rem",
                                          marginLeft: "5px",
                                          color: "#999",
                                        }}
                                      >
                                        ({total_reviews})
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                </>
              )}

              <div class="clear"></div>
            </div>
            {categories.length > 0 && (
              <>
                {/*====== phu kiện ======*/}
                <div class="category-container">
                  <div class="cate-box cat-prd p-t-15 bg-white margin-40">
                    <div class="cat-prd-oustanding p-l-15 p-r-15 margin-18">
                      <div class="title f20">
                        <h2>Phụ kiện</h2>
                      </div>
                      <div class="cat-prd-tabs"></div>
                    </div>
                    <div class="cat-prd__product">
                      <div class="row-flex">
                        {categories[4].children.map((item) => {
                          return (
                            <div class="col8 col-border">
                              <Link
                                to={`/phu-kien/${item.slug}`}
                                class="ct-item-a ct-transition"
                                onclick="ga('send', 'event', 'Home Page', 'Click Bottom Category Navigation', 'Phụ kiện nổi bật');"
                              >
                                <div class="cate-item text-center">
                                  <picture class="picture margin-10">
                                    <img
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                    />
                                  </picture>
                                  <div class="cate-item-name f15-bold">
                                    {item.name}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/*====== linh kiện máy tính======*/}
                <div class="category-container">
                  <div class="cate-box cat-prd p-t-15 bg-white margin-40">
                    <div class="cat-prd-oustanding p-l-15 p-r-15 margin-18">
                      <div class="title f20">
                        <h2>Linh kiện</h2>
                      </div>
                      <div class="cat-prd-tabs"></div>
                    </div>

                    <div class="cat-prd__product">
                      <div class="row-flex">
                        {categories[6].children[1].children.map((item) => {
                          return (
                            <div class="col8 col-border">
                              <Link
                                to={`/linh-kien/${item.slug}`}
                                class="ct-item-a ct-transition"
                                onclick="ga('send', 'event', 'Home Page', 'Click Bottom Category Navigation', 'Phụ kiện nổi bật');"
                              >
                                <div class="cate-item text-center">
                                  <picture class="picture margin-10">
                                    <img
                                      src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                    />
                                  </picture>
                                  <div class="cate-item-name f15-bold">
                                    {item.name}
                                  </div>
                                </div>
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <Loader fixed={true} />
        )}
      </section>
    </>
  );
};

export default Home;
