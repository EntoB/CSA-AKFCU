import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewPCPage = () => {
    const [pcs, setPCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    // Fetch all primary cooperatives on mount
    useEffect(() => {
        fetchPCs();
    }, []);

    const fetchPCs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/users?role=pcs");
            setPCs(response.data);
        } catch (err) {
            setMessage("Failed to load primary cooperatives.");
        }
        setLoading(false);
    };

    const handleToggleActive = async (pcId, currentState) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/pcs/${pcId}/toggle-active/`,
                { is_active: !currentState },
                { headers: { "Content-Type": "application/json" } }
            );
            setPCs(pcs =>
                pcs.map(pc =>
                    pc.id === pcId ? { ...pc, is_active: !currentState } : pc
                )
            );
            setMessage("Primary cooperative state updated.");
        } catch (err) {
            setMessage("Failed to update state.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Primary Cooperatives</h2>
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
                                <th className="border px-4 py-2">Active</th>
                                <th className="border px-4 py-2">Toggle</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pcs.map(pc => (
                                <tr key={pc.id}>
                                    <td className="border px-4 py-2">{pc.id}</td>
                                    <td className="border px-4 py-2">{pc.username}</td>
                                    <td className="border px-4 py-2">{pc.phone_number}</td>
                                    <td className="border px-4 py-2">
                                        {pc.is_active ? "Active" : "Inactive"}
                                    </td>
                                    <td className="border px-4 py-2">
                                        <button
                                            onClick={() => handleToggleActive(pc.id, pc.is_active)}
                                            className={`px-3 py-1 rounded transition ${pc.is_active
                                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                                : "bg-green-600 text-white hover:bg-green-700"
                                                }`}
                                        >
                                            {pc.is_active ? "Deactivate" : "Activate"}
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

export default ViewPCPage;