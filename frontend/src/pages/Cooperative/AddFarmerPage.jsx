import React, { useState } from "react";
import axios from "axios";

const AddFarmerPage = () => {
    const [message, setMessage] = useState("");
    const [registrationKey, setRegistrationKey] = useState("");

    const handleGenerateKey = async (e) => {
        e.preventDefault();
        setMessage("");
        setRegistrationKey("");
        try {
            // Cooperative generates a farmer registration key (no extra fields needed)
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
        } catch (error) {
            setMessage("Failed to generate registration key.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleGenerateKey}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Generate Farmer Registration Key
                </h2>
                {message && (
                    <div className="mb-4 text-center text-blue-600">{message}</div>
                )}
                {registrationKey && (
                    <div className="mb-4 text-center text-green-600">
                        Registration Key: <span className="font-mono">{registrationKey}</span>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Generate Key
                </button>
            </form>
        </div>
    );
};

export default AddFarmerPage;