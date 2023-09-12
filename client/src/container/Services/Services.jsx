import React from "react";
import { Link } from "react-router-dom";
import cookies from 'react-cookies';

import { images } from "../../constants";
import "./Services.scss";

const services = [
  {
    title: 'Khảo sát định hướng',
    image: images.serviceIcon1,
    content: 'Thực hiện bài khảo sát và nhận ngay kết quả về lĩnh vực ngành nghề phù hợp với bản thân.'
  },
  {
    title: 'Tìm hiểu trường đại học',
    image: images.serviceIcon2,
    content: 'Tìm thông tin chính thống về các trường đại học, tìm ra ngôi trường yêu thích.'
  },
];

function Services() {

  const user = cookies.load('user');

  return (
    <section id="about-us" className="services">
      <div className="container-fluid">
        <div className="side-img">
          <img src={images.aside} alt="" />
        </div>
        <div className="side2-img">
          <img src={images.aside2} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-sm-12 col-lg-4 service-txt">
              <h2 className="service-title">Mọi thứ bạn cần, chúng tôi cung cấp</h2>
              <div className="hero-btns service-btn">
                {user !== undefined ? (
                  <Link to="/main" data-scroll>
                    Trải nghiệm ngay
                  </Link>
                ) : (
                  <Link to="/login" data-scroll>
                    Đăng nhập
                  </Link>
                )}
              </div>
            </div>
            
            {services.map((item, index) => (
              <div key={index} className="col-12 col-sm-6 col-lg-4">
                <div className="item">
                  <img src={item.image} alt=""/>
                  <h3>{item.title}</h3>
                  <p>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
