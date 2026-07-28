import axios from 'axios';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// 백엔드(스프링부트)에서 이 모양 그대로 JSON만 던져주면 됩니다.
// const data = [
//     { name: '소설', value: 400 },
//     { name: '자연과학', value: 300 },
//     { name: '인문학', value: 100 },
//     { name: '만화', value: 200 },
// ];

interface data {
    name: string;
    value: number;
    top?: number;
}
interface RawRevenueData {
    NAME: string;
    VALUE: number;
    TOP: number;
}
interface ShareChartProps {
    rmonth: string;
}
//백엔드 주소가 담긴 .env파일의 키값
const backendUrl = process.env.REACT_APP_BACK_END_URL;

//const COLORS = ['#0088FE', '#00C49F', '#575550', 'pink'];
const TOP5_COLORS = ['#FF4D4D', '#FFA500', '#FFD700', '#00C49F', '#0088FE'];
const OTHER_COLOR = '#999999';

export default function ShareChart({ rmonth }: ShareChartProps) {

    const [data, setData] = useState<data[]>([]);

    console.log("원형차트 데이터 : " + data);
    useEffect(() => {
        (async () => {
            const rmonthData = rmonth;

            try {
                const data_json = await axios.get(`${backendUrl}/api/revenue/shareChartDataSet`, {
                    params: { rmonth: rmonthData }
                });
                //서클차트 데이터가 제대로 들어왔는지 검증
                if (data_json && data_json.data) {
                    //console.log("받아온 데이터 형식 확인:", typeof data_json.data[0]?.value, data_json.data);
                    const formattedData = data_json.data.map((item: RawRevenueData) => ({
                        name: item.NAME,
                        value: item.VALUE,
                        top: item.TOP
                    }));

                    //받은 데이터를 전처리하기 위한 형태로 변환
                    let processedData = formattedData;

                    //데이터가 5개를 초과할 경우, 상위 5개 + '기타' 처리
                    if (formattedData.length > 5) {
                        const top5 = formattedData.slice(0, 5);
                        const others = formattedData.slice(5); // 6등 이후 나머지
                        
                        //나머지 항목들의 value를 모두 합산
                        const othersSum = others.reduce((sum:number, current:data) => sum + current.value, 0);
                        processedData = [
                            ...top5,
                            { name: '기타', value: othersSum, top: 6 }
                        ];
                    };
                    
                    //리액트 훅으로 리랜더링
                    setData(processedData);
                }
            } catch (error) {
                console.error(error);
                //alert("원형차트를 불러올수 없습니다");
            }
        })();
    }, [rmonth]);

        return (
        <div style={{ width: '100%', height: '100%' }}>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                    >
                        {data.map((entry, index) => {
                            // [핵심 수정] 인덱스 기반이 아니라 '기타' 이름 여부 또는 정렬된 순서에 맞게 색상 부여
                            const color = entry.name === '기타' ? OTHER_COLOR : TOP5_COLORS[index % TOP5_COLORS.length];
                            return <Cell key={`cell-${index}`} fill={color} />;
                        })}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}