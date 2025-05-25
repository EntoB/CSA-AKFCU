import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";
import axios from "axios";

const OverallSentimentByCategory = () => {
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
            transition={{ delay: 0.4 }}
        >
            <h2 className='text-xl font-semibold text-green-900 mb-4'>Overall Sentiment by Category</h2>
            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={sentimentByCategoryData}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#A7F3D0' />
                        <XAxis
                            dataKey='category'
                            stroke='#000000'
                            tick={{ fill: '#000', fontWeight: 600 }}
                        />
                        <YAxis
                            stroke='#000000'
                            tick={{ fill: '#000', fontWeight: 600 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(236, 253, 245, 0.95)",
                                borderColor: "#6EE7B7",
                                color: "#000"
                            }}
                            itemStyle={{ color: "#000" }}
                            labelStyle={{ color: "#000" }}
                        />
                        <Legend />
                        <Bar dataKey='positive' fill='#10B981' name="Positive" />
                        <Bar dataKey='neutral' fill='#F59E0B' name="Neutral" />
                        <Bar dataKey='negative' fill='#EF4444' name="Negative" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

export default OverallSentimentByCategory;