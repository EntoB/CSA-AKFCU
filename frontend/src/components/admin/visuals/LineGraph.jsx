import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const SentimentTrendLineChart = () => {
    const [sentimentTrendData, setSentimentTrendData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/feedback/all-feedbacks/")
            .then(res => {
                const feedbacks = res.data.feedbacks || [];
                // Group by month and count sentiments
                const grouped = {};
                feedbacks.forEach(fb => {
                    if (!fb.created_at) return;
                    const date = new Date(fb.created_at);
                    const month = date.toLocaleString('default', { month: 'short' });
                    if (!grouped[month]) {
                        grouped[month] = { name: month, positive: 0, neutral: 0, negative: 0 };
                    }
                    if (fb.sentiment) {
                        const s = fb.sentiment.toLowerCase();
                        if (s === "positive") grouped[month].positive += 1;
                        else if (s === "neutral") grouped[month].neutral += 1;
                        else if (s === "negative") grouped[month].negative += 1;
                    }
                });
                // Sort months in calendar order
                const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const sorted = monthOrder
                    .map(m => grouped[m])
                    .filter(Boolean);
                setSentimentTrendData(sorted);
            });
    }, []);

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