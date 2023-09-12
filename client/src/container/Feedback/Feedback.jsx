import React, { useState } from "react";
import cookies from "react-cookies";

import "./Feedback.scss";
import Apis, { endpoints } from "../../configs/Apis";

function Feedback() {
  const user = cookies.load("user");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [alertInfo, setAlertInfo] = useState("");

  const resetStates = () => {
    setTitle("");
    setContent("");
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    let sendFeedback = async () => {
      const formData = new FormData();

      if (title.trim() === "" || content.trim() === "")
        setAlertInfo("Không được để trống thông tin!");
      else {
        formData.append("title", title.trim());
        formData.append("content", content.trim());

        try {
          await Apis.post(endpoints["add-feedback"], formData, {
            headers: {
              Authorization: `Bearer ${cookies.load("access_token")}`,
            },
          });

          setAlertInfo("Thành công!");
          resetStates();
        } catch (error) {
          if (error.code === "ERR_NETWORK")
            setAlertInfo("Server connection refused");
          else if (error.code === 500) setAlertInfo("Internal server error");
          else setAlertInfo("Lỗi bất định. Vui lòng thử lại sau!");
        }
      }
    };

    sendFeedback();
  };

  return (
    <section id="feedback" className="contact">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h5>PHẢN HỒI</h5>
            <h2>Đóng góp ý kiến</h2>
          </div>
        </div>
        <form onSubmit={handleSubmitFeedback}>
          <div className="row">
            <div className="col-12 col-lg-12 email">
              <input
                placeholder="Tiêu đề"
                type="subject"
                id="subject"
                size="30"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-12 message">
              <textarea
                required
                id="message"
                name="message"
                rows="5"
                cols="1"
                placeholder="Nội dung..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>
            <small
              style={{ color: "var(--primary-color)", paddingLeft: "16px" }}
            >
              {alertInfo}
            </small>
            <div className="col-12">
              <div className="contact-btn">
                {/* <!-- Send Message Btn --> */}
                <button type="submit">Gửi phản hồi</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Feedback;
