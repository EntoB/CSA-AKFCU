import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import AnimatedAlert from "../../../components/common/AnimatedAlert";

const columns = [
    { id: 'id', label: 'ID', minWidth: 60 },
    { id: 'username', label: 'Name', minWidth: 120 },
    { id: 'phone_number', label: 'Phone Number', minWidth: 120 },
    { id: 'is_active', label: 'Active', minWidth: 80 },
    { id: 'toggle', label: 'Toggle', minWidth: 100 },
];

const ViewPCPage = () => {
    const [pcs, setPCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    // Fetch all primary cooperatives on mount
    useEffect(() => {
        fetchPCs();
    }, []);

    const fetchPCs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/users?role=pcs");
            setPCs(response.data);
        } catch {
            setAlertType("danger");
            setAlertMessage("Failed to load primary cooperatives.");
            setAlertOpen(true);
        }
        setLoading(false);
    };

    const handleToggleActive = async (pcId, currentState) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/pcs/${pcId}/toggle-active/`,
                { is_active: !currentState },
                { headers: { "Content-Type": "application/json" } }
            );
            setPCs(pcs =>
                pcs.map(pc =>
                    pc.id === pcId ? { ...pc, is_active: !currentState } : pc
                )
            );
            setAlertType("success");
            setAlertMessage("Primary cooperative state updated.");
            setAlertOpen(true);
        } catch {
            setAlertType("danger");
            setAlertMessage("Failed to update state.");
            setAlertOpen(true);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Primary Cooperatives</h2>
            <AnimatedAlert
                open={alertOpen}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertOpen(false)}
                duration={1500}
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, bgcolor: '#e6f4ea' }}>
                    <TableContainer sx={{ maxHeight: 940 }}>
                        <Table stickyHeader aria-label="primary cooperatives table">
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
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pcs.map((pc) => (
                                    <TableRow hover tabIndex={-1} key={pc.id}>
                                        <TableCell>{pc.id}</TableCell>
                                        <TableCell>{pc.username}</TableCell>
                                        <TableCell>{pc.phone_number}</TableCell>
                                        <TableCell>{pc.is_active ? "Active" : "Inactive"}</TableCell>
                                        <TableCell>
                                            <button
                                                onClick={() => handleToggleActive(pc.id, pc.is_active)}
                                                style={{
                                                    background: pc.is_active ? '#f59e42' : '#16a34a',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '6px 16px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold',
                                                    transition: 'background 0.2s',
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background = pc.is_active ? '#d97706' : '#15803d'}
                                                onMouseOut={e => e.currentTarget.style.background = pc.is_active ? '#f59e42' : '#16a34a'}
                                            >
                                                {pc.is_active ? "Deactivate" : "Activate"}
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

export default ViewPCPage;