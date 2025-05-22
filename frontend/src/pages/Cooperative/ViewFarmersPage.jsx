import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import AnimatedAlert from '../../components/common/AnimatedAlert';

const columns = [
    { id: 'id', label: 'ID', minWidth: 60 },
    { id: 'username', label: 'Name', minWidth: 120 },
    { id: 'phone_number', label: 'Phone Number', minWidth: 120 },
    { id: 'address', label: 'Address', minWidth: 120 },
    { id: 'last_name', label: 'Cooperative', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
];

const ViewFarmersPage = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/coop-farmers/");
            setFarmers(response.data.farmers);
        } catch (err) {
            setAlertType("danger");
            setAlertMessage("Failed to load farmers.");
            setAlertOpen(true);
        }
        setLoading(false);
    };

    const handleToggleActive = async (farmerId, currentState) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/farmers/${farmerId}/toggle-active/`,
                { is_active: !currentState },
                { headers: { "Content-Type": "application/json" } }
            );
            setFarmers(farmers =>
                farmers.map(farmer =>
                    farmer.id === farmerId ? { ...farmer, is_active: !currentState } : farmer
                )
            );
            setAlertType("success");
            setAlertMessage("Farmer status updated.");
            setAlertOpen(true);
        } catch (err) {
            setAlertType("danger");
            setAlertMessage("Failed to update status.");
            setAlertOpen(true);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Farmers</h2>
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
                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: '#e6f4ea', // light green background
                }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="farmers table">
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
                                {farmers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((farmer) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={farmer.id}
                                            sx={{
                                                bgcolor: farmer.is_active
                                                    ? '#f7fbe7' // light golden for active
                                                    : '#fff',
                                            }}
                                        >
                                            <TableCell>{farmer.id}</TableCell>
                                            <TableCell>{farmer.username}</TableCell>
                                            <TableCell>{farmer.phone_number}</TableCell>
                                            <TableCell>{farmer.address || "—"}</TableCell>
                                            <TableCell>{farmer.last_name || "—"}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant={farmer.is_active ? "contained" : "outlined"}
                                                    color={farmer.is_active ? "success" : "primary"}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        bgcolor: farmer.is_active ? '#16a34a' : undefined,
                                                        color: farmer.is_active ? '#fff' : undefined,
                                                        '&:hover': {
                                                            bgcolor: farmer.is_active ? '#1e293b' : '#16a34a',
                                                            color: '#f59e42',
                                                        },
                                                        borderRadius: 2,
                                                        minWidth: 90,
                                                    }}
                                                    onClick={() => handleToggleActive(farmer.id, farmer.is_active)}
                                                >
                                                    {farmer.is_active ? "Active" : "Inactive"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={farmers.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            )}
        </div>
    );
};

export default ViewFarmersPage;