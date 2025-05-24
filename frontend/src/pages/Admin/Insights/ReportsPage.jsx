import React, { useRef, useState, useCallback } from "react";
import FilterFeedbacks from "./FilterFeedbacks";

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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Printable Feedback Report</h2>
            <FilterFeedbacks onSelect={handleSelect} />

            <div className="flex flex-wrap gap-4 my-4 items-center">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={handlePrint}
                >
                    Print Report
                </button>
                <label className="font-semibold ml-4">Group rows by:</label>
                <select
                    className="border rounded px-2 py-1"
                    value={rowType}
                    onChange={e => setRowType(e.target.value)}
                >
                    <option value="cooperative">Primary Cooperative</option>
                    <option value="service_name">Service</option>
                    <option value="category">Service Category</option>
                </select>
            </div>

            <div ref={reportRef}>
                <div className="mb-6 flex flex-wrap gap-8">
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
                </div>
                <h3 className="text-xl font-bold mb-2">Feedback Sentiment by {rowType === "cooperative" ? "Primary Cooperative" : rowType === "service_name" ? "Service" : "Service Category"}</h3>
                <table className="min-w-full border border-gray-300 mb-8">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2 text-left">
                                {rowType === "cooperative" && "Primary Cooperative"}
                                {rowType === "service_name" && "Service"}
                                {rowType === "category" && "Service Category"}
                            </th>
                            <th className="border px-4 py-2">Total</th>
                            <th className="border px-4 py-2">Positive</th>
                            <th className="border px-4 py-2">Negative</th>
                            <th className="border px-4 py-2">Neutral</th>
                            <th className="border px-4 py-2">+ve %</th>
                            <th className="border px-4 py-2">-ve %</th>
                            <th className="border px-4 py-2">Neutral %</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(rowStats).length === 0 ? (
                            <tr>
                                <td colSpan={8} className="border px-4 py-2 text-center">
                                    No feedbacks found for the selected filters.
                                </td>
                            </tr>
                        ) : (
                            Object.entries(rowStats).map(([group, stats]) => (
                                <tr key={group}>
                                    <td className="border px-4 py-2">{group}</td>
                                    <td className="border px-4 py-2">{stats.total}</td>
                                    <td className="border px-4 py-2">{stats.positive}</td>
                                    <td className="border px-4 py-2">{stats.negative}</td>
                                    <td className="border px-4 py-2">{stats.neutral}</td>
                                    <td className="border px-4 py-2">{stats.positiveRatio}%</td>
                                    <td className="border px-4 py-2">{stats.negativeRatio}%</td>
                                    <td className="border px-4 py-2">{stats.neutralRatio}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <h3 className="text-xl font-bold mb-4">Filtered Feedbacks</h3>
                <table className="min-w-full border border-gray-300 mb-8">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">User First Name</th>
                            <th className="border px-4 py-2">Service Category</th>
                            <th className="border px-4 py-2">Service Name</th>
                            <th className="border px-4 py-2">Rating</th>
                            <th className="border px-4 py-2">Sentiment</th>
                            <th className="border px-4 py-2">Message (English)</th>
                            <th className="border px-4 py-2">Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFeedbacks.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="border px-4 py-2 text-center">
                                    No feedbacks found for the selected filters.
                                </td>
                            </tr>
                        ) : (
                            filteredFeedbacks.map((fb, idx) => (
                                <tr key={idx}>
                                    <td className="border px-4 py-2">{fb.user_first_name || "—"}</td>
                                    <td className="border px-4 py-2">{fb.category || "—"}</td>
                                    <td className="border px-4 py-2">{fb.service_name || "—"}</td>
                                    <td className="border px-4 py-2">{fb.rating || "—"}</td>
                                    <td className="border px-4 py-2">{fb.sentiment || "—"}</td>
                                    <td className="border px-4 py-2">{fb.message_in_english || "—"}</td>
                                    <td className="border px-4 py-2">{fb.message || "—"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsPage;