import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Use the same sentiment data as previous components, but for each month
const sentimentTrendData = [
    { name: "Jul", positive: 12, neutral: 5, negative: 2 },
    { name: "Aug", positive: 10, neutral: 7, negative: 3 },
    { name: "Sep", positive: 15, neutral: 6, negative: 4 },
    { name: "Oct", positive: 13, neutral: 8, negative: 2 },
    { name: "Nov", positive: 16, neutral: 7, negative: 3 },
    { name: "Dec", positive: 18, neutral: 5, negative: 2 },
    { name: "Jan", positive: 14, neutral: 6, negative: 4 },
    { name: "Feb", positive: 13, neutral: 8, negative: 3 },
    { name: "Mar", positive: 17, neutral: 7, negative: 2 },
    { name: "Apr", positive: 15, neutral: 6, negative: 3 },
    { name: "May", positive: 19, neutral: 5, negative: 2 },
    { name: "Jun", positive: 20, neutral: 4, negative: 1 },
];

const SentimentTrendLineChart = () => {
    return (
        <motion.div
            className='bg-green-100 bg-opacity-60 backdrop-blur-md shadow-lg rounded-xl p-6 border border-green-300'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-green-900'>Sentiment Trend Overview</h2>

            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={sentimentTrendData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#A7F3D0' />
                        <XAxis dataKey={"name"} stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
                        <YAxis stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(236, 253, 245, 0.95)",
                                borderColor: "#6EE7B7",
                                color: "#000"
                            }}
                            itemStyle={{ color: "#000" }}
                        />
                        <Line
                            type='monotone'
                            dataKey='positive'
                            name='Positive'
                            stroke='#10B981'
                            strokeWidth={3}
                            dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                        <Line
                            type='monotone'
                            dataKey='neutral'
                            name='Neutral'
                            stroke='#F59E0B'
                            strokeWidth={3}
                            dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                        <Line
                            type='monotone'
                            dataKey='negative'
                            name='Negative'
                            stroke='#EF4444'
                            strokeWidth={3}
                            dot={{ fill: "#EF4444", strokeWidth: 2, r: 6 }}
                            activeDot={{ r: 8, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default SentimentTrendLineChart;