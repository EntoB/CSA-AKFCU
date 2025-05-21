import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Dummy data for sentiment distribution
const sentimentPieData = [
    { name: "Positive", value: 65 },
    { name: "Neutral", value: 25 },
    { name: "Negative", value: 10 },
];
const COLORS = ["#10B981", "#F59E0B", "#EF4444"]; // green, orange, red

const PieChartSentiment = () => {
    return (
        <motion.div
            className='bg-green-100 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-green-300'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-green-900 mb-4'>Sentiment Distribution</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={sentimentPieData}
                            cx='50%'
                            cy='50%'
                            outerRadius={80}
                            fill='#10B981'
                            dataKey='value'
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {sentimentPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(236, 253, 245, 0.95)",
                                borderColor: "#6EE7B7",
                                color: "#000"
                            }}
                            itemStyle={{ color: "#000" }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default PieChartSentiment;