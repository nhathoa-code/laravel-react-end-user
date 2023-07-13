import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

axios.defaults.withCredentials = true;
const Register = () => {
  // const [isProcessing, setIsProcessing] = useState(false);
  // const [errors, setErrors] = useState(null);
  // const [success, setSuccess] = useState(null);

  // const handleRegsiter = (e) => {
  //   e.preventDefault();
  //   setIsProcessing(true);
  //   setErrors(null);
  //   setSuccess(null);
  //   axios.get("http://localhost:8000/sanctum/csrf-cookie").then(() => {
  //     let formData = new FormData(
  //       document.getElementsByClassName("registed")[0]
  //     );
  //     axios
  //       .post(`${process.env.REACT_APP_API_ENDPOINT}/register`, formData)
  //       .then((res) => {
  //         console.log(res.data.message);
  //         setSuccess(res.data.message);
  //         document.getElementsByClassName("registed")[0].reset();
  //         setIsProcessing(false);
  //       })
  //       .catch((err) => {
  //         console.log(err.response.data);
  //         setErrors(err.response.data);
  //         setIsProcessing(false);
  //       });
  //   });
  // };
  const handleRegister = () => {};

  const googleLogin = () => {
    axios.get("http://localhost:8000/sanctum/csrf-cookie").then(() => {
      axios
        .get(`${process.env.REACT_APP_API_ENDPOINT}/auth/redirect`)
        .then((res) => {
          window.location.href = res.data;
        });
    });
  };

  return (
    <div id="login">
      <form onSubmit={handleRegister}>
        <div id="register" class="IxqCyD J1i6cp B-fiUo">
          <div class="gZNAGg">
            <div class="KG+Utm">
              <div class="K1dDgL">Đăng ký</div>
            </div>
          </div>
          <div class="yXry6s">
            <div class="D3QIf1">
              {/*  eIvw9r (when error) */}
              <div class="yup5K8">
                <input
                  // onInput={(e) => {
                  //   handleInput(e);
                  // }}
                  class="pDzPRp"
                  type="text"
                  placeholder="Số điện thoại"
                  autocomplete="on"
                  name="login_key"
                  maxlength="128"
                />
              </div>
              <div class="pYVjxt"></div>
            </div>

            <button
              class="wyhvVD _1EApiB hq6WM5 L-VL8Q cepDQ1 _7w24N1"
              disabled
            >
              Đăng ký
            </button>
            <div class="_6yKazv">
              <div style={{ paddingTop: "20px" }} class="lhhucE">
                <div class="lreZhl"></div>
                <span class="PqS8vj">hoặc</span>
                <div class="lreZhl"></div>
              </div>
              <div class="_3051nA">
                <button
                  type="button"
                  onClick={googleLogin}
                  class="nGTAZw lyJbNT bQ2eCN"
                >
                  <div class="Bq4Bra">
                    <div class="_1a550J social-white-background social-white-google-png"></div>
                  </div>
                  <div class="">Google</div>
                </button>
              </div>
            </div>
          </div>
          <div class="XLzpXt">
            <div class="Oug9xv Z8OMtU">
              Bạn đã có tài khoản?{" "}
              <Link class="wzgwUg" to={`/login`}>
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
