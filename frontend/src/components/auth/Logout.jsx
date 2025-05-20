import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const Logout = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear localStorage
        localStorage.removeItem("role");
        localStorage.removeItem("last_login");
        // Clear context
        setUser(null);
        // Optionally, you can also call your backend logout endpoint here
        navigate("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
            Logout
        </button>
    );
};

export default Logout;