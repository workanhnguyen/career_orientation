import React from "react";
import { Link } from "react-router-dom";

import { images } from "../../constants";

import "./Back.scss";

function Back() {
  return (
    <div id="back">
      <div className="back__container">
        <div className="back__image">
          <img src={images.back} alt="back" />
        </div>
        <h2 className="back__title">Vui lòng đăng nhập</h2>
        <Link to="/login" className="back__btn">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default Back;
