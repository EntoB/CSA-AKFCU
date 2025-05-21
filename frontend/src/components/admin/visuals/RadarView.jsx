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

// Use the same categories and sentiment data as the bar graph
const sentimentByCategoryData = [
    { category: "Seed", positive: 82, neutral: 53, negative: 23 },
    { category: "Fertilizers", positive: 78, neutral: 57, negative: 30 },
    { category: "Veterinary", positive: 90, neutral: 44, negative: 26 },
    { category: "Fruits", positive: 65, neutral: 43, negative: 37 },
    { category: "Advices", positive: 89, neutral: 48, negative: 32 },
    { category: "Others", positive: 67, neutral: 52, negative: 25 },
];

const RadarSentimentByCategory = () => {
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
                        <PolarRadiusAxis angle={30} domain={[0, 20]} stroke='#000' tick={{ fill: '#000', fontWeight: 600 }} />
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