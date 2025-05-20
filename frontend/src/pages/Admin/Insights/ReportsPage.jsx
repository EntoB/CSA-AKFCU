import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportsPage = () => {
    const [users, setUsers] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all users
                const usersRes = await axios.get("http://127.0.0.1:8000/accounts/users");
                setUsers(usersRes.data);

                // Fetch all services
                const servicesRes = await axios.get("http://127.0.0.1:8000/feedback/services/");
                setServices(servicesRes.data);
            } catch (err) {
                setMessage("Failed to load reports data.");
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    // Example summary statistics
    const totalUsers = users.length;
    const totalPCs = users.filter(u => u.role === "cooperative").length;
    const totalFarmers = users.filter(u => u.role === "farmer").length;
    const totalAdmins = users.filter(u => u.role === "admin").length;
    const totalServices = services.length;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports & Insights</h2>
            {message && <div className="mb-4 text-red-600">{message}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded shadow p-4">
                            <div className="text-lg font-semibold">Total Users</div>
                            <div className="text-2xl">{totalUsers}</div>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <div className="text-lg font-semibold">Primary Cooperatives</div>
                            <div className="text-2xl">{totalPCs}</div>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <div className="text-lg font-semibold">Farmers</div>
                            <div className="text-2xl">{totalFarmers}</div>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <div className="text-lg font-semibold">Admins</div>
                            <div className="text-2xl">{totalAdmins}</div>
                        </div>
                        <div className="bg-white rounded shadow p-4">
                            <div className="text-lg font-semibold">Total Services</div>
                            <div className="text-2xl">{totalServices}</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-bold mb-2">All Users</h3>
                        <table className="min-w-full border border-gray-300 mb-8">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Username</th>
                                    <th className="border px-4 py-2">Role</th>
                                    <th className="border px-4 py-2">Phone</th>
                                    <th className="border px-4 py-2">Cooperative</th>
                                    <th className="border px-4 py-2">Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="border px-4 py-2">{user.id}</td>
                                        <td className="border px-4 py-2">{user.username}</td>
                                        <td className="border px-4 py-2">{user.role || "—"}</td>
                                        <td className="border px-4 py-2">{user.phone_number || "—"}</td>
                                        <td className="border px-4 py-2">{user.last_name || "—"}</td>
                                        <td className="border px-4 py-2">{user.is_active ? "Active" : "Inactive"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <h3 className="text-xl font-bold mb-2">All Services</h3>
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">ID</th>
                                    <th className="border px-4 py-2">Name</th>
                                    <th className="border px-4 py-2">Description</th>
                                    <th className="border px-4 py-2">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => (
                                    <tr key={service.id}>
                                        <td className="border px-4 py-2">{service.id}</td>
                                        <td className="border px-4 py-2">{service.name}</td>
                                        <td className="border px-4 py-2">{service.description || "—"}</td>
                                        <td className="border px-4 py-2">{service.category || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default ReportsPage;