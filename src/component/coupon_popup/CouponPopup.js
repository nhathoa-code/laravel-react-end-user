import React, { useEffect, useState, useContext } from "react";
import "./CouponPopup.css";
import Loader from "../loader/Loader";
import axios from "axios";
import { AppStoreContext } from "../../provider/AppStoreProvider";
import { AuthContext } from "../../provider/AuthProvider";
// Import reactjs modal
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
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

const getDate = (date) => {
  let d = date.split("-");
  return new Date(d[2], parseInt(d[1]) - 1, d[0]);
};

const CouponPopup = ({ setCouponPopup, shopping_cart }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [coupons, setCoupons] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const { chosenCoupon, setChosenCoupon, chosenFreeShip, setChosenFreeShip } =
    useContext(AppStoreContext);
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  let subtotal = 0;

  shopping_cart.map((item) => {
    if (item.purchase) {
      subtotal += item.quantity * (item.price - item.discounted_price);
    }
  });

  const openCondition = (coupon) => {
    setCoupon(coupon);
    handleOpen();
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/coupons`).then((res) => {
      setIsLoading(false);
      setCoupons(
        res.data.map((item) => {
          if (item.coupon_type === "coupon") {
            if (chosenCoupon) {
              if (chosenCoupon.id === item.id) {
                item.chosen = true;
              } else {
                item.chosen = false;
              }
            } else {
              item.chosen = false;
            }
          } else {
            if (chosenFreeShip) {
              if (chosenFreeShip.id === item.id) {
                item.chosen = true;
              } else {
                item.chosen = false;
              }
            } else {
              item.chosen = false;
            }
          }
          return item;
        })
      );
    });
  }, []);

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        id="linh-kien-modal"
      >
        <Box sx={{ ...style, width: 500, height: 250, borderRadius: 1 }}>
          {coupon && (
            <>
              {coupon.coupon_type === "coupon" ? (
                <>
                  <div class="vc_Card_container vc_my-wallet-page-vouchers_pc vc_my-wallet-page-vouchers_shopeeVoucher">
                    <div class="vc_Card_card">
                      <div class="vc_Card_left">
                        <div class="vc_Card_sawtooth"></div>
                      </div>
                      <div class="vc_Card_right"></div>
                      <div class="vc_VoucherStandardTemplate_hideOverflow"></div>
                      <div class="vc_VoucherStandardTemplate_template">
                        <div class="vc_my-wallet-page-vouchers_noneRightBorder vc_VoucherStandardTemplate_left">
                          <div
                            class="vc_Logo_imageLogo"
                            data-target="shop_icon"
                          >
                            <img
                              class="vc_Logo_logo"
                              src="/images/discount.svg"
                              alt="Logo"
                            />
                          </div>
                          <div
                            class="vc_IconText_iconText vc_IconText_white vc_IconText_defaultLine"
                            data-cy="voucher_card_icon_text"
                            style={{ textTransform: "initial" }}
                          >
                            Mã giảm giá
                          </div>
                        </div>
                        <div class="vc_VoucherStandardTemplate_middle">
                          <div class="vc_MainTitle_mainTitle">
                            <div class="vc_MainTitle_text vc_MainTitle_defaultLine">
                              Giảm{" "}
                              {coupon.type === "fixed"
                                ? "₫" +
                                  new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(coupon.amount)
                                : `${coupon.amount}%`}
                            </div>
                          </div>
                          <div class="vc_Subtitle_subTitle vc_Subtitle_defaultLine">
                            Đơn Tối Thiểu ₫
                            {new Intl.NumberFormat({
                              style: "currency",
                            }).format(coupon.minimum_spend)}{" "}
                            {coupon.type === "percent" &&
                              `Giảm tối đa ₫${new Intl.NumberFormat({
                                style: "currency",
                              }).format(coupon.maximum_discount)}`}
                          </div>

                          <div class="vc_ProgressBarExpiry_progressBarExpiry">
                            <div class="vc_ProgressBar_progressBar vc_ProgressBarExpiry_progressBar"></div>
                            <div class="vc_ProgressBarExpiry_usageLimitedText">
                              <span
                                style={{ marginRight: "10px" }}
                                class="vc_ProgressBarExpiry_isRunningOutSoon"
                              >
                                Đã dùng: {coupon.used}/{coupon.limit_per_coupon}{" "}
                                lượt
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="vc_VoucherStandardTemplate_right">
                          <div class="vc_VoucherStandardTemplate_center"></div>
                        </div>
                        <div class="vc_CornerBadge_cornerBadge vc_CornerBadge_levelCorner vc_CornerBadge_valid">
                          Số luợng có hạn
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <span class="vc_ProgressBarExpiry_isEndingSoon vc_ProgressBarExpiry_capitalize">
                      HSD: {coupon.start} đến {coupon.end}
                    </span>
                    <p>{coupon.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div class="vc_Card_container vc_my-wallet-page-vouchers_pc vc_my-wallet-page-vouchers_freeSnippingVoucher">
                    <div class="vc_Card_card">
                      <div class="vc_Card_left">
                        <div class="vc_Card_sawtooth"></div>
                      </div>
                      <div class="vc_Card_right"></div>
                      <div class="vc_VoucherStandardTemplate_hideOverflow"></div>
                      <div class="vc_VoucherStandardTemplate_template">
                        <div class="vc_my-wallet-page-vouchers_noneRightBorder vc_VoucherStandardTemplate_left">
                          <div
                            class="vc_Logo_imageLogo"
                            data-target="shop_icon"
                          >
                            <img
                              class="vc_Logo_logo"
                              src="/images/free_ship.png"
                              alt="Logo"
                            />
                          </div>
                          <div
                            class="vc_IconText_iconText vc_IconText_oneLine"
                            data-cy="voucher_card_icon_text"
                            style={{ color: "white" }}
                          >
                            Mã vận chuyển
                          </div>
                        </div>
                        <div class="vc_VoucherStandardTemplate_middle">
                          <div class="vc_MainTitle_mainTitle">
                            <div class="vc_MainTitle_text vc_MainTitle_fsvLine">
                              {coupon.type === "fixed"
                                ? `Giảm ₫${new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(coupon.amount)}`
                                : coupon.type === "percent"
                                ? `Giảm ${coupon.amount}%`
                                : "Free ship"}
                            </div>
                          </div>
                          <div class="vc_Subtitle_subTitle vc_Subtitle_fsvLine">
                            Đơn Tối Thiểu ₫
                            {new Intl.NumberFormat({
                              style: "currency",
                            }).format(coupon.minimum_spend)}
                          </div>

                          <div class="vc_ProgressBarExpiry_progressBarExpiry">
                            <div class="vc_ProgressBar_progressBar vc_ProgressBarExpiry_progressBar"></div>
                            <div class="vc_ProgressBarExpiry_usageLimitedText">
                              <span
                                style={{ marginRight: "10px" }}
                                class="vc_ProgressBarExpiry_isRunningOutSoon"
                              >
                                Đã dùng: {coupon.used}/{coupon.limit_per_coupon}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div class="vc_CornerBadge_cornerBadge vc_CornerBadge_levelCorner vc_CornerBadge_valid">
                          Số luợng có hạn
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    <span class="vc_ProgressBarExpiry_isEndingSoon vc_ProgressBarExpiry_capitalize">
                      HSD: {coupon.start} đến {coupon.end}
                    </span>
                    <p>{coupon.description}</p>
                  </div>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>
      <div class="shopee-popup shopee-modal__transition-enter-done">
        <div class="shopee-popup__overlay"></div>
        <div class="shopee-popup__container">
          <div style={{ display: "contents" }}>
            <div>
              <div class="shopee-popup-form oS7fgU">
                <div class="shopee-popup-form__main">
                  <div
                    style={{ position: "relative" }}
                    class="y5uClx shopee-popup-form__main-container"
                  >
                    {/* <div class="lUl+ps">
                      <div class="_5sgxMq">
                        <div class="input-with-validator-wrapper">
                          <div class="input-with-validator">
                            <input
                              type="text"
                              value=""
                              placeholder="Mã Shopee Voucher"
                              maxlength="255"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        class="stardust-button stardust-button--disabled TtHulo CxgDW8 Bb4+ox"
                        disabled=""
                      >
                        <span>Áp Dụng</span>
                      </button>
                    </div> */}
                    {!isLoading ? (
                      <div class="u6HdhE d9WDAK">
                        <div class="iF8vqN BzObne A3W8C5">
                          Mã Miễn Phí Vận Chuyển
                          <span>Có thể chọn 1 mã</span>
                        </div>
                        {coupons
                          .filter((item) => item.coupon_type === "free_ship")
                          .map((item) => {
                            return (
                              <div
                                class={`vc_Card_container${
                                  subtotal < item.minimum_spend ||
                                  item.used === item.limit_per_coupon ||
                                  JSON.parse(item.users).filter(
                                    (item) => item == user.id
                                  ).length === item.limit_per_user ||
                                  !(
                                    getDate(item.start) < new Date() &&
                                    getDate(item.end) > new Date()
                                  )
                                    ? " vc_Card_inapplicable vc_VoucherStandardTemplate_inapplicable"
                                    : ""
                                } vc_Card_fsv vc_VoucherStandardTemplate_fsv vc_free-shipping-voucher_pc`}
                              >
                                <div class="vc_Card_card">
                                  <div class="vc_Card_left">
                                    <div class="vc_Card_sawtooth"></div>
                                  </div>
                                  <div class="vc_Card_right"></div>
                                  <div class="vc_VoucherStandardTemplate_hideOverflow"></div>
                                  <div class="vc_VoucherStandardTemplate_template">
                                    <div class="vc_VoucherStandardTemplate_left">
                                      <div
                                        class="vc_Logo_imageLogo"
                                        data-target="shop_icon"
                                      >
                                        <img
                                          class="vc_Logo_logo"
                                          src="https://cf.shopee.vn/file/sg-11134004-22120-4cskiffs0olvc3"
                                          alt="Logo"
                                        />
                                      </div>
                                      <div
                                        class="vc_IconText_iconText vc_IconText_oneLine"
                                        data-cy="voucher_card_icon_text"
                                        style={{ color: "white" }}
                                      >
                                        Mã vận chuyển
                                      </div>
                                    </div>
                                    <div class="vc_VoucherStandardTemplate_middle">
                                      <div class="vc_MainTitle_mainTitle">
                                        <div class="vc_MainTitle_text vc_MainTitle_fsvLine">
                                          Miễn phí vận chuyển
                                        </div>
                                      </div>
                                      <div class="vc_Subtitle_subTitle vc_Subtitle_fsvLine">
                                        Đơn Tối Thiểu ₫
                                        {new Intl.NumberFormat({
                                          style: "currency",
                                        }).format(item.minimum_spend)}
                                      </div>
                                      <div class="vc_Label_label">
                                        <div
                                          class="vc_Label_shopeeWalletLabel"
                                          data-cy="voucher_card_label"
                                        >
                                          <div
                                            class="vc_Label_shopeeWalletLabelContent"
                                            data-cy="voucher_card_label_content"
                                            style={{ color: "red" }}
                                          >
                                            {item.type === "fixed"
                                              ? `Giảm ₫${new Intl.NumberFormat({
                                                  style: "currency",
                                                }).format(item.amount)}`
                                              : item.type === "percent"
                                              ? `Giảm ${item.amount}%`
                                              : "Free ship"}
                                          </div>
                                        </div>
                                      </div>
                                      <div class="vc_ProgressBarExpiry_progressBarExpiry">
                                        <div class="vc_ProgressBar_progressBar vc_ProgressBarExpiry_progressBar"></div>
                                        <div class="vc_ProgressBarExpiry_usageLimitedText">
                                          <span
                                            style={{ marginRight: "10px" }}
                                            class="vc_ProgressBarExpiry_isRunningOutSoon"
                                          >
                                            Đã dùng: {item.used}/
                                            {item.limit_per_coupon}
                                          </span>
                                          <span class="vc_ProgressBarExpiry_isEndingSoon">
                                            HSD: {item.start} đến {item.end}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="vc_VoucherStandardTemplate_right">
                                      <div></div>
                                      <div
                                        class={`vc_VoucherStandardTemplate_center${
                                          item.chosen ? " vc_choosen" : ""
                                        }`}
                                      >
                                        <div
                                          onClick={
                                            subtotal > item.minimum_spend &&
                                            item.used < item.limit_per_coupon &&
                                            JSON.parse(item.users).filter(
                                              (item) => item == user.id
                                            ).length < item.limit_per_user &&
                                            getDate(item.start) < new Date() &&
                                            getDate(item.end) > new Date()
                                              ? () => {
                                                  setCoupons((prev) => {
                                                    return [...prev].map(
                                                      (Item) => {
                                                        if (
                                                          Item.coupon_type ===
                                                          "free_ship"
                                                        ) {
                                                          if (
                                                            Item.id === item.id
                                                          ) {
                                                            Item.chosen =
                                                              !Item.chosen;
                                                          } else {
                                                            Item.chosen = false;
                                                          }
                                                          return Item;
                                                        } else {
                                                          return Item;
                                                        }
                                                      }
                                                    );
                                                  });
                                                }
                                              : null
                                          }
                                          class={`vc_RadioButton_radio${
                                            subtotal < item.minimum_spend ||
                                            item.used ===
                                              item.limit_per_coupon ||
                                            JSON.parse(item.users).filter(
                                              (item) => item == user.id
                                            ).length === item.limit_per_user ||
                                            !(
                                              getDate(item.start) <
                                                new Date() &&
                                              getDate(item.end) > new Date()
                                            )
                                              ? " vc_RadioButton_radioDisabled"
                                              : ""
                                          }`}
                                          data-cy="voucher_card_radiobutton"
                                        ></div>
                                      </div>
                                      <div onClick={() => openCondition(item)}>
                                        <div class="vc_TNCLink_tncLink">
                                          <a href="javascript:void(0)">
                                            <span>Điều Kiện</span>
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                    <div
                                      class={`vc_CornerBadge_cornerBadge vc_CornerBadge_levelCorner${
                                        subtotal < item.minimum_spend ||
                                        item.used === item.limit_per_coupon ||
                                        JSON.parse(item.users).filter(
                                          (item) => item == user.id
                                        ).length === item.limit_per_user ||
                                        !(
                                          getDate(item.start) < new Date() &&
                                          getDate(item.end) > new Date()
                                        )
                                          ? " vc_CornerBadge_invalid"
                                          : " vc_CornerBadge_valid"
                                      }`}
                                    >
                                      Số luợng có hạn
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}

                        <div class="JbRfQk"></div>

                        <div class="iF8vqN BzObne A3W8C5">
                          Mã Giảm Giá<span>Có thể chọn 1 mã</span>
                        </div>
                        <div>
                          {coupons
                            .filter((item) => item.coupon_type === "coupon")
                            .map((item) => {
                              return (
                                <div
                                  class={`vc_Card_container${
                                    subtotal < item.minimum_spend ||
                                    item.used === item.limit_per_coupon ||
                                    JSON.parse(item.users).filter(
                                      (item) => item == user.id
                                    ).length === item.limit_per_user ||
                                    !(
                                      getDate(item.start) < new Date() &&
                                      getDate(item.end) > new Date()
                                    )
                                      ? " vc_Card_inapplicable vc_VoucherStandardTemplate_inapplicable"
                                      : ""
                                  } vc_Card_shopee vc_VoucherStandardTemplate_shopee vc_shopee-voucher_pc`}
                                >
                                  <div class="vc_Card_card">
                                    <div class="vc_Card_left">
                                      <div class="vc_Card_sawtooth"></div>
                                    </div>
                                    <div class="vc_Card_right"></div>
                                    <div class="vc_VoucherStandardTemplate_hideOverflow"></div>
                                    <div class="vc_VoucherStandardTemplate_template">
                                      <div class="vc_VoucherStandardTemplate_left">
                                        <div
                                          class="vc_Logo_imageLogo"
                                          data-target="shop_icon"
                                        >
                                          <img
                                            class="vc_Logo_logo"
                                            src={`/images/discount.svg`}
                                          />
                                        </div>
                                        <div
                                          class="vc_IconText_iconText vc_IconText_white vc_IconText_defaultLine"
                                          data-cy="voucher_card_icon_text"
                                          style={{ textTransform: "initial" }}
                                        >
                                          Mã giảm giá
                                        </div>
                                      </div>
                                      <div class="vc_VoucherStandardTemplate_middle">
                                        <div class="vc_MainTitle_mainTitle">
                                          <div class="vc_MainTitle_text vc_MainTitle_defaultLine">
                                            Giảm{" "}
                                            {item.type === "fixed"
                                              ? "₫" +
                                                new Intl.NumberFormat({
                                                  style: "currency",
                                                }).format(item.amount)
                                              : `${item.amount}%`}
                                          </div>
                                        </div>
                                        <div class="vc_Subtitle_subTitle vc_Subtitle_defaultLine">
                                          Đơn Tối Thiểu ₫
                                          {new Intl.NumberFormat({
                                            style: "currency",
                                          }).format(item.minimum_spend)}{" "}
                                          {item.type === "percent" &&
                                            `Giảm tối đa ₫${new Intl.NumberFormat(
                                              {
                                                style: "currency",
                                              }
                                            ).format(item.maximum_discount)}`}
                                        </div>
                                        <div class="vc_Label_label"></div>
                                        <div class="vc_ProgressBarExpiry_progressBarExpiry">
                                          <div class="vc_ProgressBarExpiry_usageLimitedText">
                                            <span
                                              style={{ marginRight: "10px" }}
                                              class="vc_ProgressBarExpiry_isRunningOutSoon"
                                            >
                                              Đã dùng: {item.used}/
                                              {item.limit_per_coupon}
                                            </span>
                                            <span class="vc_ProgressBarExpiry_isEndingSoon vc_ProgressBarExpiry_capitalize">
                                              HSD: {item.start} đến {item.end}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="vc_VoucherStandardTemplate_right">
                                        <div></div>
                                        <div
                                          class={`vc_VoucherStandardTemplate_center${
                                            item.chosen ? " vc_choosen" : ""
                                          }`}
                                        >
                                          <div
                                            onClick={
                                              subtotal > item.minimum_spend &&
                                              item.used <
                                                item.limit_per_coupon &&
                                              JSON.parse(item.users).filter(
                                                (item) => item == user.id
                                              ).length < item.limit_per_user &&
                                              getDate(item.start) <
                                                new Date() &&
                                              getDate(item.end) > new Date()
                                                ? () => {
                                                    setCoupons((prev) => {
                                                      return [...prev].map(
                                                        (Item) => {
                                                          if (
                                                            Item.coupon_type ===
                                                            "coupon"
                                                          ) {
                                                            if (
                                                              Item.id ===
                                                              item.id
                                                            ) {
                                                              Item.chosen =
                                                                !Item.chosen;
                                                            } else {
                                                              Item.chosen = false;
                                                            }
                                                            return Item;
                                                          } else {
                                                            return Item;
                                                          }
                                                        }
                                                      );
                                                    });
                                                  }
                                                : null
                                            }
                                            class={`vc_RadioButton_radio${
                                              subtotal < item.minimum_spend ||
                                              item.used ===
                                                item.limit_per_coupon ||
                                              JSON.parse(item.users).filter(
                                                (item) => item == user.id
                                              ).length ===
                                                item.limit_per_user ||
                                              !(
                                                getDate(item.start) <
                                                  new Date() &&
                                                getDate(item.end) > new Date()
                                              )
                                                ? " vc_RadioButton_radioDisabled"
                                                : ""
                                            }`}
                                            data-cy="voucher_card_radiobutton"
                                          ></div>
                                        </div>
                                        <div
                                          onClick={() => openCondition(item)}
                                        >
                                          <div class="vc_TNCLink_tncLink">
                                            <a href="javascript:void(0)">
                                              <span>Điều Kiện</span>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                      <div
                                        class={`vc_CornerBadge_cornerBadge vc_CornerBadge_levelCorner${
                                          subtotal < item.minimum_spend ||
                                          item.used === item.limit_per_coupon ||
                                          JSON.parse(item.users).filter(
                                            (item) => item == user.id
                                          ).length === item.limit_per_user ||
                                          !(
                                            getDate(item.start) < new Date() &&
                                            getDate(item.end) > new Date()
                                          )
                                            ? " vc_CornerBadge_invalid"
                                            : " vc_CornerBadge_valid"
                                        }`}
                                      >
                                        Số luợng có hạn
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>
                <div class="shopee-popup-form__footer">
                  <div class="asfDVE"></div>
                  <button
                    onClick={() => setCouponPopup(false)}
                    class="cancel-btn"
                  >
                    Trở Lại
                  </button>
                  <button
                    type="button"
                    class="btn btn-solid-primary btn--s btn--inline _8kopQK"
                    aria-disabled="false"
                    onClick={() => {
                      const chosen_coupon = coupons
                        .filter((item) => item.coupon_type === "coupon")
                        .find((item) => item.chosen);
                      const chosen_free_ship = coupons
                        .filter((item) => item.coupon_type === "free_ship")
                        .find((item) => item.chosen);
                      if (chosen_coupon) {
                        setChosenCoupon(chosen_coupon);
                      } else {
                        setChosenCoupon(null);
                      }
                      if (chosen_free_ship) {
                        setChosenFreeShip(chosen_free_ship);
                      } else {
                        setChosenFreeShip(null);
                      }
                      setCouponPopup(false);
                    }}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
            <div class="_0wFlFa">
              <div class="pFp9NU" style={{ display: "none" }}>
                <shopee-banner-closable-stateful
                  spacekey="PC-VN-VOUCHER_FLOATING_CHECKOUT"
                  baseurl="https://shopee.vn"
                ></shopee-banner-closable-stateful>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponPopup;
