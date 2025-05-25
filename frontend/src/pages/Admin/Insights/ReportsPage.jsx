import React, { useRef, useState, useCallback } from "react";
import FilterFeedbacks from "./FilterFeedbacks";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const groupBy = (array, key) => {
    return array.reduce((result, item) => {
        const groupValue = item[key] || "—";
        if (!result[groupValue]) result[groupValue] = [];
        result[groupValue].push(item);
        return result;
    }, {});
};

const countSentimentsForRows = (feedbacks, rowType) => {
    const grouped = groupBy(feedbacks, rowType);
    const result = {};
    Object.entries(grouped).forEach(([group, items]) => {
        let positive = 0, negative = 0, neutral = 0;
        items.forEach(fb => {
            if (!fb.sentiment) return;
            const s = fb.sentiment.toLowerCase();
            if (s === "positive") positive++;
            else if (s === "negative") negative++;
            else if (s === "neutral") neutral++;
        });
        const total = positive + negative + neutral;
        result[group] = {
            positive,
            negative,
            neutral,
            total,
            positiveRatio: total ? ((positive / total) * 100).toFixed(1) : "0.0",
            negativeRatio: total ? ((negative / total) * 100).toFixed(1) : "0.0",
            neutralRatio: total ? ((neutral / total) * 100).toFixed(1) : "0.0",
        };
    });
    return result;
};

const ReportsPage = () => {
    const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
    const [rowType, setRowType] = useState("cooperative"); // "cooperative", "service_name", "category"
    const reportRef = useRef();

    const handleSelect = useCallback((feedbacks) => {
        setFilteredFeedbacks(feedbacks);
    }, []);

    const handlePrint = () => {
        if (reportRef.current) {
            const printContents = reportRef.current.innerHTML;
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload();
        }
    };

    // Calculate sentiment stats for each row
    const rowStats = countSentimentsForRows(filteredFeedbacks, rowType);

    // Calculate overall sentiment stats
    const overallStats = Object.values(rowStats).reduce(
        (acc, curr) => {
            acc.positive += curr.positive;
            acc.negative += curr.negative;
            acc.neutral += curr.neutral;
            acc.total += curr.total;
            return acc;
        },
        { positive: 0, negative: 0, neutral: 0, total: 0 }
    );
    overallStats.positiveRatio = overallStats.total ? ((overallStats.positive / overallStats.total) * 100).toFixed(1) : "0.0";
    overallStats.negativeRatio = overallStats.total ? ((overallStats.negative / overallStats.total) * 100).toFixed(1) : "0.0";
    overallStats.neutralRatio = overallStats.total ? ((overallStats.neutral / overallStats.total) * 100).toFixed(1) : "0.0";

    return (
        <Box sx={{ p: 4 }}>
            <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Poppins', fontSize: '2rem' }}>Printable Feedback Report</h2>
            <FilterFeedbacks onSelect={handleSelect} />

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'stretch', sm: 'center' },
                gap: 3,
                my: 4,
                justifyContent: 'flex-start',
                flexWrap: 'wrap',
            }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePrint}
                    sx={{ fontFamily: 'Poppins', fontSize: '1rem', minWidth: 160, mb: { xs: 2, sm: 0 } }}
                >
                    Print Report
                </Button>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <label style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '1rem', marginRight: 8 }}>Group rows by:</label>
                    <select
                        style={{ fontFamily: 'Poppins', fontSize: '1rem', height: 40, borderRadius: 6, border: '1px solid #ccc', padding: '0 12px' }}
                        value={rowType}
                        onChange={e => setRowType(e.target.value)}
                    >
                        <option value="cooperative">Primary Cooperative</option>
                        <option value="service_name">Service</option>
                        <option value="category">Service Category</option>
                    </select>
                </Box>
            </Box>

            <div ref={reportRef}>
                <Box className="mb-6 flex flex-wrap gap-8" sx={{ fontFamily: 'Poppins', fontSize: '1.1rem' }}>
                    <div>
                        <div className="font-semibold">Total Responses:</div>
                        <div>{overallStats.total}</div>
                    </div>
                    <div>
                        <div className="font-semibold">Positive:</div>
                        <div>{overallStats.positive} ({overallStats.positiveRatio}%)</div>
                    </div>
                    <div>
                        <div className="font-semibold">Negative:</div>
                        <div>{overallStats.negative} ({overallStats.negativeRatio}%)</div>
                    </div>
                    <div>
                        <div className="font-semibold">Neutral:</div>
                        <div>{overallStats.neutral} ({overallStats.neutralRatio}%)</div>
                    </div>
                </Box>
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Poppins', fontSize: '1.3rem' }}>Feedback Sentiment by {rowType === "cooperative" ? "Primary Cooperative" : rowType === "service_name" ? "Service" : "Service Category"}</h3>
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, bgcolor: '#e6f4ea', mb: 4 }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader aria-label="sentiment report table">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#16a34a' }}>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>
                                        {rowType === "cooperative" && "Primary Cooperative"}
                                        {rowType === "service_name" && "Service"}
                                        {rowType === "category" && "Service Category"}
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Total</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Positive</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Negative</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Neutral</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>+ve %</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>-ve %</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Neutral %</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(rowStats).length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>
                                            No feedbacks found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    Object.entries(rowStats).map(([group, stats]) => (
                                        <TableRow key={group} sx={{ height: 56 }}>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{group}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.total}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.positive}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.negative}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.neutral}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.positiveRatio}%</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.negativeRatio}%</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{stats.neutralRatio}%</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Poppins', fontSize: '1.3rem' }}>Filtered Feedbacks</h3>
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3, borderRadius: 2, bgcolor: '#e6f4ea', mb: 4 }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader aria-label="filtered feedbacks table">
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#16a34a' }}>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>User First Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Service Category</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Service Name</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 80, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Rating</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 100, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Sentiment</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 200, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Message (English)</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', minWidth: 200, background: '#16a34a', color: '#fff', fontFamily: 'Poppins', fontSize: '1.1rem', height: 64 }}>Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredFeedbacks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>
                                            No feedbacks found for the selected filters.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFeedbacks.map((fb, idx) => (
                                        <TableRow key={idx} sx={{ height: 56 }}>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.user_first_name || "—"}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.category || "—"}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.service_name || "—"}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.rating || "—"}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.sentiment || "—"}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.message_in_english || "—"}</TableCell>
                                            <TableCell sx={{ fontFamily: 'Poppins', fontSize: '1.05rem', height: 56 }}>{fb.message || "—"}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </Box>
    );
};

export default ReportsPage;