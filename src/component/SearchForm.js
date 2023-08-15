import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SearchForm.css";
import axios from "axios";

function useOutsideAlerter(
  ref,
  isSearch,
  setIsSearch,
  overLayEl,
  suggestEl,
  searchProductsEl
) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsSearch(false);
        overLayEl.current.style.display = "none";

        if (suggestEl.current) {
          suggestEl.current.style.display = "none";
        }
        if (searchProductsEl.current) {
          searchProductsEl.current.style.display = "none";
        }
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

const SearchForm = () => {
  const navigate = useNavigate();
  const [isSearch, setIsSearch] = useState(false);
  const [search_keyword, setSearchKeyWord] = useState(false);
  const [search_trend, setSearchTrend] = useState(null);
  const [search_history, setSearchHistory] = useState([]);
  const [most_view, setMostView] = useState(null);
  const [suggest_search_products, setSuggestSearchProducts] = useState([]);
  const formEl = useRef(null);
  const inputEl = useRef(null);
  const overLayEl = useRef(null);
  const suggestEl = useRef(null);
  const searchProductsEl = useRef(null);
  let myTimeout;
  useOutsideAlerter(
    formEl,
    isSearch,
    setIsSearch,
    overLayEl,
    suggestEl,
    searchProductsEl
  );
  useEffect(() => {
    axios
      .all([
        axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/products/search_trend`
        ),
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/products/most_view`),
      ])
      .then(
        axios.spread((res1, res2) => {
          setSearchTrend(res1.data);
          setMostView(res2.data);
        })
      );

    document
      .querySelector("form.search input[name=search]")
      .addEventListener("focus", function () {
        setIsSearch(true);
        overLayEl.current.style.display = "block";
        if (suggestEl.current) {
          suggestEl.current.style.display = "block";
        }
        if (searchProductsEl.current) {
          searchProductsEl.current.style.display = "block";
        }
      });

    const trending_boxes = document.querySelectorAll(
      "form.search .trending-box"
    );
    for (let i = 0; i < trending_boxes.length; i++) {
      trending_boxes[i].addEventListener("click", function () {
        overLayEl.current.style.display = "none";
        if (suggestEl.current) {
          suggestEl.current.style.display = "none";
        }

        setIsSearch(false);
      });
    }

    document
      .querySelector("form.search input")
      .addEventListener("input", function () {
        clearTimeout(myTimeout);
        if (this.value.length === 0) {
          setSuggestSearchProducts([]);
          return;
        }
        const Input = this;
      });
    let search_history = localStorage.getItem("search_history");
    if (search_history) {
      setSearchHistory(() => {
        return JSON.parse(search_history);
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputEl.current.value === "") {
      return;
    }
    clearTimeout(myTimeout);
    overLayEl.current.style.display = "none";
    if (suggestEl.current) {
      suggestEl.current.style.display = "none";
    }
    if (searchProductsEl.current) {
      searchProductsEl.current.style.display = "none";
    }
    let history_search = localStorage.getItem("search_history");
    if (history_search) {
      if (!search_history.includes(inputEl.current.value)) {
        setSearchHistory((prev) => {
          return [inputEl.current.value, ...prev];
        });
        history_search = JSON.parse(history_search);
        history_search = [inputEl.current.value, ...history_search];
        localStorage.setItem("search_history", JSON.stringify(history_search));
      }
    } else {
      localStorage.setItem(
        "search_history",
        JSON.stringify([inputEl.current.value])
      );
      setSearchHistory((prev) => {
        return [inputEl.current.value, ...prev];
      });
    }
    navigate(`/search?keyword=${inputEl.current.value}`);
  };

  const deleteSearchHistory = (keyword) => {
    setSearchHistory((prev) => {
      return prev.filter((item) => item !== keyword);
    });
    let search_history = JSON.parse(localStorage.getItem("search_history"));
    search_history = search_history.filter((item) => item !== keyword);
    localStorage.setItem("search_history", JSON.stringify(search_history));
  };

  const clickThrough = () => {
    overLayEl.current.style.display = "none";
    if (suggestEl.current) {
      suggestEl.current.style.display = "none";
    }
    if (searchProductsEl.current) {
      searchProductsEl.current.style.display = "none";
    }
  };

  return (
    <>
      <div ref={overLayEl} id="search-focus"></div>
      <form onSubmit={handleSubmit} ref={formEl} className="search">
        <input
          ref={inputEl}
          type="text"
          name="search"
          className="entry_form"
          placeholder="Tìm toàn bộ cửa hàng ở đây"
          autoComplete="off"
        />
        {suggest_search_products.length > 0 ? (
          <div
            ref={searchProductsEl}
            id="search_autocomplete"
            class="box-search-result search-autocomplete block"
          >
            {/* <div class="mb-1 category-box block">
            <p class="title-box">Có phải bạn muốn tìm</p>
            <div class="list-cate">
              <a
                href="https://cellphones.com.vn/may-tinh-de-ban/lap-rap.html"
                class="is-block"
              >
                <div class="wrapper">Máy tính lắp ráp sẵn CPS</div>
              </a>
            </div>
          </div> */}

            <div class="mt-2 product-box">
              <p class="title-box">Sản phẩm gợi ý</p>
              {suggest_search_products.map((item) => {
                return (
                  <Link
                    onClick={clickThrough}
                    to={`/products/${item.slug}`}
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
                              }).format(item.price - item.discounted_price)}
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
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div ref={suggestEl} id="suggest-search">
            {search_history && search_history.length > 0 && (
              <div class="history-search">
                <div class="is-flex is-align-items-center is-justify-content-space-between">
                  <div class="is-flex is-align-items-center">
                    <p class="title-trending mr-1">Lịch sử tìm kiếm</p>
                    <div class="icon-trending">
                      <svg
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 7.13513V12L15.2432 15.2432"
                          stroke="#121219"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                        <path
                          d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                          stroke="#121219"
                          stroke-width="1.5"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                <div class="is-block search-history-box">
                  {search_history.map((item) => {
                    return (
                      <a
                        href="javascript:void(0)"
                        class="is-flex search-history-item"
                      >
                        <p
                          onClick={() => {
                            navigate(`/search?keyword=${item}`);
                            overLayEl.current.style.display = "none";
                            if (suggestEl.current) {
                              suggestEl.current.style.display = "none";
                            }
                            if (searchProductsEl.current) {
                              searchProductsEl.current.style.display = "none";
                            }
                          }}
                        >
                          {item}
                        </p>
                        <span
                          onClick={() => deleteSearchHistory(item)}
                          class="delete-history-search"
                        >
                          Xóa
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {search_trend && (
              <div class="trending-search">
                <div class="is-flex is-align-items-center">
                  <p class="title-trending mr-1">Xu hướng tìm kiếm</p>{" "}
                  <svg width="15" x="0px" y="0px" viewBox="0 0 92.27 122.88">
                    <g>
                      <path
                        d="M18.61,54.89C15.7,28.8,30.94,10.45,59.52,0C42.02,22.71,74.44,47.31,76.23,70.89 c4.19-7.15,6.57-16.69,7.04-29.45c21.43,33.62,3.66,88.57-43.5,80.67c-4.33-0.72-8.5-2.09-12.3-4.13C10.27,108.8,0,88.79,0,69.68 C0,57.5,5.21,46.63,11.95,37.99C12.85,46.45,14.77,52.76,18.61,54.89L18.61,54.89z"
                        class="st0"
                      ></path>{" "}
                      <path
                        d="M33.87,92.58c-4.86-12.55-4.19-32.82,9.42-39.93c0.1,23.3,23.05,26.27,18.8,51.14 c3.92-4.44,5.9-11.54,6.25-17.15c6.22,14.24,1.34,25.63-7.53,31.43c-26.97,17.64-50.19-18.12-34.75-37.72 C26.53,84.73,31.89,91.49,33.87,92.58L33.87,92.58z"
                        class="st1"
                      ></path>
                    </g>
                  </svg>
                </div>{" "}
                <div class="is-flex trending-box">
                  {search_trend.map((item) => {
                    return (
                      <Link
                        onClick={clickThrough}
                        to={`/products/${item.slug}`}
                        class="is-flex trending-item"
                      >
                        <img
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                          width="40"
                          alt="Search Trending iPhone 14 Pro Max"
                        />
                        <p>{item.name}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
            {most_view && (
              <div class="most-viewed trending-search">
                <div class="is-flex is-align-items-center">
                  <p class="title-trending mr-1">Xem nhiều</p>
                </div>
                <div class="is-flex trending-box">
                  {most_view.map((item) => {
                    return (
                      <Link
                        onClick={clickThrough}
                        to={`/products/${item.slug}`}
                        class="is-flex trending-item"
                      >
                        <img
                          src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                          width="40"
                          alt="Search Trending iPhone 14 Pro Max"
                        />
                        <p>{item.name}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </form>
    </>
  );
};

export default SearchForm;
