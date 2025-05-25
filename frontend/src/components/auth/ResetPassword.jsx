import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
    const [key, setKey] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        try {
            const res = await axios.post("http://127.0.0.1:8000/accounts/reset-password/", {
                key,
                password,
            });
            setMessage(res.data.message || "Password reset successful!");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Failed to reset password. Please check your key and try again."
            );
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Reset Key</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={key}
                        onChange={e => setKey(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">New Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Confirm Password</label>
                    <input
                        type="password"
                        className="w-full border rounded px-3 py-2"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="text-red-600 mb-2">{error}</div>}
                {message && <div className="text-green-600 mb-2">{message}</div>}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;