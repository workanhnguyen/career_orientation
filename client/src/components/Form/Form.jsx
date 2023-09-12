import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import cookies from "react-cookies";

import "./Form.scss";
import Apis, { endpoints } from "../../configs/Apis";
import { InputWithLabel, Loading } from "../../components";
import { images } from "../../constants";
import { loginUser } from "../../ActionCreators/UserCreators";

const BYTE = 1048576;
const MEGA_BYTE = 2;

function Form({ btnContent, type }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState();
  const avatar = useRef();

  const [alertInfo, setAlertInfo] = useState("");
  const [isLogining, setIsLogining] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetStates = () => {
    setFirstName("");
    setLastName("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setAlertInfo("");
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let OAuth2Info = await Apis.get(endpoints["oauth2-info"]);
      let OAuth2Token = await Apis.post(endpoints["login"], {
        client_id: OAuth2Info.data.client_id,
        client_secret: OAuth2Info.data.client_secret,
        username: username,
        password: password,
        grant_type: "password",
      });

      cookies.save("access_token", OAuth2Token.data.access_token);

      let user = await Apis.get(endpoints["current-user"], {
        headers: {
          Authorization: `Bearer ${cookies.load("access_token")}`,
        },
      });
      cookies.save("user", user.data);
      dispatch(loginUser(user.data));
      setIsLogining(true);
      setAlertInfo('');
      setTimeout(() => {
        navigate("/main"); 
      }, 1500)
    } catch (error) {
      if (error.code === "ERR_NETWORK")
        setAlertInfo("Server connection refused");
      else if (error.code === 500)
        setAlertInfo("Internal Server Error")
      else 
        setAlertInfo("Tên đăng nhập hoặc mật khẩu không chính xác!");
    }
  };
  const handleRegister = (e) => {
    e.preventDefault();

    let registerUser = async () => {
      let allowToRegister = false;

      const formData = new FormData();

      if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        username.trim() === "" ||
        password.trim() === "" ||
        confirmPassword.trim() === "" ||
        email.trim() === ""
      )
        setAlertInfo("Không được để trống thông tin!");
      else if (username.includes(" "))
        setAlertInfo("Tên đăng nhập không được chứa khoảng trắng!");
      else if (password.includes(" "))
        setAlertInfo("Mật khẩu không được chứa khoảng trắng!");
      else if (password.length < 8)
        setAlertInfo("Mật khẩu phải có độ dài từ 8 kí tự!");
      else if (password !== confirmPassword)
        setAlertInfo("Mật khẩu không trùng khớp!");
      else {
        if (avatar.current.files[0] !== undefined) {
          if (avatar.current.files[0].size < BYTE * MEGA_BYTE) {
            formData.append("avatar", avatar.current.files[0]);
            allowToRegister = true;
          } else {
            allowToRegister = false;
            setAlertInfo(
              `Kích cỡ ảnh phải dưới ${MEGA_BYTE}MB!`
            );
            avatar.current.value = "";
          }
        } else allowToRegister = true;
      }

      if (allowToRegister) {
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("email", email);
        formData.append("username", username);
        formData.append("password", password);
        formData.append("day_of_birth", dob);

        try {
          let res = await Apis.post(endpoints["register"], formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          if (res.status === 201) {
            setAlertInfo("Thành công!");
            resetStates();
            navigate("/login");
          }
        } catch (error) {
          if (error.code === "ERR_NETWORK")
            setAlertInfo("Server connection refused");
          else if (error.code === 500)
            setAlertInfo("Internal server error");
          else 
            setAlertInfo("Tên đăng nhập đã tồn tại!");
        }
      }
    };
    registerUser();
  };

  return type === "login" ? (
    <div id="form">
      <div className="form__img">
        <img src={images.loginHead} alt="login-logo" />
      </div>
      <form onSubmit={handleLogin}>
        <InputWithLabel
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Tên đăng nhập"
          required
        />
        <InputWithLabel
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          label="Mật khẩu"
          required
        />
        <small className="alert">{alertInfo}</small>
        {!isLogining ? (
          <button type="submit">{btnContent}</button>
        ) : (
          <Loading />
        )}
      </form>
      <div className="form__switch">
        {!isLogining ? (
          <Link to="/register">
          Chưa có tài khoản?{" "}
          <span className="form__switch-highlight">Đăng ký ngay</span>
          </Link>
        ) : (
          null
        )}
      </div>
    </div>
  ) : (
    <div id="form">
      <h3 className="form__title">ĐĂNG KÝ</h3>
      <form onSubmit={handleRegister}>
        <InputWithLabel
          id="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          label="Họ và chữ lót"
          required
        />
        <InputWithLabel
          id="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          label="Tên"
          required
        />
        <InputWithLabel
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          type="email"
          required
        />
        <InputWithLabel
          id="dob"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          label="Ngày sinh"
          type="date"
          required
        />
        <InputWithLabel
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Tên đăng nhập"
          required
        />
        <InputWithLabel
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Mật khẩu"
          type="password"
          required
        />
        <InputWithLabel
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          label="Nhập lại mật khẩu"
          type="password"
          required
        />
        <label htmlFor="avatar">
          <span>Ảnh đại diện</span>
          <br />
          <input id="avatar" type="file" ref={avatar} />
        </label>
        <small className="alert">{alertInfo}</small>
        <button type="submit">{btnContent}</button>
      </form>
      <div className="form__switch">
        <Link to="/login">
          Đã có tài khoản?{" "}
          <span className="form__switch-highlight">Đăng nhập ngay</span>
        </Link>
      </div>
    </div>
  );
}

export default Form;
