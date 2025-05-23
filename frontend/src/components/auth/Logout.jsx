import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useLanguage } from "../../contexts/LanguageContext"; // import translation hook

const Logout = () => {
    const { setUser } = useAuth();
    const { translate } = useLanguage(); // use translate function
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("last_login");
        setUser(null);
        navigate("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
            {translate("common.logout")} {/* Translated logout text */}
        </button>
    );
};

export default Logout;