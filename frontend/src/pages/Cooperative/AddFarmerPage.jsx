import React, { useState, useEffect } from "react";
import axios from "axios";

const AddFarmerPage = () => {
    const [message, setMessage] = useState("");
    const [registrationKey, setRegistrationKey] = useState("");
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [activeFarmers, setActiveFarmers] = useState(0);
    const [maxFarmers, setMaxFarmers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both farmer data and cooperative data in parallel
                const [farmersResponse, coopResponse] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/accounts/coop-farmers/", {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }),
                    axios.get("http://127.0.0.1:8000/accounts/users/me/", {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }),
                ]);

                const farmers = farmersResponse.data.farmers || [];
                setTotalFarmers(farmers.length);
                setActiveFarmers(farmers.filter((f) => f.is_active).length);
                setMaxFarmers(coopResponse.data.number_of_farmers || 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage("Failed to load farmer data");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateKey = async (e) => {
        e.preventDefault();
        setMessage("");
        setRegistrationKey("");

        if (totalFarmers >= maxFarmers) {
            setMessage(
                `Cannot generate key. You have reached your maximum farmer limit of ${maxFarmers}.`
            );
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/generate-registration-key/",
                {},
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setRegistrationKey(response.data.registration_key);
            setMessage("Registration key generated successfully!");
            setTotalFarmers((prev) => prev + 1); // Increment total farmers count
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setMessage("You have reached your maximum farmer limit.");
            } else {
                setMessage("Failed to generate registration key.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleGenerateKey}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Generate Farmer Registration Key
                </h2>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Farmers:</span>
                        <span className="font-medium">
                            {totalFarmers} / {maxFarmers}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Active Farmers:</span>
                        <span className="font-medium">{activeFarmers}</span>
                    </div>
                </div>

                {message && (
                    <div
                        className={`mb-4 text-center ${message.includes("successfully")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </div>
                )}
                {registrationKey && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg text-center">
                        <div className="text-sm text-gray-600 mb-1">Registration Key:</div>
                        <div className="font-mono text-green-700 break-all">
                            {registrationKey}
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
                    disabled={totalFarmers >= maxFarmers}
                >
                    {totalFarmers >= maxFarmers ? "Farmer Limit Reached" : "Generate Key"}
                </button>
            </form>
        </div>
    );
};

export default AddFarmerPage;
