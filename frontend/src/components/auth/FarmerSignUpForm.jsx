import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../contexts/LanguageContext"; // Update this path

const FarmerSignUpForm = () => {
    const { translate } = useLanguage();
    const [form, setForm] = useState({
        first_name: "",
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

        // First name validation
        if (form.first_name.length < 2) {
            setError(translate("farmerSignUp.firstNameError"));
            toast.error(translate("farmerSignUp.firstNameError"), {
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

        // Phone number validation
        if (!/^09\d{8}$/.test(form.phone_number)) {
            setError(translate("farmerSignUp.phoneNumberError"));
            toast.error(translate("farmerSignUp.phoneNumberError"), {
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
            setError(translate("farmerSignUp.passwordLengthError"));
            toast.error(translate("farmerSignUp.passwordLengthError"), {
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
            setError(translate("farmerSignUp.passwordMismatchError"));
            toast.error(translate("farmerSignUp.passwordMismatchError"), {
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
                    first_name: form.first_name,
                    phone_number: form.phone_number,
                    registration_key: form.registration_key,
                    password: form.password,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.status === 201) {
                setMessage(translate("farmerSignUp.successMessage"));
                toast.success(translate("farmerSignUp.successMessage"), {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });

                setForm({
                    first_name: "",
                    phone_number: "",
                    registration_key: "",
                    password: "",
                    confirm_password: "",
                });

                setTimeout(() => {
                    navigate("/Farmer-Login");
                }, 1500);
            }
        } catch (err) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.detail ||
                translate("farmerSignUp.genericError");

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
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
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

            <div className="container mx-auto px-4 py-12">
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                        <div className="bg-green-600 py-4 px-6">
                            <h2 className="text-2xl font-bold text-white">
                                {translate("farmerSignUp.title")}
                            </h2>
                            <p className="text-green-100">
                                {translate("farmerSignUp.subtitle")}
                            </p>
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
                                        {translate("farmerSignUp.firstNameLabel")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={form.first_name}
                                            onChange={handleChange}
                                            required
                                            minLength={2}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                            placeholder={translate(
                                                "farmerSignUp.firstNamePlaceholder"
                                            )}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {translate("farmerSignUp.phoneNumberLabel")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            name="phone_number"
                                            value={form.phone_number}
                                            onChange={handleChange}
                                            required
                                            pattern="^09\d{8}$"
                                            maxLength="10"
                                            inputMode="numeric"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                            placeholder={translate(
                                                "farmerSignUp.phoneNumberPlaceholder"
                                            )}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {translate("farmerSignUp.registrationKeyLabel")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="registration_key"
                                            value={form.registration_key}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                                            placeholder={translate(
                                                "farmerSignUp.registrationKeyPlaceholder"
                                            )}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {translate("farmerSignUp.passwordLabel")}
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
                                            placeholder={translate(
                                                "farmerSignUp.passwordPlaceholder"
                                            )}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {translate("farmerSignUp.confirmPasswordLabel")}
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
                                            placeholder={translate(
                                                "farmerSignUp.confirmPasswordPlaceholder"
                                            )}
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg
                                                className="h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
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
                                        className={`w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
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
                                                {translate("farmerSignUp.processingText")}
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
                                                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                {translate("farmerSignUp.submitButton")}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    {translate("farmerSignUp.existingAccountText")}{" "}
                                    <a
                                        href="/Farmer-Login"
                                        className="text-green-600 hover:text-green-800 font-medium"
                                    >
                                        {translate("farmerSignUp.signInText")}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerSignUpForm;
