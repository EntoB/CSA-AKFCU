import React, { useState, useCallback } from "react";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FilterFeedbacks from "./FilterFeedbacks";

const RecommendationsPage = () => {
    const [recommendations, setRecommendations] = useState({ recommendations: [], message: "" });
    const [recLoading, setRecLoading] = useState(false);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(false);

    // Function to format date as DD/MM/YYYY
    const formatDate = (dateString) => {
        if (!dateString) return <i>Unknown</i>;

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return <i>Unknown</i>;

            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();

            return `${day}/${month}/${year}`;
        } catch (e) {
            return <i>Unknown</i>;
        }
    };

    // Accept filters as second argument
    const handleSelect = useCallback((feedbacks, filters) => {
        setFilteredFeedbacks(feedbacks);
        setFilters(filters);
    }, []);

    const handleGenerateRecommendations = async () => {
        setRecLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/insights/recommendations/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summaries: filteredFeedbacks.map(fb => fb.summarized).filter(Boolean),
                })
            });
            const data = await res.json();
            setRecommendations(data);
        } catch (err) {
            setRecommendations({ recommendations: [], message: "Failed to generate recommendations." });
        } finally {
            setRecLoading(false);
        }
    };

    const handleSaveRecommendations = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/insights/save-recommendations/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recommendations: recommendations.recommendations,
                    filters: filters
                })
            });
            const data = await res.json();
            alert(data.message);
        } catch (err) {
            alert("Failed to save recommendations.");
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <FilterFeedbacks onSelect={handleSelect} />

            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Poppins' }}>
                Summarized Feedbacks & Service
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{
                    width: '100%',
                    overflow: 'hidden',
                    boxShadow: 3,
                    borderRadius: 2,
                    bgcolor: '#e6f4ea',
                }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader aria-label="recommendations table" sx={{ minWidth: 1000 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#16a34a' }}>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '15%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Service Name</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '12%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Category</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '15%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Cooperative</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '15%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Farmers</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '10%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Date</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '10%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Sentiment</TableCell>
                                    <TableCell sx={{
                                        fontWeight: 'bold',
                                        width: '23%',
                                        background: '#16a34a',
                                        color: '#fff',
                                        fontFamily: 'Poppins',
                                        fontSize: '1rem'
                                    }}>Summarized Feedback</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredFeedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ fontFamily: 'Poppins', fontSize: '1rem' }}>
                                            No feedbacks found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFeedbacks.map((row, idx) => (
                                        <TableRow key={idx}
                                            sx={{
                                                bgcolor: row.sentiment === 'positive'
                                                    ? '#f7fbe7'
                                                    : row.sentiment === 'negative'
                                                        ? '#fbeee7'
                                                        : '#fff',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                }
                                            }}
                                        >
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem',
                                                wordBreak: 'break-word'
                                            }}>{row.service_name || <i>Unknown</i>}</TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem'
                                            }}>{row.category || <i>Unknown</i>}</TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem',
                                                wordBreak: 'break-word'
                                            }}>{row.cooperative || <i>Unknown</i>}</TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem',
                                                wordBreak: 'break-word'
                                            }}>{row.customer || <i>Unknown</i>}</TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem'
                                            }}>{formatDate(row.created_at)}</TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem'
                                            }}>{row.sentiment || <i>Unknown</i>}</TableCell>
                                            <TableCell sx={{
                                                fontFamily: 'Poppins',
                                                fontSize: '0.95rem',
                                                wordBreak: 'break-word'
                                            }}>{row.summarized || <i>No summary</i>}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <Box sx={{ mt: 4, textAlign: "center" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGenerateRecommendations}
                    disabled={recLoading || filteredFeedbacks.length === 0}
                    sx={{
                        minWidth: 240,
                        minHeight: 48,
                        fontFamily: 'Poppins',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: 2,
                        boxShadow: 2,
                        '&:hover': {
                            boxShadow: 4
                        }
                    }}
                >
                    {recLoading ? (
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                    ) : (
                        "Generate Recommendations"
                    )}
                </Button>
            </Box>

            {((Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0) || recommendations.message) && (
                <Box sx={{
                    mt: 4,
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    boxShadow: 1
                }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Poppins' }}>
                        Recommendations
                    </Typography>
                    {recommendations.message && (
                        <Typography color="error" sx={{ mb: 2, fontFamily: 'Poppins' }}>
                            {recommendations.message}
                        </Typography>
                    )}
                    {Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0 && (
                        <Box
                            component="ul"
                            sx={{
                                pl: 3,
                                mb: 2,
                                '& li': {
                                    fontFamily: 'Poppins',
                                    fontSize: '1rem',
                                    mb: 1,
                                    lineHeight: 1.6,
                                    listStyleType: 'disc', // Ensure bullet style
                                }
                            }}
                        >
                            {recommendations.recommendations.map((rec, idx) => (
                                <li key={idx}>{rec}</li>
                            ))}
                        </Box>
                    )}
                    {Array.isArray(recommendations.recommendations) && recommendations.recommendations.length > 0 && (
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{
                                mt: 2,
                                fontFamily: 'Poppins',
                                fontWeight: 600,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 3,
                                py: 1
                            }}
                            onClick={handleSaveRecommendations}
                        >
                            Save Recommendations & Filters
                        </Button>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default RecommendationsPage;