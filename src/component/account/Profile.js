import React, { useEffect, useState } from "react";
import "./Profile.css";
import axios from "axios";
import Loader from "../loader/Loader";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [openDay, setOpenDay] = useState(false);
  const [openMonth, setOpenMonth] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const [days_in_month, setDaysInMonth] = useState([]);
  const [months_in_year, setMonthsInYear] = useState([]);
  const [years, setYears] = useState([]);
  const [birthDay, setBirthDay] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/user/profile`)
      .then((res) => {
        console.log(res.data);
        setIsLoading(false);
        setUserProfile(res.data);
        setBirthDay(
          res.data.birthday ? res.data.birthday.split("-") : [1, 1, 1910]
        );
      });
    const days_in_month = [];
    for (let i = 1; i <= 31; i++) {
      days_in_month.push(i);
    }
    setDaysInMonth(days_in_month);
    const months_in_year = [];
    for (let i = 1; i <= 12; i++) {
      months_in_year.push(i);
    }
    setMonthsInYear(months_in_year);
    const years = [];
    for (let i = new Date().getFullYear(); i >= 1910; i--) {
      years.push(i);
    }
    setYears(years);
  }, []);

  const toggleDay = () => {
    setOpenMonth(false);
    setOpenYear(false);
    if (openDay) {
      setOpenDay(false);
    } else {
      setOpenDay(true);
    }
  };

  const toggleMonth = () => {
    setOpenDay(false);
    setOpenYear(false);
    if (openMonth) {
      setOpenMonth(false);
    } else {
      setOpenMonth(true);
    }
  };

  const toggleYear = () => {
    setOpenDay(false);
    setOpenMonth(false);
    if (openYear) {
      setOpenYear(false);
    } else {
      setOpenYear(true);
    }
  };

  const handlePickDay = (day) => {
    setBirthDay((prev) => {
      prev[0] = day;
      return [...prev];
    });
    setOpenDay(false);
  };

  const handlePickMonth = (month) => {
    setBirthDay((prev) => {
      prev[1] = month;
      return [...prev];
    });
    setOpenMonth(false);
  };

  const handlePickYear = (year) => {
    setBirthDay((prev) => {
      prev[2] = year;
      return [...prev];
    });
    setOpenYear(false);
  };

  const handleChooseGender = (gender) => {
    setUserProfile((prev) => {
      return { ...prev, gender: gender };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);
    const formData = new FormData(document.querySelector("form#form"));
    formData.append("gender", userProfile.gender);
    formData.append(
      "birth_day",
      birthDay[2] + "-" + birthDay[1] + "-" + birthDay[0]
    );
    axios
      .post(
        `${process.env.REACT_APP_API_ENDPOINT}/user/profile/update`,
        formData
      )
      .then((res) => {
        setProcessing(false);
        console.log(res.data);
      });
  };

  return (
    <div class="Hvae38" role="main">
      <div style={{ display: "contents" }}>
        <div class="b7wtmP">
          {processing && <Loader />}
          <div class="_66hYBa">
            <h1 class="SbCTde">Hồ sơ của tôi</h1>
          </div>
          {!isLoading ? (
            <div class="R-Gpdg">
              <div class="volt8A">
                <form id="form" onSubmit={handleSubmit}>
                  <table class="Zj7UK+">
                    <tr>
                      <td class="espR83 qQTY0O">
                        <label>Tên đăng nhập</label>
                      </td>
                      <td class="Tmj5Z6">
                        <div>
                          <div class="W50dp5">
                            <input
                              type="text"
                              name="nickname"
                              class="CMyrTJ"
                              defaultValue={userProfile.nickname}
                            />
                          </div>
                          {/* <div class="bp2tsO">
                            Tên Đăng nhập chỉ có thể thay đổi một lần.
                          </div> */}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="espR83">
                        <label>Tên</label>
                      </td>
                      <td class="Tmj5Z6">
                        <div>
                          <div class="W50dp5">
                            <input
                              type="text"
                              name="name"
                              class="CMyrTJ"
                              defaultValue={userProfile.name}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="espR83">
                        <label>Email</label>
                      </td>
                      <td class="Tmj5Z6">
                        <div class="_0ZgK9X">
                          <div class="uxYEXm">
                            {userProfile.email ? userProfile.email : "Chưa có"}
                          </div>
                          {/* <button class="DJRxAF">Thay đổi</button> */}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="espR83">
                        <label>Số điện thoại</label>
                      </td>
                      <td class="Tmj5Z6">
                        <div class="_0ZgK9X">
                          <div class="uxYEXm">
                            {userProfile.phone ? userProfile.phone : "Chưa có"}
                          </div>
                          {/* <button class="DJRxAF">Thay đổi</button> */}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="espR83">
                        <label>Giới tính</label>
                      </td>
                      <td class="Tmj5Z6">
                        <div class="s4eg4A">
                          <div class="stardust-radio-group" role="radiogroup">
                            <div
                              onClick={() => handleChooseGender("Boy")}
                              class="stardust-radio"
                              tabindex="0"
                              role="radio"
                              aria-checked="true"
                            >
                              <div
                                class={`stardust-radio-button${
                                  userProfile.gender === "Boy"
                                    ? " stardust-radio-button--checked"
                                    : ""
                                }`}
                              >
                                <div class="stardust-radio-button__outer-circle">
                                  <div class="stardust-radio-button__inner-circle"></div>
                                </div>
                              </div>
                              <div class="stardust-radio__content">
                                <div class="stardust-radio__label">Nam</div>
                              </div>
                            </div>
                            <div
                              onClick={() => handleChooseGender("Girl")}
                              class="stardust-radio"
                              tabindex="0"
                              role="radio"
                              aria-checked="false"
                            >
                              <div
                                class={`stardust-radio-button${
                                  userProfile.gender === "Girl"
                                    ? " stardust-radio-button--checked"
                                    : ""
                                }`}
                              >
                                <div class="stardust-radio-button__outer-circle">
                                  <div class="stardust-radio-button__inner-circle"></div>
                                </div>
                              </div>
                              <div class="stardust-radio__content">
                                <div class="stardust-radio__label">Nữ</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="espR83">
                        <label>Ngày sinh</label>
                      </td>
                      <td class="Tmj5Z6">
                        <div class="ewT4Cd">
                          <div
                            onClick={() => toggleDay()}
                            class={`shopee-dropdown shopee-dropdown--has-selected${
                              openDay ? " shopee-dropdown--opened" : ""
                            }`}
                            style={{ position: "relative" }}
                          >
                            <div class="shopee-dropdown__entry shopee-dropdown__entry--selected">
                              <span>{birthDay[0]}</span>
                              {openDay ? (
                                <svg
                                  enable-background="new 0 0 11 11"
                                  viewBox="0 0 11 11"
                                  x="0"
                                  y="0"
                                  class="shopee-svg-icon icon-arrow-up"
                                >
                                  <g>
                                    <path d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>
                                  </g>
                                </svg>
                              ) : (
                                <svg
                                  enable-background="new 0 0 11 11"
                                  viewBox="0 0 11 11"
                                  x="0"
                                  y="0"
                                  class="shopee-svg-icon icon-arrow-down"
                                >
                                  <g>
                                    <path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>
                                  </g>
                                </svg>
                              )}
                            </div>
                            {openDay && (
                              <div
                                class="shopee-popover shopee-popover--default"
                                aria-role="tooltip"
                                style={{
                                  position: "absolute",
                                  top: "40px",
                                  left: "0px",
                                  width: "137.17px",
                                  zIndex: "600",
                                }}
                              >
                                <ul class="shopee-dropdown__options">
                                  {days_in_month.map((item) => {
                                    if (item !== birthDay[0]) {
                                      return (
                                        <li
                                          onClick={() => handlePickDay(item)}
                                          class="shopee-dropdown__entry shopee-dropdown__entry--optional"
                                        >
                                          <div class="shopee-dropdown__entry-content">
                                            {item}
                                          </div>
                                        </li>
                                      );
                                    }
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div
                            onClick={() => toggleMonth()}
                            class={`shopee-dropdown shopee-dropdown--has-selected${
                              openMonth ? " shopee-dropdown--opened" : ""
                            }`}
                            style={{ position: "relative" }}
                          >
                            <div class="shopee-dropdown__entry shopee-dropdown__entry--selected">
                              <span>Tháng {birthDay[1]}</span>
                              {openMonth ? (
                                <svg
                                  enable-background="new 0 0 11 11"
                                  viewBox="0 0 11 11"
                                  x="0"
                                  y="0"
                                  class="shopee-svg-icon icon-arrow-up"
                                >
                                  <g>
                                    <path d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>
                                  </g>
                                </svg>
                              ) : (
                                <svg
                                  enable-background="new 0 0 11 11"
                                  viewBox="0 0 11 11"
                                  x="0"
                                  y="0"
                                  class="shopee-svg-icon icon-arrow-down"
                                >
                                  <g>
                                    <path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>
                                  </g>
                                </svg>
                              )}
                            </div>
                            {openMonth && (
                              <div
                                class="shopee-popover shopee-popover--default"
                                aria-role="tooltip"
                                style={{
                                  position: "absolute",
                                  top: "40px",
                                  left: "0px",
                                  width: "137.17px",
                                  zIndex: "600",
                                }}
                              >
                                <ul class="shopee-dropdown__options">
                                  {months_in_year.map((item) => {
                                    if (item !== birthDay[1]) {
                                      return (
                                        <li
                                          onClick={() => handlePickMonth(item)}
                                          class="shopee-dropdown__entry shopee-dropdown__entry--optional"
                                        >
                                          <div class="shopee-dropdown__entry-content">
                                            Tháng {item}
                                          </div>
                                        </li>
                                      );
                                    }
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                          <div
                            onClick={() => toggleYear()}
                            class={`shopee-dropdown shopee-dropdown--has-selected${
                              openYear ? " shopee-dropdown--opened" : ""
                            }`}
                            style={{ position: "relative" }}
                          >
                            <div class="shopee-dropdown__entry shopee-dropdown__entry--selected">
                              <span>{birthDay[2]}</span>
                              {openYear ? (
                                <svg
                                  enable-background="new 0 0 11 11"
                                  viewBox="0 0 11 11"
                                  x="0"
                                  y="0"
                                  class="shopee-svg-icon icon-arrow-up"
                                >
                                  <g>
                                    <path d="m11 8.5c0-.1 0-.2-.1-.3l-5-6c-.1-.1-.3-.2-.4-.2s-.3.1-.4.2l-5 6c-.2.2-.1.5.1.7s.5.1.7-.1l4.6-5.5 4.6 5.5c.2.2.5.2.7.1.1-.1.2-.3.2-.4z"></path>
                                  </g>
                                </svg>
                              ) : (
                                <svg
                                  enable-background="new 0 0 11 11"
                                  viewBox="0 0 11 11"
                                  x="0"
                                  y="0"
                                  class="shopee-svg-icon icon-arrow-down"
                                >
                                  <g>
                                    <path d="m11 2.5c0 .1 0 .2-.1.3l-5 6c-.1.1-.3.2-.4.2s-.3-.1-.4-.2l-5-6c-.2-.2-.1-.5.1-.7s.5-.1.7.1l4.6 5.5 4.6-5.5c.2-.2.5-.2.7-.1.1.1.2.3.2.4z"></path>
                                  </g>
                                </svg>
                              )}
                            </div>
                            {openYear && (
                              <div
                                class="shopee-popover shopee-popover--default"
                                aria-role="tooltip"
                                style={{
                                  position: "absolute",
                                  top: "40px",
                                  left: "0px",
                                  width: "137.17px",
                                  zIndex: "600",
                                }}
                              >
                                <ul class="shopee-dropdown__options">
                                  {years.map((item) => {
                                    if (item !== birthDay[2]) {
                                      return (
                                        <li
                                          onClick={() => handlePickYear(item)}
                                          class="shopee-dropdown__entry shopee-dropdown__entry--optional"
                                        >
                                          <div class="shopee-dropdown__entry-content">
                                            {item}
                                          </div>
                                        </li>
                                      );
                                    }
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="espR83">
                        <label></label>
                      </td>
                      <td class="Tmj5Z6">
                        <button
                          type="submit"
                          class="btn btn-solid-primary btn--m btn--inline"
                          aria-disabled="false"
                        >
                          Lưu
                        </button>
                      </td>
                    </tr>
                  </table>
                </form>
              </div>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
