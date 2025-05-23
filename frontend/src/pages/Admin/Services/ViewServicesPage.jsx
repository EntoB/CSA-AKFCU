import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <input
                    type="text"
                    placeholder="Search by name or category,"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        border: '1.5px solid #16a34a',
                        fontSize: 17,
                        minWidth: 300,
                        outline: 'none',
                        background: '#f7fbe7',
                        color: '#14532d',
                        boxShadow: '0 2px 8px 0 rgba(22,163,74,0.07)',
                        transition: 'border 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => e.target.style.border = '2px solid #22c55e'}
                    onBlur={e => e.target.style.border = '1.5px solid #16a34a'}
                />
            </div>
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