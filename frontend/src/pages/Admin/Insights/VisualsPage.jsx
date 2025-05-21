import React from 'react';
import OverallSentimentByCategory from '../../../components/admin/visuals/Bargraph';
import RadarSentimentByCategory from '../../../components/admin/visuals/RadarView';

const VisualsPage = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Visuals</h2>
            <div className="flex flex-col md:flex-row justify-center gap-8">
                <div className="w-full md:w-1/2">
                    <OverallSentimentByCategory />
                </div>
                <div className="w-full md:w-1/2">
                    <RadarSentimentByCategory />
                </div>
            </div>
        </div>
    );
};

export default VisualsPage;