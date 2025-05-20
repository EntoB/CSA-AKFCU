import React, { useState, useEffect } from "react";
import axios from "axios";

const EnableServicesPc = () => {
    const [pcs, setPCs] = useState([]); // Cooperatives
    const [services, setServices] = useState([]); // All services
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get all primary cooperatives
                const pcsRes = await axios.get(
                    "http://127.0.0.1:8000/accounts/users?role=pcs"
                );
                setPCs(pcsRes.data);

                // 2. Get all services
                const servicesRes = await axios.get(
                    "http://127.0.0.1:8000/feedback/services/"
                );
                setServices(servicesRes.data);
            } catch (err) {
                setMessage("Failed to load cooperatives or services.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle checkbox toggle for a cooperative and a service
    const handleServiceToggle = (pcId, serviceId, isChecked) => {
        setPCs(prevPCs =>
            prevPCs.map(pc => {
                if (pc.id === pcId) {
                    const newActiveServices = isChecked
                        ? [...(pc.active_services || []), serviceId]
                        : (pc.active_services || []).filter(id => id !== serviceId);
                    return { ...pc, active_services: newActiveServices };
                }
                return pc;
            })
        );
    };

    // Save changes to backend
    const handleSave = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/accounts/update-user-services/",
                { users: pcs.map(pc => ({ id: pc.id, active_services: pc.active_services })) },
                { headers: { "Content-Type": "application/json" } }
            );
            setMessage("Changes saved successfully!");
        } catch (err) {
            setMessage("Failed to save changes.");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!pcs.length || !services.length) return <p>No cooperatives or services available.</p>;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Enable Services for Cooperatives</h2>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Cooperative</th>
                            {services.map(service => (
                                <th key={service.id} className="border px-4 py-2">{service.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pcs.map(pc => (
                            <tr key={pc.id}>
                                <td className="border px-4 py-2">{pc.username}</td>
                                {services.map(service => (
                                    <td key={`${pc.id}-${service.id}`} className="border px-4 py-2 text-center">
                                        <input
                                            type="checkbox"
                                            checked={(pc.active_services || []).includes(service.id)}
                                            onChange={e =>
                                                handleServiceToggle(pc.id, service.id, e.target.checked)
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

export default EnableServicesPc;