import React, { useState, memo, useEffect } from "react";
import cookies from "react-cookies";

import { images } from "../../constants";
import { FooterOnly, HeaderOnly } from "../../Layout";
import { Back } from "../../container";
import "./Survey.scss";
import Apis, { endpoints } from "../../configs/Apis";

const INIT_SURVEY = "INIT_SURVEY";
const DO_SURVEY = "DO_SURVEY";
const RESULT_SURVEY = "RESULT_SURVEY";

function Survey() {
  const [toggleSurvey, setToggleSurvey] = useState(INIT_SURVEY);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [listQuestion, setListQuestion] = useState([]);
  const [question, setQuestion] = useState();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [countResult, setCountResult] = useState();
  const [checkedState, setCheckedState] = useState();
  const [result, setResult] = useState({});
  const [rangeAnswer, setRangeAnswer] = useState();
  const [requiredInput, setRequiredInput] = useState(true);
  const [careerCategoryList, setCareerCategoryList] = useState([]);

  const user = cookies.load("user");

  // Fetch datas from API only 1 time
  useEffect(() => {
    const fetchData = async () => {
      // Fetch and set question data
      let resQuestion = await Apis.get(endpoints["questions"], {
        headers: {
          Authorization: `Bearer ${cookies.load('access_token')}`
        }
      });

      setListQuestion(resQuestion.data);
      setTotalQuestions(resQuestion.data.length);
      setCheckedState(
        new Array(resQuestion.data.length * resQuestion.data[0].answers.length).fill(
          false
        )
      );

      // Fetch and set total career category
      let resTotalCategory = await Apis.get(`${endpoints["career-categories"]}total-category/`, {
        headers: {
          Authorization: `Bearer ${cookies.load('access_token')}`
        }
      });

      setCountResult(new Array(resTotalCategory.data).fill(0));

      // Fetch and set data of career category
      let resDataCategory = await Apis.get(endpoints["career-categories"], {
        headers: {
          Authorization: `Bearer ${cookies.load('access_token')}`
        }
      });

      setCareerCategoryList(resDataCategory.data);
    };
    fetchData();
  }, []);

  // Re-render and update value of indexQuestion when user clicks on prev and next button
  useEffect(() => {
    setQuestion(listQuestion[indexQuestion]);
  }, [indexQuestion]);

  // When user clicks on "Bắt đầu ngay" button
  // It will render DO_SURVEY UI
  // Init first question
  const handleRenderSurvey = (e) => {
    e.preventDefault();

    setQuestion(listQuestion[indexQuestion]);

    // Check the answers of this question are checked at least one or not
    const newRangeAnswer = new Array(listQuestion.length);
    for (let i = 0; i < newRangeAnswer.length; i++) {
      newRangeAnswer[i] = new Array(
        listQuestion[indexQuestion].answers.length
      ).fill(false);
    }
    setRangeAnswer(newRangeAnswer);
    setToggleSurvey(DO_SURVEY);
  };

  // Handle data when user chooses checkbox and save those choices
  const handleCheckboxChange = (e) => {
    // Check state checked of input fields
    setCheckedState(
      checkedState.map((item, index) => {
        return index === e.target.id - 1 ? !item : item;
      })
    );

    // Check user selected checkbox in current question
    rangeAnswer[indexQuestion] = rangeAnswer[indexQuestion].map(
      (item, index) => {
        return index === Math.floor((e.target.id - 1) % rangeAnswer[indexQuestion].length)
          ? !item
          : item;
      }
    );

    const setCheckboxValue = (e) => {
      if (e.target.checked === true) {
        if (!countResult[Number(e.target.value) - 1])
          countResult[Number(e.target.value) - 1] = 1;
        else
          countResult[Number(e.target.value) - 1] =
            countResult[Number(e.target.value) - 1] + 1;
      } else {
        countResult[Number(e.target.value) - 1] =
          countResult[Number(e.target.value) - 1] - 1;
      }
    };

    setCheckboxValue(e);
  };

  // Handle indexQuestion when user clicks on button
  const handlePrevBtn = (e) => {
    e.preventDefault();
    if (rangeAnswer[indexQuestion].includes(true)) {
      setIndexQuestion((prev) => prev - 1);
      setRequiredInput(false);
    } else setRequiredInput(true);
  };

  // Handle indexQuestion when user clicks on button
  const handleNextBtn = (e) => {
    e.preventDefault();
    if (rangeAnswer[indexQuestion].includes(true)) {
      setIndexQuestion((prev) => prev + 1);
      setRequiredInput(false);
    } else setRequiredInput(true);
  };

  // Calculate result and save it to database when user clicks on button
  const handleSubmitSurvey = () => {

    setIndexQuestion(0);

    const max = Math.max(...countResult);
    const categoryIndex = countResult.indexOf(max) + 1;

    const saveSurveyData = async () => {

      // Get data from career category
      try {
        let res = await Apis.get(`${endpoints["career-categories"]}${categoryIndex}/`, {
          headers: {
            Authorization: `Bearer ${cookies.load('access_token')}`
          }
        });
        let data = res.data;

        setResult(data);
        const saveResult = `<p>${data.category_name}<br/><b>Đặc điểm tính cách: </b>${data.explained_content}<br/><b>Nghề nghiệp phù hợp: </b>${data.career_content}</p>`;

        // Prepare data to save to database
        const formData = new FormData();
        formData.append("participant", user.id);
        formData.append("result", saveResult);

        try {
          await Apis.post(endpoints["add-survey"], formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${cookies.load("access_token")}`,
            },
          });
        } catch (err) {
          console.log(err);
        }

      } catch (err) {
        console.log(err);
      }
    };

    saveSurveyData();

    setToggleSurvey(RESULT_SURVEY);
    resetSurvey();
  };
  // Reset survey
  const resetSurvey = () => {
    setCheckedState(checkedState.fill(false));
    setCountResult(countResult.fill(0));
  };

  if (user === undefined) return <Back />;
  else
    switch (toggleSurvey) {
      case INIT_SURVEY:
        return (
          <>
            <HeaderOnly>
              <div id="survey">
                <div className="container">
                  <div className="row no-gutters justify-content-center align-items-center init">
                    <div className="col-12 col-sm-12 col-lg-6 col-xl-6">
                      <div className="survey__image">
                        <img src={images.holland} />
                      </div>
                    </div>
                    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
                      <div className="survey__content">
                        <p>
                          Trắc nghiệm Holland chính là cơ sở để bạn đối chiếu sở
                          thích, năng lực tự nhiên của mình với yêu cầu của các
                          nhóm ngành nghề. Từ đó bạn có thể định hướng nghề nghiệp
                          theo nhóm ngành phù hợp nhất. Kết quả Bài trắc nghiệm
                          định hướng nghề nghiệp giúp bạn tìm ra ba kiểu tính cách
                          của bạn tương ứng với 3 mật mã Holland (ví dụ: RCE hoặc
                          ECR ). Sau đó dùng mã này kết nối với những nghề nghiệp
                          cụ thể. Hãy thả lỏng tâm trí và thực hiện khảo sát một
                          cách thoải mái nhất.
                        </p>
                        <button
                          onClick={handleRenderSurvey}
                          className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4"
                        >
                          Bắt đầu ngay!
                        </button>
                      </div>
                    </div>
                  </div>
                  {careerCategoryList.map((item, index) => (
                    <div
                      key={index}
                      className="row no-gutters justify-content-center align-items-center explain"
                    >
                      <div className="col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4">
                        <div className="explain__image">
                          <img src={item.image} />
                        </div>
                      </div>
                      <div className="col-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 explain__content">
                        <div className="explain__content">
                          <p>{item.explained_content}</p>
                          <p>
                            <b>Đặc điểm tính cách: </b>
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </HeaderOnly>
            <FooterOnly />
          </>
        );
      case DO_SURVEY:
        return (
          <HeaderOnly>
            <h1 id="hal"></h1>
            <div id="survey">
              <div className="container">
                <div className="row no-gutters justify-content-center align-items-center question">
                  <div className="col col-12 col-sm-12 col-lg-8 col-xl-8">
                    <div className="question__item">
                      <p className="question__item-title">
                        {`${question.id}. ${question.question_content}`}
                      </p>
                      <form>
                        {question.answers.map((itemAnswer, index) => (
                          <label
                            key={index}
                            className="question__item-choice"
                            htmlFor={itemAnswer.id}
                          >
                            <input
                              id={itemAnswer.id}
                              type="checkbox"
                              name={itemAnswer.id}
                              onChange={(e) => handleCheckboxChange(e)}
                              value={itemAnswer.career_category}
                              checked={checkedState[itemAnswer.id - 1]}
                              required={requiredInput}
                            />
                            {itemAnswer.answer_content}
                          </label>
                        ))}
                        {indexQuestion === 0 ? (
                          <div className="question__item-controller">
                            <button
                              type="submit"
                              onClick={handleNextBtn}
                              className="controller-next col-12 col-sm-5"
                            >
                              Câu tiếp theo
                            </button>
                          </div>
                        ) : indexQuestion === totalQuestions - 1 ? (
                          <div className="question__item-controller">
                            <button
                              type="submit"
                              onClick={handlePrevBtn}
                              className="controller-prev col-12 col-sm-5"
                            >
                              Câu trước
                            </button>
                            <button
                              type="submit"
                              onClick={handleSubmitSurvey}
                              className="controller-submit col-12 col-sm-5"
                            >
                              Nộp đáp án
                            </button>
                          </div>
                        ) : (
                          <div className="question__item-controller">
                            <button
                              type="submit"
                              onClick={handlePrevBtn}
                              className="controller-prev col-12 col-sm-5"
                            >
                              Câu trước
                            </button>
                            <button
                              type="submit"
                              onClick={handleNextBtn}
                              className="controller-next col-12 col-sm-5"
                            >
                              Câu tiếp theo
                            </button>
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </HeaderOnly>
        );
      case RESULT_SURVEY:
        return (
          <HeaderOnly>
            <div id="survey">
              <div className="container">
                <div className="row no-gutters justify-content-center align-items-center result">
                <h1 className="result__title">KẾT QUẢ CỦA BẠN LÀ:</h1>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                    <img className="result__image" src={result.image} />
                  </div>
                  <div className="col-12 col-sm-12 col-md-12 col-lg-8 col-xl-8">
                  
                    <p className="result__content">
                      {result.category_name}
                      <br />
                      <br />
                      <b>Đặc điểm tính cách: </b>
                      {result.explained_content}
                      <br />
                      <br />
                      <b>Nghề nghiệp phù hợp: </b>
                      {result.career_content}
                    </p>
                  </div>
                  <div className="col-12 col-sm-12 col-md-6 col-lg-4 col-xl-4">
                    <button
                      onClick={() => setToggleSurvey(INIT_SURVEY)}
                      className="result__btn-back"
                    >
                      Trở về
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </HeaderOnly>
        );
    }
}

export default memo(Survey);
