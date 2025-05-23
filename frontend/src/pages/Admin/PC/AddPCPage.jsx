import React, { useState } from "react";
import axios from "axios";

const AddPCPage = () => {
    const [form, setForm] = useState({
        name: "",
        location: "",
        number_of_farmers: "",
        address: "",
    });
    const [message, setMessage] = useState({ text: "", type: "" });
    const [registrationKey, setRegistrationKey] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/generate-registration-key/",
                {
                    name: form.name,
                    address: form.address,
                    number_of_farmers: form.number_of_farmers,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            setRegistrationKey(response.data.registration_key);
            setMessage({
                text: "Registration key generated successfully!",
                type: "success",
            });
            setForm({ name: "", location: "", number_of_farmers: "", address: "" });
        } catch (error) {
            setMessage({
                text:
                    error.response?.data?.message ||
                    "Failed to generate registration key",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Register New Cooperative
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Fill in the details below to generate a registration key
                        </p>
                    </div>

                    {message.text && (
                        <div
                            className={`mb-6 p-4 rounded-md ${message.type === "success"
                                    ? "bg-green-50 text-green-800"
                                    : "bg-red-50 text-red-800"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {registrationKey && (
                        <div className="mb-6 p-4 bg-green-50 rounded-md">
                            <h3 className="text-sm font-medium text-green-800">
                                Registration Key
                            </h3>
                            <div className="mt-2 px-3 py-2 bg-white rounded text-green-600 font-mono text-lg break-all">
                                {registrationKey}
                            </div>
                            <p className="mt-2 text-xs text-green-600">
                                Share this key with the cooperative administrator
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Cooperative Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="address"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Full Address
                            </label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="number_of_farmers"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Number of Farmers
                            </label>
                            <input
                                type="number"
                                id="number_of_farmers"
                                name="number_of_farmers"
                                value={form.number_of_farmers}
                                onChange={handleChange}
                                required
                                min="1"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isSubmitting ? (
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
                                        Processing...
                                    </>
                                ) : (
                                    "Generate Registration Key"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPCPage;
