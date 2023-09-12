import React, { useState, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { motion } from "framer-motion";
import cookies from "react-cookies";
import { useDispatch } from "react-redux";

import { images, variables } from "../../constants";
import { Back, Footer } from "../../container";
import "./SearchUniversity.scss";
import { logoutUser } from "../../ActionCreators/UserCreators";
import Apis, { endpoints } from "../../configs/Apis";

const navList = [
  {
    title: "Thông tin",
    route: "/current-user",
  },
  {
    title: "Đăng xuất",
    route: "/",
  },
];

function SearchUniversity() {
  const user = cookies.load("user");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [toggle, setToggle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUniList, setSearchUniList] = useState([]);
  const [uniList, setUniList] = useState([]);

  useEffect(() => {
    const fetchUniversityData = async () => {
      try {
        let res = await Apis.get(endpoints["get-universities"]);
        setUniList(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUniversityData();
  }, []);

  useEffect(() => {
    setSearchUniList(uniList.filter((uni) =>
        uni.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
      )
    );
  }, [searchTerm]);

  const handleLogout = (e) => {
    e.preventDefault();

    setToggle(false);
    cookies.remove("access_token");
    cookies.remove("user");
    dispatch(logoutUser());
    navigate("/");
  };

  if (user === undefined) return <Back />;
  else
    return (
      <div id="search-university">
        <div className="container">
          <div className="row justify-content-center">
          <div className="main__header">
            <Link to="/" className="main__header-img d-none d-sm-none d-lg-flex d-xl-flex">
              <img src={images.logo} />
            </Link>
            <div className="search-bar col-12 col-sm-6 col-lg-4 col-xl-4">
              <label>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Nhập tên trường muốn tìm..."
                />
                <BiSearchAlt className="icon" />
              </label>
            </div>
            <div className="main__header-user-info d-none d-sm-flex d-lg-flex d-xl-flex">
              <span>{`${user.last_name} ${user.first_name}`}</span>
              <div className="app__navbar-menu">
                <img
                  src={
                    user.avatar !== null
                      ? `${variables.BASE_DIR_STATIC}${user.avatar}`
                      : images.defaultUser
                  }
                  onClick={() => setToggle(true)}
                />
                {toggle && (
                  <motion.div
                    whileInView={{ x: [300, 0] }}
                    transition={{ duration: 0.85, ease: "easeOut" }}
                    className="main__hiden-panel"
                  >
                    <HiX onClick={() => setToggle(false)} />
                    <ul className="app__navbar-links">
                      {navList.map((item, index) => {
                        if (index === 0)
                          return (
                            <li key={index}>
                              <Link
                                data-scroll
                                to={item.route}
                                onClick={() => setToggle(false)}
                              >
                                {item.title}
                              </Link>
                            </li>
                          );
                        else
                          return (
                            <li key={index}>
                              <Link
                                data-scroll
                                to={item.route}
                                onClick={handleLogout}
                              >
                                {item.title}
                              </Link>
                            </li>
                          );
                      })}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          </div>
          <div className="row no-gutters justify-content-start main__content">
            {searchTerm !== '' ? (
              searchUniList.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3 col-xl-3">
                  <a className="item" href={item.link}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </a>
                </div>
              ))
            ) : (
              uniList.map((item, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-3 col-xl-3">
                  <a className="item" href={item.link}>
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
}

export default memo(SearchUniversity);
