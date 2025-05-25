import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    Tooltip,
} from "recharts";
import axios from "axios";

const RadarSentimentByCategory = () => {
    const [sentimentByCategoryData, setSentimentByCategoryData] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/feedback/all-feedbacks/")
            .then(res => {
                const feedbacks = res.data.feedbacks || [];
                // Group by category and count sentiments
                const grouped = {};
                feedbacks.forEach(fb => {
                    const cat = fb.category || "Unknown";
                    if (!grouped[cat]) {
                        grouped[cat] = { category: cat, positive: 0, neutral: 0, negative: 0 };
                    }
                    if (fb.sentiment) {
                        const s = fb.sentiment.toLowerCase();
                        if (s === "positive") grouped[cat].positive += 1;
                        else if (s === "neutral") grouped[cat].neutral += 1;
                        else if (s === "negative") grouped[cat].negative += 1;
                    }
                });
                setSentimentByCategoryData(Object.values(grouped));
            });
    }, []);

    return (
        <motion.div
            className='bg-green-100 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-green-300'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <h2 className='text-xl font-semibold text-green-900 mb-4'>Sentiment Segmentation by Category</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <RadarChart cx='50%' cy='50%' outerRadius='80%' data={sentimentByCategoryData}>
                        <PolarGrid stroke='#A7F3D0' />
                        <PolarAngleAxis dataKey='category' stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
                        <PolarRadiusAxis stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
                        <Radar name='Positive' dataKey='positive' stroke='#10B981' fill='#10B981' fillOpacity={0.5} />
                        <Radar name='Neutral' dataKey='neutral' stroke='#F59E0B' fill='#F59E0B' fillOpacity={0.5} />
                        <Radar name='Negative' dataKey='negative' stroke='#EF4444' fill='#FCA5A5' fillOpacity={0.5} />
                        <Legend />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(236, 253, 245, 0.95)",
                                borderColor: "#6EE7B7",
                                color: "#000"
                            }}
                            itemStyle={{ color: "#000" }}
                            labelStyle={{ color: "#000" }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default RadarSentimentByCategory;