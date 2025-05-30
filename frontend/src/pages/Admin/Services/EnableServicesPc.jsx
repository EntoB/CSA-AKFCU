import * as React from 'react';
import axios from 'axios';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import AnimatedAlert from '../../../components/common/AnimatedAlert';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

function EnableServicesPc() {
    const [pcs, setPCs] = React.useState([]);
    const [services, setServices] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState('');
    const [showAlert, setShowAlert] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pcsRes = await axios.get('http://127.0.0.1:8000/accounts/users?role=pcs');
                const servicesRes = await axios.get('http://127.0.0.1:8000/feedback/services/');
                setPCs(pcsRes.data);
                setServices(servicesRes.data);
            } catch {
                setMessage('Failed to load cooperatives or services.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleServiceToggle = (pcId, serviceId, isActive) => {
        setPCs(prev =>
            prev.map(pc =>
                pc.id === pcId
                    ? {
                        ...pc,
                        active_services: isActive
                            ? pc.active_services.filter(id => id !== serviceId)
                            : [...pc.active_services, serviceId],
                    }
                    : pc
            )
        );
    };

    const handleSave = async () => {
        try {
            await axios.post(
                'http://127.0.0.1:8000/accounts/update-user-services/',
                {
                    users: pcs.map(pc => ({
                        id: pc.id,
                        active_services: pc.active_services,
                    })),
                },
                { headers: { 'Content-Type': 'application/json' } }
            );
            setMessage('Changes saved successfully!');
            setShowAlert(true);
        } catch {
            setMessage('Failed to save changes.');
            setShowAlert(true);
        } finally {
            setTimeout(() => setShowAlert(false), 4000);
        }
    };

    // Filtered PCs based on search
    const filteredPCs = pcs.filter(pc =>
        pc.username?.toLowerCase().includes(search.toLowerCase()) ||
        pc.phone_number?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination
    const paginatedPCs = filteredPCs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress size="lg" variant="soft" />
            </Box>
        );
    }

    if (!pcs.length || !services.length) {
        return <Typography level="h4" sx={{ textAlign: 'center', mt: 5 }}>No cooperatives or services available.</Typography>;
    }

    // Table columns: first column is sticky, others are fixed width and horizontally scrollable
    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {/* Search input */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 0 }}>
                <input
                    type="text"
                    placeholder="Search cooperative"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        padding: '10px 18px',
                        borderRadius: 12,
                        border: '1.5px solid #16a34a',
                        fontSize: 20,
                        minWidth: 300,
                        outline: 'none',
                        marginRight: 8,
                        background: '#f7fbe7',
                        color: '#14532d',
                        boxShadow: '0 2px 8px 0 rgba(22,163,74,0.07)',
                        transition: 'border 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => e.target.style.border = '2px solid #22c55e'}
                    onBlur={e => e.target.style.border = '1.5px solid #16a34a'}
                />
            </Box>
            {/* Absolute Alert on top of everything */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 24,
                    left: 0,
                    width: '100%',
                    zIndex: 1300,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none'
                }}
            >
                <Box sx={{ pointerEvents: 'auto' }}>
                    <AnimatedAlert
                        open={showAlert}
                        message={message}
                        type={message === 'Changes saved successfully!' ? 'success' : 'danger'}
                        onClose={() => setShowAlert(false)}
                    />
                </Box>
            </Box>

            <Typography level="h3" sx={{ textAlign: 'center', pb: 2, fontWeight: 'bold' }}>
                Enable Services for Cooperatives
            </Typography>

            <Paper sx={{
                width: '100%',
                overflow: 'auto',
                boxShadow: 3,
                borderRadius: 2,
                bgcolor: '#e6f4ea',
                mb: 3,
            }}>
                <TableContainer sx={{ maxHeight: 440, minWidth: 700 }}>
                    <Table
                        stickyHeader
                        aria-label="enable services table"
                        size="small"
                        sx={{
                            borderCollapse: 'collapse',
                            '& td, & th': {
                                borderRight: '1px solid #e0e0e0',
                                borderBottom: '1px solid #e0e0e0',
                                padding: '8px 12px',
                            },
                            '& td:last-child, & th:last-child': {
                                borderRight: 0,
                            },
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    sx={{
                                        minWidth: 200,
                                        maxWidth: 200,
                                        background: '#d3f9d8',
                                        fontWeight: 'bold',
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 3,
                                        fontSize: 14,
                                        padding: '8px 12px',
                                    }}
                                >
                                    Cooperative
                                </TableCell>
                                {services.map(service => (
                                    <TableCell
                                        key={service.id}
                                        sx={{
                                            minWidth: 140,
                                            maxWidth: 140,
                                            background: '#d3f9d8',
                                            fontWeight: 'bold',
                                            textAlign: 'center',
                                            fontSize: 14,
                                            padding: '8px 12px',
                                        }}
                                    >
                                        {service.name}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedPCs.map(pc => (
                                <TableRow key={pc.id}>
                                    <TableCell
                                        sx={{
                                            minWidth: 200,
                                            maxWidth: 200,
                                            position: 'sticky',
                                            left: 0,
                                            background: '#f7fbe7',
                                            fontWeight: 'bold',
                                            zIndex: 1,
                                            fontSize: 14,
                                            padding: '8px 12px',
                                        }}
                                    >
                                        {pc.username}
                                    </TableCell>
                                    {services.map(service => {
                                        const isActive = (pc.active_services || []).includes(service.id);
                                        return (
                                            <TableCell
                                                key={`${pc.id}-${service.id}`}
                                                sx={{
                                                    minWidth: 140,
                                                    maxWidth: 140,
                                                    textAlign: 'center',
                                                    fontSize: 14,
                                                    padding: '8px 12px',
                                                }}
                                            >
                                                <Button
                                                    fullWidth
                                                    size="lg"
                                                    variant={isActive ? 'solid' : 'outlined'}
                                                    color={isActive ? 'success' : 'neutral'}
                                                    sx={{
                                                        opacity: isActive ? 0.9 : 1,
                                                        height: '48px',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem',
                                                        borderRadius: 2,
                                                        transition: 'all 0.2s',
                                                        boxShadow: isActive ? 'sm' : 'none',
                                                        minWidth: 0,
                                                        px: 0.5,
                                                    }}
                                                    onClick={() =>
                                                        handleServiceToggle(pc.id, service.id, isActive)
                                                    }
                                                >
                                                    {isActive ? 'Active' : 'Inactive'}
                                                </Button>
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component="div"
                    count={filteredPCs.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(event, newPage) => setPage(newPage)}
                    onRowsPerPageChange={event => {
                        setRowsPerPage(+event.target.value);
                        setPage(0);
                    }}
                />
            </Paper>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                    onClick={handleSave}
                    color="success"
                    size="lg"
                    variant="solid"
                    sx={{ px: 4, fontWeight: 'bold', fontSize: '1.1rem', boxShadow: 'sm' }}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}

export default EnableServicesPc;