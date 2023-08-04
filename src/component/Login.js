import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import Loader from "./loader/Loader";
import { AuthContext } from "../provider/AuthProvider";
import { AppStoreContext } from "../provider/AppStoreProvider";
import "./Login.css";
const Login = () => {
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(false);
  const { setUser } = useContext(AuthContext);
  const { setShoppingCart } = useContext(AppStoreContext);
  // const [isHide, setIsHide] = useState(true);
  // const [credential, setCredential] = useState({ invalid: false, message: "" });

  // const toggleHide = () => {
  //   if (isHide) {
  //     setIsHide(false);
  //   } else {
  //     setIsHide(true);
  //   }
  // };

  useEffect(() => {
    if (searchParams.get("next")) {
      localStorage.setItem("next_url", searchParams.get("next"));
    }
  }, []);

  // const handleInput = (e) => {
  //   switch (e.target.name) {
  //     case "login_key":
  //       if (e.target.value === "") {
  //         document.querySelector(".D3QIf1 .yup5K8").classList.add("eIvw9r");
  //         document.querySelector(".D3QIf1 .pYVjxt").innerText =
  //           "Vui lòng điền vào mục này.";
  //       } else {
  //         document.querySelector(".D3QIf1 .yup5K8").classList.remove("eIvw9r");
  //         document.querySelector(".D3QIf1 .pYVjxt").innerText = "";
  //       }
  //       break;
  //     case "password":
  //       if (e.target.value === "") {
  //         document.querySelector(".vkgBkQ .yup5K8").classList.add("eIvw9r");
  //         document.querySelector(".vkgBkQ .pYVjxt").innerText =
  //           "Vui lòng điền vào mục này.";
  //       } else {
  //         document.querySelector(".vkgBkQ .yup5K8").classList.remove("eIvw9r");
  //         document.querySelector(".vkgBkQ .pYVjxt").innerText = "";
  //       }
  //   }
  //   if (
  //     document.querySelector("#login input[name=login_key]").value === "" ||
  //     document.querySelector("#login input[name=password]").value === ""
  //   ) {
  //     document.querySelector("#login ._1EApiB").setAttribute("disabled", true);
  //   } else {
  //     document.querySelector("#login ._1EApiB").removeAttribute("disabled");
  //   }
  // };

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   setCredential({
  //     invalid: false,
  //     message: "",
  //   });
  //   document.querySelector("#login ._1EApiB").setAttribute("disabled", true);
  //   axios.get("http://localhost:8000/sanctum/csrf-cookie").then(() => {
  //     let formData = new FormData(document.querySelector("#login form"));
  //     formData.append(
  //       "login_key",
  //       document.querySelector("#login input[name=login_key]").value
  //     );
  //     axios
  //       .post(`${process.env.REACT_APP_API_ENDPOINT}/login`, formData)
  //       .then((res) => {
  //         document.querySelector("#login ._1EApiB").removeAttribute("disabled");
  //         console.log(res.data);
  //         setUser(res.data.user);
  //         setShoppingCart(res.data.shopping_cart);
  //         navigate(searchParams.get("next"));
  //       })
  //       .catch((err) => {
  //         document.querySelector("#login ._1EApiB").removeAttribute("disabled");
  //         if (err.response.status === 401) {
  //           setCredential({
  //             invalid: true,
  //             message:
  //               "Đăng nhập KHÔNG thành công. Bạn vui lòng thử lại hoặc đăng nhập bằng cách khác nhé!",
  //           });
  //         }
  //       });
  //   });
  // };

  const googleLogin = () => {
    setProcessing(true);
    axios
      .get(`${process.env.REACT_APP_API_ENDPOINT}/auth/redirect`)
      .then((res) => {
        window.location.href = res.data;
      });
  };

  return (
    <div id="login">
      {processing && <Loader fixed={true} />}
      <form>
        <div class="IxqCyD J1i6cp B-fiUo">
          {/* <div class="gZNAGg">
            <div class="KG+Utm">
              <div class="K1dDgL">Đăng nhập</div>
            </div>
          </div> */}
          <div class="yXry6s">
            {/* <div className={credential.invalid && "_8cXplf fu1xRy ek+JS+"}>
              {credential.invalid && (
                <>
                  <div class="ed6S0z">
                    <svg viewBox="0 0 16 16" class="fJb11i">
                      <path
                        fill="none"
                        stroke="#FF424F"
                        d="M8 15A7 7 0 108 1a7 7 0 000 14z"
                        clip-rule="evenodd"
                      ></path>
                      <rect
                        stroke="none"
                        width="7"
                        height="1.5"
                        x="6.061"
                        y="5"
                        fill="#FF424F"
                        rx=".75"
                        transform="rotate(45 6.06 5)"
                      ></rect>
                      <rect
                        stroke="none"
                        width="7"
                        height="1.5"
                        fill="#FF424F"
                        rx=".75"
                        transform="scale(-1 1) rotate(45 -11.01 -9.51)"
                      ></rect>
                    </svg>
                  </div>
                  <div>
                    <div class="gCY-Ye">{credential.message}</div>
                  </div>
                </>
              )}
            </div>
            <div class="D3QIf1">
              eIvw9r (when error)
              <div class="yup5K8">
                <input
                  onInput={(e) => {
                    handleInput(e);
                  }}
                  class="pDzPRp"
                  type="text"
                  placeholder="Email hoặc Số điện thoại"
                  autocomplete="on"
                  name="login_key"
                  maxlength="128"
                />
              </div>
              <div class="pYVjxt"></div>
            </div>
            <div class="vkgBkQ">
              <div class="yup5K8">
                <input
                  onInput={(e) => {
                    handleInput(e);
                  }}
                  class="pDzPRp"
                  type={isHide ? "password" : "text"}
                  placeholder="Mật khẩu"
                  autocomplete="current-password"
                  name="password"
                  maxlength="16"
                />
                <button type="button" onClick={toggleHide} class="SnLyxu">
                  <svg
                    fill="none"
                    viewBox="0 0 20 10"
                    class={isHide ? "_340FWs" : "tF-uq+"}
                  >
                    {isHide ? (
                      <path
                        stroke="none"
                        fill="#000"
                        fill-opacity=".54"
                        d="M19.834 1.15a.768.768 0 00-.142-1c-.322-.25-.75-.178-1 .143-.035.036-3.997 4.712-8.709 4.712-4.569 0-8.71-4.712-8.745-4.748a.724.724 0 00-1-.071.724.724 0 00-.07 1c.07.106.927 1.07 2.283 2.141L.631 5.219a.69.69 0 00.036 1c.071.142.25.213.428.213a.705.705 0 00.5-.214l1.963-2.034A13.91 13.91 0 006.806 5.86l-.75 2.535a.714.714 0 00.5.892h.214a.688.688 0 00.679-.535l.75-2.535a9.758 9.758 0 001.784.179c.607 0 1.213-.072 1.785-.179l.75 2.499c.07.321.392.535.677.535.072 0 .143 0 .179-.035a.714.714 0 00.5-.893l-.75-2.498a13.914 13.914 0 003.248-1.678L18.3 6.147a.705.705 0 00.5.214.705.705 0 00.499-.214.723.723 0 00.036-1l-1.82-1.891c1.463-1.071 2.32-2.106 2.32-2.106z"
                      ></path>
                    ) : (
                      <path
                        stroke="none"
                        fill="#000"
                        fill-opacity=".54"
                        fill-rule="evenodd"
                        d="M19.975 5.823V5.81 5.8l-.002-.008v-.011a.078.078 0 01-.002-.011v-.002a.791.791 0 00-.208-.43 13.829 13.829 0 00-1.595-1.64c-1.013-.918-2.123-1.736-3.312-2.368-.89-.474-1.832-.867-2.811-1.093l-.057-.014a2.405 2.405 0 01-.086-.02L11.884.2l-.018-.003A9.049 9.049 0 0010.089 0H9.89a9.094 9.094 0 00-1.78.197L8.094.2l-.016.003-.021.005a1.844 1.844 0 01-.075.017l-.054.012c-.976.226-1.92.619-2.806 1.09-1.189.635-2.3 1.45-3.31 2.371a13.828 13.828 0 00-1.595 1.64.792.792 0 00-.208.43v.002c-.002.007-.002.015-.002.022l-.002.01V5.824l-.002.014a.109.109 0 000 .013L0 5.871a.206.206 0 00.001.055c0 .01 0 .018.002.027 0 .005 0 .009.003.013l.001.011v.007l.002.01.001.013v.002a.8.8 0 00.208.429c.054.067.11.132.165.197a13.9 13.9 0 001.31 1.331c1.043.966 2.194 1.822 3.428 2.48.974.52 2.013.942 3.09 1.154a.947.947 0 01.08.016h.003a8.864 8.864 0 001.596.16h.2a8.836 8.836 0 001.585-.158l.006-.001a.015.015 0 01.005-.001h.005l.076-.016c1.079-.212 2.118-.632 3.095-1.153 1.235-.66 2.386-1.515 3.43-2.48a14.133 14.133 0 001.474-1.531.792.792 0 00.208-.43v-.002c.003-.006.003-.015.003-.022v-.01l.002-.008c0-.004 0-.009.002-.013l.001-.012.001-.015.001-.019.002-.019a.07.07 0 01-.01-.036c0-.009 0-.018-.002-.027zm-6.362.888a3.823 3.823 0 01-1.436 2.12l-.01-.006a3.683 3.683 0 01-2.178.721 3.67 3.67 0 01-2.177-.721l-.009.006a3.823 3.823 0 01-1.437-2.12l.014-.01a3.881 3.881 0 01-.127-.974c0-2.105 1.673-3.814 3.738-3.816 2.065.002 3.739 1.711 3.739 3.816 0 .338-.047.662-.128.975l.011.009zM8.145 5.678a1.84 1.84 0 113.679 0 1.84 1.84 0 01-3.679 0z"
                        clip-rule="evenodd"
                      ></path>
                    )}
                  </svg>
                </button>
              </div>
              <div class="pYVjxt"></div>
            </div> */}
            {/* <button
              class="wyhvVD _1EApiB hq6WM5 L-VL8Q cepDQ1 _7w24N1"
              disabled
            >
              Đăng nhập
            </button> */}
            {/* <div class="tRiWov">
              <a class="anLGcx" href="/buyer/reset">
                Quên mật khẩu
              </a>
              <a
                class="anLGcx"
                href="/buyer/login/otp?next=https%3A%2F%2Fshopee.vn%2Fm%2Ffreeship-xtra-plus"
              >
                Đăng nhập với SMS
              </a>
            </div> */}
            <div class="_6yKazv">
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
            {/* <div class="lhhucE">
              <div class="lreZhl"></div>
              <span class="PqS8vj">hoặc</span>
              <div class="lreZhl"></div>
            </div>
            <div class="_6yKazv">
              <div class="_3051nA">
                <button style={{ width: "100%" }} class="nGTAZw lyJbNT bQ2eCN">
                  <div class="Bq4Bra">
                    <div class="_1a550J social-white-background social-white-fb-blue-png"></div>
                  </div>
                  <div class="">Facebook</div>
                </button>
              </div>
            </div> */}
          </div>
          {/* <div class="XLzpXt">
            <div class="Oug9xv Z8OMtU">
              Bạn chưa có tài khoản?{" "}
              <Link class="wzgwUg" to={`/register`}>
                Đăng ký
              </Link>
            </div>
          </div> */}
        </div>
      </form>
    </div>
  );
};

export default Login;
