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
    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(false);
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSelect = useCallback((feedbacks) => {
        setFilteredFeedbacks(feedbacks);
    }, []);

    const handleGenerateRecommendations = async () => {
        setRecLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/insights/recommendations/");
            const data = await res.json();
            setRecommendations(data);
        } catch (err) {
            setRecommendations([{ service_name: "Error", recommendations: "Failed to generate recommendations." }]);
        } finally {
            setRecLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <FilterFeedbacks onSelect={handleSelect} />

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Summarized Feedbacks & Service
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', mt: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Cooperative</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Sentiment</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Summarized Feedback</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredFeedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No feedbacks found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFeedbacks.map((row, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>{row.service_name || <i>Unknown</i>}</TableCell>
                                            <TableCell>{row.category || <i>Unknown</i>}</TableCell>
                                            <TableCell>{row.cooperative || <i>Unknown</i>}</TableCell>
                                            <TableCell>{row.customer || <i>Unknown</i>}</TableCell>
                                            <TableCell>{row.created_at || <i>Unknown</i>}</TableCell>
                                            <TableCell>{row.sentiment || <i>Unknown</i>}</TableCell>
                                            <TableCell>{row.summarized || <i>No summary</i>}</TableCell>
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
                    disabled={recLoading}
                >
                    {recLoading ? "Generating..." : "Generate Recommendations"}
                </Button>
            </Box>

            {recommendations.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Recommendations
                    </Typography>
                    {recommendations.map((rec, idx) => (
                        <Paper key={idx} sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {rec.service_name || <i>Unknown Service</i>}
                            </Typography>
                            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                                {rec.recommendations}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default RecommendationsPage;
