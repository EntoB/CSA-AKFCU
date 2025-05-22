import * as React from 'react';
import axios from 'axios';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import AnimatedAlert from '../../../components/common/AnimatedAlert';

function EnableServicesPc() {
    const [pcs, setPCs] = React.useState([]);
    const [services, setServices] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [message, setMessage] = React.useState('');
    const [showAlert, setShowAlert] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const pcsRes = await axios.get('http://127.0.0.1:8000/accounts/users?role=pcs');
                const servicesRes = await axios.get('http://127.0.0.1:8000/feedback/services/');
                setPCs(pcsRes.data);
                setServices(servicesRes.data);
            } catch (err) {
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
        } catch (err) {
            setMessage('Failed to save changes.');
            setShowAlert(true);
        } finally {
            setTimeout(() => setShowAlert(false), 4000);
        }
    };

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

    return (
        <Box sx={{ width: '100%', position: 'relative' }}>
            {/* Absolute Alert on top of everything */}
            <Box
                sx={{
                    position: 'fixed',
                    top: 24,
                    left: 0,
                    width: '100%',
                    zIndex: 1300, // above modal/dialog
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

            <Sheet
                variant="outlined"
                sx={theme => ({
                    '--TableCell-height': '56px',
                    '--TableHeader-height': 'calc(1 * var(--TableCell-height))',
                    '--Table-firstColumnWidth': '200px',
                    '--Table-lastColumnWidth': '144px',
                    '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.03)',
                    '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.07)',
                    overflow: 'auto',
                    background: theme.vars.palette.background.surface,
                    borderRadius: 'lg',
                    boxShadow: 'sm',
                    p: 2,
                })}
            >
                <Table
                    borderAxis="bothBetween"
                    stripe="odd"
                    hoverRow
                    sx={{
                        minWidth: 700,
                        '& th, & td': {
                            textAlign: 'center',
                            padding: 0,
                        },
                        '& th': {
                            backgroundColor: '#d3f9d8',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                        },
                        '& td:first-child, & th:first-child': {
                            position: 'sticky',
                            left: 0,
                            backgroundColor: '#d3f9d8',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textAlign: 'left',
                            zIndex: 2,
                            padding: '0 16px',
                        },
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 'var(--Table-firstColumnWidth)' }}>Cooperative</th>
                            {services.map(service => (
                                <th key={service.id}>{service.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pcs.map(pc => (
                            <tr key={pc.id}>
                                <td>{pc.username}</td>
                                {services.map(service => {
                                    const isActive = (pc.active_services || []).includes(service.id);
                                    return (
                                        <td key={`${pc.id}-${service.id}`}>
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
                                                }}
                                                onClick={() =>
                                                    handleServiceToggle(pc.id, service.id, isActive)
                                                }
                                            >
                                                {isActive ? 'Active' : 'Inactive'}
                                            </Button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Sheet>

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