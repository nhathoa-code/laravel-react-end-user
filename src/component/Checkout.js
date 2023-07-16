import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "./loader/Loader";
import Popup from "./popup/Popup";
import CouponPopup from "./coupon_popup/CouponPopup";
import { useNavigate } from "react-router-dom";
import shipping_fee from "./shipping_fee.json";
import "./Checkout.css";
import { AuthContext } from "../provider/AuthProvider";
import { AppStoreContext } from "../provider/AppStoreProvider";
/*=============   copy from address   =============*/
// Import reactjs modal
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
  str = str.replace(/\u02C6|\u0306|\u031B/g, "");
  str = str.replace(/ + /g, " ");
  str = str.trim();
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str;
}

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

/*=============  end copy from address   =============*/
const Checkout = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (
      shopping_cart.length === 0 ||
      !shopping_cart.find((item) => item.purchase)
    ) {
      setPopup({
        message:
          shopping_cart.length === 0
            ? "Vui lòng chọn sản phẩm vào giỏ hàng trước khi thanh toán!"
            : "Vui lòng chọn sản phẩm bạn muốn thanh toán",
        btn2:
          shopping_cart.length === 0 ? "Tiếp tục mua hàng" : "Trở về giỏ hàng",
        action:
          shopping_cart.length === 0
            ? () => {
                navigate("/");
              }
            : () => {
                navigate("/cart");
              },
      });
    }
  }, []);
  let subtotal = 0;
  let total_items = 0;
  const [popup, setPopup] = useState(null);
  const [popup1, setPopup1] = useState(null);
  const [couponPopup, setCouponPopup] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);

  const { user } = useContext(AuthContext);
  const { shopping_cart, setShoppingCart, chosenCoupon, chosenFreeShip } =
    useContext(AppStoreContext);
  const [isLoading, setIsLoading] = useState(true);
  const [address, setAddress] = useState([]);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigate = useNavigate();
  const [addressId, setAddressId] = useState(null);
  const [chosenAddress, setChosenAddress] = useState({});
  const [requireAddress, setRequireAddress] = useState(false);
  const [chooseAddress, setChooseAddress] = useState(false);
  const [addNewAddress, setAddNewAddress] = useState(false);
  useEffect(() => {
    if (Object.keys(chosenAddress).length !== 0) {
      setShippingFee(
        shipping_fee.find((item) => item.name === chosenAddress.city)
          .shipping_fee
      );
    } else {
      setShippingFee(null);
    }
  }, [chosenAddress]);
  /*=============   copy from address   =============*/
  const [isEditMode, setIsEditMode] = useState(false);
  const [id, setId] = useState(null);
  /*========= reactjs modal mui ===========*/
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      if (document.querySelector("div.kGwaat")) {
        document
          .querySelector("div.kGwaat")
          .addEventListener("click", function (e) {
            if (e.target.classList.contains("cs-input")) {
              return;
            }
            if (!e.target.classList.contains("dropdown-button")) {
              cleanUp();
            }
          });
      }
    }, 1);
  };
  const handleClose = () => {
    setFullName("");
    setPhoneNumber("");
    setChosenCity("");
    setChosenDistrict("");
    setChosenVillage("");
    setAddressDetail("");
    setIsEditMode(false);
    //setOpen(false);
  };
  /*========= end reactjs modal mui ===========*/
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [full_name, setFullName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [chosenCity, setChosenCity] = useState(null);
  const [chosenDistrict, setChosenDistrict] = useState(null);
  const [chosenVillage, setChosenVillage] = useState(null);
  const [address_detail, setAddressDetail] = useState("");
  const [isDefaulted, setIsDefaulted] = useState(false);

  const handleInput = (e) => {
    switch (e.target.name) {
      case "full_name":
        setFullName(e.target.value);
        break;
      case "phone_number":
        setPhoneNumber(e.target.value);
        break;
      case "address_detail":
        setAddressDetail(e.target.value);
    }
  };

  const handleDropdownCities = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      cleanUp();
      return;
    }
    cleanUp();
    e.currentTarget.classList.add("active");
    func(e);
  };

  const handleDropdownDistricts = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      cleanUp();
      return;
    }
    cleanUp();
    e.currentTarget.classList.add("active");
    func(e);
  };

  const handleDropdownVillages = (e) => {
    if (e.currentTarget.classList.contains("active")) {
      cleanUp();
      return;
    }
    cleanUp();
    e.currentTarget.classList.add("active");
    func(e);
  };

  const func = (e) => {
    let dropdown_button_id = e.currentTarget.getAttribute("id");
    let dropdown_menu_id = dropdown_button_id.replace("button-", "");
    document.querySelector(`#${dropdown_menu_id}`).classList.add("open");
  };

  const cleanUp = () => {
    if (document.querySelector(".dropdown-menu.open")) {
      document.querySelector(".dropdown-menu.open").classList.remove("open");
    }
    if (document.querySelector(".dropdown-button.active")) {
      document
        .querySelector(".dropdown-button.active")
        .classList.remove("active");
    }
  };

  useEffect(() => {
    axios
      .all([
        fetch("https://provinces.open-api.vn/api/?depth=3"),
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/address`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
      ])
      .then(
        axios.spread(async (res1, res2) => {
          setIsLoading(false);
          const data = await res1.json();
          setCities(data);
          localStorage.setItem("cities", JSON.stringify(data));
          let address = res2.data;
          setAddress(address);
          if (address.length === 0) {
            setRequireAddress(true);
            handleOpen();
          } else {
            let defaulted_address = address.find(
              (item) => item.is_defaulted == 1
            );
            if (defaulted_address) {
              setChosenAddress(defaulted_address);
            } else {
              setChosenAddress({});
            }
          }
        })
      );
  }, []);

  const handleSelectCity = (code) => {
    const chosen_city = cities.find((item) => item.code === code);
    if (chosen_city.name === chosenCity) {
      return;
    }
    setChosenCity(chosen_city.name);
    setChosenDistrict("");
    setChosenVillage("");
    setDistricts(chosen_city.districts);
    localStorage.setItem("districts", JSON.stringify(chosen_city.districts));
    setVillages([]);
  };

  const handleSelectDistrict = (code) => {
    const chosen_district = districts.find((item) => item.code === code);
    if (chosen_district.name === chosenDistrict) {
      return;
    }
    setChosenDistrict(chosen_district.name);
    setChosenVillage("");
    setVillages(chosen_district.wards);
    localStorage.setItem("villages", JSON.stringify(chosen_district.wards));
  };

  const handleSelectVillage = (code) => {
    const chosen_village = villages.find((item) => item.code === code);
    setChosenVillage(chosen_village.name);
  };

  const handleCitySearch = (e) => {
    let search_string = e.target.value;
    if (search_string === "") {
      setCities(JSON.parse(localStorage.getItem("cities")));
    } else {
      setCities(
        JSON.parse(localStorage.getItem("cities")).filter((item) =>
          removeVietnameseTones(item.name.toLowerCase()).includes(
            removeVietnameseTones(search_string.toLowerCase())
          )
        )
      );
    }
  };

  const handleDistrictSearch = (e) => {
    let search_string = e.target.value;
    if (search_string === "") {
      setDistricts(JSON.parse(localStorage.getItem("districts")));
    } else {
      setDistricts(
        JSON.parse(localStorage.getItem("districts")).filter((item) =>
          removeVietnameseTones(item.name.toLowerCase()).includes(
            removeVietnameseTones(search_string.toLowerCase())
          )
        )
      );
    }
  };

  const handleVillageSearch = (e) => {
    let search_string = e.target.value;
    if (search_string === "") {
      setVillages(JSON.parse(localStorage.getItem("villages")));
    } else {
      setVillages(
        JSON.parse(localStorage.getItem("villages")).filter((item) =>
          removeVietnameseTones(item.name.toLowerCase()).includes(
            removeVietnameseTones(search_string.toLowerCase())
          )
        )
      );
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    const btns = document.querySelectorAll("._9q6Q2s");
    for (let i = 0; i < btns.length; i++) {
      btns[i].setAttribute("disabled", true);
    }
    const data = {
      full_name: full_name,
      phone_number: phone_number,
      city: chosenCity,
      district: chosenDistrict,
      village: chosenVillage,
      address: address_detail,
      default: document.querySelector("#default").checked,
    };
    if (isEditMode) {
      axios
        .put(`${process.env.REACT_APP_API_ENDPOINT}/address/${id}`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        })
        .then((res) => {
          setAddress((prev) => {
            return [...prev].map((item) => {
              if (item.id === id) {
                return res.data;
              } else {
                if (res.data.is_defaulted == 1) {
                  item.is_defaulted = "0";
                }
                return item;
              }
            });
          });
          setIsEditMode(false);
          setChooseAddress(true);
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/address`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          setAddress((prev) => {
            return [...prev, res.data];
          });
          setChooseAddress(true);
          setAddNewAddress(false);
          if (requireAddress) {
            setRequireAddress(false);
          }
        });
    }
  };

  useEffect(() => {
    if (addNewAddress) {
      document.querySelector(
        "form#new-address-form input[name=full_name]"
      ).value = "";
      document.querySelector(
        "form#new-address-form input[name=phone_number]"
      ).value = "";
      document.querySelector(
        "form#new-address-form  textarea[name=address_detail]"
      ).value = "";
      document.querySelector("#city-dropdown").innerText = "Chọn Tỉnh/Thành";
      document.querySelector("#district-dropdown").innerText =
        "Chọn Quận/Huyện";
      document.querySelector("#village-dropdown").innerText = "Chọn Phường/Xã";
    }
  }, [addNewAddress]);

  // const handleDelete = (id) => {
  //   axios
  //     .delete(`${process.env.REACT_APP_API_ENDPOINT}/address/${id}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
  //       },
  //     })
  //     .then(() => {
  //       setAddress((prev) => {
  //         return [...prev].filter((item) => item.id !== id);
  //       });
  //     });
  // };

  const handleEdit = (id) => {
    const edited_address = address.find((item) => item.id === id);
    let city = cities.find((item) => item.name === edited_address.city);
    let village = city.districts.find(
      (item) => item.name === edited_address.district
    );
    setId(edited_address.id);
    setDistricts(city.districts);
    setVillages(village.wards);
    setFullName(edited_address.full_name);
    setPhoneNumber(edited_address.phone_number);
    setChosenCity(edited_address.city);
    setChosenDistrict(edited_address.district);
    setChosenVillage(edited_address.village);
    setAddressDetail(edited_address.address);
    setIsDefaulted(() => {
      return edited_address.is_defaulted == 1 ? true : false;
    });
    setIsEditMode(true);
    handleOpen();
  };

  /*=============   end copy from address   =============*/

  const handleAddOrder = () => {
    if (Object.keys(chosenAddress).length === 0) {
      return setPopup1({
        message: "Bạn chưa có địa chỉ nhận hàng !",
        btn2: "Trở lại",
        action: () => {
          setPopup1(null);
        },
      });
    }

    if (!paymentMethod) {
      return setPopup1({
        message: "Bạn chưa chọn phương thức thanh toán !",
        btn2: "Trở lại",
        action: () => {
          setPopup1(null);
        },
      });
    }

    setIsLoading(true);

    let items_to_purchase = [];
    shopping_cart.forEach((item) => {
      if (item.purchase) {
        items_to_purchase.push(item.id);
      }
    });
    let data = {
      buyer_info: JSON.stringify(chosenAddress),
      pttt: paymentMethod,
      items_to_purchase: items_to_purchase,
      shipping_fee: shippingFee,
    };
    if (chosenCoupon) {
      data.coupon = chosenCoupon;
    }
    if (chosenFreeShip) {
      data.free_ship = chosenFreeShip;
    }
    if (paymentMethod === "vnpay") {
      data.return_url = `http://${window.location.host}/online_payment/vnpay`;
    }
    axios
      .post(`${process.env.REACT_APP_API_ENDPOINT}/orders`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        setIsLoading(false);
        if (paymentMethod === "vnpay") {
          window.location.href = res.data;
        } else if (paymentMethod === "cod") {
          document
            .getElementById("main")
            .scrollIntoView({ behavior: "smooth" });
          setIsOrderSuccess(true);
          setShoppingCart([]);
          navigate(`/account/order/${res.data.order_id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChooseAddress = (e, id) => {
    setAddressId(id);
    let radios = document.querySelectorAll(".stardust-radio-button");
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].classList.contains("stardust-radio-button--checked")) {
        radios[i].classList.remove("stardust-radio-button--checked");
      }
    }
    e.currentTarget.classList.add("stardust-radio-button--checked");
  };

  const handleUpdateChosenAddress = () => {
    if (addressId) {
      setChosenAddress(address.find((item) => item.id === addressId));
    }
    setOpen(false);
  };

  const handleChoosePaymentMethod = (e, payment_method) => {
    if (
      document.querySelector(
        ".stardust-radio-button.stardust-radio-button--checked"
      )
    ) {
      document
        .querySelector(".stardust-radio-button.stardust-radio-button--checked")
        .classList.remove("stardust-radio-button--checked");
    }
    e.currentTarget
      .querySelector(".stardust-radio-button")
      .classList.add("stardust-radio-button--checked");
    setPaymentMethod(payment_method);
  };

  return (
    <section id="main" class="entire_width">
      {!popup ? (
        <>
          {popup1 && <Popup {...popup1} />}
          {couponPopup && (
            <CouponPopup
              setCouponPopup={setCouponPopup}
              shopping_cart={shopping_cart}
            />
          )}
          <Modal
            className="product-specification"
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={modal_style}>
              {chooseAddress && (
                <div class="ZTVg+6">
                  <div class="TytfN+">
                    <div class="D0rZmj">
                      <div class="rgsMiz">
                        <div>Địa Chỉ Của Tôi</div>
                      </div>
                      <div class="Vvugcp g60B0R">
                        <div>
                          {address.map((item) => {
                            return (
                              <div class="eh3LSo sCgduz">
                                <div class="RaP0z8">
                                  <div
                                    class="stardust-radio"
                                    tabindex="0"
                                    role="radio"
                                    aria-checked="false"
                                    aria-disabled="false"
                                  >
                                    {/* stardust-radio-button--checked */}
                                    <div
                                      onClick={(e) => {
                                        handleChooseAddress(e, item.id);
                                      }}
                                      class={`stardust-radio-button${
                                        item.id === chosenAddress?.id
                                          ? " stardust-radio-button--checked"
                                          : ""
                                      }`}
                                    >
                                      <div class="stardust-radio-button__outer-circle">
                                        <div class="stardust-radio-button__inner-circle"></div>
                                      </div>
                                    </div>
                                    <div class="stardust-radio__content">
                                      <div class="stardust-radio__label"></div>
                                    </div>
                                  </div>
                                </div>
                                <div class="yeNlVS">
                                  <div role="heading" class="U4dUzz U-1fLx">
                                    <div class="cN4yku _7YSPT">
                                      <span class="NQiF1Q N9EhS4">
                                        <div class="NqDMvV">
                                          {item.full_name}
                                        </div>
                                      </span>
                                      <div class="_7JM7ui"></div>
                                      <div
                                        role="row"
                                        class="Y8kLd3 bwW59H _1Eyhj-"
                                      >
                                        {item.phone_number}
                                      </div>
                                    </div>
                                    <div class="uzL3rQ">
                                      <button
                                        onClick={() => {
                                          setChooseAddress(false);
                                          handleEdit(item.id);
                                        }}
                                        class="bRN77Q"
                                      >
                                        Cập nhật
                                      </button>
                                    </div>
                                  </div>
                                  <div role="heading" class="U4dUzz U-1fLx">
                                    <div class="cN4yku _7YSPT">
                                      <div class="YrJatK">
                                        <div role="row" class="_1Eyhj-">
                                          {item.address}
                                        </div>
                                        <div role="row" class="_1Eyhj-">
                                          {item.village}, {item.district},{" "}
                                          {item.city}
                                        </div>
                                      </div>
                                    </div>
                                    <div class="q9talk uzL3rQ"></div>
                                  </div>
                                  {item.is_defaulted == 1 && (
                                    <div role="row" class="UyHa35 _1Eyhj-">
                                      <span
                                        role="mark"
                                        class="b59z1w _9d0+gy A5xtpE"
                                      >
                                        Mặc định
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <button
                          onClick={() => {
                            handleOpen();
                            setChooseAddress(false);
                            setAddNewAddress(true);
                          }}
                          class="Ic56yv QLgWLc +jGaSf"
                        >
                          <svg viewBox="0 0 10 10" class="rMXp0S">
                            <path
                              stroke="none"
                              d="m10 4.5h-4.5v-4.5h-1v4.5h-4.5v1h4.5v4.5h1v-4.5h4.5z"
                            ></path>
                          </svg>
                          Thêm Địa Chỉ Mới
                        </button>
                      </div>
                      <div class="eT+Xh1">
                        <button
                          onClick={() => {
                            setOpen(false);
                          }}
                          class="buaGaW Ic56yv QLgWLc +jGaSf"
                        >
                          Huỷ
                        </button>
                        <button
                          onClick={handleUpdateChosenAddress}
                          class="cN4V5B QLgWLc nVbjI2"
                        >
                          Xác nhận
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/*==================================*/}

              {(requireAddress || addNewAddress || isEditMode) && (
                <div className="kGwaat">
                  <div class="_6qQnMm">
                    <div class="+8jojr">
                      {requireAddress
                        ? "Vui lòng thêm địa chỉ đặt hàng"
                        : isEditMode
                        ? "Cập nhật địa chỉ"
                        : "Địa chỉ mới"}
                    </div>
                    <form id="new-address-form">
                      <div class="FjAbyn">
                        <div class="U+ue2m">
                          <div class="M7ul5X">
                            <div class="VBEzJh IUAosB">
                              <div class="+QLhYo">
                                <div class="VumFUt">Họ và tên</div>
                                <input
                                  onChange={handleInput}
                                  name="full_name"
                                  class="_4TB5gZ"
                                  type="text"
                                  placeholder="Họ và tên"
                                  autocomplete="name"
                                  maxlength="64"
                                  defaultValue={full_name}
                                />
                              </div>
                            </div>
                            <div class="upIqg6"></div>
                            <div class="VBEzJh qkhyaJ">
                              <div class="+QLhYo">
                                <div class="VumFUt">Số điện thoại</div>
                                <input
                                  onChange={handleInput}
                                  name="phone_number"
                                  class="_4TB5gZ"
                                  type="text"
                                  placeholder="Số điện thoại"
                                  autocomplete="user-address-phone"
                                  defaultValue={phone_number}
                                />
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <div class="form-group">
                              <div class="dropdown w-100">
                                <div
                                  onClick={(e) => {
                                    handleDropdownCities(e);
                                  }}
                                  className="dropdown-button _4TB5gZ"
                                  id="button-dropdown-city"
                                >
                                  <span class="f-s-p-16" id="city-dropdown">
                                    {chosenCity || "Chọn Tỉnh/Thành"}
                                  </span>
                                  <i class="ic-arrow-select ic-md"></i>
                                </div>
                                <div class="dropdown-menu" id="dropdown-city">
                                  <div class="c-dropdown-menu__search">
                                    <div class="cs-input-group cs-input-group--search dropdown-menu__top">
                                      <input
                                        onInput={(e) => {
                                          handleCitySearch(e);
                                        }}
                                        type="text"
                                        className="cs-input cs-input--lg w100 _4TB5gZ"
                                      />
                                    </div>
                                  </div>
                                  <div
                                    class="dropdown-menu-wrapper scrollbar"
                                    id="listCity"
                                  >
                                    {cities.map((item) => {
                                      return (
                                        <a
                                          onClick={() => {
                                            handleSelectCity(item.code);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <span
                                            style={
                                              item.name === chosenCity
                                                ? addNewAddress
                                                  ? {
                                                      cursor: "pointer",
                                                    }
                                                  : {
                                                      cursor: "pointer",
                                                      fontWeight: "bold",
                                                    }
                                                : {}
                                            }
                                          >
                                            {item.name}
                                          </span>
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div
                                class=" text-danger-700 m-t-8"
                                style={{ display: "none" }}
                              >
                                <span class="">Thông tin bắt buộc</span>
                              </div>
                            </div>
                          </div>
                          <div class="col-12">
                            <div class="form-group">
                              <div class="dropdown w-100">
                                <div
                                  onClick={(e) => {
                                    handleDropdownDistricts(e);
                                  }}
                                  class="dropdown-button"
                                  id="button-dropdown-district"
                                >
                                  <span class="f-s-p-16" id="district-dropdown">
                                    {chosenDistrict || "Chọn Quận/Huyện"}
                                  </span>
                                  <i class="ic-arrow-select ic-md"></i>
                                </div>
                                <div
                                  class="dropdown-menu"
                                  id="dropdown-district"
                                >
                                  <div class="c-dropdown-menu__search">
                                    <div class="cs-input-group cs-input-group--search  dropdown-menu__top">
                                      <input
                                        onInput={(e) => {
                                          handleDistrictSearch(e);
                                        }}
                                        type="text"
                                        className="cs-input _4TB5gZ"
                                      />
                                      <span class="ic-search cs-input-search"></span>
                                    </div>
                                  </div>
                                  <div
                                    class="dropdown-menu-wrapper scrollbar"
                                    id="listDis"
                                  >
                                    {districts.map((item) => {
                                      return (
                                        <a
                                          onClick={() => {
                                            handleSelectDistrict(item.code);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <span
                                            style={
                                              item.name === chosenDistrict
                                                ? addNewAddress
                                                  ? {
                                                      cursor: "pointer",
                                                    }
                                                  : {
                                                      cursor: "pointer",
                                                      fontWeight: "bold",
                                                    }
                                                : {}
                                            }
                                          >
                                            {item.name}
                                          </span>
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div
                                class=" text-danger-700 m-t-8"
                                style={{ display: "none" }}
                              >
                                <span class="">Thông tin bắt buộc</span>
                              </div>
                            </div>
                          </div>
                          <div class="col-12 m-t-12">
                            <div class="form-group">
                              <div class="dropdown w-100">
                                <div
                                  onClick={(e) => {
                                    handleDropdownVillages(e);
                                  }}
                                  class="dropdown-button"
                                  id="button-dropdown-village"
                                >
                                  <span class="f-s-p-16" id="village-dropdown">
                                    {chosenVillage || "Chọn Phường/Xã"}
                                  </span>
                                  <i class="ic-arrow-select ic-md"></i>
                                </div>
                                <div
                                  class="dropdown-menu"
                                  id="dropdown-village"
                                >
                                  <div class="c-dropdown-menu__search">
                                    <div class="cs-input-group cs-input-group--search  dropdown-menu__top">
                                      <input
                                        onInput={(e) => {
                                          handleVillageSearch(e);
                                        }}
                                        type="text"
                                        className="cs-input _4TB5gZ"
                                      />
                                      <span class="ic-search cs-input-search"></span>
                                    </div>
                                  </div>
                                  <div
                                    class="dropdown-menu-wrapper scrollbar"
                                    id="listVillage"
                                  >
                                    {villages.map((item) => {
                                      return (
                                        <a
                                          onClick={() => {
                                            handleSelectVillage(item.code);
                                          }}
                                          style={{ cursor: "pointer" }}
                                        >
                                          <span
                                            style={
                                              item.name === chosenVillage
                                                ? addNewAddress
                                                  ? {
                                                      cursor: "pointer",
                                                    }
                                                  : {
                                                      cursor: "pointer",
                                                      fontWeight: "bold",
                                                    }
                                                : {}
                                            }
                                          >
                                            {item.name}
                                          </span>
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                              <div
                                class="text-danger-700 m-t-8"
                                style={{ display: "none" }}
                              >
                                <span class="">Thông tin bắt buộc</span>
                              </div>
                            </div>
                          </div>
                          <div class="M7ul5X">
                            <div class="Vlj3UI">
                              <div class="nFtsZT _1aYH4o Yiz5W8">
                                <div class="_94OLZZ">
                                  <div class="ADyZ6g">Địa chỉ cụ thể</div>
                                  <textarea
                                    onChange={handleInput}
                                    name="address_detail"
                                    class="Z5Ndvj"
                                    disabled=""
                                    rows="2"
                                    placeholder="Địa chỉ cụ thể"
                                    autocomplete="user-street-address"
                                    maxlength="128"
                                    defaultValue={address_detail}
                                  ></textarea>
                                </div>
                              </div>
                              <div class="B+WSSS"></div>
                            </div>
                          </div>
                          <div class="_9m40T7">
                            <label class="VQRLw-">
                              <input
                                defaultChecked={
                                  isEditMode
                                    ? isDefaulted
                                      ? true
                                      : false
                                    : false
                                }
                                onChange={(e) => {
                                  const div = document.querySelector(".tcK1ox");
                                  if (div.classList.contains("QZTonY")) {
                                    div.classList.remove("QZTonY");
                                  } else {
                                    div.classList.add("QZTonY");
                                  }
                                }}
                                class="QAVe-Q"
                                type="checkbox"
                                id="default"
                              />
                              <div
                                class={`tcK1ox${
                                  isEditMode
                                    ? isDefaulted
                                      ? " QZTonY"
                                      : ""
                                    : ""
                                }`}
                              ></div>
                              Đặt làm địa chỉ mặc đinh
                            </label>
                          </div>
                        </div>
                        <div class="KKsTzS">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              if (isEditMode || addNewAddress) {
                                setIsEditMode(false);
                                setAddNewAddress(false);
                                setChooseAddress(true);
                              } else if (requireAddress) {
                                navigate("/cart");
                              }
                            }}
                            class="_9q6Q2s _9+tJoA"
                          >
                            Trở Lại
                          </button>
                          <button
                            onClick={(e) => {
                              handleAddAddress(e);
                            }}
                            class="_9q6Q2s _3B7lBt"
                          >
                            Hoàn thành
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </Box>
          </Modal>
          {isLoading && <Loader fixed={true} />}
          <div role="main" class="OX-2Lj">
            <div class="-p7ULT">
              <div class="vtrWey"></div>
              <div class="_8jJlG8">
                <div class="nU2ylc">
                  <div class="MqmqK4">
                    <div class="Iafoll">
                      <svg
                        height="16"
                        viewBox="0 0 12 16"
                        width="12"
                        class="shopee-svg-icon icon-location-marker"
                      >
                        <path
                          d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
                          fill-rule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>Địa chỉ nhận hàng</div>
                    {!isLoading &&
                      Object.keys(chosenAddress).length === 0 &&
                      !requireAddress && (
                        <div
                          onClick={() => {
                            setOpen(true);
                            setChooseAddress(true);
                          }}
                          class="_3WkjWD"
                        >
                          Chọn địa chỉ
                        </div>
                      )}
                  </div>
                </div>
                {Object.keys(chosenAddress).length !== 0 && (
                  <div class="Jw2Sc-">
                    <div>
                      <div class="NYnMjH">
                        <div class="FVWWQy">
                          {chosenAddress.full_name} -{" "}
                          {chosenAddress.phone_number}
                        </div>
                        <div class="QsWYfx">
                          {chosenAddress.address}, {chosenAddress.village},{" "}
                          {chosenAddress.district}, {chosenAddress.city}
                        </div>
                        {chosenAddress.is_defaulted == 1 && (
                          <div class="uk7Wpm">Mặc định</div>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setOpen(true);
                        setChooseAddress(true);
                        setAddNewAddress(false);
                      }}
                      class="_3WkjWD"
                    >
                      Thay đổi
                    </div>
                  </div>
                )}

                <div></div>
              </div>
            </div>
            <div class="sqxwIi">
              <div class="_3cPNXP">
                <div class="V-sVj2">
                  <div class="jNp+ZB ktatB-">
                    <div class="_6HCfS6">Sản phẩm</div>
                  </div>
                  <div class="jNp+ZB _04sLFc"></div>
                  <div class="jNp+ZB">Đơn giá</div>
                  <div class="jNp+ZB">Số lượng</div>
                  <div class="jNp+ZB LBqTli">Thành tiền</div>
                </div>
              </div>
              <div>
                <div class="o6P-mw">
                  <div>
                    <div class="Z7qspM">
                      {/* <div class="vYrpLx">
                        <div>
                          <div class="xAkOUO">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="62"
                              height="16"
                              fill="none"
                            >
                              <path
                                fill="#EE4D2D"
                                fill-rule="evenodd"
                                d="M0 2C0 .9.9 0 2 0h58a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2z"
                                clip-rule="evenodd"
                              ></path>
                              <g clip-path="url(#clip0)">
                                <path
                                  fill="#fff"
                                  d="M8.7 13H7V8.7L5.6 6.3A828.9 828.9 0 004 4h2l2 3.3a1197.3 1197.3 0 002-3.3h1.6L8.7 8.7V13zm7.9-1.7h1.7c0 .3-.2.6-.5 1-.2.3-.5.5-1 .7l-.6.2h-.8c-.5 0-1 0-1.5-.2l-1-.8a4 4 0 01-.9-2.4c0-1 .3-1.9 1-2.6a3 3 0 012.4-1l.8.1a2.8 2.8 0 011.3.7l.4.6.3.8V10h-4.6l.2 1 .4.7.6.5.7.1c.4 0 .7 0 .9-.2l.2-.6v-.1zm0-2.3l-.1-1-.3-.3c0-.2-.1-.2-.2-.3l-.8-.2c-.3 0-.6.2-.9.5l-.3.5a4 4 0 00-.3.8h3zm-1.4-4.2l-.7.7h-1.4l1.5-2h1.1l1.5 2h-1.4l-.6-.7zm8.1 1.6H25V13h-1.7v-.5.1H23l-.7.5-.9.1-1-.1-.7-.4c-.3-.2-.4-.5-.6-.8l-.2-1.3V6.4h1.7v3.7c0 1 0 1.6.3 1.7.2.2.5.3.7.3h.4l.4-.2.3-.3.3-.5.2-1.4V6.4zM34.7 13a11.2 11.2 0 01-1.5.2 3.4 3.4 0 01-1.3-.2 2 2 0 01-.5-.3l-.3-.5-.2-.6V7.4h-1.2v-1h1.1V5h1.7v1.5h1.9v1h-2v3l.2 1.2.1.3.2.2h.3l.2.1c.2 0 .6 0 1.3-.3v1zm2.4 0h-1.7V3.5h1.7v3.4a3.7 3.7 0 01.2-.1 2.8 2.8 0 013.4 0l.4.4.2.7V13h-1.6V9.3 8.1l-.4-.6-.6-.2a1 1 0 00-.4.1 2 2 0 00-.4.2l-.3.3a3 3 0 00-.3.5l-.1.5-.1.9V13zm5.4-6.6H44V13h-1.6V6.4zm-.8-.9l1.8-2h1.8l-2.1 2h-1.5zm7.7 5.8H51v.5l-.4.5a2 2 0 01-.4.4l-.6.3-1.4.2c-.5 0-1 0-1.4-.2l-1-.7c-.3-.3-.5-.7-.6-1.2-.2-.4-.3-.9-.3-1.4 0-.5.1-1 .3-1.4a2.6 2.6 0 011.6-1.8c.4-.2.9-.3 1.4-.3.6 0 1 .1 1.5.3.4.1.7.4 1 .6l.2.5.1.5h-1.6c0-.3-.1-.5-.3-.6-.2-.2-.4-.3-.8-.3s-.8.2-1.2.6c-.3.4-.4 1-.4 2 0 .9.1 1.5.4 1.8.4.4.8.6 1.2.6h.5l.3-.2.2-.3v-.4zm4 1.7h-1.6V3.5h1.7v3.4a3.7 3.7 0 01.2-.1 2.8 2.8 0 013.4 0l.3.4.3.7V13h-1.6V9.3L56 8.1c-.1-.3-.2-.5-.4-.6l-.6-.2a1 1 0 00-.3.1 2 2 0 00-.4.2l-.3.3a3 3 0 00-.3.5l-.2.5V13z"
                                ></path>
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <path
                                    fill="#fff"
                                    d="M0 0h55v16H0z"
                                    transform="translate(4)"
                                  ></path>
                                </clipPath>
                              </defs>
                            </svg>
                          </div>
                        </div>
                        <div class="_75ySYI">
                          <svg
                            viewBox="0 0 16 16"
                            class="shopee-svg-icon +Wv1h7"
                          >
                            <g fill-rule="evenodd">
                              <path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z"></path>
                            </g>
                          </svg>
                          Chat ngay
                        </div>
                      </div> */}
                      <div class="KxX-H6">
                        {shopping_cart.map((item) => {
                          if (item.purchase) {
                            total_items += item.quantity;
                            subtotal +=
                              item.quantity *
                              (item.price - item.discounted_price);
                          }
                          if (item.purchase) {
                            return (
                              <div class="_2OGC7L xBI6Zm">
                                <div class="h3ONzh EOqcX3">
                                  <img
                                    class="rTOisL"
                                    src={`${process.env.REACT_APP_SERVER_ROOT_URL}/${item.image}`}
                                    width="70"
                                    height="70"
                                  />
                                  <span class="oEI3Ln">
                                    <span class="gHbVhc">{item.name}</span>
                                  </span>
                                </div>
                                <div class="h3ONzh Le31ox">
                                  {item.version && (
                                    <div class="dcPz7Y">
                                      <span style={{ fontWeight: "bold" }}>
                                        Phiên bản:
                                      </span>{" "}
                                      {item.version}
                                    </div>
                                  )}
                                  {item.color && (
                                    <div class="dcPz7Y">
                                      <span style={{ fontWeight: "bold" }}>
                                        Màu:
                                      </span>{" "}
                                      {item.color}
                                    </div>
                                  )}
                                </div>
                                <div class="h3ONzh">
                                  ₫
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(item.price - item.discounted_price)}
                                </div>
                                <div class="h3ONzh">{item.quantity}</div>
                                <div class="h3ONzh fHRPUO">
                                  ₫
                                  {new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(
                                    item.quantity *
                                      (item.price - item.discounted_price)
                                  )}
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                  <div class="Nivkv-">
                    <div class="ULZMSb">
                      <div class="z10ZuQ">
                        Tổng số tiền ({total_items} sản phẩm):
                      </div>
                      <div class="_9F3E9v">
                        ₫
                        {new Intl.NumberFormat({
                          style: "currency",
                        }).format(subtotal)}
                      </div>
                    </div>
                  </div>
                  {/* <div class="wVzdz-">
                      <div class="OUah6W Tn7sb8">
                        <div class="u-JjSt">
                          <span>Lời nhắn:</span>
                          <div class="nWvmL7">
                            <div class="QP7B8L _0HwzC1">
                              <div class="_3VCZ+j F9tXsd">
                                <input
                                  class="T-hVMj"
                                  type="text"
                                  placeholder="Lưu ý cho Người bán..."
                                />
                              </div>
                              <div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                </div>
              </div>
            </div>
            <div class="+w8dNn">
              <div class="At3Wkr">
                <div class="W-XOpk">
                  <div class="kKkbFa">
                    <div class="jeFLq1">
                      <svg
                        fill="none"
                        viewBox="0 -2 23 22"
                        class="shopee-svg-icon icon-voucher-line"
                      >
                        <g filter="url(#voucher-filter0_d)">
                          <mask id="a" fill="#fff">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M1 2h18v2.32a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75V16H1v-2.12a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75V2z"
                            ></path>
                          </mask>
                          <path
                            d="M19 2h1V1h-1v1zM1 2V1H0v1h1zm18 2.32l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zM19 16v1h1v-1h-1zM1 16H0v1h1v-1zm0-2.12l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zM19 1H1v2h18V1zm1 3.32V2h-2v2.32h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zM20 16v-2.13h-2V16h2zM1 17h18v-2H1v2zm-1-3.12V16h2v-2.12H0zm1.4.91a2.5 2.5 0 001.5-2.29h-2a.5.5 0 01-.3.46l.8 1.83zm1.5-2.29a2.5 2.5 0 00-1.5-2.3l-.8 1.84c.18.08.3.26.3.46h2zM0 10.48v.65h2v-.65H0zM.9 9.1a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 9.1h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 8.65zM0 7.08v.65h2v-.65H0zM.9 5.7a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 5.7h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 5.25zM0 2v2.33h2V2H0z"
                            mask="url(#a)"
                          ></path>
                        </g>
                        <path
                          clip-rule="evenodd"
                          d="M6.49 14.18h.86v-1.6h-.86v1.6zM6.49 11.18h.86v-1.6h-.86v1.6zM6.49 8.18h.86v-1.6h-.86v1.6zM6.49 5.18h.86v-1.6h-.86v1.6z"
                        ></path>
                        <defs>
                          <filter
                            id="voucher-filter0_d"
                            x="0"
                            y="1"
                            width="20"
                            height="16"
                            filterUnits="userSpaceOnUse"
                            color-interpolation-filters="sRGB"
                          >
                            <feFlood
                              flood-opacity="0"
                              result="BackgroundImageFix"
                            ></feFlood>
                            <feColorMatrix
                              in="SourceAlpha"
                              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                            ></feColorMatrix>
                            <feOffset></feOffset>
                            <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                            <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"></feColorMatrix>
                            <feBlend
                              in2="BackgroundImageFix"
                              result="effect1_dropShadow"
                            ></feBlend>
                            <feBlend
                              in="SourceGraphic"
                              in2="effect1_dropShadow"
                              result="shape"
                            ></feBlend>
                          </filter>
                        </defs>
                      </svg>
                      <span class="Pd8fbQ">Mã Giảm Giá</span>
                    </div>
                  </div>
                </div>
                <div class="_84yUzo">
                  <button onClick={() => setCouponPopup(true)} class="FPhJqC">
                    Chọn Mã Giảm Giá
                  </button>
                </div>
              </div>
            </div>
            <div class="DS2ZYY">
              <div class="DQ7t9K">
                <div>
                  <div class="checkout-payment-method-view__current checkout-payment-setting">
                    <div class="checkout-payment-method-view__current-title">
                      Phương thức thanh toán
                    </div>
                  </div>
                  <div class="checkout-payment-setting__payment-method-options">
                    <div class="bank-transfer-category">
                      <div class="bank-transfer-category__body">
                        <div class="checkout-bank-transfer-item">
                          {/*====== stardust-radio--checked ======*/}
                          <div
                            onClick={(e) => {
                              handleChoosePaymentMethod(e, "cod");
                            }}
                            class="stardust-radio"
                            tabindex="0"
                            role="radio"
                            aria-checked="false"
                            aria-disabled="false"
                          >
                            {/*====== stardust-radio-button--checked ======*/}
                            <div class="stardust-radio-button">
                              <div class="stardust-radio-button__outer-circle">
                                <div class="stardust-radio-button__inner-circle"></div>
                              </div>
                            </div>
                            <div class="stardust-radio__content">
                              <div class="stardust-radio__label">
                                <div class="checkout-bank-transfer-item__card">
                                  <div class="checkout-bank-transfer-item__icon-container">
                                    <img
                                      src="/images/cod.png"
                                      class="checkout-bank-transfer-item__icon"
                                    />
                                  </div>
                                  <div class="checkout-bank-transfer-item__main">
                                    <div class="checkout-bank-transfer-item__title">
                                      Thanh toán khi nhận hàng
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="bank-transfer-category">
                      <div class="bank-transfer-category__body">
                        <div class="checkout-bank-transfer-item">
                          {/*==== stardust-radio--checked ====*/}
                          <div
                            onClick={(e) => {
                              handleChoosePaymentMethod(e, "vnpay");
                            }}
                            class="stardust-radio "
                            tabindex="0"
                            role="radio"
                            aria-checked="true"
                          >
                            <div class="stardust-radio-button">
                              <div class="stardust-radio-button__outer-circle">
                                <div class="stardust-radio-button__inner-circle"></div>
                              </div>
                            </div>
                            <div class="stardust-radio__content">
                              <div class="stardust-radio__label">
                                <div class="checkout-bank-transfer-item__card">
                                  <div class="checkout-bank-transfer-item__icon-container">
                                    <img
                                      src="/images/vnpay.png"
                                      class="checkout-bank-transfer-item__icon"
                                    />
                                  </div>
                                  <div class="checkout-bank-transfer-item__main">
                                    <div class="checkout-bank-transfer-item__title">
                                      Thanh toán online
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="KQyCj0">
                <div class="Tc17Ac XIEGGF">Tổng tiền hàng</div>
                <div class="Tc17Ac mCEcIy">
                  ₫
                  {new Intl.NumberFormat({
                    style: "currency",
                  }).format(subtotal)}
                </div>
                {Object.keys(chosenAddress).length !== 0 && (
                  <>
                    <div class="Tc17Ac XIEGGF">Phí vận chuyển</div>
                    <div class="Tc17Ac mCEcIy">
                      ₫
                      {new Intl.NumberFormat({
                        style: "currency",
                      }).format(shippingFee)}
                    </div>
                    {chosenFreeShip && (
                      <>
                        <div class="Tc17Ac XIEGGF">Giảm giá vận chuyển</div>
                        <div class="Tc17Ac mCEcIy">
                          - ₫
                          {new Intl.NumberFormat({
                            style: "currency",
                          }).format(
                            chosenFreeShip.type === "fixed"
                              ? chosenFreeShip.amount
                              : chosenFreeShip.type === "percent"
                              ? shippingFee * (chosenFreeShip.amount / 100) >
                                chosenFreeShip.maximum_discount
                                ? chosenFreeShip.maximum_discount
                                : shippingFee * (chosenFreeShip.amount / 100)
                              : new Intl.NumberFormat({
                                  style: "currency",
                                }).format(shippingFee)
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
                {chosenCoupon && (
                  <>
                    <div class="Tc17Ac XIEGGF">Mã giảm giá</div>
                    <div class="Tc17Ac mCEcIy">
                      - ₫
                      {new Intl.NumberFormat({
                        style: "currency",
                      }).format(
                        chosenCoupon.type === "fixed"
                          ? chosenCoupon.amount
                          : subtotal * (chosenCoupon.amount / 100) >
                            chosenCoupon.maximum_discount
                          ? chosenCoupon.maximum_discount
                          : subtotal * (chosenCoupon.amount / 100)
                      )}
                    </div>
                  </>
                )}

                <div class="Tc17Ac XIEGGF n3vdfL">Tổng thanh toán:</div>
                <div class="Tc17Ac kC0GSn mCEcIy n3vdfL">
                  ₫
                  {new Intl.NumberFormat({
                    style: "currency",
                  }).format(
                    subtotal +
                      shippingFee -
                      (chosenCoupon
                        ? chosenCoupon.type === "fixed"
                          ? chosenCoupon.amount
                          : subtotal * (chosenCoupon.amount / 100) >
                            chosenCoupon.maximum_discount
                          ? chosenCoupon.maximum_discount
                          : subtotal * (chosenCoupon.amount / 100)
                        : 0) -
                      (chosenFreeShip && Object.keys(chosenAddress).length !== 0
                        ? chosenFreeShip.type === "fixed"
                          ? chosenFreeShip.amount
                          : chosenFreeShip.type === "percent"
                          ? shippingFee * (chosenFreeShip.amount / 100) >
                            chosenFreeShip.maximum_discount
                            ? chosenFreeShip.maximum_discount
                            : shippingFee * (chosenFreeShip.amount / 100)
                          : shippingFee
                        : 0)
                  )}
                </div>
                <div class="uTFqRt">
                  {/* <div class="k4VpYA">
                    <div class="C-NSr-">
                      Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
                      <a
                        href="https://help.shopee.vn/portal/article/77242"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Điều khoản Shopee
                      </a>
                    </div>
                  </div> */}
                  <button
                    onClick={handleAddOrder}
                    class="stardust-button stardust-button--primary stardust-button--large apLZEG N7Du4X"
                  >
                    Đặt hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Popup {...popup} />
      )}
    </section>
  );
};

export default Checkout;
