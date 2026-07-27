import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// 백엔드(스프링부트)에서 이 모양 그대로 JSON만 던져주면 됩니다.
const data = [
    { name: '소설', value: 400 },
    { name: '자연과학', value: 300 },
    { name: '인문학', value: 100 },
    { name: '만화', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#575550', 'pink'];

export default function ShareChart() {
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
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}