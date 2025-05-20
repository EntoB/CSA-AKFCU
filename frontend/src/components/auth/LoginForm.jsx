import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
axios.defaults.withCredentials = true;

const LoginForm = () => {
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/login/",
                {
                    username: formData.username,
                    password: formData.password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 200) {
                // Store role and last_login in localStorage
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("last_login", response.data.last_login);
                setUser({ role: response.data.role, last_login: response.data.last_login });
                alert("Login successful!");
                // Redirect based on role
                if (response.data.role === "admin") {
                    navigate("/admin");
                } else if (response.data.role === "cooperative") {
                    navigate("/cooperative");
                } else if (response.data.role === "farmer") {
                    navigate("/farmer");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(
                error.response?.data?.error ||
                error.response?.data?.detail ||
                "Login failed. Please try again."
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username:</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;