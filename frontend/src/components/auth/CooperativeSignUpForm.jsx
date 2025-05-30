import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CooperativeSignUpForm = () => {
    const [form, setForm] = useState({
        phone_number: "",
        registration_key: "",
        password: "",
        confirm_password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        // For phone number field, only allow numbers
        if (name === "phone_number") {
            if (!value || /^[0-9\b]+$/.test(value)) {
                setForm({ ...form, [name]: value });
            }
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // Phone number validation
        if (!/^09\d{8}$/.test(form.phone_number)) {
            setError("Phone number must start with 09 and be 10 digits");
            toast.error("Phone number must start with 09 and be 10 digits", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // Password validation
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            toast.error("Password must be at least 6 characters", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // Confirm password validation
        if (form.password !== form.confirm_password) {
            setError("Passwords do not match");
            toast.error("Passwords do not match", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/register/",
                {
                    phone_number: form.phone_number,
                    registration_key: form.registration_key,
                    password: form.password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 201) {
                setMessage("Registration successful! Redirecting to login...");
                toast.success("Registration successful! Redirecting to login...", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setForm({
                    phone_number: "",
                    registration_key: "",
                    password: "",
                    confirm_password: "",
                });

                setTimeout(() => {
                    navigate("/AdminCoop-Login");
                }, 1500);
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Registration failed. Please check your details and try again.";

            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center p-4">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="max-w-md w-full">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                    <div className="bg-green-600 py-5 px-6 text-center">
                        <svg
                            className="w-12 h-12 mx-auto text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.5"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                        </svg>
                        <h2 className="text-2xl font-bold text-white mt-3">
                            Cooperative Registration
                        </h2>
                        <p className="text-green-100 mt-1">Join our agricultural network</p>
                    </div>

                    <div className="p-6">
                        {message && (
                            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number (09XXXXXXXX)
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel" // Changed to tel for better mobile keyboard
                                        name="phone_number"
                                        value={form.phone_number}
                                        onChange={handleChange}
                                        required
                                        pattern="^09\d{8}$"
                                        maxLength="10"
                                        inputMode="numeric" // Shows numeric keyboard on mobile
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        placeholder="09XXXXXXXX"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Rest of the form remains the same */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Registration Key
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="registration_key"
                                        value={form.registration_key}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        placeholder="Your registration code"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password (min 6 characters)
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        placeholder="Create password"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={form.confirm_password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                        placeholder="Confirm password"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full ${isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"} text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center`}
                                >
                                    {isLoading ? (
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
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                            Register Cooperative
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <a
                                    href="/AdminCoop-Login"
                                    className="text-green-600 hover:text-green-800 font-medium"
                                >
                                    Sign in here
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>Connecting agricultural cooperatives with farmers nationwide</p>
                </div>
            </div>
        </div>
    );
};

export default CooperativeSignUpForm;
