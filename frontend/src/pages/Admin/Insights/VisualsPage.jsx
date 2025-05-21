import React from 'react';
import OverallSentimentByCategory from '../../../components/admin/visuals/Bargraph';
import RadarSentimentByCategory from '../../../components/admin/visuals/RadarView';
import SentimentTrendLineChart from '../../../components/admin/visuals/LineGraph';
import PieChartSentiment from '../../../components/admin/visuals/PieChart';

const VisualsPage = () => {
    return (
        <div className="px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-4">Visuals</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
                <div className="w-full md:w-1/2">
                    <OverallSentimentByCategory />
                </div>
                <div className="w-full md:w-1/2">
                    <RadarSentimentByCategory />
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-8 mb-8">
                <div className="w-full md:w-2/3">
                    <SentimentTrendLineChart />
                </div>
                <div className="w-full md:w-1/3">
                    <PieChartSentiment />
                </div>
            </div>
        </div>
    );
};

export default VisualsPage;