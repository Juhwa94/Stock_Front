// SalesLineChart.jsx
import {
    ResponsiveContainer,
    LineChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Line,
} from 'recharts';
// import { data } from './sampleData';

interface SalesData {
    date: string;  // 가로축 (예: '6월 1주차')
    sales: number; // 세로축 매출 (예: 5000000)
}
// 비즈니스 로직 : 백엔드에서 작업추천 
// 1.DB에서 받은 시작일~마감일의 범위값을 7단위로 나누기
// 2.남는 일은 마지막 주에 더하는거로 예외처리
const data: SalesData[] = [
    { date: '6월 1주차', sales: 1500000 },
    { date: '6월 2주차', sales: 3200000 },
    { date: '6월 3주차', sales: 2800000 },
    { date: '6월 4주차', sales: 4500000 },
];
const Chart: React.FC = () => {
    // 2. 축 포맷터 함수에 정확한 타입 지정
    const formatXAxis = (tickItem: string): string => {
        return tickItem; // 필요 시 날짜 포맷팅 로직 추가
    };

    const formatYAxis = (tickItem: number): string => {
        // 10,000원 단위나 만원 단위로 변환하고 싶을 때 사용
        return `${(tickItem / 10000).toLocaleString()}만원`;
    };

    return (
        <div role="img" aria-label="6월 주차별 매출 추이를 보여주는 선형 차트">
            <ResponsiveContainer width="100%" height={320}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />

                    <XAxis
                        dataKey="date"
                        tickFormatter={formatXAxis}
                        dy={10}
                        tick={{ fontSize: 13, fill: '#6c757d' }}
                    />
                    <YAxis
                        tickFormatter={formatYAxis}
                        dx={-5}
                        tick={{ fontSize: 13, fill: '#6c757d' }}
                    />

                    <Tooltip />
                    <Legend wrapperStyle={{ paddingTop: 10 }} />

                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#4c6ef5" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#4c6ef5' }}
                        activeDot={{ r: 6 }}
                        name="매출"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;