import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./surveyUpdate.module.css"

const SurveyUpdate: React.FC = () => {

    const [sub, setSub] = useState("");
    const [code, setCode] = useState("2"); //최소 항목 2개, 2개로 code를 초기화해둔다.
    const [surveyQuestions, setSurveyQuestions] = useState<string[]>(Array(2).fill(""));
    //question이 들어있는 빈 문자열의 배열을 만들어두고 크기를 2로 설정한다.

    const navigate = useNavigate();

    const backendUrl = process.env.REACT_APP_BACK_END_URL;
    const surveyCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;//code를 바꾸었을때 newValue라는 값에 넣어둔다.
        const numValue = parseInt(newValue);//newValue는 문자열 형식으로 되어있으므로 정수형으로 바꾸어준다.
        //code가 3이면 setSurveyTitles=["항목1","항목2","항목3"]
        // 최소 2 ~ 최대 5 항목만 처리
        if(numValue >= 2 && numValue <= 5) {
        //useState에 code , title을 저장
            setCode(newValue);//바꾼 code를 다시 setCode를 통해 넣어둔다.
            setSurveyQuestions(prev => {
                const newArray = Array(numValue).fill("");//numValue만큼의 크기의 빈 문자열로 되어있는 배열을 만든다.
                return newArray.map((item, index) => prev[index] || "");
                //만든 배열의 요소를 하나씩 순화하면서 새로운 요소값으로 교체.
                //prev[index]는 같은 인덱스 위치에 기존에 작성해둔 질문이 있는지 확인하고, 이후
                //||의 논리 or 연산자를 통해 기존 질문(prev[index])가 존재하면 그 내용을 그대로 유지하고,
                //없거나 undefined인 경우 빈 문자열("")로 채움.
            })
        }
    };
    // 위에서 code에 의해서 항목이  ["","",""] => ["항목내용1","항목내용2","항목내용3"]
    const surveyQuestionChange = (index: number, value: string) => {
        const newQuestions = [...surveyQuestions];
        newQuestions[index] = value;
        setSurveyQuestions(newQuestions);
    };

    const surveySubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            // JSON으로 객체를 전송할 데이터 형식 만들어 놓기 , sub, code ,surveyTitle.map
            const surveyData = {
                sub,
                code: parseInt(code),
                questions: surveyQuestions.map(questions => ({
                    questions_text: questions,
                }))
            };
            //postman에서 테스트 한 것처럼 구현 - axios.post방식
            const response = await axios.post(`${backendUrl}/api/survey/addSurvey`,surveyData);
            if(response.status === 200){

                alert("등록 완료.");

                navigate("/admin/surveymanagement");
            }
        } catch (error) {
            console.error("Error :",error);
            alert("등록 실패.");
        }
    };
    return (
        <div className={style.container2}>
            <form onSubmit={surveySubmit}>
                <div className="card w-100 shadow border-0">
                    {/* 제목 */}
                    <div className="card-header bg-dark text-white fw-bold py-3 text-center">
                        <b>제목 </b>
                        <input
                            type="text"
                            value={sub}
                            onChange={(e) => setSub(e.target.value)}
                            required
                        />
                    </div>
                    {/* 설문문항 */}
                    <div className="fw-bold text-dark flex-grow-1">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
                            <div className={style.questionsContainer}>
                                <span>문항 수
                                <input
                                    type="number"
                                    min="2"
                                    max="5"
                                    value={code}
                                    onChange={surveyCodeChange}
                                    required
                                />
                                </span>
                            </div>
                        </li>   
                    {surveyQuestions.map((question, index) => (
                        <li className="list-group-item p-4 bg-white d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2"
                            key={index} style={{marginBottom:0}}>
                            질문{index + 1}
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => surveyQuestionChange(index, e.target.value)}
                                    required
                                />
                        </li>
                        ))}    
                    </ul>
                </div>
            <div className="card-footer bg-light p-3 text-center border-0 d-flex gap-2 justify-content-center">
                <button type="submit" className="btn btn-primary fw-bold px-4 py-2">등록완료</button>
                <button type="button" className="btn btn-primary fw-bold px-4 py-2" onClick={()=> navigate("/admin/surveymanagement")}>취소</button>
            </div>
        </div>
      </form>
    </div>
    );
}
export default SurveyUpdate