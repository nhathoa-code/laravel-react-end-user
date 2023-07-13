import React, { useEffect, useState } from "react";
import "./Coupons.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";
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

const Coupons = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [coupon, setCoupon] = useState(null);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_ENDPOINT}/coupons`).then((res) => {
      setIsLoading(false);
      console.log(res.data);
      setCoupons(res.data);
    });
  }, []);

  const openCondition = (coupon) => {
    console.log(coupon);
    setCoupon(coupon);
    handleOpen();
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
                          <div>
                            <div class="vc_UseLink_useLink">
                              <Link to={`/cart`} class="vc_UseLink_link">
                                Dùng ngay
                              </Link>
                            </div>
                          </div>
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
                        <div class="vc_VoucherStandardTemplate_right">
                          <div>
                            <div class="vc_UseLink_useLink">
                              <Link to={`/cart`} class="vc_UseLink_link">
                                Dùng ngay
                              </Link>
                            </div>
                          </div>
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
              )}
            </>
          )}
        </Box>
      </Modal>
      <div style={{ position: "relative" }} class="coOw9l">
        {!isLoading ? (
          <div class="TMCf0u">
            {coupons.map((item) => {
              if (item.coupon_type === "free_ship") {
                return (
                  <div class="LUGhvJ">
                    <div class="d6WhVp">
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
                                  {item.type === "fixed"
                                    ? `Giảm ₫${new Intl.NumberFormat({
                                        style: "currency",
                                      }).format(item.amount)}`
                                    : item.type === "percent"
                                    ? `Giảm ${item.amount}%`
                                    : "Free ship"}
                                </div>
                              </div>
                              <div class="vc_Subtitle_subTitle vc_Subtitle_fsvLine">
                                Đơn Tối Thiểu ₫
                                {new Intl.NumberFormat({
                                  style: "currency",
                                }).format(item.minimum_spend)}
                              </div>

                              <div class="vc_ProgressBarExpiry_progressBarExpiry">
                                <div class="vc_ProgressBar_progressBar vc_ProgressBarExpiry_progressBar"></div>
                                <div class="vc_ProgressBarExpiry_usageLimitedText">
                                  <span
                                    style={{ marginRight: "10px" }}
                                    class="vc_ProgressBarExpiry_isRunningOutSoon"
                                  >
                                    Đã dùng: {item.used}/{item.limit_per_coupon}
                                  </span>
                                  <span class="vc_ProgressBarExpiry_isEndingSoon">
                                    HSD: {item.start} đến {item.end}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="vc_VoucherStandardTemplate_right">
                              <div>
                                <div class="vc_UseLink_useLink">
                                  <Link to={`/cart`} class="vc_UseLink_link">
                                    Dùng ngay
                                  </Link>
                                </div>
                              </div>
                              <div class="vc_VoucherStandardTemplate_center"></div>
                              <div onClick={() => openCondition(item)}>
                                <div class="vc_TNCLink_tncLink">
                                  <a
                                    onClick={() => console.log("")}
                                    href="javascript:void(0)"
                                  >
                                    <span>Điều Kiện</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div class="vc_CornerBadge_cornerBadge vc_CornerBadge_levelCorner vc_CornerBadge_valid">
                              Số luợng có hạn
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div class="LUGhvJ">
                    <div class="d6WhVp">
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
                                  `Giảm tối đa ₫${new Intl.NumberFormat({
                                    style: "currency",
                                  }).format(item.maximum_discount)}`}
                              </div>

                              <div class="vc_ProgressBarExpiry_progressBarExpiry">
                                <div class="vc_ProgressBar_progressBar vc_ProgressBarExpiry_progressBar"></div>
                                <div class="vc_ProgressBarExpiry_usageLimitedText">
                                  <span
                                    style={{ marginRight: "10px" }}
                                    class="vc_ProgressBarExpiry_isRunningOutSoon"
                                  >
                                    Đã dùng: {item.used}/{item.limit_per_coupon}{" "}
                                    lượt
                                  </span>
                                  <span class="vc_ProgressBarExpiry_isEndingSoon vc_ProgressBarExpiry_capitalize">
                                    HSD: {item.start} đến {item.end}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div class="vc_VoucherStandardTemplate_right">
                              <div>
                                <div class="vc_UseLink_useLink">
                                  <Link to={`/cart`} class="vc_UseLink_link">
                                    Dùng ngay
                                  </Link>
                                </div>
                              </div>
                              <div class="vc_VoucherStandardTemplate_center"></div>
                              <div onClick={() => openCondition(item)}>
                                <div class="vc_TNCLink_tncLink">
                                  <a href="javascript:void(0)">
                                    <span>Điều Kiện</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div class="vc_CornerBadge_cornerBadge vc_CornerBadge_levelCorner vc_CornerBadge_valid">
                              Số luợng có hạn
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default Coupons;
