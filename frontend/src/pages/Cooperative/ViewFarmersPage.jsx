import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewFarmersPage = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/coop-farmers/");
            setFarmers(response.data.farmers);
        } catch (err) {
            setMessage("Failed to load farmers.");
        }
        setLoading(false);
    };

    const handleToggleActive = async (farmerId, currentState) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/farmers/${farmerId}/toggle-active/`,
                { is_active: !currentState },
                { headers: { "Content-Type": "application/json" } }
            );
            setFarmers(farmers =>
                farmers.map(farmer =>
                    farmer.id === farmerId ? { ...farmer, is_active: !currentState } : farmer
                )
            );
            setMessage("Farmer state updated.");
        } catch (err) {
            setMessage("Failed to update state.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Farmers</h2>
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
                                <th className="border px-4 py-2">Phone Number</th>
                                <th className="border px-4 py-2">Address</th>
                                <th className="border px-4 py-2">Cooperative</th>
                                <th className="border px-4 py-2">Active</th>
                                <th className="border px-4 py-2">Toggle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farmers.map(farmer => (
                                <tr key={farmer.id}>
                                    <td className="border px-4 py-2">{farmer.id}</td>
                                    <td className="border px-4 py-2">{farmer.username}</td>
                                    <td className="border px-4 py-2">{farmer.phone_number}</td>
                                    <td className="border px-4 py-2">{farmer.address || "—"}</td>
                                    <td className="border px-4 py-2">{farmer.last_name || "—"}</td>
                                    <td className="border px-4 py-2">
                                        {farmer.is_active ? "Active" : "Inactive"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleToggleActive(farmer.id, farmer.is_active)}
                                            className={`px-3 py-1 rounded transition ${farmer.is_active
                                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                                : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                        >
                                            {farmer.is_active ? "Deactivate" : "Activate"}
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

export default ViewFarmersPage;