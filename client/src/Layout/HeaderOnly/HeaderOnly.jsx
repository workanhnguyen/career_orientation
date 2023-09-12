import React, { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import cookies from 'react-cookies'

import { images, variables } from "../../constants";
import "./HeaderOnly.scss";
import { logoutUser } from "../../ActionCreators/UserCreators";

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

function HeaderOnly({ children }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();

    setToggle(false);
    cookies.remove("access_token");
    cookies.remove("user");
    dispatch(logoutUser())
    navigate("/");
  }

  const [toggle, setToggle] = useState(false);
  const user = cookies.load("user");
  return (
    <div id="header-only">
      <div className="container">
        <div className="main__header">
          <Link to="/" className="main__header-img">
            <img src={images.logo} />
          </Link>
          <div className="main__header-user-info">
            <span>{user !== undefined ? `${user.last_name} ${user.first_name}` : `null`}</span>
            <div className="app__navbar-menu">
              <img src={user.avatar !== null ? `${variables.BASE_DIR_STATIC}${user.avatar}` : images.defaultUser} onClick={() => setToggle(true)} />
              {toggle && (
                <motion.div
                  whileInView={{ x: [300, 0] }}
                  transition={{ duration: 0.85, ease: "easeOut" }}
                  className="main__hiden-panel"
                >
                  <HiX onClick={() => setToggle(false)} />
                  <ul className="app__navbar-links">
                    {navList.map((item, index) => {
                      if (item.route === '/') {
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
                      } else {
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
                      }
                    })}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default memo(HeaderOnly);
