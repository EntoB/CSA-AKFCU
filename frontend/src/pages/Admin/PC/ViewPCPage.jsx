import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const columns = [
    { id: 'id', label: 'ID', minWidth: 60 },
    { id: 'username', label: 'Name', minWidth: 120 },
    { id: 'phone_number', label: 'Phone Number', minWidth: 120 },
    { id: 'is_active', label: 'Active', minWidth: 80 },
    { id: 'toggle', label: 'Toggle', minWidth: 100 },
    { id: 'reset', label: 'Reset Password', minWidth: 140 },
];

const ViewPCPage = () => {
    const [pcs, setPCs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetKey, setResetKey] = useState("");
    const [resetPC, setResetPC] = useState(null);

    useEffect(() => {
        fetchPCs();
    }, []);

    const fetchPCs = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/users?role=pcs");
            setPCs(response.data);
        } catch {
            setMessage("Failed to load primary cooperatives.");
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
            setMessage("Primary cooperative state updated.");
        } catch {
            setMessage("Failed to update state.");
        }
    };

    const handleResetPassword = async (pcId) => {
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/accounts/farmers/${pcId}/reset-password/`,
                {},
                { headers: { "Content-Type": "application/json" } }
            );
            setResetKey(res.data.key);
            const pc = pcs.find(p => p.id === pcId);
            setResetPC(pc);
            setResetDialogOpen(true);
        } catch {
            setMessage("Failed to generate reset key.");
        }
    };

    const handleCloseResetDialog = () => {
        setResetDialogOpen(false);
        setResetKey("");
        setResetPC(null);
    };

    return (
        <div className="p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 className="text-2xl font-bold">All Primary Cooperatives</h2>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{
                            padding: '8px 12px',
                            borderRadius: 6,
                            border: '1px solid #ccc',
                            fontSize: 16,
                            fontFamily: 'poppins, sans-serif',
                        }}
                    />
                    <a
                        href="/admin/pc/add"
                        style={{
                            background: '#16a34a',
                            color: '#fff',
                            padding: '8px 18px',
                            borderRadius: 6,
                            fontWeight: 'bold',
                            fontFamily: 'poppins, sans-serif',
                            fontSize: 16,
                            textDecoration: 'none',
                            transition: 'background 0.2s',
                            display: 'inline-block',
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#15803d'}
                        onMouseOut={e => e.currentTarget.style.background = '#16a34a'}
                    >
                        + Add PC
                    </a>
                </div>
            </div>
            {message && <div className="mb-4 text-blue-600">{message}</div>}
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
                                {pcs.filter(pc =>
                                    pc.username && pc.username.toLowerCase().includes(search.toLowerCase())
                                ).map((pc) => (
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
                                                    fontFamily: 'poppins, sans-serif',
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
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                size="small"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    borderRadius: 2,
                                                    minWidth: 120,
                                                }}
                                                onClick={() => handleResetPassword(pc.id)}
                                            >
                                                Reset Password
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog}>
                <DialogTitle>Password Reset Key</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {resetPC && (
                            <>
                                PC: <b>{resetPC.username}</b>
                                <br />
                            </>
                        )}
                        <span style={{ color: "#16a34a", wordBreak: "break-all" }}>
                            Key: <b>{resetKey}</b>
                        </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Give this key to the PC to reset their password.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResetDialog} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewPCPage;