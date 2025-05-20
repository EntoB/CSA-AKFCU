import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Add this import

const FarmerSignUpForm = () => {
    const [form, setForm] = useState({
        first_name: "",
        phone_number: "",
        registration_key: "",
        password: "",
        confirm_password: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (form.password !== form.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/register/",
                {
                    first_name: form.first_name,
                    phone_number: form.phone_number,
                    registration_key: form.registration_key,
                    password: form.password
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            if (response.status === 201) {
                setMessage("Registration successful! Redirecting to login...");
                setForm({
                    first_name: "",
                    phone_number: "",
                    registration_key: "",
                    password: "",
                    confirm_password: ""
                });
                setTimeout(() => {
                    navigate("/login");
                }, 1000); // Redirect after 1 second
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Registration failed. Please check your details and try again."
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Farmer Sign Up
                </h2>
                {message && (
                    <div className="mb-4 text-center text-green-600">{message}</div>
                )}
                {error && (
                    <div className="mb-4 text-center text-red-600">{error}</div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">First Name:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={form.first_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Phone Number:</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        pattern="^09\d{8}$"
                        title="Phone number must start with 09 and be 10 digits"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Registration Key:</label>
                    <input
                        type="text"
                        name="registration_key"
                        value={form.registration_key}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Confirm Password:</label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default FarmerSignUpForm;