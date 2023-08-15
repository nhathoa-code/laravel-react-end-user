import React, { useEffect, useState, useContext } from "react";
import "./Notification.css";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import axios from "axios";
import Loader from "../loader/Loader";
import { AppStoreContext } from "../../provider/AppStoreProvider";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const { notifications, setNotifications } = useContext(AppStoreContext);

  const handleMarkAsRead = (notification_id, status) => {
    if (status === "unread") {
      axios
        .put(
          `${process.env.REACT_APP_API_ENDPOINT}/notifications/${notification_id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        )
        .then(() => {
          setNotifications((prev) => {
            const not = prev.find((item) => item.id === notification_id);
            not.status = "read";
            return [...prev];
          });
        });
    }
  };

  const handleDelete = (notification_id) => {
    setProcessing(true);
    axios
      .delete(
        `${process.env.REACT_APP_API_ENDPOINT}/notifications/${notification_id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      )
      .then((res) => {
        setProcessing(false);
        setNotifications((prev) => {
          return prev.filter((item) => item.id !== notification_id);
        });
      });
  };

  return (
    <>
      {processing && <Loader />}
      <div style={{ position: "relative" }}>
        {notifications ? (
          <>
            {notifications.length > 0 ? (
              <>
                <div class="ggNFa+">
                  <div class="Zl35pt">
                    <p class="_2CKPP3">Đánh dấu Đã đọc tất cả</p>
                  </div>
                  <div class="">
                    {notifications.map((item) => {
                      return (
                        <div class="mAFvNF eivFaM">
                          <div class="ssWhg- _6Wd-Sz">
                            <div class="yvbeD6 _9KTDdY">
                              <div class="_9KTDdY +ZCtwF"></div>
                              <div class="W7NV8o">
                                <div class="ZqyOeF c73vFc">
                                  <img src="/images/not_image.png" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="VunZ9e qvZNVn">
                            <h1 class="jS2Nf7">{item.title}</h1>
                            <div class="wBqQAl">
                              {parse(
                                item.content
                                  .replace("{", "<b>")
                                  .replace("}", "</b>")
                              )}
                            </div>
                            <div class="PmKaN+">
                              <p class="Y3aLQR">{item.created_at}</p>
                            </div>
                          </div>
                          <div class="_0+L5GJ">
                            <Link
                              onClick={() =>
                                handleMarkAsRead(item.id, item.status)
                              }
                              to={`${item.action_link}`}
                              class="_07Kc1J XEFU2N"
                            >
                              {item.action_title}
                            </Link>
                            <i
                              onClick={() => handleDelete(item.id)}
                              style={{ marginLeft: "10px" }}
                              class="fa-solid fa-trash-can"
                            ></i>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              <div class="ggNFa+">
                <div class="HEB6C8">
                  <div class="yvbeD6 qsxtA-">
                    <img
                      width="invalid-value"
                      height="invalid-value"
                      class="qsxtA- vc8g9F"
                      style={{ objectFit: "contain" }}
                      src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/fa4e2b534c2928596a6deded9c730a21.png"
                    />
                  </div>
                  <p>Chưa có thông báo mới</p>
                </div>
              </div>
            )}
          </>
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
};

export default Notifications;
