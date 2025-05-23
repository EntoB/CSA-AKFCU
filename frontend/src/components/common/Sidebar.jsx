import React, { useState, useEffect } from "react";
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
    FaPen,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const adminSections = [
    {
        title: "Dashboard",
        icon: <FaTachometerAlt />,
        links: [{ to: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" }],
    },
    {
        title: "Insights",
        icon: <FaChartBar />,
        links: [
            { to: "/admin/insights/visuals", icon: <FaChartBar />, label: "Visuals" },
            {
                to: "/admin/insights/recommendations",
                icon: <FaLightbulb />,
                label: "Recommendations",
            },
            { to: "/admin/insights/reports", icon: <FaFileAlt />, label: "Reports" },
        ],
    },
    {
        title: "Services",
        icon: <FaToggleOn />,
        links: [
            { to: "/admin/services/add", icon: <FaPlus />, label: "Add Service" },
            { to: "/admin/services/view", icon: <FaEye />, label: "View Services" },
            {
                to: "/admin/services/enable",
                icon: <FaToggleOn />,
                label: "Enable Services",
            },
        ],
    },
    {
        title: "Production",
        icon: <FaProjectDiagram />,
        links: [
            { to: "/admin/pc/add", icon: <FaPlus />, label: "Add PC" },
            { to: "/admin/pc/edit", icon: <FaPen />, label: "Edit PC" },
            { to: "/admin/pc/view", icon: <FaEye />, label: "View PC" },
        ],
    },
];

const coopSections = [
    {
        title: "Dashboard",
        icon: <FaTachometerAlt />,
        links: [
            { to: "/cooperative", icon: <FaTachometerAlt />, label: "Dashboard" },
        ],
    },
    {
        title: "Farmers",
        icon: <FaUsers />,
        links: [
            {
                to: "/cooperative/add-farmer",
                icon: <FaUserPlus />,
                label: "Add Farmer",
            },
            {
                to: "/cooperative/view-farmers",
                icon: <FaUsers />,
                label: "View Farmers",
            },
        ],
    },
    {
        title: "Services",
        icon: <FaToggleOn />,
        links: [
            {
                to: "/cooperative/enable-services",
                icon: <FaToggleOn />,
                label: "Enable Services",
            },
        ],
    },
    {
        title: "Communications",
        icon: <FaBullhorn />,
        links: [
            {
                to: "/cooperative/announcements",
                icon: <FaBullhorn />,
                label: "Announcements",
            },
        ],
    },
];

const Sidebar = () => {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [openSections, setOpenSections] = useState({});
    const location = useLocation();

    useEffect(() => {
        if (expanded) {
            const newOpenSections = {};
            const sections = user?.role === "admin" ? adminSections : coopSections;
            sections.forEach((section) => {
                newOpenSections[section.title] = section.links.some(
                    (link) => location.pathname === link.to
                );
            });
            setOpenSections(newOpenSections);
        }
    }, [expanded, location.pathname, user?.role]);

    if (!user) return null;

    const sections = user.role === "admin" ? adminSections : coopSections;

    const toggleSection = (title) => {
        setOpenSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }));
    };

    return (
        <motion.aside
            className={`fixed top-0 left-0 h-screen z-20 flex flex-col bg-green-900 opacity-85 text-white shadow-lg transition-all duration-300
                ${expanded ? "w-64" : "w-[48px]"} group`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
            style={{ minWidth: expanded ? 200 : 48 }}
        >
            <div className="flex flex-col flex-1 p-2">
                <h2
                    className={`text-xl font-bold mb-6 mt-4 text-center transition-all duration-200 ${expanded ? "opacity-100" : "opacity-0 w-0 h-0 overflow-hidden"}`}
                >
                    {user.role === "admin" ? "Admin Panel" : "Coop Panel"}
                </h2>

                <nav className="flex flex-col gap-2">
                    {sections.map((section) => (
                        <div key={section.title} className="flex flex-col">
                            {section.links.length > 1 ? (
                                <>
                                    <motion.button
                                        onClick={() => toggleSection(section.title)}
                                        className={`flex items-center justify-between gap-3 px-2 py-2 rounded hover:bg-green-800 transition
                                            ${location.pathname.startsWith(
                                            section.links[0].to
                                                .split("/")
                                                .slice(0, 3)
                                                .join("/")
                                        )
                                                ? "bg-green-800"
                                                : ""
                                            }`}
                                        whileHover={expanded ? { scale: 1.02 } : {}}
                                        whileTap={expanded ? { scale: 0.98 } : {}}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">{section.icon}</span>
                                            <motion.span
                                                className="transition-all duration-200"
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{
                                                    opacity: expanded ? 1 : 0,
                                                    x: expanded ? 0 : -10,
                                                }}
                                            >
                                                {section.title}
                                            </motion.span>
                                        </div>
                                        {expanded && (
                                            <motion.span
                                                animate={{
                                                    rotate: openSections[section.title] ? 0 : -90,
                                                }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <FaChevronDown className="text-sm" />
                                            </motion.span>
                                        )}
                                    </motion.button>

                                    <AnimatePresence>
                                        {(openSections[section.title] || !expanded) && (
                                            <motion.div
                                                initial="hidden"
                                                animate={expanded ? "visible" : "hidden"}
                                                exit="hidden"
                                                variants={{
                                                    visible: {
                                                        opacity: 1,
                                                        height: "auto",
                                                        transition: { staggerChildren: 0.05 },
                                                    },
                                                    hidden: {
                                                        opacity: 0,
                                                        height: 0,
                                                    },
                                                }}
                                                className="overflow-hidden"
                                            >
                                                {section.links.map((link) => (
                                                    <motion.div
                                                        key={link.to}
                                                        variants={{
                                                            hidden: { opacity: 0, x: -20 },
                                                            visible: { opacity: 1, x: 0 },
                                                        }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Link
                                                            to={link.to}
                                                            className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-green-800 transition ml-6
                                                                ${location.pathname === link.to ? "bg-green-800" : ""}`}
                                                        >
                                                            <span className="text-lg">{link.icon}</span>
                                                            {expanded && (
                                                                <span className="transition-all duration-200">
                                                                    {link.label}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Link
                                    key={section.links[0].to}
                                    to={section.links[0].to}
                                    className={`flex items-center gap-3 px-2 py-2 rounded hover:bg-green-800 transition
                                        ${location.pathname === section.links[0].to ? "bg-green-800" : ""}`}
                                >
                                    <span className="text-lg">{section.icon}</span>
                                    {expanded && (
                                        <span className="transition-all duration-200">
                                            {section.links[0].label}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            <div className="mt-auto mb-4 flex items-center justify-center">
                <div className="flex items-center w-full">
                    <span className="text-lg ml-2">
                        <FaSignOutAlt />
                    </span>
                    <span
                        className={`transition-all duration-200 ${expanded ? "opacity-100 ml-2" : "opacity-0 w-0 h-0 overflow-hidden"}`}
                    >
                        <Logout />
                    </span>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
