import React, { useEffect, useState } from "react";
import axios from "axios";
import CouterCards from "../../components/common/CouterCards";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// Visualization components
import OverallSentimentByCategory from '../../components/admin/visuals/Bargraph';
import RadarSentimentByCategory from '../../components/admin/visuals/RadarView';
import SentimentTrendLineChart from '../../components/admin/visuals/LineGraph';
import PieChartSentiment from '../../components/admin/visuals/PieChart';
import RecentResponsesTable from '../../components/admin/RecentResponsesTable';

const AdminHome = () => {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usersRes = await axios.get("http://127.0.0.1:8000/accounts/users");
                setUsers(usersRes.data);

                const servicesRes = await axios.get("http://127.0.0.1:8000/feedback/services/");
                setServices(servicesRes.data);
            } catch (err) {
                setMessage("Failed to load dashboard data.");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalUsers = users.length;
    const totalPCs = users.filter(u => u.role === "cooperative").length;
    const totalFarmers = users.filter(u => u.role === "farmer").length;
    const totalServices = services.length;

    const cards = [
        {
            id: 1,
            title: 'Total Users',
            count: totalUsers,
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: '#16a34a' }} />,
            color: '#e6f4ea',
            borderColor: '#16a34a',
        },
        {
            id: 2,
            title: 'Primary Cooperatives',
            count: totalPCs,
            icon: <GroupsIcon sx={{ fontSize: 40, color: '#1e293b' }} />,
            color: '#e0e7ef',
            borderColor: '#1e293b',
        },
        {
            id: 3,
            title: 'Farmers',
            count: totalFarmers,
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: '#f59e42' }} />,
            color: '#fdf6e3',
            borderColor: '#f59e42',
        },
        {
            id: 4,
            title: 'Total Services',
            count: totalServices,
            icon: <LocalOfferIcon sx={{ fontSize: 40, color: '#16a34a' }} />,
            color: '#e6f4ea',
            borderColor: '#16a34a',
        },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            {message && <div className="mb-4 text-red-600">{message}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <CouterCards data={cards} />
                    {/* Visualizations */}
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
                            <SentimentTrendLineChart className="w-full h-full" />
                        </div>
                        <div className="w-full md:w-1/3">
                            <PieChartSentiment className="w-full h-full" />
                        </div>
                    </div>
                    {/* Recent Responses Table */}
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-4">Recent Responses</h3>
                        <RecentResponsesTable />
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminHome;