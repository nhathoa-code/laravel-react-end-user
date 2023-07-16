import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Loader from "./loader/Loader";
import Popup from "./popup/Popup";
import { AuthContext } from "../provider/AuthProvider";
import { AppStoreContext } from "../provider/AppStoreProvider";

const LoginGoogle = () => {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const { setShoppingCart } = useContext(AppStoreContext);

  useEffect(() => {
    return () => {
      if (localStorage.getItem("next_url")) {
        localStorage.removeItem("next_url");
      }
    };
  }, []);

  useEffect(() => {
    setProcessing(true);
    axios
      .get(
        `${process.env.REACT_APP_API_ENDPOINT}/auth/callback${window.location.search}`
      )
      .then((res) => {
        setProcessing(false);
        // return console.log(res.data);
        if (res.status === 200) {
          localStorage.setItem("auth_token", res.data.auth_token);
          setUser(res.data.user);
          setShoppingCart(res.data.shopping_cart);
          if (localStorage.getItem("next_url")) {
            navigate(localStorage.getItem("next_url"));
          } else {
            navigate("/");
          }
        }
      })
      .catch((err) => {
        console.log(err.response);
        setPopup({
          message: "Có lỗi xảy ra,vui lòng đăng nhập lại!",
          action: () => {
            if (localStorage.getItem("next_url")) {
              navigate(`/login?next=${localStorage.getItem("next_url")}`);
            } else {
              navigate("/login");
            }
          },
          cancel: () => {},
          btn2: "Đăng nhập",
        });
      });
  }, []);
  return (
    <>
      {popup && <Popup {...popup} />}
      {processing && <Loader fixed={true} />}
    </>
  );
};

export default LoginGoogle;
