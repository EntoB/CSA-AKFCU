import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../../contexts/LanguageContext";
import LanguageSelector from "../../components/common/LanguageSelector";
import CouterCards from "../../components/common/CouterCards";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CoopHome = () => {
    const [cooperative, setCooperative] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const { translate } = useLanguage();

    useEffect(() => {
        const fetchCooperativeData = async () => {
            try {
                const [coopRes, servicesRes] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/accounts/users/me/"),
                    axios.get("http://127.0.0.1:8000/feedback/services/"),
                ]);

                setCooperative(coopRes.data);

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

    const cards = [
        {
            id: 1,
            title: translate("totalFarmers"),
            count: totalFarmers,
            icon: <PeopleAltIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
            color: "#e6f4ea",
            borderColor: "#16a34a",
        },
        {
            id: 2,
            title: translate("activeServices"),
            count: totalActiveServices,
            icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#2563eb" }} />,
            color: "#e0e7ff",
            borderColor: "#2563eb",
        },
        {
            id: 3,
            title: translate("cooperativeSince"),
            count: new Date().getFullYear() - 5, // Example: 5 years ago
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
            <LanguageSelector />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Cooperative Welcome Header */}
                <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
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
                                <span className="text-blue-600">
                                    {cooperative?.username || translate("common.cooperative")}
                                </span>
                            </h1>
                            <p className="mt-2 text-gray-600 flex items-center justify-center sm:justify-start">
                                <svg
                                    className="w-5 h-5 mr-2 text-blue-500"
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
                                {translate("location :")}{" "}
                                <span className="font-semibold ml-1 text-gray-700">
                                    {cooperative?.address ||
                                        translate("common.locationNotSpecified")}
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
                                    {totalFarmers} {translate("farmers")}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Counter Cards Section */}
                <div className="mx-auto">
                    <CouterCards data={cards} />
                </div>

                {/* Services Section (optional) */}
                {services.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {translate("activeServices")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-medium text-lg">{service.name}</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {service.description ||
                                            translate("cooperative.noDescription")}
                                    </p>
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
