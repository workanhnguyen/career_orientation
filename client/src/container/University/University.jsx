import React, { useState, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import cookies from "react-cookies";

import { images } from "../../constants";
import "./University.scss";
import Apis, { endpoints } from "../../configs/Apis";

function University() {
  const user = cookies.load("user");

  const [toggleShowMoreUni, setToggleShowMoreUni] = useState(false);
  const [uniList, setUniList] = useState([]);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        let res = await Apis.get(endpoints["get-universities"]);

        const newUniList = res.data.slice(0, 9).map((item, index) => {
          if (index < 6)
            return {
              ...item,
              showed: true,
            };
          else
            return {
              ...item,
              showed: false,
            };
        });
        setUniList(newUniList);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUniversityData();
  }, []);

  return (
    <section id="university" className="portfolio">
      <div className="container-fluid">
        <div className="portfolio-aside">
          <img src={images.aside3} alt="" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2>
                Một số trường đại học
                <br />ở Thành phố Hồ Chí Minh
              </h2>
            </div>
          </div>
          <div className="row">
            {uniList.map((item, index) => {
              if (item.showed === true)
                return (
                  <div key={index} className="col-12 col-sm-6 col-lg-4 work-box">
                    <div className="photobox photobox_type10">
                      {user !== undefined ? (
                        <Link
                          to="/search-university"
                          className="photobox__previewbox"
                        >
                          <img
                            src={item.image}
                            className="photobox__preview"
                            alt="Preview"
                          />
                          <span className="photobox__label">Xem ngay</span>
                        </Link>
                      ) : (
                        <Link to="/login" className="photobox__previewbox">
                          <img
                            src={item.image}
                            className="photobox__preview"
                            alt="Preview"
                          />
                          <span className="photobox__label">
                            Đăng nhập để xem
                          </span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
            })}
          </div>
          <div className="row">
            <div className="col-12 more-btn">
              {/* <!-- Show Me More/Less Button --> */}
              {toggleShowMoreUni ? null : (
                <a
                  onClick={() => {
                    setUniList(
                      uniList.map((item) => {
                        if (item.showed === false) item.showed = true;
                        return item;
                      })
                    );
                    setToggleShowMoreUni(true);
                  }}
                  className="more-btn-inside"
                >
                  Hiển thị thêm
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(University);
