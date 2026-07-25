import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import style from './survey.module.css'; 

interface SubmitData {
  mnum : number,
  svnum : number,
  rating : number,
  request : string | null;
}

interface SurveyData {
  svnum : number,
  code : number,
  sub : string,
  questions : Question[]
}

interface Question {
  questions_text : string;
}

const SurveyAddForm: React.FC = () => {
  const [code, setCode] = useState<number>(5); 
  const [mnum,setMnum] = useState<number>(2);
  const [svnum, setSvnum] = useState<number>(0);
  const [surveyData, setSurveyData] = useState<SurveyData|null>(null);
  const [sub, setSub] = useState<string>("");
  const [req,setReq] = useState<string>("")

  const [rating, setRating] = useState<number[]>(Array(5).fill(0)); 
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACK_END_URL;

  const surveyRatingChange = (index: number, score: number) => {
    const newRatings = [...rating];
    newRatings[index] = score;
    setRating(newRatings);
  };

  useEffect(() => {

    const getSurvey = async () => {
      try {
        const response = await axios.get<SurveyData>(`${backendUrl}/api/survey/selectSurvey`);

        const responseData = response.data;

        setSurveyData(responseData);
        setSvnum(responseData.svnum);
        setCode(responseData.code);
        setSub(responseData.sub);
        setRating(Array(responseData.code).fill(0));

        console.log("평가지를 불러오는데 성공하였습니다.");
      } catch (error) {
        console.error("평가지를 불러오는데 실패하였습니다.",error);
      }
    };
    getSurvey();
  },[])
  
  const surveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(svnum);
    try {
      const submitData:SubmitData[] = rating.map((rating) => ({
        mnum : mnum,
        svnum : svnum,
        rating: rating, 
        request:req
      }));

      const response = await axios.post(`${backendUrl}/api/survey/addResult`, submitData);
      if(response.status === 200){
        alert("평가해 주셔서 감사합니다. 여러분들의 평가는 저희의 발전의 원동력이 됩니다.");
        navigate(-1);
      } 
    } catch (error) {
      console.error("Error :", error);
      alert("평가 등록에 실패하였습니다. 잠시 후 다시 시도해주십시오.");
    }
  };

  const handleChange = (e: any) => {
    setReq(e.target.value);
  }

  return (
    <div className={style.container2}>
      <form onSubmit={surveySubmit}>
        <div className="card w-100 shadow border-0">
          
          {/* 제목 */}
          <div className="card-header bg-dark text-white fw-bold py-3 text-center">
            (회사로고){sub}
          </div>

          {/* 설문문항 */}
          <ul className="list-group list-group-flush">
            {surveyData?.questions.map((question, index) => (
              <li key={index} className="list-group-item p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                
                {/* 질문 */}
                <div className="fw-bold text-dark flex-grow-1">{index+1}. {question.questions_text}</div>
                <div className="d-flex align-items-center gap-3 ms-md-auto">
                  <div className={style.starRatingContainer}>
                    {[1, 2, 3, 4, 5].map((score) => {
                      const isSelected = rating[index] >= score;
                      return (
                        <span
                          key={score}
                          onClick={() => surveyRatingChange(index, score)}
                          className={`${style.starItem} ${isSelected ? style.active : ""}`}
                        >
                          ★
                        </span>
                      );
                    })}
                  </div>
                  {/* 점수표시  */}
                  <span className={`badge bg-secondary rounded-pill ${style.scoreBadge}`}>
                    {rating[index]}점
                  </span>
                </div>

              </li>
            ))}
            {/*추가적인 요청 사항 텍스트 박스*/}
            <li className="list-group-item p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
              <div className={style.textareaContainer}>
                <p className="fw-bold text-dark flex-grow-1">{code+1}. 추가로 요청하실 사안이 있으시다면 자유롭게 작성해주세요.</p>{/*숫자 6은 code를 받고 +1 시킬 것. */}
                <textarea
                  className={style.textarea}
                  rows={8}
                  cols={85}
                  onChange={handleChange}
                />
              </div>
            </li>
          </ul>
          
          <div className="card-footer bg-light p-3 text-center border-0 d-flex gap-2 justify-content-center">
            <button type="submit" className="btn btn-primary fw-bold px-4 py-2">등록</button>
            {/* <button type="button" className="btn btn-secondary px-4 py-2" onClick={() => navigate("/surveylist")}>
              목록
            </button> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SurveyAddForm;