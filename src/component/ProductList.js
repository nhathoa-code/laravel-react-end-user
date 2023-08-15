import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import Loader from "./loader/Loader";
import CircularProcessing from "../component/CircularProgress";
import "./ProductList.css";

const ProductList = () => {
  const [preventFilter, setPreventFilter] = useState(true);
  const { slug } = useParams("slug");
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [per_page, setPerPage] = useState(0);
  const [next_page_url, setNextPageUrl] = useState(null);
  const [productIds, setProductIds] = useState([]);
  const [category, setCategory] = useState(null);
  const [category_attributes, setCategoryAttributes] = useState([]);
  const [searchParams] = useSearchParams();
  const [brands, setBrands] = useState([]);
  const products_per_page = 6;
  const navigate = useNavigate();
  useEffect(() => {
    setPreventFilter(true);
    setIsFiltering(false);
    window.scrollTo(0, 0);
    setCategoryAttributes([]);
    setProducts([]);
    setIsLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/category/attributes/0/${slug}`,
        {
          params: {
            products_per_page: products_per_page,
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        setCategory(res.data.category);
        let query_filter = false;
        if (res.data.hasOwnProperty("attributes")) {
          setCategoryAttributes(
            res.data.attributes.map((item) => {
              let filtered_attr_values = [];
              if (searchParams.get(item.name.replace(/[ ]+/g, "-"))) {
                query_filter = true;
                filtered_attr_values = [
                  ...searchParams
                    .get(item.name.replace(/[ ]+/g, "-"))
                    .split(","),
                ];
              }
              item.values = item.values.map((item) => {
                if (filtered_attr_values.includes(`${item.id}`)) {
                  item.checked = true;
                } else {
                  item.checked = false;
                }
                return item;
              });
              return item;
            })
          );
        }

        setProductIds(res.data.productIds);
        let filtered_brands = [];
        if (searchParams.get("hãng-sản-xuất")) {
          query_filter = true;
          filtered_brands = [...searchParams.get("hãng-sản-xuất").split(",")];
        }

        if (res.data.hasOwnProperty("brands")) {
          setBrands(
            res.data.brands.map((item) => {
              if (filtered_brands.includes(`${item.id}`)) {
                item.choosen = true;
              } else {
                item.choosen = false;
              }
              return item;
            })
          );
        } else {
          setBrands([]);
        }

        if (query_filter) {
          setPreventFilter(false);
        } else {
          setProducts(res.data.products.data);
          setTotal(res.data.products.total);
          setPerPage(res.data.products.per_page);
          setNextPageUrl(res.data.products.next_page_url);
        }
      });
  }, [slug]);

  useEffect(() => {
    if (preventFilter) {
      return;
    }
    if (document.querySelector(".product-list-container")) {
      window.scrollTo({
        top: document.querySelector(".product-list-container").offsetTop - 36,
        behavior: "smooth",
      });
    }

    setIsFiltering(true);
    const choosen_brands = [];
    brands.map((item) => {
      if (item.choosen) {
        choosen_brands.push(item.id);
      }
    });
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/products/filter`, {
        input: JSON.stringify(
          category_attributes.map((item) => {
            let obj = { attr_id: item.attr_id };
            let checked_attr_values = [];
            item.values.map((item) => {
              if (item.checked) {
                checked_attr_values = [...checked_attr_values, item.id];
              }
            });
            obj.values = checked_attr_values;
            return obj;
          })
        ),
        productIds: JSON.stringify(productIds),
        choosen_brands: choosen_brands,
        products_per_page: products_per_page,
      })
      .then((res) => {
        setIsFiltering(false);
        setProducts(res.data.filtered_products.data);
        setTotal(res.data.filtered_products.total);
        setPerPage(res.data.filtered_products.per_page);
        setNextPageUrl(res.data.filtered_products.next_page_url);
      });
    let new_state = "";

    if (brands.find((b) => b.choosen)) {
      new_state += "&" + "hãng-sản-xuất" + "=";
      brands.map((item) => {
        if (item.choosen) {
          new_state += `${item.id},`;
        }
      });
      new_state = new_state.substring(0, new_state.length - 1);
    }

    category_attributes.map((item) => {
      if (item.values.find((item) => item.checked)) {
        new_state += "&" + item.name.replace(/[ ]+/g, "-") + `=`;
        item.values.map((item) => {
          if (item.checked) {
            new_state += `${item.id},`;
          }
        });
        new_state = new_state.substring(0, new_state.length - 1);
      }
    });
    navigate(`${new_state.length > 0 ? "?" + new_state.substring(1) : ""}`);
  }, [category_attributes, brands]);

  const handleLoadMore = (next_page_url) => {
    setIsLoadingMore(true);
    if (preventFilter) {
      axios
        .get(next_page_url, {
          params: {
            products_per_page: products_per_page,
          },
        })
        .then((res) => {
          setIsLoadingMore(false);
          setProducts((prev) => {
            return [...prev, ...res.data.products.data];
          });
          setTotal(res.data.products.total);
          setPerPage(res.data.products.per_page);
          setNextPageUrl(res.data.products.next_page_url);
        });
    } else {
      const choosen_brands = [];
      brands.map((item) => {
        if (item.choosen) {
          choosen_brands.push(item.id);
        }
      });
      axios
        .post(next_page_url, {
          input: JSON.stringify(
            category_attributes.map((item) => {
              let obj = { attr_id: item.attr_id };
              let checked_attr_values = [];
              item.values.map((item) => {
                if (item.checked) {
                  checked_attr_values = [...checked_attr_values, item.id];
                }
              });
              obj.values = checked_attr_values;
              return obj;
            })
          ),
          productIds: JSON.stringify(productIds),
          choosen_brands: choosen_brands,
          products_per_page: products_per_page,
        })
        .then((res) => {
          setIsLoadingMore(false);
          setProducts((prev) => {
            return [...prev, ...res.data.filtered_products.data];
          });
          setNextPageUrl(res.data.filtered_products.next_page_url);
        });
    }
  };

  const handleCheck = (attr_id, attr_value_id) => {
    setPreventFilter(false);
    setCategoryAttributes((prev) => {
      return [...prev].map((item) => {
        if (item.attr_id === attr_id) {
          item.values = item.values.map((item) => {
            if (item.id === attr_value_id) {
              if (item.checked) {
                item.checked = false;
              } else {
                item.checked = true;
              }
            }
            return item;
          });
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const handleBrandChoose = (brand_id) => {
    setPreventFilter(false);
    setBrands((prev) => {
      return [...prev].map((item) => {
        if (item.id === brand_id) {
          if (item.choosen) {
            item.choosen = false;
          } else {
            item.choosen = true;
          }
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const removeBrandsFilter = (brand_id) => {
    setBrands((prev) => {
      return [...prev].map((item) => {
        if (item.id === brand_id) {
          item.choosen = false;
          return item;
        } else {
          return item;
        }
      });
    });
  };

  const removeFilter = (attr_id, attr_value_id) => {
    setPreventFilter(false);
    setCategoryAttributes((prev) => {
      return [...prev].map((item) => {
        if (item.attr_id === attr_id) {
          item.values = item.values.map((item) => {
            if (item.id === attr_value_id) {
              item.checked = false;
            }
            return item;
          });
          return item;
        } else {
          return item;
        }
      });
    });
  };
  let averageStar = 0;

  return (
    <section id="main">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container">
          <div class="breadcrumb-container">
            <ol class="breadcrumb breadcrumb-margin">
              <li class="breadcrumb-item">
                <Link to="/" title="Trang chủ">
                  Trang chủ
                </Link>
              </li>
              {category && (
                <li class="breadcrumb-item active">{category.name}</li>
              )}
            </ol>
          </div>
          <div class="product-list-container">
            <div id="filter-bar">
              <aside id="shop_by">
                {category_attributes.map((Item) => {
                  return (
                    <>
                      <h3>{Item.name}</h3>
                      {Item.values.map((item) => {
                        return (
                          <>
                            <div class="checkbox">
                              <label class="VQRLw-">
                                <input
                                  id={item.id}
                                  class="QAVe-Q"
                                  type="checkbox"
                                  onChange={() => {
                                    handleCheck(Item.attr_id, item.id);
                                  }}
                                />
                                {/*=== QZTonY ====*/}
                                <div
                                  class={`tcK1ox${
                                    item.checked ? " QZTonY" : ""
                                  }`}
                                ></div>
                                {item.value}
                              </label>
                            </div>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </aside>
            </div>
            <div style={{ flex: "1" }}>
              <div class="card m-b-30 fpheadbox">
                <div class="card-header">
                  <div class="cdt-head">
                    <h1 class="cdt-head__title">Tìm thấy: </h1>
                    <span>({total} sản phẩm)</span>
                  </div>
                </div>
                {brands.length > 0 && (
                  <>
                    <div class="block-filter-brands">
                      <div class="brands__content">
                        <div class="list-brand">
                          {brands.map((item) => {
                            return (
                              <a
                                onClick={() => handleBrandChoose(item.id)}
                                class={`list-brand__item button__link${
                                  item.choosen ? " brand-choosen" : ""
                                }`}
                              >
                                <img
                                  src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                  height="50"
                                  alt="Mac"
                                  loading="lazy"
                                  class="filter-brand__img"
                                />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    {(document.querySelector(".tcK1ox.QZTonY") ||
                      document.querySelector(".brand-choosen")) && (
                      <div class="cdt-list-tag" style={{ display: "block" }}>
                        <span>Lọc theo: </span>
                        {brands.find((item) => item.choosen) && (
                          <>
                            <span style={{ marginRight: "5px" }}>
                              Hãng sản xuất:
                            </span>
                            {brands.map((item) => {
                              if (item.choosen) {
                                return (
                                  <a
                                    onClick={() => {
                                      removeBrandsFilter(item.id);
                                    }}
                                    href="javascript:void(0)"
                                  >
                                    <h2>{item.name}</h2>{" "}
                                    <i class="icon-cancel"></i>
                                  </a>
                                );
                              }
                            })}
                          </>
                        )}
                        {category_attributes.map((Item) => {
                          if (Item.values.find((item) => item.checked)) {
                            return [
                              <span
                                style={{
                                  marginRight: "5px",
                                }}
                              >
                                {Item.name}:
                              </span>,
                              ...Item.values.map((item) => {
                                if (item.checked) {
                                  return (
                                    <a
                                      onClick={() => {
                                        removeFilter(Item.attr_id, item.id);
                                      }}
                                      href="javascript:void(0)"
                                    >
                                      <h2>{item.value}</h2>{" "}
                                      <i class="icon-cancel"></i>
                                    </a>
                                  );
                                }
                              }),
                            ];
                          }
                        })}
                      </div>
                    )}
                    {/* <a
                  href="/may-tinh-xach-tay/su-dung-tam-nen-ips?sort=ban-chay-nhat"
                  class="fs-ctf-fidelall"
                >
                  Xóa tất cả <i class="icon-cancel"></i>
                </a> */}
                  </>
                )}
              </div>
              <div id="list-product">
                {isFiltering ? (
                  <Loader />
                ) : (
                  products.length > 0 &&
                  products.map((item) => {
                    let averageStar = item.reviews.average_star;
                    let total_reviews = item.reviews.total_reviews;
                    return (
                      <div class="product-info-container">
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
                  })
                )}
              </div>
              {products.length > 0 && !isFiltering && (
                <>
                  <div class="view_more">
                    <div>
                      <div id="results-hits">
                        1 - {products.length} trong {total} sản phẩm
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
                                {total - products.length > per_page
                                  ? per_page
                                  : total - products.length}{" "}
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

              {!isFiltering && products.length === 0 && (
                <div class="card-body p-0 p-t-15 p-b-30 no-result">
                  <div
                    class="fs-senull"
                    style={{ textAlign: "center", paddingBottom: "30px" }}
                  >
                    <p class="fs-senull-l1">
                      <img src="/images/no-result.png" />
                    </p>
                    <p class="fs-senull-l2">Không tìm thấy sản phẩm phù hợp</p>
                    <p class="fs-senull-l3">Vui lòng điều chỉnh lại bộ lọc</p>
                  </div>
                </div>
              )}
            </div>
            <div class="clear"></div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductList;
