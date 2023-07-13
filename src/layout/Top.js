import React from "react";

const Top = () => {
  return (
    <div id="top">
      <div className="grid_3 ">
        <div className="phone_top">
          <span>Call Us +777 (100) 1234</span>
        </div>
      </div>
      <div className="grid_6">
        <div className="welcome">
          Welcome visitor you can <a href="/login.html">login</a> or{" "}
          <a href="/login.html">create an account</a>.
        </div>
      </div>

      <div className="grid_3"></div>
    </div>
  );
};

export default Top;
