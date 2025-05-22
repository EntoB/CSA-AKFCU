import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Table from '@mui/joy/Table';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import AnimatedAlert from '../../components/common/AnimatedAlert';

const EnableServicesFarmer = () => {
    const [farmers, setFarmers] = useState([]);
    const [services, setServices] = useState([]);
    const [coopActiveServices, setCoopActiveServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get farmers and active_services for this cooperative
                const farmersRes = await axios.get(
                    "http://127.0.0.1:8000/accounts/coop-farmers/"
                );
                setFarmers(farmersRes.data.farmers);
                setCoopActiveServices(farmersRes.data.active_services);

                // 2. Get all services, but only those in the coop's active_services
                const servicesRes = await axios.get(
                    "http://127.0.0.1:8000/feedback/services/"
                );
                const coopServices = servicesRes.data.filter(service =>
                    (farmersRes.data.active_services || []).includes(service.id)
                );
                setServices(coopServices);
            } catch (err) {
                setMessage("Failed to load farmers or services.");
                setShowAlert(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Handle checkbox toggle
    const handleServiceToggle = (farmerId, serviceId, isChecked) => {
        setFarmers(prevFarmers =>
            prevFarmers.map(farmer => {
                if (farmer.id === farmerId) {
                    const newActiveServices = isChecked
                        ? [...(farmer.active_services || []), serviceId]
                        : (farmer.active_services || []).filter(id => id !== serviceId);
                    return { ...farmer, active_services: newActiveServices };
                }
                return farmer;
            })
        );
    };

    // Save changes to backend
    const handleSave = async () => {
        try {
            await axios.post(
                "http://127.0.0.1:8000/accounts/update-user-services/",
                { users: farmers },
                { headers: { "Content-Type": "application/json" } }
            );
            setMessage("Changes saved successfully!");
            setShowAlert(true);
        } catch (err) {
            setMessage("Failed to save changes.");
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

    if (!farmers.length || !services.length) {
        return <Typography level="h4" sx={{ textAlign: 'center', mt: 5 }}>No farmers or services available.</Typography>;
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
                Enable Services for Farmers
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
                            <th style={{ width: 'var(--Table-firstColumnWidth)' }}>Farmer</th>
                            {services.map(service => (
                                <th key={service.id}>{service.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {farmers.map(farmer => (
                            <tr key={farmer.id}>
                                <td>{farmer.username || farmer.name}</td>
                                {services.map(service => {
                                    const isActive = (farmer.active_services || []).includes(service.id);
                                    return (
                                        <td key={`${farmer.id}-${service.id}`}>
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
                                                    handleServiceToggle(farmer.id, service.id, !isActive)
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
};

export default EnableServicesFarmer;