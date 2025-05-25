import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedAlert from "../../../components/common/AnimatedAlert";

const EditPCPage = () => {
    const [pcs, setPCs] = useState([]);
    const [selectedPC, setSelectedPC] = useState(null);
    const [newNumber, setNewNumber] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [search, setSearch] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        fetchPCs();
    }, []);

    const fetchPCs = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/accounts/users?role=pcs"
            );
            setPCs(response.data.filter((pc) => pc.is_active));
            setMessage({ text: "", type: "" });
        } catch (err) {
            setMessage({
                text: "Failed to load primary cooperatives.",
                type: "error",
            });
        }
        setLoading(false);
    };

    const handleSelectPC = (pc) => {
        setSelectedPC(pc);
        setNewNumber(pc.number_of_farmers || "");
        setMessage({ text: "", type: "" });
    };

    const handleUpdate = async () => {
        if (!selectedPC || newNumber === "") return;
        setUpdating(true);
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/pcs/${selectedPC.id}/update-farmers/`,
                { number_of_farmers: newNumber },
                { headers: { "Content-Type": "application/json" } }
            );
            setMessage({
                text: "Number of farmers updated successfully!",
                type: "success",
            });
            setAlertOpen(true);
            setPCs((pcs) =>
                pcs.map((pc) =>
                    pc.id === selectedPC.id ? { ...pc, number_of_farmers: newNumber } : pc
                )
            );
            setSelectedPC({ ...selectedPC, number_of_farmers: newNumber });
        } catch (err) {
            setMessage({
                text:
                    err.response?.data?.message || "Failed to update number of farmers.",
                type: "error",
            });
            setAlertOpen(true);
        } finally {
            setUpdating(false);
        }
    };

    // Filtered PCs based on search
    const filteredPCs = pcs.filter(pc =>
        pc.username?.toLowerCase().includes(search.toLowerCase()) ||
        pc.phone_number?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8 -mt-12" style={{ fontFamily: 'Poppins, sans-serif' }}>
            <AnimatedAlert
                open={alertOpen}
                message={message.text}
                type={message.type === "success" ? "success" : "danger"}
                onClose={() => setAlertOpen(false)}
                duration={1800}
            />
            <div className="max-w-6xl mx-auto">
                <div className="bg-green-100 rounded-xl shadow-md overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Manage Cooperatives
                            </h1>
                            <p className="mt-2 text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Select a cooperative to update the number of farmers
                            </p>
                        </div>
                        {/* Search input */}
                        <form className="flex items-center max-w-sm ml-auto mb-4" onSubmit={e => e.preventDefault()} style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <label htmlFor="simple-search" className="sr-only">Search</label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="simple-search"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                    placeholder="Search branch name..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    autoComplete="off"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                />
                            </div>
                            <button
                                type="submit"
                                className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                                tabIndex={-1}
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                                <span className="sr-only">Search</span>
                            </button>
                        </form>
                        {message.text && message.type !== "success" && (
                            <div
                                className={`mb-6 p-4 rounded-md ${message.type === "success"
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                    }`}
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                            >
                                {message.text}
                            </div>
                        )}

                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cooperative List */}
                            <div className="w-full lg:w-1/2">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        Active Cooperatives
                                    </h3>
                                    <button
                                        onClick={fetchPCs}
                                        className="text-sm text-green-600 hover:text-green-800"
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        Refresh List
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        {filteredPCs.length > 0 ? (
                                            filteredPCs.map((pc) => (
                                                <li
                                                    key={pc.id}
                                                    className={`p-4 cursor-pointer transition ${selectedPC?.id === pc.id
                                                        ? "bg-green-100"
                                                        : "hover:bg-gray-50"
                                                        }`}
                                                    onClick={() => handleSelectPC(pc)}
                                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                                >
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <div className="font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                                {pc.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                                {pc.address || "No address provided"}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium text-green-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                                {pc.number_of_farmers || 0} farmers
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))
                                        ) : (
                                            <li className="p-4 text-center text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                No active cooperatives found
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </div>

                            {/* Cooperative Details */}
                            <div className="w-full lg:w-1/2">
                                {selectedPC ? (
                                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            {selectedPC.username}
                                        </h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    Address
                                                </label>
                                                <div className="p-3 bg-gray-50 rounded-md text-gray-800" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {selectedPC.address || "Not specified"}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    Current Number of Farmers
                                                </label>
                                                <div className="p-3 bg-green-50 rounded-md text-green-800 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    {selectedPC.number_of_farmers || 0}
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="newNumber"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                                >
                                                    Update Number of Farmers
                                                </label>
                                                <input
                                                    id="newNumber"
                                                    type="number"
                                                    min="0"
                                                    value={newNumber}
                                                    onChange={(e) => setNewNumber(e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                                />
                                            </div>

                                            <button
                                                onClick={handleUpdate}
                                                disabled={
                                                    updating ||
                                                    newNumber === "" ||
                                                    newNumber === selectedPC.number_of_farmers
                                                }
                                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${updating ||
                                                    newNumber === "" ||
                                                    newNumber === selectedPC.number_of_farmers
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : ""
                                                    }`}
                                                style={{ fontFamily: 'Poppins, sans-serif' }}
                                            >
                                                {updating ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Updating...
                                                    </>
                                                ) : (
                                                    "Update Farmers Count"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                        <div className="text-gray-500 mb-4">
                                            <svg
                                                className="mx-auto h-12 w-12"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            No Cooperative Selected
                                        </h3>
                                        <p className="text-sm text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                            Select a cooperative from the list to view and edit
                                            details
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPCPage;