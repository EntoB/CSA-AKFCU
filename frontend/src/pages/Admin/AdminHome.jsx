import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CouterCards from "../../components/common/CouterCards";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Visualization components
import OverallSentimentByCategory from "../../components/admin/visuals/Bargraph";
import RadarSentimentByCategory from "../../components/admin/visuals/RadarView";
import SentimentTrendLineChart from "../../components/admin/visuals/LineGraph";
import PieChartSentiment from "../../components/admin/visuals/PieChart";
import RecentResponsesTable from "../../components/admin/RecentResponsesTable";

const AdminHome = () => {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    // Mock admin data - will be replaced with actual data from your context/API
    const [adminData] = useState({
        first_name: "Admin",
        last_name: "User",
        email: "admin@cooperative.com",
        role: "System Administrator",
        profile_picture: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, servicesRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/accounts/users"),
                    axios.get("http://127.0.0.1:8000/feedback/services/"),
                ]);
                setUsers(usersRes.data);
                setServices(servicesRes.data);
            } catch (err) {
                setMessage("Failed to load dashboard data.");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const totalUsers = users.length;
    const totalPCs = users.filter((u) => u.role === "cooperative").length;
    const totalFarmers = users.filter((u) => u.role === "farmer").length;
    const totalServices = services.length;

    const cards = [
        {
            id: 1,
            title: "Total Users",
            count: totalUsers,
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
            color: "#e6f4ea",
            borderColor: "#16a34a",
        },
        {
            id: 2,
            title: "Primary Cooperatives",
            count: totalPCs,
            icon: <GroupsIcon sx={{ fontSize: 40, color: "#1e293b" }} />,
            color: "#e0e7ef",
            borderColor: "#1e293b",
        },
        {
            id: 3,
            title: "Farmers",
            count: totalFarmers,
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: "#f59e42" }} />,
            color: "#fdf6e3",
            borderColor: "#f59e42",
        },
        {
            id: 4,
            title: "Total Services",
            count: totalServices,
            icon: <LocalOfferIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
            color: "#e6f4ea",
            borderColor: "#16a34a",
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("last_login");
        setUser(null);
        navigate("/AdminCoop-Login");
    };


    return (
        <div className="p-6">
            {/* Header with Profile */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <p className="text-sm text-gray-600">
                    Welcome back,{" "}
                    <span className="font-medium text-green-600">
                        {adminData?.first_name || "Admin"}
                    </span>
                </p>
                <div className="relative">
                    <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        {adminData.profile_picture ? (
                            <img
                                src={adminData.profile_picture}
                                alt="Admin"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                                <AccountCircleIcon fontSize="large" />
                            </div>
                        )}
                        <span className="hidden md:inline-block font-medium">
                            {adminData.first_name}
                        </span>
                    </button>

                    {showProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                            <div className="px-4 py-2 border-b">
                                <p className="text-sm font-medium text-gray-900">
                                    {adminData.first_name} {adminData.last_name}
                                </p>
                                <p className="text-xs text-green-600 mt-1">{adminData.role}</p>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-200 flex items-center"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {message && <div className="mb-4 text-red-600">{message}</div>}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
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
