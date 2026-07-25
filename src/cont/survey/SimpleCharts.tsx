import { BarChart } from '@mui/x-charts/BarChart';

interface Result {
  code: number,
  avg: number[],
  sdate : string
}
//평점의 평균값, 질문을 배열로 받는다. 
export default function SimpleCharts(props:Result) {{/*props:ResDataprops 를 매개변수로 넣는다.*/}
  
  const qList = Array(props.code).fill("").map((_, index) => `q${index +1}`);
  console.log(props)
  return (
    <BarChart
      xAxis={[
        {
          id: 'barCategories',
          data: qList,
          height: 28,
          categoryGapRatio: 0.5
        },
      ]}
      yAxis={[
        {
          min: 0,
          max: 5
        }
      ]}
      series={[
        {
          data: props.avg,
          label: props.sdate
        }
      ]}
      grid={{ horizontal: true, vertical: true}}
      height={300}
    />
  );
}