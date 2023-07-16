import React, { useEffect, useState, useContext } from "react";
import { Link, Outlet, useNavigate, Navigate } from "react-router-dom";
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
  const { notifications, setNotifications } = useContext(AppStoreContext);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/notifications`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        setNotifications(res.data);
      });
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
                <Link to={"/account/profile"}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText
                      style={
                        window.location.pathname === "/account/profile" ||
                        window.location.pathname === "/account"
                          ? { color: "#EE4D2D" }
                          : {}
                      }
                      primary="Hồ sơ"
                    />
                  </ListItemButton>
                </Link>
                <Link to={"/account/address"}>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText
                      style={
                        window.location.pathname === "/account/address"
                          ? { color: "#EE4D2D" }
                          : {}
                      }
                      primary="Địa chỉ"
                    />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>
            <Link to={"/account/orders_history"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/order.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={
                    window.location.pathname === "/account/orders_history"
                      ? { color: "#EE4D2D" }
                      : {}
                  }
                  primary="Đơn hàng"
                />
              </ListItemButton>
            </Link>
            <Link to={"/account/notifications"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.1rem", height: "1.1rem" }}
                    src="/images/notification.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={
                    window.location.pathname === "/account/notifications"
                      ? { color: "#EE4D2D" }
                      : {}
                  }
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
            <Link to={"/account/review"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/star.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={
                    window.location.pathname === "/account/review"
                      ? { color: "#EE4D2D" }
                      : {}
                  }
                  primary="Lịch sử đánh giá"
                />
              </ListItemButton>
            </Link>
            <Link to={"/account/recent"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/clock.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={
                    window.location.pathname === "/account/recent"
                      ? { color: "#EE4D2D" }
                      : {}
                  }
                  primary="Sản phẩm đã xem"
                />
              </ListItemButton>
            </Link>
            <Link to={"/account/coupons"}>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    style={{ width: "1.25rem", height: "1.25rem" }}
                    src="/images/coupons.png"
                  />
                </ListItemIcon>
                <ListItemText
                  style={
                    window.location.pathname === "/account/coupons"
                      ? { color: "#EE4D2D" }
                      : {}
                  }
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
