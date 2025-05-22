import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'customer', label: 'User', minWidth: 120 },
    { id: 'service', label: 'Service', minWidth: 120 },
    { id: 'message', label: 'Message', minWidth: 200 },
    { id: 'sentiment', label: 'Sentiment', minWidth: 100 },
    { id: 'created_at', label: 'Date', minWidth: 120 },
];

export default function RecentResponsesTable() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/feedback/recent-feedbacks/')
            .then(res => setRows(res.data.feedbacks))
            .catch(() => setRows([]));
    }, []);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{
            width: '100%',
            overflow: 'hidden',
            boxShadow: 3,
            borderRadius: 2,
            bgcolor: '#e6f4ea', // light green background
        }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="recent responses table">
                    <TableHead>
                        <TableRow sx={{ bgcolor: '#16a34a' }}>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        background: '#16a34a', // main green
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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}
                                    sx={{
                                        bgcolor: row.sentiment === 'positive'
                                            ? '#f7fbe7' // light golden for positive
                                            : row.sentiment === 'negative'
                                                ? '#fbeee7' // light red for negative
                                                : '#fff',
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align}>
                                            {row[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}