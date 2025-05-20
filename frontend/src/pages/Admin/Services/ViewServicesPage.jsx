import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/feedback/services/");
            setServices(response.data);
        } catch (err) {
            setMessage("Failed to load services.");
        }
        setLoading(false);
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/feedback/services/${serviceId}/delete/`);
            setMessage("Service deleted successfully.");
            setServices(services.filter(service => service.id !== serviceId));
        } catch (err) {
            setMessage("Failed to delete service.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Services</h2>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Description</th>
                                <th className="border px-4 py-2">Category</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {services.map(service => (
                                <tr key={service.id}>
                                    <td className="border px-4 py-2">{service.id}</td>
                                    <td className="border px-4 py-2">{service.name}</td>
                                    <td className="border px-4 py-2">{service.description || "—"}</td>
                                    <td className="border px-4 py-2">{service.category || "—"}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewServicesPage;