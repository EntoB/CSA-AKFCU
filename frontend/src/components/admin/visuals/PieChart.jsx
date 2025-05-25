import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]; // green, orange, red

const PieChartSentiment = () => {
    const [sentimentPieData, setSentimentPieData] = useState([
        { name: "Positive", value: 0 },
        { name: "Neutral", value: 0 },
        { name: "Negative", value: 0 },
    ]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/feedback/all-feedbacks/")
            .then(res => {
                const feedbacks = res.data.feedbacks || [];
                const counts = { Positive: 0, Neutral: 0, Negative: 0 };
                feedbacks.forEach(fb => {
                    if (fb.sentiment) {
                        const s = fb.sentiment.toLowerCase();
                        if (s === "positive") counts.Positive += 1;
                        else if (s === "neutral") counts.Neutral += 1;
                        else if (s === "negative") counts.Negative += 1;
                    }
                });
                setSentimentPieData([
                    { name: "Positive", value: counts.Positive },
                    { name: "Neutral", value: counts.Neutral },
                    { name: "Negative", value: counts.Negative },
                ]);
            });
    }, []);

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