import React, { useEffect, useState } from "react";
import axios from "axios";
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

const RecommendationsPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [recommendations, setRecommendations] = useState([]);
    const [recLoading, setRecLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://127.0.0.1:8000/insights/all-feedbacks/");
                setData(res.data);
            } catch (err) {
                // Optionally handle error
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleGenerateRecommendations = async () => {
        setRecLoading(true);
        try {
            const res = await axios.get("http://127.0.0.1:8000/insights/recommendations/");
            setRecommendations(res.data);
        } catch (err) {
            setRecommendations([{ service_name: "Error", recommendations: "Failed to generate recommendations." }]);
        }
        setRecLoading(false);
    };

    return (
        <Box sx={{ p: 4 }}>
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
                                    <TableCell sx={{ fontWeight: 'bold' }}>Summarized Feedback</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{row.service_name || <i>Unknown</i>}</TableCell>
                                        <TableCell>{row.summarized || <i>No summary</i>}</TableCell>
                                    </TableRow>
                                ))}
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