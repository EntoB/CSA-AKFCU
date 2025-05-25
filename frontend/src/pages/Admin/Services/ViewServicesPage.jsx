import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { blue, green } from "@mui/material/colors";

const columns = [
    { id: 'id', label: 'ID', minWidth: 60 },
    { id: 'name', label: 'Name', minWidth: 120 },
    { id: 'description', label: 'Description', minWidth: 200 },
    { id: 'category', label: 'Category', minWidth: 120 },
    { id: 'actions', label: 'Actions', minWidth: 120 },
];

const ViewServicesPage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/feedback/services/");
            setServices(response.data);
        } catch {
            setMessage("Failed to load services.");
        }
        setLoading(false);
    };

    const handleDelete = async (serviceId) => {
        if (!window.confirm("Are you sure you want to delete this service?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/feedback/services/${serviceId}/delete/`);
            setMessage("Service deleted successfully.");
            setServices(services.filter(service => service.id !== serviceId));
        } catch {
            setMessage("Failed to delete service.");
        }
    };

    // Filtered services based on search
    const filteredServices = services.filter(service =>
        service.name?.toLowerCase().includes(search.toLowerCase()) ||
        service.category?.toLowerCase().includes(search.toLowerCase()) ||
        service.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Services</h2>
            {/* Search input */}
            <form className="flex items-center max-w-sm ml-auto mb-4" onSubmit={e => e.preventDefault()}>
                <label htmlFor="simple-search" className="sr-only">Search</label>
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="simple-search"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                        placeholder="Search branch name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <button
                    type="submit"
                    className="p-2.5 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    tabIndex={-1}
                >
                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                    <span className="sr-only">Search</span>
                </button>
                <button
                    type="button"
                    className="p-2.5 ml-2 text-sm font-medium text-white bg-green-800 rounded-lg border border-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 flex items-center"
                    onClick={() => window.location.href = '/admin/services/add'}
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add
                </button>
            </form>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, bgcolor: '#e6f4ea' }}>
                    <TableContainer sx={{ maxHeight: 940 }}>
                        <Table stickyHeader aria-label="services table">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#16a34a' }}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                                minWidth: column.minWidth,
                                                background: '#16a34a',
                                                color: '#fff',
                                                fontWeight: 'bold',
                                                fontFamily: 'Segoe UI, Arial, sans-serif',
                                                fontSize: '1rem',
                                                letterSpacing: '0.03em',
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredServices.map((service) => (
                                    <TableRow hover tabIndex={-1} key={service.id}>
                                        <TableCell style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.98rem' }}>{service.id}</TableCell>
                                        <TableCell style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem' }}>{service.name}</TableCell>
                                        <TableCell style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '0.98rem' }}>{service.description || "—"}</TableCell>
                                        <TableCell style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '0.98rem' }}>{service.category || "—"}</TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                style={{
                                                    background: '#dc2626',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 16px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    fontFamily: 'Segoe UI, Arial, sans-serif',
                                                    fontSize: '0.98rem',
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = '#b91c1c'}
                                                onMouseOut={e => e.currentTarget.style.background = '#dc2626'}
                                            >
                                                Delete
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </div>
    );
};

export default ViewServicesPage;