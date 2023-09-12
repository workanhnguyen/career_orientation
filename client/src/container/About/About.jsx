import React from "react";

import { images } from "../../constants";
import "./About.scss";

function About() {
  return (
    <section className="about">
      <div className="container">
        <div className="row">
          <div className="col-12 col-sm-12 col-lg-6">
            <img src={images.aboutimg} alt="" />
          </div>
          <div className="col-12 col-sm-12 col-lg-6">
            <h5>HỆ THỐNG CỦA CHÚNG TÔI</h5>
            <h2>
              Thông tin
              <br />
              về chúng tôi
            </h2>
            {/* <!-- Replace About Us Text Under --> */}
            <p>
              Nhóm phát triển dự án nghiên cứu khoa học thuộc Khoa Công nghệ 
              thông tin - Trường Đại học Mở thành phố Hồ Chí Minh với đề tài "Hệ thống 
              hỗ trợ định hướng nghề nghiệp cho học sinh."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
