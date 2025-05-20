import React, { useState, useEffect } from "react";
import axios from "axios";

const EnableServicesFarmer = () => {
    const [farmers, setFarmers] = useState([]);
    const [services, setServices] = useState([]);
    const [coopActiveServices, setCoopActiveServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get farmers and active_services for this cooperative
                const farmersRes = await axios.get(
                    "http://127.0.0.1:8000/accounts/coop-farmers/"
                );
                setFarmers(farmersRes.data.farmers);
                setCoopActiveServices(farmersRes.data.active_services);

                // 2. Get all services, but only those in the coop's active_services
                const servicesRes = await axios.get(
                    "http://127.0.0.1:8000/feedback/services/"
                );
                const coopServices = servicesRes.data.filter(service =>
                    (farmersRes.data.active_services || []).includes(service.id)
                );
                setServices(coopServices);
            } catch (err) {
                setMessage("Failed to load farmers or services.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle checkbox toggle
    const handleServiceToggle = (farmerId, serviceId, isChecked) => {
        setFarmers(prevFarmers =>
            prevFarmers.map(farmer => {
                if (farmer.id === farmerId) {
                    const newActiveServices = isChecked
                        ? [...(farmer.active_services || []), serviceId]
                        : (farmer.active_services || []).filter(id => id !== serviceId);
                    return { ...farmer, active_services: newActiveServices };
                }
                return farmer;
            })
        );
    };

    // Save changes to backend
    const handleSave = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/accounts/update-user-services/",
                { users: farmers },
                { headers: { "Content-Type": "application/json" } }
            );
            setMessage("Changes saved successfully!");
        } catch (err) {
            setMessage("Failed to save changes.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!farmers.length || !services.length) return <p>No farmers or services available.</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Enable Services for Farmers</h2>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Farmer</th>
                            {services.map(service => (
                                <th key={service.id} className="border px-4 py-2">{service.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.map(farmer => (
                            <tr key={farmer.id}>
                                <td className="border px-4 py-2">{farmer.username || farmer.name}</td>
                                {services.map(service => (
                                    <td key={`${farmer.id}-${service.id}`} className="border px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={(farmer.active_services || []).includes(service.id)}
                                            onChange={e =>
                                                handleServiceToggle(farmer.id, service.id, e.target.checked)
                                            }
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleSave}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
                Save Changes
            </button>
        </div>
    );
};

export default EnableServicesFarmer;