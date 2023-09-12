import React from "react";

import { images } from "../../constants";
import "./Footer.scss";

function Footer() {
  return (
    <footer>
      <h5>SCOSS</h5>
      <h3>HCMC - OU</h3>
      <ul className="contact-nav">
        <li>
          <a data-scroll href="#home">
            Trang chủ
          </a>
        </li>
        <li>
          <a data-scroll href="#about-us">
            Về chúng tôi
          </a>
        </li>
        <li>
          <a data-scroll href="#university">
            Đại học
          </a>
        </li>
      </ul>
      <h6>© 2023 - SCOSS, Bản quyền</h6>
    </footer>
  );
}

export default Footer;
