import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLanguage } from "../../contexts/LanguageContext"; // Update this path
import { useNavigate } from "react-router-dom"; // <-- Add this import

const ResetPassword = () => {
    const { translate } = useLanguage();
    const navigate = useNavigate(); // <-- Add this line
    const [key, setKey] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        // Password validation
        if (password.length < 6) {
            setError(translate("resetPassword.passwordLengthError"));
            toast.error(translate("resetPassword.passwordLengthError"), {
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
        if (password !== confirmPassword) {
            setError(translate("resetPassword.passwordMismatchError"));
            toast.error(translate("resetPassword.passwordMismatchError"), {
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
            const res = await axios.post(
                "http://127.0.0.1:8000/accounts/reset-password/",
                {
                    key,
                    password,
                }
            );
            setMessage(translate("resetPassword.successMessage"));
            toast.success(translate("resetPassword.successMessage"), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setTimeout(() => {
                navigate("/AdminCoop-Login");
            }, 1200); // Give user a moment to see the success message
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || translate("resetPassword.genericError");
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
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center">
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

            <div className="max-w-md w-full p-6 bg-white rounded-xl shadow-lg border border-green-100">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-green-800">
                        {translate("resetPassword.title")}
                    </h2>
                    <p className="text-gray-600">{translate("resetPassword.subtitle")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {translate("resetPassword.resetKeyLabel")}
                        </label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {translate("resetPassword.newPasswordLabel")}
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {translate("resetPassword.confirmPasswordLabel")}
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-2 px-4 rounded-lg font-medium text-white ${isLoading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"} transition duration-200 flex items-center justify-center`}
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
                                {translate("resetPassword.resettingText")}
                            </>
                        ) : (
                            translate("resetPassword.submitButton")
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
