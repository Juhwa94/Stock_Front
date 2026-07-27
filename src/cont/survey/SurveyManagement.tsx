import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SimpleCharts from "./SimpleCharts";
import styles from "./surveymanagement.module.css"
import axios from "axios";
import RequestList from "./RequestList";

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
interface RequestData {
    REQUEST: string;
    RESDATE: string;
}

interface SurveyDate {
    SVNUM: number,
    SDATE: string
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const SurveyManagement: React.FC = () => {

    const [result, setResult] = useState<number[]>([]);
    const [code, setCode] = useState<number>(0);
    const [sdate, setSdate] = useState<string>("");

    const [surveyDates, setSurveyDates] = useState<SurveyDate[]>([]);
    const [selectedSvnum, setSelectedSvnum] = useState<number>(0);
    const [requests, setRequests] = useState<RequestData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/survey/getAvgs`, {
                    params: {
                        svnum: selectedSvnum
                    }
                });
                if (response.status === 200) {

                    const responseData: Data = response.data;

                    await dataHandler(responseData);

                } else {
                    console.log("데이터를 불러오는데 실패했습니다.");
                }
            } catch (error) {
                console.error("데이터를 불러오는데 실패했습니다.", error);
            }
        };
        fetchResult();
    }, [selectedSvnum]);

    useEffect(() => {
        const fetchDate = async () => {
            const response = await axios.get(`${backendUrl}/api/survey/getSdate`);

            if (response.status === 200) {
                const surveyDates: SurveyDate[] = response.data;

                dateHandler(surveyDates);
            }
        }
        fetchDate();
    }, [])

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/survey/getRequest`);

                if (response.status === 200) {
                    setRequests(response.data);
                }
            } catch (error) {
                console.error(
                    "요청사항 데이터를 불러오는데 실패했습니다.",
                    error
                );
            }
        };
        fetchRequests();
    }, []);

    //console.log(requests);
    const dataHandler = (responseData: Data) => {

        setCode(responseData.code);
        setSdate(responseData.sdate);

        const newAvgArr = Array(responseData.code).fill(0);

        if (responseData.result) {
            responseData.result.map((item) => {
                const targetIndex = item.QUESTIONS_ID - 1;

                if (targetIndex >= 0 && targetIndex < responseData.code) {
                    newAvgArr[targetIndex] = item.AVG;
                }
            });
        }
        setResult(newAvgArr);
    }

    const dateHandler = (surveyDates: SurveyDate[]) => {
        setSurveyDates(surveyDates)
        return surveyDates;
    }

    return (
        <div className={styles.managementContainer}>
            <button
                onClick={() => navigate("/admin/surveyupdate")}
                className={styles.transbtn}
            >
                평가항목 등록
            </button>

            <div className={styles.resultContainer}>
                <h3>평가 결과</h3>
                <div className={styles.dateinputContainer}>
                    <span>
                        <select onChange={(e) => setSelectedSvnum(Number(e.target.value))}>
                            <option value="">
                                날짜 선택
                            </option>

                            {surveyDates.map((item) => (
                                <option key={item.SVNUM} value={item.SVNUM}>
                                    {item.SDATE}
                                </option>
                            ))}
                        </select>
                    </span>
                </div>
                <SimpleCharts
                    code={code}
                    avg={result}
                    sdate={sdate}
                />
            </div>
            <div className={styles.resultContainer}>
                <h3>추가 요청 사항</h3>
                
                <RequestList 
                    requests={requests}
                />
            </div>
        </div>
    );
}
export default SurveyManagement