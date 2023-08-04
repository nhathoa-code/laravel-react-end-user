import React, { useState, useContext, useRef, useEffect } from "react";
import "./Compare.css";
import parse from "html-react-parser";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { AppStoreContext } from "../provider/AppStoreProvider";
import CircularProcessing from "../component/CircularProgress";
import axios from "axios";

function useOutsideAlerter(ref, searchProductsEl, isSearch, setIsSearch) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        searchProductsEl.current.style.display = "none";
        setIsSearch(false);
      }
    }
    if (isSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, isSearch]);
}

const Compare = () => {
  const [searchParams] = useSearchParams();
  const [isSearch, setIsSearch] = useState(false);
  const [merged_titles, setMergedTitles] = useState([]);
  const [merged_titles_technical_infos, setMergedTitlesTechnicalInfos] =
    useState([]);
  const [isCompare, setIsCompare] = useState(false);
  const [loading, setLoading] = useState(false);
  const { products_to_compare, setProductsToCompare, compareCat } =
    useContext(AppStoreContext);
  const [suggest_search_products, setSuggestSearchProducts] = useState([]);
  const searchProductsEl = useRef(null);
  const formEl = useRef(null);
  const inputEl = useRef(null);
  const compareEl = useRef(null);
  const navigate = useNavigate();
  const averageStar = 0;

  useEffect(() => {
    if (products_to_compare.length === 0) {
      navigate("/");
    }
    document
      .querySelector("form.compare-form input")
      .addEventListener("focus", function () {
        searchProductsEl.current.style.display = "block";
        setIsSearch(true);
      });
  }, []);

  useOutsideAlerter(formEl, searchProductsEl, isSearch, setIsSearch);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputEl.current.value.length === 0) {
      setSuggestSearchProducts([]);
      return;
    }
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/products/search_keyword?compare`,
        {
          params: {
            keyword: inputEl.current.value,
            compare_cat: compareCat,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        setSuggestSearchProducts(res.data);
      });
  };

  const handleChoose = (item) => {
    if (!products_to_compare.find((Item) => Item.id === item.id)) {
      setProductsToCompare((prev) => {
        return [...prev, item];
      });
    } else {
      return;
    }
    searchProductsEl.current.style.display = "none";
    setIsSearch(false);
    if (isCompare) {
      window.scrollTo({
        top: document.querySelector(".compare").offsetTop,
        behavior: "smooth",
      });
    }
  };

  const removeCompre = (id) => {
    if (products_to_compare.length === 2) {
      setIsCompare(false);
    } else if (products_to_compare.length === 1) {
      navigate("/");
    }
    setProductsToCompare((prev) => {
      return [...prev].filter((item) => item.id !== id);
    });
  };

  const handleCompare = () => {
    if (isCompare) {
      return;
    }
    setMergedTitles([]);
    setMergedTitlesTechnicalInfos([]);
    setIsCompare(true);
    setTimeout(() => {
      window.scrollTo({
        top: document.querySelector(".compare").offsetTop,
        behavior: "smooth",
      });
    }, 1);
    let merged_titles = [];
    let merged_titles_technical_infos = [];
    products_to_compare.forEach((item) => {
      item.specification.forEach((item) => {
        if (!merged_titles.includes(item.title)) {
          merged_titles.push(item.title);
        }
      });
    });

    merged_titles.forEach((title) => {
      let merged_tech_infos = [];
      products_to_compare.forEach((item) => {
        if (item.specification.find((item) => item.title === title)) {
          item.specification
            .find((item) => item.title === title)
            .technical_infos.forEach((tech_info) => {
              if (!merged_tech_infos.includes(tech_info.technical_info)) {
                merged_tech_infos.push(tech_info.technical_info);
              }
            });
        }
      });
      merged_titles_technical_infos.push(merged_tech_infos);
    });
    setMergedTitles(merged_titles);
    setMergedTitlesTechnicalInfos(merged_titles_technical_infos);
  };
  return (
    <section id="main">
      <div class="container">
        <form onSubmit={handleSubmit} ref={formEl} class="search compare-form">
          <input
            disabled={products_to_compare.length === 3 ? true : false}
            ref={inputEl}
            type="text"
            name="search_compare"
            class="compare_form"
            placeholder="Nhập tên sản phẩm muốn so sánh..."
            autocomplete="off"
          ></input>
          <div
            ref={searchProductsEl}
            id="search_autocomplete_compare"
            class="box-search-result search-autocomplete block"
          >
            {loading ? (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                <CircularProcessing size={30} />
              </div>
            ) : (
              <div class="mt-2 product-box">
                {suggest_search_products.length > 0 ? (
                  <>
                    {" "}
                    {suggest_search_products.map((item) => {
                      return (
                        <a
                          onClick={() => handleChoose(item)}
                          href="javascript:void(0)"
                          class="header-search-item is-flex is-align-items-center"
                        >
                          <img
                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                            alt={`${item.name}`}
                            loading="lazy"
                            class="mr-1"
                          />
                          <div class="header-search-item-info">
                            <p class="header-search-name">{item.name}</p>
                            <div class="is-flex is-align-items-center">
                              {item.discounted_price > 0 ? (
                                <>
                                  <p class="header-search-special mr-1">
                                    {new Intl.NumberFormat({
                                      style: "currency",
                                    }).format(
                                      item.price - item.discounted_price
                                    )}
                                    &nbsp;₫
                                  </p>{" "}
                                  <p class="header-search-price">
                                    {new Intl.NumberFormat({
                                      style: "currency",
                                    }).format(item.price)}
                                    &nbsp;₫
                                  </p>{" "}
                                </>
                              ) : (
                                <p class="header-search-special mr-1">
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(item.price)}
                                  &nbsp;₫
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      );
                    })}
                  </>
                ) : (
                  <p style={{ textAlign: "center", marginTop: "50px" }}>
                    Không tìm thấy sản phẩm nào!
                  </p>
                )}
              </div>
            )}
          </div>
        </form>

        <div id="products-to-compare">
          {products_to_compare.map((item, index) => {
            return (
              <>
                <div key={item.id} class="product-info-container">
                  <span
                    onClick={() => removeCompre(item.id)}
                    class="compare-remove"
                  ></span>
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
                {products_to_compare.length >= 2 &&
                  index + 1 < products_to_compare.length && (
                    <span class="compare-vs">VS</span>
                  )}
              </>
            );
          })}
        </div>
        {products_to_compare.length > 1 && (
          <div
            style={{
              textAlign: "center",
              paddingTop: "20px",
            }}
          >
            <a
              onClick={handleCompare}
              href="javascript:void(0)"
              class="re-link margin-left-2x"
            >
              <span class="ic-plus margin-right-sm"></span>So sánh
            </a>
          </div>
        )}

        <div
          ref={compareEl}
          style={isCompare ? { display: "block" } : { display: "none" }}
          class="compare"
        >
          <table class="table tab-content table-bordered table-striped table-compare">
            <tbody>
              <tr class="specs-group">
                <th colspan="4">Thông tin chung</th>
              </tr>
              <tr class="specs equaHeight" data-obj="h3">
                <td class="text " style={{ width: "17.5%" }}>
                  Hình ảnh, giá
                </td>
                {products_to_compare.map((item) => {
                  return (
                    <td class="item image" style={{ width: "27.5%" }}>
                      <div class="image">
                        <Link to={`products/${item.slug}`}>
                          <img
                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                          />
                        </Link>
                      </div>
                      <h3 style={{ height: "21px", textAlign: "center" }}>
                        <Link to={`products/${item.slug}`}>{item.name}</Link>
                      </h3>
                      <div class="price-note">
                        <p style={{ textAlign: "center" }} class="price">
                          {item.discounted_price > 0 ? (
                            <>
                              <strong style={{ marginRight: "7px" }}>
                                {new Intl.NumberFormat({
                                  style: "currency",
                                }).format(item.price - item.discounted_price)}
                                &nbsp;₫
                              </strong>
                              <i>
                                <strike>
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(item.price)}
                                  &nbsp;₫
                                </strike>
                              </i>
                            </>
                          ) : (
                            <strong>
                              {new Intl.NumberFormat({
                                style: "currency",
                              }).format(item.price)}
                              &nbsp;₫
                            </strong>
                          )}
                        </p>
                        <p class="note"></p>
                      </div>
                    </td>
                  );
                })}
              </tr>
              {merged_titles.map((title, index) => {
                return (
                  <>
                    <tr class="specs-group">
                      <th class="text" colspan="4">
                        {title}
                      </th>
                    </tr>
                    {merged_titles_technical_infos[index].map((tech_info) => {
                      return (
                        <>
                          <tr class="specs">
                            <th class="text">{tech_info}:</th>
                            {products_to_compare.map((item) => {
                              return item.specification.find(
                                (item) => item.title === title
                              ) ? (
                                item.specification
                                  .find((item) => item.title === title)
                                  .technical_infos.find(
                                    (item) => item.technical_info === tech_info
                                  ) ? (
                                  <td class="data">
                                    <span>
                                      {item.specification
                                        .find((item) => item.title === title)
                                        .technical_infos.find(
                                          (item) =>
                                            item.technical_info === tech_info
                                        )
                                        .technical_content.split("\n")
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
                                    </span>
                                  </td>
                                ) : (
                                  <td class="data">
                                    <span></span>
                                  </td>
                                )
                              ) : (
                                <td class="data">
                                  <span></span>
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      );
                    })}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Compare;
