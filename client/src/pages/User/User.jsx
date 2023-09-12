import React, { useState, memo, useEffect, useReducer, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import cookies from 'react-cookies';
import { HiXCircle } from 'react-icons/hi'

import { images } from "../../constants";
import { InputWithLabel } from '../../components'
import { Back } from "../../container";
import { FooterOnly } from "../../Layout";
import "./User.scss";
import { variables } from '../../constants'
import { useDispatch } from "react-redux";
import { logoutUser } from "../../ActionCreators/UserCreators";
import Apis, { endpoints } from "../../configs/Apis";

const USER_EDIT = 'USER_EDIT';
const USER_SURVEY = 'USER_SURVEY';
const BYTE = 1048576;
const MEGA_BYTE = 2;
//       "id": 18,
//       "result": "Realistic - Người thực tế",
//       "participant": 1,
//       "created_date": "2023-01-28T04:51:24.571719Z"
//   },
//   {
//       "id": 19,
//       "result": "hihi haha",
//       "participant": 1,
//       "created_date": "2023-01-28T04:51:39.233930Z"
//   },
//   {
//       "id": 20,
//       "result": "hoho",
//       "participant": 1,
//       "created_date": "2023-01-28T05:23:00.328016Z"
//   },
//   {
//       "id": 21,
//       "result": "hakdhasjds",
//       "participant": 1,
//       "created_date": "2023-01-29T13:12:43.744376Z"
//   },
//   {
//     "id": 18,
//     "result": "Realistic - Người thực tế",
//     "participant": 1,
//     "created_date": "2023-01-28T04:51:24.571719Z"
// },
// {
//     "id": 19,
//     "result": "hihi haha",
//     "participant": 1,
//     "created_date": "2023-01-28T04:51:39.233930Z"
// },
// {
//     "id": 20,
//     "result": "hoho",
//     "participant": 1,
//     "created_date": "2023-01-28T05:23:00.328016Z"
// },
// {
//     "id": 21,
//     "result": "hakdhasjds",
//     "participant": 1,
//     "created_date": "2023-01-29T13:12:43.744376Z"
// }
// ];

function User() {

  const user = cookies.load('user');

  const [firstName, setFirstName] = useState(user === undefined ? '' : user.first_name);
  const [lastName, setLastName] = useState(user === undefined ? '' : user.last_name);
  const [email, setEmail] = useState(user === undefined ? '' : user.email);
  const [dob, setDob] = useState(user === undefined ? '' : user.day_of_birth);
  const avatar = useRef();

  const [alertInfo, setAlertInfo] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [toggle, setToggle] = useState(USER_SURVEY);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getSurveyData = async() => {
      try {
        let res = await Apis.get(endpoints['get-survey'], {
          headers: {
            "Authorization": `Bearer ${cookies.load('access_token')}`
          }
        });
        setSurveys(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (user !== undefined)
      getSurveyData();
  }, [])

  setTimeout(() => {
    if (user !== undefined && toggle === USER_SURVEY) 
          document.getElementById('survey__result').innerHTML = surveys.map((item, index) => (
            `<li key=${index}>
              <h5>${item.created_date.toString().slice(0, 10)}</h5>
              ${item.result}
            </li>`
          )).join('');
  }, 0);

  const handleEdit = (e) => {
    e.preventDefault();

    const updateUser = async() => {
      let allowToUpdate = false;

      const formData = new FormData();

      if (
        firstName.trim() === "" ||
        lastName.trim() === "" ||
        email.trim() === ""
      )
        setAlertInfo("Không được để trống thông tin!");
      else {
        if (avatar.current.files[0] !== undefined) {
          if (avatar.current.files[0].size < BYTE * MEGA_BYTE) {
            formData.append("avatar", avatar.current.files[0]);
            allowToUpdate = true;
          } else {
            allowToUpdate = false;
            setAlertInfo(
              `Kích cỡ ảnh phải dưới ${MEGA_BYTE}MB!`
            );
            avatar.current.value = "";
          }
        } else {
          formData.append("avatar", user.avatar);
          allowToUpdate = true;
        }
      }

      if (allowToUpdate) {
        formData.append("first_name", firstName);
        formData.append("last_name", lastName);
        formData.append("email", email);
        formData.append("day_of_birth", dob);

        try {
          let res = await Apis.patch(endpoints["update"], formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${cookies.load('access_token')}`
            },
          });
          if (res.status === 200) {
            let user = await Apis.get(endpoints["current-user"], {
              headers: {
                Authorization: `Bearer ${cookies.load("access_token")}`,
              },
            });
            setAlertInfo("Thành công!");
            cookies.save("user", user.data);
            resetStates();
          }
        } catch (error) {
          if (error.code === "ERR_NETWORK")
            setAlertInfo("Server connection refused");
          else setAlertInfo("Không thể chỉnh sửa, vui lòng thử lại sau!");
        }
      }
    }
    updateUser();
  }

  const handleLogout = (e) => {
    e.preventDefault();

    cookies.remove("access_token");
    cookies.remove("user");
    dispatch(logoutUser())
    navigate("/");
  }

  const resetStates = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDob("")
    avatar.current.value = null
  };
  
  if (user === undefined)
    return (<Back />);
  else
    switch(toggle) {
      case USER_SURVEY:
        return (
          <div id="user">
            <div className="container">
              <div className="row no-gutters justify-content-center align-items-center user">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
                  <div className="user__info">
                    <div className="user__info-image">
                      <img src={user.avatar === null ? images.defaultUser : `${variables.BASE_DIR_STATIC}${user.avatar}` } alt="avatar" />
                    </div>
                    <div className="user__info-detail">
                      <p>
                        <span className="title">Họ và tên: </span>
                        <span className="content">{`${user.last_name} ${user.first_name}`}</span>
                      </p>
                      <p>
                        <span className="title">Ngày sinh: </span>
                        <span className="content">{`${user.day_of_birth}`}</span>
                      </p>
                      <p>
                        <span className="title">Email: </span>
                        <span className="content">{`${user.email}`}</span>
                      </p>
                    </div>
                    <div className="row user__info-controller">
                      <button
                        onClick={() => setToggle(USER_EDIT)}
                        className="btn-edit col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                      >
                        Chỉnh sửa
                      </button>
                      <Link 
                        to="/" 
                        onClick={handleLogout} 
                        className="btn-log-out col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12"
                      >
                        Đăng xuất
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-7">
                  <div className="user__show">
                    <h3>LỊCH SỬ KHẢO SÁT:</h3>
                    <ul id="survey__result" className="survey__list scroll">
                      {
                        surveys.map((item, index) => (
                          `<li key=${index}>
                            <h5>${item.created_date.toString().slice(0, 10)}</h5>
                            ${item.result}
                          </li>`
                        )).join('')
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <FooterOnly />
          </div>
        );
      case USER_EDIT:
        return (
          <div id="user">
            <div className="container">
              <div className="row no-gutters justify-content-center align-items-center user">
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-5">
                  <div className="user__info">
                    <div className="user__info-image">
                    <img src={user.avatar === null ? images.defaultUser : `${variables.BASE_DIR_STATIC}${user.avatar}`} alt="avatar" />
                    </div>
                    <div className="user__info-detail">
                      <p>
                        <span className="title">Họ và tên: </span>
                        <span className="content">{`${user.last_name} ${user.first_name}`}</span>
                      </p>
                      <p>
                        <span className="title">Ngày sinh: </span>
                        <span className="content">{user.day_of_birth}</span>
                      </p>
                      <p>
                        <span className="title">Email: </span>
                        <span className="content">{user.email}</span>
                      </p>
                    </div>
                    <div className="user__info-controller">
                      <Link 
                        to="/" 
                        onClick={handleLogout} 
                        className="btn-log-out col-12 col-sm-5 col-md-5 col-lg-12"
                      >
                        Đăng xuất
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-7">
                  <div className="user__show">
                    <form onSubmit={handleEdit}>
                      <div>
                        <InputWithLabel
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          label="Họ và chữ lót:"
                          required
                        />
                        <InputWithLabel
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          label="Tên:"
                          required
                        />
                      </div>
                      <div>
                        <InputWithLabel
                          id="dob"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          type="date"
                          label="Ngày sinh:"
                          required
                        />
                        <InputWithLabel
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                          label="Email:"
                          required
                        />
                      </div>
                      <div className="form__avatar"> 
                        <label>
                          Ảnh đại diện:<br/>
                          <input ref={avatar} type="file" accept=".png,.jpg" />
                        </label>
                        <HiXCircle onClick={() => avatar.current.value = null}/>
                      </div>
                      <div>
                        <small className="alert-info">{alertInfo}</small>
                      </div>
                      <div className="row user__info-controller">
                        <button 
                          className="btn-submit col-12 col-sm-12 col-lg-12 col-xl-4"
                          type="submit"
                        >
                          Lưu thông tin
                        </button>
                        <button 
                          className="btn-back col-12 col-sm-12 col-lg-12 col-xl-4"
                          onClick={() => setToggle(USER_SURVEY)}
                        >
                          Trở lại
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <FooterOnly />
          </div>
        )
    }
}

export default memo(User)