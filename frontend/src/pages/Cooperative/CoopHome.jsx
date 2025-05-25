import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../../contexts/LanguageContext";
import CouterCards from "../../components/common/CouterCards";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CoopHome = () => {
    const [cooperative, setCooperative] = useState(null);
    const [services, setServices] = useState([]);
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { translate } = useLanguage();

    useEffect(() => {
        const fetchCooperativeData = async () => {
            try {
                const [coopRes, servicesRes, farmersRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/accounts/users/me/"),
                    axios.get("http://127.0.0.1:8000/feedback/services/"),
                    axios.get("http://127.0.0.1:8000/accounts/coop-farmers/"),
                ]);

                setCooperative(coopRes.data);
                setFarmers(farmersRes.data.farmers || []);

                // Filter services that are in the cooperative's active_services array
                const activeServices = servicesRes.data.filter((service) =>
                    coopRes.data.active_services?.includes(service.id)
                );
                setServices(activeServices);
            } catch (err) {
                console.error("Error fetching cooperative data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCooperativeData();
    }, []);

    const totalFarmers = cooperative?.number_of_farmers || 0;
    const totalActiveServices = services.length;
    const activeUsers = farmers.filter((farmer) => farmer.is_active).length;

    const cards = [
        {
            id: 1,
            title: translate("cooperative.totalFarmers"),
            count: totalFarmers,
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
            color: "#e6f4ea",
            borderColor: "#16a34a",
        },
        {
            id: 2,
            title: translate("common.activeServices"),
            count: totalActiveServices,
            icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
            color: "#e0e7ff",
            borderColor: "#2563eb",
        },
        {
            id: 3,
            title: translate("cooperative.activeUsers"),
            count: activeUsers,
            icon: <GroupsIcon sx={{ fontSize: 40, color: "#d97706" }} />,
            color: "#fef3c7",
            borderColor: "#d97706",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Cooperative Welcome Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                            {cooperative?.profile_picture ? (
                                <img
                                    src={cooperative.profile_picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-3xl font-bold">
                                    {cooperative?.name?.charAt(0) || "C"}
                                </span>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                {translate("common.welcome")},{" "}
                                <span className="text-green-600">
                                    {cooperative?.username ||
                                        translate("cooperative.cooperative")}
                                </span>
                            </h1>
                            <p className="mt-2 text-gray-600 flex items-center justify-center sm:justify-start">
                                <svg
                                    className="w-5 h-5 mr-2 text-green-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {translate("cooperative.location")}{" "}
                                <span className="font-semibold ml-1 text-gray-700">
                                    {cooperative?.address ||
                                        translate("cooperative.locationNotSpecified")}
                                </span>
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {totalFarmers} {translate("cooperative.farmers")}
                                </span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {activeUsers} {translate("cooperative.activeUsers")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter Cards Section - Centered */}
                <div className="flex justify-center">
                    <div className="w-full">
                        <CouterCards data={cards} />
                    </div>
                </div>

                {/* Enhanced Active Services Section */}
                {services.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-md p-6">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
                            <CheckCircleIcon className="mr-2 text-green-500" />
                            {translate("common.activeServices")}
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full shadow-sm">
                                {totalActiveServices}
                            </span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="relative overflow-hidden border border-gray-200 rounded-xl transition-all duration-300 
                   hover:border-green-300 group bg-white hover:shadow-lg
                   shadow-sm hover:-translate-y-1"
                                >
                                    {/* Gradient accent border */}
                                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-green-600"></div>

                                    <div className="p-5 pl-6">
                                        <div className="flex items-start gap-4">
                                            {/* Service Icon */}
                                            <div className="p-3 bg-green-50 rounded-lg shadow-inner group-hover:bg-green-100 transition-colors">
                                                <CheckCircleIcon className="text-green-500" />
                                            </div>

                                            {/* Service Content */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                                                    {service.name}
                                                </h3>
                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                                    {service.description ||
                                                        translate("cooperative.noDescription")}
                                                </p>

                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {service.category && (
                                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                                            {service.category}
                                                        </span>
                                                    )}
                                                    <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                                                        {translate("common.active")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 group-hover:bg-green-50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                {translate("cooperative.serviceID")}: {service.id}
                                            </span>
                                            <button
                                                className="text-sm text-green-600 hover:text-green-800 font-medium
                               px-3 py-1 rounded-md hover:bg-green-100 transition-colors
                               flex items-center"
                                            >
                                                {translate("common.viewDetails")}
                                                <svg
                                                    className="w-4 h-4 ml-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoopHome;
