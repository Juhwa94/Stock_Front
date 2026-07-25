import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleCharts from "./SimpleCharts";
import styles from "./surveymanagement.module.css"
import axios from "axios";

interface SurveyResult {
    QUESTIONS_ID: number,
    AVG: number
}

interface Data {
    svnum: number,
    code: number, 
    sub: string, 
    sdate: string,
    result: SurveyResult[]
}

interface ResProps {
    code: number,
    avg: number[],
    sdate : string
}
const SurveyManagement: React.FC = () => {

    const backendUrl = process.env.REACT_APP_BACK_END_URL;

    const [result,setResult] = useState<number[]>([]);
    const [code, setCode] = useState<number>(0);
    const [sdate, setSdate] = useState<string>("");

    const [begin,setBegin] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        const fetchResult = async () => {
            try{
                const response = await axios.get(`${backendUrl}/api/survey/getAvg`)
            
                if(response.status === 200) {
                    const responseData = response.data;
                    
                    setCode(responseData.code);
                    setSdate(responseData.sdate);
                    setResult(responseData.result.map((item: SurveyResult) => item.AVG));
                    
                } else {
                    console.log("데이터를 불러오는데 실패했습니다.");
                }
            } catch(error) {
                console.error("데이터를 불러오는데 실패했습니다.",error);
            }
        };

        fetchResult();
    },[])

    return(
        <div className={styles.managementContainer}>
            <button
                onClick={() => navigate("/admin/surveyupdate")}
                className={styles.transbtn}
            >
                평가항목 등록
            </button>
            <div className={styles.resultContainer}>
                <h3>평가 결과</h3>
                <SimpleCharts
                    code = {code}
                    avg = {result}
                    sdate = {sdate}
                />
            </div>
            <div className={styles.dateinputContainer}>
                <span>날짜 선택  <input type="date"  onChange={(e:React.ChangeEvent<HTMLInputElement>) => setBegin(e.target.value)} /></span>
            </div>
            <button type="button" style={{width : 150}}>오래된 평가지 삭제</button>
        </div>
    );
}
export default SurveyManagement