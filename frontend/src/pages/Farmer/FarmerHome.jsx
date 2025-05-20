import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FarmerHome = () => {
    const [farmer, setFarmer] = useState(null);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFarmerAndServices = async () => {
            try {
                const farmerRes = await axios.get("http://127.0.0.1:8000/accounts/users/me/");
                setFarmer(farmerRes.data);

                const servicesRes = await axios.get("http://127.0.0.1:8000/feedback/services/");
                const activeServiceIds = farmerRes.data.active_services || [];
                const activeServices = servicesRes.data.filter(service =>
                    activeServiceIds.includes(service.id)
                );
                setServices(activeServices);
            } catch (err) { }
            setLoading(false);
        };
        fetchFarmerAndServices();
    }, []);

    const handleCardClick = (service) => {
        navigate(`/farmer/feedback`, { state: { service } });
    };

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">
                Welcome{farmer && farmer.first_name ? `, ${farmer.first_name}` : ""}!
            </h1>
            <h2 className="text-xl font-semibold mb-2">Your Active Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {services.length === 0 ? (
                    <div className="col-span-full text-gray-500">No active services.</div>
                ) : (
                    services.map(service => (
                        <div
                            key={service.id}
                            className="bg-white rounded shadow p-4 cursor-pointer hover:bg-green-100 transition"
                            onClick={() => handleCardClick(service)}
                        >
                            <div className="font-bold text-lg">{service.name}</div>
                            <div className="text-gray-600">{service.description || "No description."}</div>
                            <div className="text-xs text-gray-400 mt-2">Category: {service.category || "—"}</div>
                        </div>
                    ))
                )}
            </div>
            <div className="bg-green-100 border-l-4 border-green-600 p-4 rounded">
                <h3 className="font-semibold mb-1">Announcement from your Cooperative</h3>
                <p>
                    Please attend the upcoming cooperative meeting on Friday at 10:00 AM. More details will be shared soon!
                </p>
            </div>
        </div>
    );
};

export default FarmerHome;