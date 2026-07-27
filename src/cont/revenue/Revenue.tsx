import React, { useState } from 'react'
import Chart from './Chart'
import Stayle from './revenue.module.css'
import ShareChart from './ShareChart'

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


const Revenue: React.FC = () => {
  const [date, setDate] = useState("");

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
                name="date"
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </li>
            <li>총 매출 : </li>
            <li>총 판매수량 : </li>
            <li>마진 : </li>
            <li>원가 : </li>
          </ul>
        </div>

        <div className={Stayle.pie_chart_wrapper}>
          <ShareChart />
        </div>
      </div>

      <div className={Stayle.line_chart_container}>
        <Chart />
      </div>
    </div>
  )
}

export default Revenue