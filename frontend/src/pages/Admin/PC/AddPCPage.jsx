import React, { useState } from "react";
import axios from "axios";

const AddPCPage = () => {
    const [form, setForm] = useState({
        name: "",
        location: "",
        number_of_farmers: "",
        address: ""
    });
    const [message, setMessage] = useState("");
    const [registrationKey, setRegistrationKey] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the required fields to the backend
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/generate-registration-key/",
                {
                    name: form.name,
                    address: form.address,
                    number_of_farmers: form.number_of_farmers
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setRegistrationKey(response.data.registration_key);
            setMessage("Registration key generated successfully!");
            setForm({ name: "", location: "", number_of_farmers: "", address: "" });
        } catch (error) {
            setMessage("Failed to generate registration key.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add Cooperative (PC)</h2>
                {message && (
                    <div className="mb-4 text-center text-blue-600">{message}</div>
                )}
                {registrationKey && (
                    <div className="mb-4 text-center text-green-600">
                        Registration Key: <span className="font-mono">{registrationKey}</span>
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Address:</label>
                    <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Number of Farmers:</label>
                    <input
                        type="number"
                        name="number_of_farmers"
                        value={form.number_of_farmers}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Generate Registration Key
                </button>
            </form>
        </div>
    );
};

export default AddPCPage; 