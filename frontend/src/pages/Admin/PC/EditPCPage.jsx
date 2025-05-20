import React, { useEffect, useState } from "react";
import axios from "axios";

const EditPCPage = () => {
    const [pcs, setPCs] = useState([]);
    const [selectedPC, setSelectedPC] = useState(null);
    const [newNumber, setNewNumber] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPCs();
    }, []);

    const fetchPCs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/users?role=pcs");
            setPCs(response.data.filter(pc => pc.is_active));
        } catch (err) {
            setMessage("Failed to load primary cooperatives.");
        }
        setLoading(false);
    };

    const handleSelectPC = (pc) => {
        setSelectedPC(pc);
        setNewNumber(pc.number_of_farmers || "");
        setMessage("");
    };

    const handleUpdate = async () => {
        if (!selectedPC) return;
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/pcs/${selectedPC.id}/update-farmers/`,
                { number_of_farmers: newNumber },
                { headers: { "Content-Type": "application/json" } }
            );
            setMessage("Number of farmers updated!");
            setPCs(pcs =>
                pcs.map(pc =>
                    pc.id === selectedPC.id
                        ? { ...pc, number_of_farmers: newNumber }
                        : pc
                )
            );
            setSelectedPC({ ...selectedPC, number_of_farmers: newNumber });
        } catch (err) {
            setMessage("Failed to update number of farmers.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Primary Cooperatives</h2>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2">
                    <h3 className="font-semibold mb-2">Select a Cooperative:</h3>
                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <ul className="divide-y border rounded">
                            {pcs.map(pc => (
                                <li
                                    key={pc.id}
                                    className={`p-3 cursor-pointer hover:bg-green-100 transition ${selectedPC && selectedPC.id === pc.id ? "bg-green-200" : ""}`}
                                    onClick={() => handleSelectPC(pc)}
                                >
                                    <div className="font-bold">{pc.username}</div>
                                    <div className="text-sm text-gray-600">{pc.address || "No address"}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="w-full md:w-1/2">
                    {selectedPC && (
                        <div className="bg-white rounded shadow p-6">
                            <h3 className="text-xl font-bold mb-4">{selectedPC.username}</h3>
                            <div className="mb-2">
                                <span className="font-semibold">Address:</span> {selectedPC.address || "N/A"}
                            </div>
                            <div className="mb-2">
                                <span className="font-semibold">Number of Farmers:</span> {selectedPC.number_of_farmers || 0}
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-semibold">Set New Number of Farmers:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={newNumber}
                                    onChange={e => setNewNumber(e.target.value)}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>
                            <button
                                onClick={handleUpdate}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                                Update
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditPCPage;