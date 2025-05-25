import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { motion } from "framer-motion";

const FarmerHome = () => {
    const [farmer, setFarmer] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { translate } = useLanguage();

    useEffect(() => {
        const fetchFarmerAndServices = async () => {
            try {
                const [farmerRes, servicesRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/accounts/users/me/"),
                    axios.get("http://127.0.0.1:8000/feedback/services/"),
                ]);

                setFarmer(farmerRes.data);
                const activeServiceIds = farmerRes.data.active_services || [];
                const activeServices = servicesRes.data.filter((service) =>
                    activeServiceIds.includes(service.id)
                );
                setServices(activeServices);
            } catch (err) {
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFarmerAndServices();
    }, []);

    const handleCardClick = (service) => {
        navigate(`/farmer/feedback`, { state: { service } });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"
                ></motion.div>
            </div>
        );
    }

    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const cardHover = {
        scale: 1.02,
        boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    };

    const cardTap = {
        scale: 0.98,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"
                >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-md"
                        >
                            {farmer?.profile_picture ? (
                                <img
                                    src={farmer.profile_picture}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-3xl font-bold">
                                    {farmer?.first_name?.charAt(0) || "F"}
                                </span>
                            )}
                        </motion.div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                {translate("common.welcome")},{" "}
                                <span className="text-green-600">
                                    {farmer?.first_name || translate("common.welcome")}
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
                                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {translate("common.Phone_Number")}{" "}
                                <span className="font-semibold ml-1 text-gray-700">
                                    {farmer?.username || translate("common.memberOf")}
                                </span>
                            </p>
                            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium flex items-center"
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    {translate("common.joined")} {new Date().getFullYear()}
                                </motion.span>
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium flex items-center"
                                >
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                            clipRule="evenodd"
                                        />
                                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                                    </svg>
                                    {services.length} {translate("common.activeServices")}
                                </motion.span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Services Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {translate("farmer.yourActiveServices")}
                        </h2>
                    </div>

                    {services.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="text-center py-12"
                        >
                            <motion.div
                                animate={{
                                    rotate: [0, 10, -10, 0],
                                    scale: [1, 1.1, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                }}
                                className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4"
                            >
                                <svg
                                    className="w-12 h-12 text-blue-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </motion.div>
                            <h3 className="text-xl font-medium text-gray-700 mb-2">
                                {translate("farmer.noServicesFound")}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto mb-6">
                                {translate("farmer.noServicesDescription")}
                            </p>
                            <motion.button
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: "0 5px 15px rgba(37, 99, 235, 0.3)",
                                }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-md"
                            >
                                {translate("farmer.exploreServices")}
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {services.map((service) => (
                                <motion.div
                                    key={service.id}
                                    variants={item}
                                    whileHover={cardHover}
                                    whileTap={cardTap}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group relative border border-gray-200"
                                    onClick={() => handleCardClick(service)}
                                >
                                    {/* Animated blue side border */}
                                    <motion.div
                                        initial={{ scaleY: 0 }}
                                        animate={{ scaleY: 1 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute left-0 top-0 h-full w-2 bg-blue-500 origin-bottom"
                                    />

                                    <div className="p-5 pl-7">
                                        <div className="flex items-center mb-4">
                                            <motion.div
                                                whileHover={{ rotate: 15 }}
                                                className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mr-4 text-blue-600"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M13 10V3L4 14h7v7l9-11h-7z"
                                                    />
                                                </svg>
                                            </motion.div>
                                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                                {service.name}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                                            {service.description ||
                                                "Service description not available"}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {service.category && (
                                                <motion.span
                                                    whileHover={{ scale: 1.05 }}
                                                    className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                                                >
                                                    {service.category}
                                                </motion.span>
                                            )}
                                            <motion.span
                                                whileHover={{ scale: 1.05 }}
                                                className="px-2.5 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium"
                                            >
                                                {translate("common.active")}
                                            </motion.span>
                                        </div>
                                    </div>
                                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 text-right group-hover:bg-gray-100 transition-colors">
                                        <motion.span
                                            whileHover={{ x: 5 }}
                                            className="text-sm text-blue-600 font-medium inline-flex items-center"
                                        >
                                            {translate("common.provideFeedback")}
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
                                        </motion.span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </motion.div>

                {/* Announcement Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                        <h3 className="text-lg font-bold text-white flex items-center">
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatDelay: 3,
                                }}
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                                    />
                                </svg>
                            </motion.div>
                            {translate("farmer.cooperativeAnnouncement")}
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="flex items-start">
                            <motion.div
                                whileHover={{ rotate: 10 }}
                                className="flex-shrink-0 pt-1"
                            >
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                            </motion.div>
                            <div className="ml-4">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                    {translate("farmer.upcomingMeeting")}
                                </h4>
                                <p className="text-gray-700 mb-3">
                                    {translate("farmer.meetingDetails")}{" "}
                                    <span className="font-medium text-blue-600">
                                        {new Date().toLocaleDateString("en-US", {
                                            weekday: "long",
                                            month: "long",
                                            day: "numeric",
                                        })}{" "}
                                        {translate("common.at")} 10:00 AM
                                    </span>{" "}
                                    {translate("farmer.meetingLocation")}
                                </p>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r"
                                >
                                    <p className="text-sm text-gray-700">
                                        <span className="font-medium text-blue-700">
                                            {farmer?.cooperative ||
                                                translate("cooperative.cooperative")}
                                        </span>{" "}
                                        {translate("farmer.leadershipDiscussion")}
                                    </p>
                                </motion.div>
                                <div className="mt-4 flex items-center text-sm text-gray-500">
                                    <svg
                                        className="w-4 h-4 mr-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    {translate("common.posted")}{" "}
                                    {new Date().toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FarmerHome;
