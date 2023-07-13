import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../loader/Loader";
import "./Address.css";

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

const Address = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [id, setId] = useState(null);
  /*========= reactjs modal mui ===========*/
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
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
    setOpen(false);
  };
  /*========= reactjs modal mui ===========*/
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
    fetch("https://provinces.open-api.vn/api/?depth=3").then(async (res) => {
      let data = await res.json();
      setCities(data);
      localStorage.setItem("cities", JSON.stringify(data));
    });
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/address`).then((res) => {
      setIsLoading(false);
      console.log(res.data);
      setAddress(res.data);
    });
    return () => {
      localStorage.removeItem("cities");
      localStorage.removeItem("districts");
      localStorage.removeItem("villages");
    };
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
        .put(`${process.env.REACT_APP_API_ENDPOINT}/address/${id}`, data)
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
          handleClose();
        });
    } else {
      axios
        .post(`${process.env.REACT_APP_API_ENDPOINT}/address`, data)
        .then((res) => {
          console.log(res.data);
          setAddress((prev) => {
            if (res.data.is_defaulted == 1) {
              prev.map((item) => {
                item.is_defaulted = "0";
                return item;
              });
            }
            return [...prev, res.data];
          });
          handleClose();
        });
    }
  };

  const handleSetDefault = (id) => {
    const btns = document.querySelectorAll(".DmXQ31");
    for (let i = 0; i < btns.length; i++) {
      btns[i].setAttribute("disabled", true);
    }
    axios
      .put(`${process.env.REACT_APP_API_ENDPOINT}/address/${id}?set_default`)
      .then(() => {
        setAddress((prev) => {
          return [...prev].map((item) => {
            if (item.id === id) {
              item.is_defaulted = "1";
              return item;
            } else {
              item.is_defaulted = "0";
              return item;
            }
          });
        });
        for (let i = 0; i < btns.length; i++) {
          btns[i].removeAttribute("disabled");
        }
      });
  };

  const handleDelete = (id) => {
    setIsProcessing(true);
    axios
      .delete(`${process.env.REACT_APP_API_ENDPOINT}/address/${id}`)
      .then(() => {
        setIsProcessing(false);
        setAddress((prev) => {
          return [...prev].filter((item) => item.id !== id);
        });
      });
  };

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

  return (
    <>
      <Modal
        className="product-specification"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modal_style}>
          <div className="kGwaat">
            <div class="_6qQnMm">
              <div class="+8jojr">
                {isEditMode ? "Cập nhật địa chỉ" : "Địa chỉ mới"}
              </div>
              <form>
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
                                          ? {
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
                          <div class="dropdown-menu" id="dropdown-district">
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
                                          ? {
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
                          <div class="dropdown-menu" id="dropdown-village">
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
                                          ? {
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
                            isEditMode ? (isDefaulted ? true : false) : false
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
                            isEditMode ? (isDefaulted ? " QZTonY" : "") : ""
                          }`}
                        ></div>
                        Đặt làm địa chỉ mặc đinh
                      </label>
                    </div>
                  </div>
                  <div class="KKsTzS">
                    <button
                      onClick={() => handleClose()}
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
        </Box>
      </Modal>
      <div class="xMDeox">
        <div class="Hvae38" role="main">
          <div style={{ display: "contents" }}>
            <div class="UWIOO4">
              <div class="d2XTTX">
                <div class="KxkIgA">
                  <div class="Df4Vny">Địa chỉ của tôi</div>
                  <div class="VwAsdf"></div>
                </div>
                <div>
                  <div class="_6r5J8Y">
                    <div style={{ display: "flex" }}>
                      <button
                        onClick={() => {
                          setIsEditMode(false);
                          handleOpen();
                        }}
                        class="shopee-button-solid shopee-button-solid--primary ErE1Vh"
                      >
                        <div class="t9RWKn">
                          <div class="EN0IP+">
                            <svg
                              enable-background="new 0 0 10 10"
                              viewBox="0 0 10 10"
                              x="0"
                              y="0"
                              class="shopee-svg-icon icon-plus-sign"
                            >
                              <polygon points="10 4.5 5.5 4.5 5.5 0 4.5 0 4.5 4.5 0 4.5 0 5.5 4.5 5.5 4.5 10 5.5 10 5.5 5.5 10 5.5"></polygon>
                            </svg>
                          </div>
                          <div>Thêm địa chỉ mới</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="G-rPVC">
                {isProcessing && <Loader />}
                <div style={{ position: "relative" }} class="EHan+5">
                  {!isLoading ? (
                    <>
                      {address.length > 0 ? (
                        address.map((item) => {
                          return (
                            <div class="RnMqRZ OIBd-J">
                              <div class="_70j3aj">
                                <div role="heading" class="_7lC5y1 fVHv1Z">
                                  <div class="XBSydm DikMLj">
                                    <span class="Tv2wKj uBRQwt">
                                      <div class="YD3W3V">{item.full_name}</div>
                                    </span>
                                    <div class="xbIya3"></div>
                                    <div
                                      role="row"
                                      class="Ayh0hN L8KYK3 IsnjAd"
                                    >
                                      {item.phone_number}
                                    </div>
                                  </div>
                                  <div class="oSiOlj">
                                    <button
                                      onClick={() => {
                                        handleEdit(item.id);
                                      }}
                                      class="tXBaRL"
                                    >
                                      Cập nhật
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDelete(item.id);
                                      }}
                                      class="tXBaRL"
                                    >
                                      Xóa
                                    </button>
                                  </div>
                                </div>
                                <div role="heading" class="_7lC5y1 fVHv1Z">
                                  <div class="XBSydm DikMLj">
                                    <div class="tiDOor">
                                      <div role="row" class="IsnjAd">
                                        {item.address}
                                      </div>
                                      <div role="row" class="IsnjAd">
                                        {item.village}, {item.district},{" "}
                                        {item.city}
                                      </div>
                                    </div>
                                  </div>
                                  <div class="iI3vH9 oSiOlj">
                                    <button
                                      onClick={() => {
                                        handleSetDefault(item.id);
                                      }}
                                      class="mgW0lg DmXQ31 PEXLbW"
                                      disabled={
                                        item.is_defaulted == 1 ? true : false
                                      }
                                    >
                                      Thiết lập mặc định
                                    </button>
                                  </div>
                                </div>
                                <div role="row" class="TArgaE IsnjAd">
                                  {item.is_defaulted == 1 && (
                                    <span
                                      role="mark"
                                      class="fZIR8+ gXV+gD wIyMUR"
                                    >
                                      Mặc định
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div class="FS90r3">
                          <svg fill="none" viewBox="0 0 121 120" class="+elnpp">
                            <path
                              d="M16 79.5h19.5M43 57.5l-2 19"
                              stroke="#BDBDBD"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M56.995 78.791v-.001L41.2 38.195c-2.305-5.916-2.371-12.709.44-18.236 1.576-3.095 4.06-6.058 7.977-8 5.061-2.5 11.038-2.58 16.272-.393 3.356 1.41 7 3.92 9.433 8.43v.002c2.837 5.248 2.755 11.853.602 17.603L60.503 78.766v.001c-.617 1.636-2.88 1.643-3.508.024Z"
                              fill="#fff"
                              stroke="#BDBDBD"
                              stroke-width="2"
                            ></path>
                            <path
                              d="m75.5 58.5 7 52.5M13 93h95.5M40.5 82.5 30.5 93 28 110.5"
                              stroke="#BDBDBD"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                            <path
                              d="M44.5 79.5c0 .55-.318 1.151-1.038 1.656-.717.502-1.761.844-2.962.844-1.2 0-2.245-.342-2.962-.844-.72-.505-1.038-1.105-1.038-1.656 0-.55.318-1.151 1.038-1.656.717-.502 1.761-.844 2.962-.844 1.2 0 2.245.342 2.962.844.72.505 1.038 1.105 1.038 1.656Z"
                              stroke="#BDBDBD"
                              stroke-width="2"
                            ></path>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M48.333 68H18.5a1 1 0 1 0 0 2h30.667l-.834-2Zm20.5 2H102a1 1 0 0 0 0-2H69.667l-.834 2Z"
                              fill="#BDBDBD"
                            ></path>
                            <path
                              d="M82 73h20l3 16H84.5L82 73ZM34.5 97H76l1.5 13H33l1.5-13ZM20.5 58h18l-1 7h-18l1-7Z"
                              fill="#E8E8E8"
                            ></path>
                            <path
                              clip-rule="evenodd"
                              d="M19.5 41a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM102.5 60a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                              stroke="#E8E8E8"
                              stroke-width="2"
                            ></path>
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M93.5 22a1 1 0 0 0-1 1v3h-3a1 1 0 1 0 0 2h3v3a1 1 0 1 0 2 0v-3h3a1 1 0 1 0 0-2h-3v-3a1 1 0 0 0-1-1Z"
                              fill="#E8E8E8"
                            ></path>
                            <circle
                              cx="58.5"
                              cy="27"
                              r="7"
                              stroke="#BDBDBD"
                              stroke-width="2"
                            ></circle>
                          </svg>
                          <div class="tYrwYD">Bạn chưa có địa chỉ.</div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Loader />
                  )}
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Address;
