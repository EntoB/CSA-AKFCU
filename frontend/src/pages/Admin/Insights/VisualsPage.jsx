import React, { useState } from 'react';
import FilterFeedbacks from './FilterFeedbacks';
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip as PieTooltip, Legend, ResponsiveContainer as PieResponsiveContainer } from "recharts";
import { Bar, BarChart, CartesianGrid, Legend as BarLegend, ResponsiveContainer as BarResponsiveContainer, Tooltip as BarTooltip, XAxis, YAxis } from "recharts";
import { LineChart, Line, XAxis as LineXAxis, YAxis as LineYAxis, CartesianGrid as LineCartesianGrid, Tooltip as LineTooltip, ResponsiveContainer as LineResponsiveContainer } from "recharts";

const COLORS = ["#10B981", "#F59E0B", "#EF4444"]; // green, orange, red

const PieChartSentiment = ({ feedbacks }) => {
    // Count sentiments
    const counts = { Positive: 0, Neutral: 0, Negative: 0 };
    feedbacks.forEach(fb => {
        if (fb.sentiment) {
            const s = fb.sentiment.toLowerCase();
            if (s === "positive") counts.Positive += 1;
            else if (s === "neutral") counts.Neutral += 1;
            else if (s === "negative") counts.Negative += 1;
        }
    });
    const sentimentPieData = [
        { name: "Positive", value: counts.Positive },
        { name: "Neutral", value: counts.Neutral },
        { name: "Negative", value: counts.Negative },
    ];

    return (
        <motion.div
            className='bg-green-100 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-green-300 h-full flex flex-col justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-xl font-semibold text-green-900 mb-4'>Sentiment Distribution</h2>
            <div style={{ width: "100%", height: 300 }}>
                <PieResponsiveContainer>
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
                        <PieTooltip
                            contentStyle={{
                                backgroundColor: "rgba(236, 253, 245, 0.95)",
                                borderColor: "#6EE7B7",
                                color: "#000"
                            }}
                            itemStyle={{ color: "#000" }}
                        />
                        <Legend />
                    </PieChart>
                </PieResponsiveContainer>
            </div>
        </motion.div>
    );
};

const OverallSentimentByCategory = ({ feedbacks }) => {
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
    const sentimentByCategoryData = Object.values(grouped);

    return (
        <motion.div
            className='bg-green-100 bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-green-300 h-full flex flex-col justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h2 className='text-xl font-semibold text-green-900 mb-4'>Overall Sentiment by Category</h2>
            <div style={{ width: "100%", height: 300 }}>
                <BarResponsiveContainer>
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
                        <BarTooltip
                            contentStyle={{
                                backgroundColor: "rgba(236, 253, 245, 0.95)",
                                borderColor: "#6EE7B7",
                                color: "#000"
                            }}
                            itemStyle={{ color: "#000" }}
                            labelStyle={{ color: "#000" }}
                        />
                        <BarLegend />
                        <Bar dataKey='positive' fill='#10B981' name="Positive" />
                        <Bar dataKey='neutral' fill='#F59E0B' name="Neutral" />
                        <Bar dataKey='negative' fill='#EF4444' name="Negative" />
                    </BarChart>
                </BarResponsiveContainer>
            </div>
        </motion.div>
    );
};

const SentimentTrendLineChart = ({ feedbacks }) => {
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
    const sentimentTrendData = monthOrder
        .map(m => grouped[m])
        .filter(Boolean);

    return (
        <motion.div
            className='bg-green-100 bg-opacity-60 backdrop-blur-md shadow-lg rounded-xl p-6 border border-green-300 mx-auto'
            style={{ width: "66.6667%" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-lg font-medium mb-4 text-green-900'>Sentiment Trend Overview</h2>
            <div className='h-80'>
                <LineResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={sentimentTrendData}>
                        <LineCartesianGrid strokeDasharray='3 3' stroke='#A7F3D0' />
                        <LineXAxis dataKey={"name"} stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
                        <LineYAxis stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
                        <LineTooltip
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
                </LineResponsiveContainer>
            </div>
        </motion.div>
    );
};

const VisualsPage = () => {
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);

    return (
        <div className="px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-4">Visuals</h2>
            <FilterFeedbacks onSelect={setFilteredFeedbacks} />
            <div className="flex flex-col gap-8 mb-8">
                <div className="flex flex-row gap-8">
                    <div className="w-1/3">
                        <PieChartSentiment feedbacks={filteredFeedbacks} />
                    </div>
                    <div className="w-2/3">
                        <OverallSentimentByCategory feedbacks={filteredFeedbacks} />
                    </div>
                </div>
                <div className="flex justify-center">
                    <SentimentTrendLineChart feedbacks={filteredFeedbacks} />
                </div>
            </div>
        </div>
    );
};

export default VisualsPage;