import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "./loader/Loader";
import axios from "axios";
import "./SearchResult.css";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [next_page_url, setNextPageUrl] = useState(null);
  const keyword = searchParams.get("keyword");
  const averageStar = 0;
  useEffect(() => {
    if (keyword) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/products/search_keyword`, {
          params: {
            keyword: keyword,
          },
        })
        .then((res) => {
          setLoading(false);
          setSearchedProducts(res.data.data);
          setTotal(res.data.total);
          setNextPageUrl(res.data.next_page_url);
          console.log(res.data);
        });
    } else {
      setLoading(false);
      setSearchedProducts([]);
    }
  }, [keyword]);

  const handleLoadMore = (next_page_url) => {
    setIsLoadingMore(true);
    axios
      .get(next_page_url, {
        params: {
          keyword: keyword,
        },
      })
      .then((res) => {
        setIsLoadingMore(false);
        setSearchedProducts((prev) => {
          return [...prev, ...res.data.data];
        });
        setNextPageUrl(res.data.next_page_url);
      });
  };

  return (
    <section id="main" className="search-result">
      <div class="container">
        {loading ? (
          <Loader />
        ) : (
          <>
            {searchedProducts.length > 0 ? (
              <>
                <h1 class="search-result-count has-text-centered mb-3">
                  Tìm thấy
                  <strong> {total}</strong> sản phẩm cho từ khoá
                  <strong> '{keyword}'</strong>
                </h1>
                <div id="list-searched-product">
                  {searchedProducts.map((item) => {
                    return (
                      <div class="product-info-container">
                        <div class="product-info">
                          <Link
                            onClick={() => {
                              axios.post(
                                `${process.env.REACT_APP_API_ENDPOINT}/products/increment_search_click/${item.id}`
                              );
                            }}
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
                                          (item.discounted_price / item.price) *
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
                            <div class="product__promotions">
                              <div>
                                <div class="promotion">
                                  <p class="coupon-price">
                                    Phần Mềm Diệt Virus, Office chính hãng chỉ
                                    từ 150k và <b>1 km</b> khác
                                  </p>
                                </div>
                              </div>
                            </div>
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
                                                  (averageStar - (item - 1)) *
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
                {searchedProducts.length > 0 && (
                  <>
                    <div class="view_more">
                      <div>
                        <div id="results-hits">
                          1 - {searchedProducts.length} trong {total} sản phẩm
                        </div>
                        {next_page_url && (
                          <div class="view-btn">
                            <button
                              onClick={() => handleLoadMore(next_page_url)}
                              id="view-more"
                            >
                              {isLoadingMore ? (
                                " đang tải..."
                              ) : (
                                <>
                                  Xem thêm{" "}
                                  {total - searchedProducts.length > 10
                                    ? 10
                                    : total - searchedProducts.length}{" "}
                                  sản phẩm
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div class="senull">
                <p class="senull-l1">
                  <img src="images/noti-search.png" />
                </p>
                <p class="senull-l2">
                  Rất tiếc chúng tôi không tìm thấy kết quả của{" "}
                  <strong>{keyword}</strong>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default SearchResult;
