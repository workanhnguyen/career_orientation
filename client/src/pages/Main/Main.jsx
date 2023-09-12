import React, { useState, memo } from "react";
import { Link } from "react-router-dom";
import cookies from 'react-cookies';

import { images } from "../../constants";
import { Feedback } from "../../container";
import "./Main.scss";
import { HeaderOnly, FooterOnly } from '../../Layout'
import { Back } from '../../container'

const services = [
    {
      title: 'Khảo sát định hướng',
      image: images.serviceIcon1,
      content: 'Thực hiện bài khảo sát và nhận ngay kết quả về lĩnh vực ngành nghề phù hợp với bản thân.',
      route: '/survey'
    },
    {
      title: 'Tìm hiểu trường đại học',
      image: images.serviceIcon2,
      content: 'Tìm thông tin chính thống về các trường đại học, tìm ra ngôi trường yêu thích.',
      route: '/search-university'
    },
];

function Main() {
    const user = cookies.load('user');

    if (user === undefined)
        return (<Back />);
    else
    return (
        <>
            <HeaderOnly>
                <div id='main'>
                    <div className="container">
                        <div className="row justify-content-around align-items-center main__choices">
                            {services.map((item, index) => (
                                <div key={index} className="col-12 col-sm-12 col-lg-6 col-xl-6">
                                    <div className="item">
                                        <img src={item.image} alt=""/>
                                        <div>
                                            <h3>{item.title}</h3>
                                            <p>{item.content}</p>
                                        </div>
                                        <div>
                                            <Link to={item.route}>Truy cập</Link>
                                        </div>
                                    </div>
                                </div>))
                            }
                        </div>
                    </div>
                </div>
            </HeaderOnly> 
            <Feedback />
            <FooterOnly />
        </>
        
    )
}

export default memo(Main)