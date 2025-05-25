import React, { useEffect, useState } from "react";
import axios from "axios";

// Helper for filtering feedbacks
const filterFeedbacks = (data, filters) => {
    return data.filter((fb) => {
        const feedbackDate = new Date(fb.created_at);
        const matchCategory = !filters.category || fb.category === filters.category;
        const matchService = !filters.service || fb.service_name === filters.service;
        const matchCoop = !filters.cooperative || fb.cooperative === filters.cooperative;
        const matchSentiment = !filters.sentiment || (fb.sentiment && fb.sentiment.toLowerCase() === filters.sentiment);
        const matchDateFrom = !filters.dateFrom || feedbackDate >= new Date(filters.dateFrom);
        const matchDateTo = !filters.dateTo || feedbackDate <= new Date(filters.dateTo);

        return matchCategory && matchService && matchCoop && matchSentiment && matchDateFrom && matchDateTo;
    });
};

const FilterFeedbacks = ({ onSelect }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        service: "",
        cooperative: "",
        sentiment: "",
        dateFrom: "",
        dateTo: "",
    });
    const [error, setError] = useState(null);

    // Today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await axios.get("http://127.0.0.1:8000/feedback/all-feedbacks/");
                const fbData = res.data.feedbacks || [];
                setFeedbacks(fbData);

                setCategories([...new Set(fbData.map(fb => fb.category).filter(Boolean))]);
                setServices([...new Set(fbData.map(fb => fb.service_name).filter(Boolean))]);
                setCooperatives([...new Set(fbData.map(fb => fb.cooperative).filter(Boolean))]);

                onSelect(filterFeedbacks(fbData, filters), filters);
            } catch (err) {
                console.error("Error fetching feedbacks:", err);
                setError("Failed to load feedbacks. Please try again later.");
            }
        };

        fetchFeedbacks();
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const filtered = filterFeedbacks(feedbacks, filters);
        onSelect(filtered, filters);
        // eslint-disable-next-line
    }, [filters, feedbacks]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };

        // Only validate if both dates are set
        if (newFilters.dateFrom && newFilters.dateTo) {
            const fromDate = new Date(newFilters.dateFrom);
            const toDate = new Date(newFilters.dateTo);

            // Calculate difference in days
            const diffTime = toDate - fromDate;
            const diffDays = diffTime / (1000 * 60 * 60 * 24);

            if (diffDays < 0) {
                setError("End date cannot be before start date");
                return;
            }

            if (diffDays < 1) {
                setError("There must be at least one day difference between dates");
                return;
            }
        }

        setError(null);
        setFilters(newFilters);
    };

    const clearFilters = () => {
        setFilters({
            category: "",
            service: "",
            cooperative: "",
            sentiment: "",
            dateFrom: "",
            dateTo: "",
        });
        setError(null);
    };

    // Calculate minimum date for "Date To" (dateFrom + 1 day)
    const getMinToDate = () => {
        if (!filters.dateFrom) return undefined;
        const nextDay = new Date(filters.dateFrom);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
    };

    // Calculate maximum date for "Date From" (dateTo - 1 day)
    const getMaxFromDate = () => {
        if (!filters.dateTo) return today;
        const prevDay = new Date(filters.dateTo);
        prevDay.setDate(prevDay.getDate() - 1);
        return prevDay.toISOString().split('T')[0];
    };

    return (
        <div className="bg-gray-400 rounded-lg shadow-xl p-3 mb-6 mx-6 font-poppins">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    Filter Feedbacks
                </h2>
                <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-lg"
                >
                    Clear Filters
                </button>
            </div>

            {error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Service
                    </label>
                    <select
                        name="service"
                        value={filters.service}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    >
                        <option value="">All Services</option>
                        {services.map(svc => (
                            <option key={svc} value={svc}>{svc}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Cooperative
                    </label>
                    <select
                        name="cooperative"
                        value={filters.cooperative}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    >
                        <option value="">All Cooperatives</option>
                        {cooperatives.map(coop => (
                            <option key={coop} value={coop}>{coop}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Sentiment
                    </label>
                    <select
                        name="sentiment"
                        value={filters.sentiment}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    >
                        <option value="">All Sentiments</option>
                        <option value="positive">Positive</option>
                        <option value="neutral">Neutral</option>
                        <option value="negative">Negative</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Date From
                    </label>
                    <input
                        type="date"
                        name="dateFrom"
                        value={filters.dateFrom}
                        max={getMaxFromDate()}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                        Date To
                    </label>
                    <input
                        type="date"
                        name="dateTo"
                        value={filters.dateTo}
                        min={getMinToDate()}
                        max={today}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gradient-to-r from-green-50 to-green-100"
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterFeedbacks;