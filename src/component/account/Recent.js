import React from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./Recent.css";

const Recent = () => {
  const [cookies, setCookie] = useCookies();
  let recently_viewed_products = cookies.recently_viewed_products
    ? cookies.recently_viewed_products
    : [];
  const averageStar = 0;
  return (
    <>
      {recently_viewed_products.length > 0 ? (
        <div id="list-product">
          {recently_viewed_products.map((item) => {
            let averageStar = item.reviews.average_star;
            let total_reviews = item.reviews.total_reviews;
            return (
              <div class="product-info-container">
                <div class="product-info">
                  <Link to={`/products/${item.slug}`} class="product__link">
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
                      <span class="title-price" style={{ display: "none" }}>
                        :
                      </span>
                      <div class="box-info__box-price">
                        {item.discounted_price > 0 ? (
                          <>
                            <p class="product__price--show">
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(item.price - item.discounted_price)}
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
                                  (item.discounted_price / item.price) * 100
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
                  <div
                    class="product__sticker-doc-quyen"
                    data-src="https://cdn2.cellphones.com.vn/70x/media/sticker/sticker-doc-quyen-3.svg"
                    lazy="loading"
                    style={{
                      display: "none",
                      backgroundImage: `url("https://cdn2.cellphones.com.vn/200x/media/wysiwyg/placehoder.png")`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Không có sản phẩm nào đã xem gần đây</p>
      )}
    </>
  );
};

export default Recent;
