import React, { useEffect, useState } from 'react'
import Chart from './Chart'
import Stayle from './revenue.module.css'
import ShareChart from './ShareChart'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'

/*
  미래를 위한 주석
  const inputValue = "2026-07"; // 7월
  const [year, monthStr] = inputValue.split('-'); // ["2026", "07"]

  // 07을 숫자로 바꾸면? 앞에 0을 알아서 떼고 순수 숫자 7로 만듭니다.
  const monthNum = Number(monthStr); 

  console.log(monthNum); // 7 (숫자형)

  발주일 input태그에서 각각 차트컴포넌트로 값을 보낼때 
  받아온 벨류값을 숫자로써  전처리하는 패턴임zzzzzzzzzzzzzzzzzzzzz
*/

export interface RevenueVO {
    rmonth: string;         // 매출 기준 월 (예: "2026-08-01" 또는 "2026-08")
    rtotalqty: number;      // 총 판매 수량
    rtotalsales: number;    // 총 매출액
    rtotalcost: number;     // 총 원가
    rtotalmargin: number;   // 총 마진
    pfnum: number;          // 상품폼 번호 (대표값 등)
}

const backendUrl = process.env.REACT_APP_BACK_END_URL;

const Revenue: React.FC = () => {
    const [searchParams] = useSearchParams();
    const pso_rmonth = searchParams.get("rmonth") || "";
    const [rmonth, setRmonth] = useState(pso_rmonth || "2026-07");

    const [revenue, setRevenue] = useState<RevenueVO>();

    useEffect(() => {
        (async () => {
            const rmonthData = JSON.stringify(rmonth);

            try {
                //백엔드로 전송 (fetch 사용), pa)axios사용해 보실 분들은 저한테 말하고 바꾸셔도 됩니다!
                const res = await axios.get(`${backendUrl}/api/revenue/revenueDataSet`, {
                    params: { rmonth: rmonthData }
                });
                setRevenue(res.data);
                //전송결과 출력
                if (!res) {
                    alert("전송 실패 서버 에러");
                }
            } catch (error) {
                alert("판매를 아직 안하셨습니다.")
            }
        })();
    }, [rmonth]);

    return (
        <div className={Stayle.container}>
            <h1 className={Stayle.main_title}>매출관리</h1>

            <div className={Stayle.chart_layout_parent}>
                <div className={Stayle.info_card_box}>
                    <ul className={Stayle.layout_child}>
                        <li>
                            이번달 결산 :{' '}
                            <input
                                type="month"
                                name="rmonth"
                                defaultValue={pso_rmonth ? pso_rmonth : "2026-07"}
                                onChange={(e) => {
                                    setRmonth(e.target.value);
                                    console.log(e.target.value);
                                }}
                            />
                        </li>
                        <li>총 매출 : {revenue?.rtotalsales} 원</li>
                        <li>총 판매수량 : {revenue?.rtotalqty} 권</li>
                        <li>마진 : {revenue?.rtotalmargin} 원</li>
                        <li>원가 : {revenue?.rtotalcost} 원</li>
                    </ul>
                </div>

                <div className={Stayle.pie_chart_wrapper}>
                    <ShareChart rmonth={rmonth} />
                </div>
            </div>

            {/* <div className={Stayle.line_chart_container}>
                <Chart />
            </div> */}
        </div>
    );
}

export default Revenue