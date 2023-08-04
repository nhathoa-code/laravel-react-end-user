import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppStoreContext } from "../provider/AppStoreProvider";
import { AuthContext } from "../provider/AuthProvider";
import CryptoJS from "crypto-js";
// Import reactjs modal
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import axios from "axios";
import Loader from "./loader/Loader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDF from "./PDF";
import Swal from "sweetalert2";
import "./BuildPc.css";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#fff",
  p: 4,
  outline: "none",
  padding: "15px",
  overflow: "auto",
};

const BuildPc = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { categories } = useContext(AppStoreContext);
  const [preventFilter, setPreventFilter] = useState(true);
  const [typeOfDevice, setTypeOfDevice] = useState(null);
  const [main_gallery, setMainGallery] = useState(null);
  const [products, setProducts] = useState([]);
  const [productIds, setProductIds] = useState([]);
  const [category_attributes, setCategoryAttributes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [per_page, setPerPage] = useState(0);
  const [next_page_url, setNextPageUrl] = useState(null);
  const [currentSlug, setCurrentSlug] = useState(null);
  const [type_of_devices, setTypeOfDevices] = useState(null);
  const [type_id, setTypeId] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const { setShoppingCart } = useContext(AppStoreContext);
  const { user } = useContext(AuthContext);
  const products_per_page = 8;
  const navigate = useNavigate();
  const crypto_secret = "vnhAG3fa26s";

  useEffect(() => {
    if (preventFilter) {
      return;
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
  }, [...category_attributes.map((item) => item.values), brands]);

  useEffect(() => {
    if (categories.length > 0) {
      let build_pc = [];
      if (localStorage.getItem("build_pc")) {
        build_pc = JSON.parse(
          CryptoJS.AES.decrypt(
            localStorage.getItem("build_pc"),
            crypto_secret
          ).toString(CryptoJS.enc.Utf8)
        );
      }
      setTypeOfDevices(() => {
        return [
          ...categories[6].children[1].children,
          categories[6].children[2],
          categories[4].children[6],
          categories[4].children[4],
        ].map((item) => {
          const type_device = build_pc.find(
            (bpc_item) => bpc_item.type_id === item.id
          );
          if (type_device) {
            return { category: item, device: type_device.device };
          } else {
            return { category: item, device: null };
          }
        });
      });
    }
  }, [categories]);

  const handleShowDevices = (slug, type_of_device, id) => {
    handleOpen();
    if (slug === currentSlug) {
      return;
    }
    setCurrentSlug(slug);
    setTypeOfDevice(type_of_device);
    setTypeId(id);
    setCategoryAttributes([]);
    setProducts([]);
    setIsLoading(true);
    setPreventFilter(true);
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
        if (res.data.hasOwnProperty("attributes")) {
          setCategoryAttributes(
            res.data.attributes.map((item) => {
              item.open = false;
              item.values = item.values.map((item) => {
                item.checked = false;
                return item;
              });
              return item;
            })
          );
        }
        setProductIds(res.data.productIds);
        if (res.data.hasOwnProperty("brands")) {
          setBrands(
            res.data.brands.map((item) => {
              item.choosen = false;
              return item;
            })
          );
        } else {
          setBrands([]);
        }
        setIsLoading(false);
        setProducts(res.data.products.data);
        setTotal(res.data.products.total);
        setPerPage(res.data.products.per_page);
        setNextPageUrl(res.data.products.next_page_url);
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

  const handleOpenAttribute = (attr_id) => {
    setCategoryAttributes((prev) => {
      return [...prev].map((item) => {
        if (item.attr_id === attr_id) {
          if (item.open) {
            item.open = false;
          } else {
            item.open = true;
          }
        } else {
          item.open = false;
        }
        return item;
      });
    });
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

  const pickDevice = (device) => {
    setTypeOfDevices((prev) => {
      const type_of_device = prev.find((item) => item.category.id === type_id);
      type_of_device.device = {
        id: device.id,
        name: device.name,
        image: device.image,
        quantity: 1,
        price: device.price,
        discounted_price: device.discounted_price,
        slug: device.slug,
      };
      return [...prev];
    });
    let build_pc = localStorage.getItem("build_pc");
    if (!build_pc) {
      build_pc = [
        {
          type_id: type_id,
          device: {
            id: device.id,
            name: device.name,
            image: device.image,
            quantity: 1,
            price: device.price,
            discounted_price: device.discounted_price,
            slug: device.slug,
          },
        },
      ];
      localStorage.setItem(
        "build_pc",
        CryptoJS.AES.encrypt(JSON.stringify(build_pc), crypto_secret).toString()
      );
    } else {
      build_pc = JSON.parse(
        CryptoJS.AES.decrypt(
          localStorage.getItem("build_pc"),
          crypto_secret
        ).toString(CryptoJS.enc.Utf8)
      );

      const type_device = build_pc.find((item) => item.type_id === type_id);
      if (type_device) {
        type_device.device = {
          id: device.id,
          name: device.name,
          image: device.image,
          quantity: 1,
          price: device.price,
          discounted_price: device.discounted_price,
          slug: device.slug,
        };
      } else {
        build_pc.push({
          type_id: type_id,
          device: {
            id: device.id,
            name: device.name,
            image: device.image,
            quantity: 1,
            price: device.price,
            discounted_price: device.discounted_price,
            slug: device.slug,
          },
        });
      }
      localStorage.setItem(
        "build_pc",
        CryptoJS.AES.encrypt(JSON.stringify(build_pc), crypto_secret).toString()
      );
    }
    handleClose();
  };

  const handleDelete = (type_id) => {
    setTypeOfDevices((prev) => {
      const type_of_device = prev.find((item) => item.category.id === type_id);
      type_of_device.device = null;
      return [...prev];
    });
    let build_pc = JSON.parse(
      CryptoJS.AES.decrypt(
        localStorage.getItem("build_pc"),
        crypto_secret
      ).toString(CryptoJS.enc.Utf8)
    );
    build_pc = build_pc.filter((item) => item.type_id !== type_id);
    localStorage.setItem(
      "build_pc",
      CryptoJS.AES.encrypt(JSON.stringify(build_pc), crypto_secret).toString()
    );
  };

  const handleChangeQuantity = (type_id, sign) => {
    setTypeOfDevices((prev) => {
      const type_of_device = prev.find((item) => item.category.id === type_id);
      if (sign === "+") {
        type_of_device.device.quantity += 1;
      } else if (sign === "-") {
        type_of_device.device.quantity -= 1;
      }
      return [...prev];
    });
    let build_pc = JSON.parse(
      CryptoJS.AES.decrypt(
        localStorage.getItem("build_pc"),
        crypto_secret
      ).toString(CryptoJS.enc.Utf8)
    );
    const type_device = build_pc.find((item) => item.type_id === type_id);
    if (sign === "+") {
      type_device.device.quantity += 1;
    } else {
      type_device.device.quantity -= 1;
    }
    localStorage.setItem(
      "build_pc",
      CryptoJS.AES.encrypt(JSON.stringify(build_pc), crypto_secret).toString()
    );
  };

  useEffect(() => {
    let subtotal = 0;
    if (type_of_devices) {
      type_of_devices.forEach((item) => {
        if (item.device) {
          subtotal +=
            item.device.quantity *
            (item.device.price - item.device.discounted_price);
        }
      });
      if (
        type_of_devices.filter((item) => {
          if (item.device) {
            return true;
          } else {
            return false;
          }
        }).length === 0
      ) {
        setMainGallery(null);
      } else if (type_of_devices[8].device) {
        setMainGallery(type_of_devices[8].category.id);
      } else if (type_of_devices[7].device) {
        setMainGallery(type_of_devices[7].category.id);
      } else if (type_of_devices[0].device) {
        setMainGallery(type_of_devices[0].category.id);
      } else if (type_of_devices[5].device) {
        setMainGallery(type_of_devices[5].category.id);
      } else if (type_of_devices[1].device) {
        setMainGallery(type_of_devices[1].category.id);
      } else if (type_of_devices[3].device) {
        setMainGallery(type_of_devices[3].category.id);
      } else if (type_of_devices[4].device) {
        setMainGallery(type_of_devices[4].category.id);
      } else if (type_of_devices[2].device) {
        setMainGallery(type_of_devices[2].category.id);
      } else if (type_of_devices[6].device) {
        setMainGallery(type_of_devices[6].category.id);
      } else if (type_of_devices[10].device) {
        setMainGallery(type_of_devices[10].category.id);
      } else if (type_of_devices[9].device) {
        setMainGallery(type_of_devices[9].category.id);
      }
    }
    setSubtotal(subtotal);
  }, [type_of_devices]);

  const handleReset = () => {
    setTypeOfDevices((prev) => {
      return prev.map((item) => {
        item.device = null;
        return item;
      });
    });
    localStorage.setItem(
      "build_pc",
      CryptoJS.AES.encrypt(JSON.stringify([]), crypto_secret).toString()
    );
  };

  const handleAddToCart = (order_now = false) => {
    if (!user) {
      return navigate(`/login?next=${encodeURI(window.location.pathname)}`);
    }
    const post_reqs = [];
    type_of_devices
      .filter((item) => item.device)
      .forEach((item) => {
        let data = {
          product_id: item.device.id,
          name: item.device.name,
          slug: item.device.slug,
          price: item.device.price,
          discounted_price: item.device.discounted_price,
          image: item.device.image,
        };
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
    setIsAddingToCart(true);
    axios
      .all(post_reqs)
      .then(
        axios.spread((...responses) => {
          setIsAddingToCart(false);
          responses.forEach((res) => {
            setShoppingCart((prev) => {
              if (res.data.new) {
                let item = {
                  ...res.data.cart_item,
                  isUpdate: false,
                  purchase: false,
                };
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
          if (order_now) {
            let purchase_items = responses.map((res) => res.data.cart_item.id);
            setShoppingCart((prev) => {
              return [...prev].map((item) => {
                if (purchase_items.includes(item.id)) {
                  item.purchase = true;
                } else {
                  item.purchase = false;
                }
                return item;
              });
            });
            return navigate("/checkout");
          } else {
            Swal.fire({
              title: "Sản phẩm đã được thêm vào giỏ hàng",
              confirmButtonText: "Đóng",
            });
          }
        })
      )
      .catch((err) => {
        setIsAddingToCart(false);
      });
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        id="linh-kien-modal"
      >
        <Box sx={{ ...style, width: 1000, height: 500, borderRadius: 1 }}>
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <h2 id="type-of-device">Chọn {typeOfDevice}</h2>
              <div class="card m-b-30 fpheadbox">
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
                  </>
                )}
                {category_attributes.length > 0 && (
                  <div class="normal-filter">
                    <div class="filter-list">
                      <div class="filter-list_inner">
                        {category_attributes.map((Item) => {
                          return (
                            <div class="ss-dropdown cs-dr categoryList">
                              <div
                                onClick={() => {
                                  handleOpenAttribute(Item.attr_id);
                                }}
                                class={`ss-dropdown-button${
                                  Item.open ? " active" : ""
                                }`}
                              >
                                {Item.name}
                                <span class="ss-dropdown-arrow ss-dropdown-arrow--triangle"></span>
                              </div>
                              <div
                                class="ss-dropdown-menu"
                                style={
                                  Item.open
                                    ? { display: "block" }
                                    : { display: "none" }
                                }
                              >
                                {Item.values.map((item) => {
                                  return (
                                    <div class="cs-dr-scr">
                                      <a
                                        onClick={() => {
                                          handleCheck(Item.attr_id, item.id);
                                        }}
                                        class={`${
                                          item.checked ? "active" : ""
                                        }`}
                                        href="javascript:void(0)"
                                      >
                                        <i class="ic-checkbox"></i> {item.value}
                                      </a>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                {(document.querySelector(".cs-dr-scr .active") ||
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
                                <h2>{item.name}</h2> <i class="icon-cancel"></i>
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
              </div>
              <div id="device-list">
                {isFiltering ? (
                  <Loader />
                ) : (
                  products.length > 0 && (
                    <>
                      {products.map((item) => {
                        return (
                          <div class="product-info-container">
                            <div class="product-info">
                              <Link
                                target="_blank"
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

                                <div
                                  class="product__promotions"
                                  style={{ display: "none" }}
                                >
                                  <div class="promotion">
                                    <p class="gift-cont"></p>
                                  </div>
                                </div>
                              </Link>
                              <div class="device-pick">
                                <button
                                  onClick={() => pickDevice(item)}
                                  className="btn_device-pick"
                                >
                                  Chọn
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )
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
              {!isLoading && !isFiltering && products.length === 0 && (
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
            </>
          )}
        </Box>
      </Modal>
      {isAddingToCart && <Loader fixed={true} />}
      <section id="main">
        <div class="container">
          <div class="build-pc__wrap row clearfix">
            <div class="col-8 build-pc__left">
              <div class="build-pc__select">
                <div class="devices js--layout">
                  {categories.length > 0 && type_of_devices && (
                    <>
                      {type_of_devices.map((item) => {
                        if (item.device) {
                          return (
                            <div class="device selected">
                              <span class="device__title text f-w-500 text-grayscale-600">
                                {item.category.name}
                              </span>
                              <div class="device__product">
                                <div class="product product--horizontal">
                                  <div class="product__img">
                                    <Link to={`/products/${item.device.slug}`}>
                                      <img
                                        src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.device.image}`}
                                        alt={item.device.name}
                                      />
                                    </Link>
                                  </div>
                                  <div class="product__info">
                                    <h3>
                                      <Link
                                        to={`/products/${item.device.slug}`}
                                        class="product__name m-b-4"
                                      >
                                        {item.device.name}
                                      </Link>
                                    </h3>
                                  </div>
                                  <div class="product__btn">
                                    <div class="flex flex-column">
                                      <div class="cs-btn-number">
                                        <button
                                          onClick={() =>
                                            handleChangeQuantity(
                                              item.category.id,
                                              "-"
                                            )
                                          }
                                          type="button"
                                          class={`btn btn-icon-single btn-outline-grayscale btn-sm${
                                            item.device.quantity <= 1
                                              ? " disabled"
                                              : ""
                                          }`}
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
                                          type="text"
                                          readonly=""
                                          class="form-input form-input-sm"
                                          value={item.device.quantity}
                                        />
                                        <button
                                          onClick={() =>
                                            handleChangeQuantity(
                                              item.category.id,
                                              "+"
                                            )
                                          }
                                          type="button"
                                          class="btn btn-icon-single btn-outline-grayscale btn-sm"
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
                                      <div class="flex flex-center-hor m-t-8">
                                        <div
                                          onClick={() =>
                                            handleDelete(item.category.id)
                                          }
                                          class="label label-sm flex flex-center-ver text-grayscale cursor-pointer"
                                        >
                                          <i class="fa-solid fa-trash-can"></i>
                                          <span class="alert-text label-text">
                                            Xoá
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="product__price">
                                      {item.device.discounted_price > 0 ? (
                                        <>
                                          <div class="price">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(
                                              item.device.quantity *
                                                (item.device.price -
                                                  item.device.discounted_price)
                                            )}
                                            ₫
                                          </div>
                                          <div class="product__strike">
                                            {new Intl.NumberFormat({
                                              style: "currency",
                                            }).format(item.device.price)}
                                            ₫
                                          </div>
                                        </>
                                      ) : (
                                        <div class="price">
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(
                                            item.device.quantity *
                                              item.device.price
                                          )}
                                          ₫
                                        </div>
                                      )}
                                      <a
                                        onClick={() =>
                                          handleShowDevices(
                                            item.category.slug,
                                            item.category.name,
                                            item.category.id
                                          )
                                        }
                                        class="btn-chonlai link-xs text-grayscale-600 m-t-12"
                                      >
                                        Chọn lại
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              onClick={() =>
                                handleShowDevices(
                                  item.category.slug,
                                  item.category.name,
                                  item.category.id
                                )
                              }
                              class="device "
                            >
                              <span class="device__title text f-w-500 text-grayscale-600">
                                {item.category.name}
                              </span>
                              <div class="device__icon">
                                <i class="ic-vga"></i>
                              </div>
                              <div class="flex-1 text-right">
                                <span class="link f-s-p-14">Chọn</span>
                              </div>
                            </div>
                          );
                        }
                      })}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div class="col-4 build-pc__right">
              {type_of_devices && (
                <>
                  {type_of_devices.filter((item) => item.device).length > 0 ? (
                    <div class="card card-md">
                      <div class="card-title">
                        <div class="label label-md">
                          <i class="ic-pc-tower ic-circle ic-bg-primary ic-lg m-r-8"></i>
                          <span class="alert-text label-text text--title">
                            CẤU HÌNH PC CỦA BẠN
                          </span>
                        </div>
                      </div>
                      <div class="card-body">
                        <div class="cta">
                          {type_of_devices &&
                            type_of_devices.filter(
                              (item) => item.device !== null
                            ).length !== 0 && (
                              <div class="pc-gallery">
                                <div class="main">
                                  {type_of_devices.find(
                                    (item) => item.category.id === main_gallery
                                  ) &&
                                    type_of_devices.find(
                                      (item) =>
                                        item.category.id === main_gallery
                                    ).device && (
                                      <img
                                        src={`${
                                          process.env.REACT_APP_SERVER_ROOT_URL
                                        }/${
                                          type_of_devices.find(
                                            (item) =>
                                              item.category.id === main_gallery
                                          ).device.image
                                        }`}
                                        alt={`${
                                          type_of_devices.find(
                                            (item) =>
                                              item.category.id === main_gallery
                                          ).device.name
                                        }`}
                                      />
                                    )}
                                </div>
                                <div class="thumbs">
                                  {type_of_devices
                                    .filter(
                                      (item) =>
                                        item.category.id !== main_gallery &&
                                        main_gallery !== null &&
                                        item.device !== null
                                    )
                                    .map((item) => {
                                      return (
                                        <div class="item" data-count="">
                                          <img
                                            src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.device.image}`}
                                            alt={`${item.device.name}`}
                                          />
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                            )}

                          <div class="pc-gallery-price">
                            <div class="flex flex-between flex-center-ver">
                              <div class="text text--title f-s-p-16">
                                Chi phí dự tính
                              </div>
                              <div class="text-primary f-w-500 f-s-p-16">
                                {new Intl.NumberFormat({
                                  style: "currency",
                                }).format(subtotal)}
                                đ
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="card-footer">
                        <div class="flex flex-wrap">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              marginBottom: "8px",
                            }}
                          >
                            <a
                              style={{
                                backgroundColor: "#041e3a",
                                flex: "1 1 0",
                                marginRight: "10px",
                              }}
                              onClick={() => handleAddToCart(true)}
                              class="btn btn-primary btn-xl f-w-500 w-100 m-b-8"
                            >
                              <span style={{ color: "#fff" }}>MUA NGAY</span>
                            </a>
                            <a
                              onClick={() => handleAddToCart()}
                              style={{
                                backgroundColor: "transparent",
                                flex: "1 1 0",
                                border: "1px solid #041e3a",
                              }}
                              class="btn btn-primary btn-xl f-w-500 w-100 m-b-8"
                            >
                              <span style={{ color: "#041e3a" }}>
                                THÊM GIỎ HÀNG
                              </span>
                            </a>
                          </div>

                          <PDFDownloadLink
                            className="w-100"
                            document={
                              <PDF
                                data={type_of_devices
                                  .filter((item) => item.device)
                                  .map((item) => item.device)}
                              />
                            }
                            fileName="build-pc.pdf"
                          >
                            {() => (
                              <a class="btn btn-link btn-lg flex-row w-100 m-b-8">
                                <svg viewBox="0 0 512 512">
                                  <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zM432 456c-13.3 0-24-10.7-24-24s10.7-24 24-24s24 10.7 24 24s-10.7 24-24 24z"></path>
                                </svg>
                                <span class="f-s-ui-16">TẢI BẢNG GIÁ</span>
                              </a>
                            )}
                          </PDFDownloadLink>
                          <a
                            onClick={() => handleReset()}
                            class="btn btn-link btn-lg flex-row w-100"
                          >
                            <i class="fa fa-refresh"></i>
                            <span class="f-s-ui-16">
                              THIẾT LẶP LẠI CẤU HÌNH
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div class="card card-md empty">
                      <div class="content">
                        <img
                          src="https://fptshop.com.vn/may-tinh-de-ban/xay-dung-cau-hinh-may-tinh/desktop/images/pharse2/build.jpg"
                          alt=""
                        />
                        <div class="text text-center m-t-16">
                          Vui lòng chọn các linh kiện <br />
                          để xây dựng trọn bộ PC
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuildPc;
