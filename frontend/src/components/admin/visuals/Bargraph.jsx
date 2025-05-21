import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion } from "framer-motion";

// Dummy data: overall sentiment counts by service category
const sentimentByCategoryData = [
    { category: "Seed", positive: 22, neutral: 5, negative: 2 },
    { category: "Fertilizers", positive: 8, neutral: 7, negative: 3 },
    { category: "Veterinary", positive: 10, neutral: 4, negative: 6 }, // Changed here
    { category: "Fruits", positive: 15, neutral: 3, negative: 1 },
    { category: "Advices", positive: 9, neutral: 8, negative: 2 },
    { category: "Others", positive: 5, neutral: 2, negative: 4 },
];

const OverallSentimentByCategory = () => {
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
                            stroke='#000000' // Black axis
                            tick={{ fill: '#000', fontWeight: 600 }} // Black category text
                        />
                        <YAxis
                            stroke='#000000' // Black axis
                            tick={{ fill: '#000', fontWeight: 600 }} // Black numbers
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