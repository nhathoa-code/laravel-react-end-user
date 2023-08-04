import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import axios from "axios";
import "./Account.css";
import { AppStoreContext } from "../../provider/AppStoreProvider";

const Account = () => {
  const [open, setOpen] = React.useState(true);
  const { path, setPath } = useContext(AppStoreContext);

  const { notifications, setNotifications, setCountOrders } =
    useContext(AppStoreContext);

  useEffect(() => {
    axios
      .all([
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
        axios.get(`${process.env.REACT_APP_API_ENDPOINT}/orders/count`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }),
      ])
      .then(
        axios.spread((res1, res2) => {
          setNotifications(res1.data);
          setCountOrders(res2.data);
        })
      );
  }, []);

  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <section id="main">
      <div className="account_container">
        <div id="sidebar">
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <img
                  style={{ width: "1.25rem", height: "1.25rem" }}
                  src="/images/account.png"
                />
              </ListItemIcon>
              <ListItemText primary="Tài khoản" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link
                  onClick={() => setPath("profile")}
                  to={"/account/profile"}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText
                      style={
                        path === "profile" || path === "account"
                          ? { color: "#EE4D2D" }
                          : {}
                      }
                      primary="Hồ sơ"
                    />
                  </ListItemButton>
                </Link>
                <Link
                  onClick={() => setPath("address")}
                  to={"/account/address"}
                >
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText
                      style={path === "address" ? { color: "#EE4D2D" } : {}}
                      primary="Địa chỉ"
                    />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>
            <Link
              onClick={() => setPath("orders_history")}
              to={"/account/orders_history"}
            >
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/order.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={path === "orders_history" ? { color: "#EE4D2D" } : {}}
                  primary="Đơn hàng"
                />
              </ListItemButton>
            </Link>
            <Link
              onClick={() => setPath("notifications")}
              to={"/account/notifications"}
            >
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.1rem", height: "1.1rem" }}
                    src="/images/notification.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={path === "notifications" ? { color: "#EE4D2D" } : {}}
                  primary={`Thông báo${
                    notifications
                      ? notifications.filter((item) => item.status === "unread")
                          .length === 0
                        ? ""
                        : " (" +
                          notifications.filter(
                            (item) => item.status === "unread"
                          ).length +
                          ")"
                      : ""
                  }`}
                />
              </ListItemButton>
            </Link>
            <Link onClick={() => setPath("reviews")} to={"/account/reviews"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/star.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={path === "reviews" ? { color: "#EE4D2D" } : {}}
                  primary="Lịch sử đánh giá"
                />
              </ListItemButton>
            </Link>
            <Link onClick={() => setPath("recent")} to={"/account/recent"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/clock.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={path === "recent" ? { color: "#EE4D2D" } : {}}
                  primary="Sản phẩm đã xem"
                />
              </ListItemButton>
            </Link>
            <Link onClick={() => setPath("coupons")} to={"/account/coupons"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/coupons.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={path === "coupons" ? { color: "#EE4D2D" } : {}}
                  primary="Mã giảm giá"
                />
              </ListItemButton>
            </Link>
          </List>
        </div>
        <div id="content">
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Account;
