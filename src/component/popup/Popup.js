import React from "react";
import "./Popup.css";
const Popup = ({ action, cancel, message, btn1 = null, btn2 }) => {
  return (
    <aside
      tabindex="0"
      role="dialog"
      aria-modal="true"
      aria-label="Mã xác thực (OTP) sẽ được gửi qua tin nhắn Zalo của số điện thoại (+84) 943166208."
      class="ReDGyJ undefined"
    >
      <div class="_68lNMv undefined">
        <div class="aZ-vOM">
          <div class="_9wmqil vylugi">
            <div class="_7iez0l">
              {message}
              {/* Mã xác thực (OTP) sẽ được gửi qua tin nhắn Zalo của số điện thoại
              (+84) 943166208. */}
            </div>
          </div>
          <div class="Kp5gjr zfb33O">
            {btn1 && (
              <button onClick={() => cancel()} class="wyhvVD _1EApiB j3cHHZ">
                {btn1}
              </button>
            )}
            <button onClick={() => action()} class="wyhvVD _1EApiB gSuZ93">
              {btn2}
            </button>
          </div>
        </div>
      </div>
      <div class="rZRsMD"></div>
    </aside>
  );
};

export default Popup;
