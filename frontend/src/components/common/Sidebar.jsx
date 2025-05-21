import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Logout from "../auth/Logout";
import {
    FaTachometerAlt,
    FaChartBar,
    FaProjectDiagram,
    FaLightbulb,
    FaFileAlt,
    FaPlus,
    FaEye,
    FaToggleOn,
    FaUserPlus,
    FaUsers,
    FaBullhorn,
    FaSignOutAlt,
    FaPen
} from "react-icons/fa";

const adminLinks = [
    { to: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/admin/insights/visuals", icon: <FaChartBar />, label: "Visuals" }, // merged charts/graphs
    { to: "/admin/insights/recommendations", icon: <FaLightbulb />, label: "Recommendations" },
    { to: "/admin/insights/reports", icon: <FaFileAlt />, label: "Reports" },
    { to: "/admin/services/add", icon: <FaPlus />, label: "Add Service" },
    { to: "/admin/services/view", icon: <FaEye />, label: "View Services" },
    { to: "/admin/services/enable", icon: <FaToggleOn />, label: "Enable Services" },
    { to: "/admin/pc/add", icon: <FaPlus />, label: "Add PC" },
    { to: "/admin/pc/edit", icon: <FaPen />, label: "Edit PC" },
    { to: "/admin/pc/view", icon: <FaEye />, label: "View PC" },
];

const coopLinks = [
    { to: "/cooperative", icon: <FaTachometerAlt />, label: "Dashboard" },
    { to: "/cooperative/add-farmer", icon: <FaUserPlus />, label: "Add Farmer" },
    { to: "/cooperative/view-farmers", icon: <FaUsers />, label: "View Farmers" },
    { to: "/cooperative/enable-services", icon: <FaToggleOn />, label: "Enable Services" },
    { to: "/cooperative/announcements", icon: <FaBullhorn />, label: "Announcements" },
];

const Sidebar = () => {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();

    if (!user) return null;

    const links = user.role === "admin" ? adminLinks : coopLinks;

    return (
        <aside
            className={`fixed top-0 left-0 h-screen z-20 flex flex-col bg-green-900 opacity-85 text-white shadow-lg transition-all duration-300
                ${expanded ? "w-64" : "w-[48px]"} group`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            style={{ minWidth: expanded ? 200 : 48 }}
        >
            <div className="flex flex-col flex-1 p-2">
                <h2 className={`text-xl font-bold mb-6 mt-4 text-center transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0 h-0 overflow-hidden"}`}>
                    {user.role === "admin" ? "Admin Panel" : "Coop Panel"}
                </h2>
                <nav className="flex flex-col gap-2">
                    {links.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-green-800 transition
                                ${location.pathname === link.to ? "bg-green-800" : ""}`}
                            title={link.label}
                        >
                            <span className="text-lg">{link.icon}</span>
                            <span className={`transition-all duration-200 ${expanded ? "opacity-100 ml-2" : "opacity-0 w-0 h-0 overflow-hidden"}`}>
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto mb-4 flex items-center justify-center">
                <div className="flex items-center w-full">
                    <span className="text-lg ml-2"><FaSignOutAlt /></span>
                    <span className={`transition-all duration-200 ${expanded ? "opacity-100 ml-2" : "opacity-0 w-0 h-0 overflow-hidden"}`}>
                        <Logout />
                    </span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;