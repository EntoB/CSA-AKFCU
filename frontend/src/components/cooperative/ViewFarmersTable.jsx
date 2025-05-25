import React from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';

const columns = [
    { id: 'id', label: 'ID', minWidth: 60 },
    { id: 'username', label: 'Name', minWidth: 120 },
    { id: 'phone_number', label: 'Phone Number', minWidth: 120 },
    { id: 'address', label: 'Address', minWidth: 120 },
    { id: 'last_name', label: 'Cooperative', minWidth: 120 },
    { id: 'status', label: 'Status', minWidth: 100 },
    { id: 'reset', label: 'Reset Password', minWidth: 130 },
];

const ViewFarmersTable = ({
    farmers,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleToggleActive,
    handleResetPassword,
}) => (
    <Paper sx={{
        width: '100%',
        overflow: 'hidden',
        boxShadow: 3,
        borderRadius: 2,
        bgcolor: '#e6f4ea',
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
                                        ? '#f7fbe7'
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
                                        onClick={() => handleResetPassword(farmer.id)}
                                    >
                                        Reset Password
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
);

export default ViewFarmersTable;