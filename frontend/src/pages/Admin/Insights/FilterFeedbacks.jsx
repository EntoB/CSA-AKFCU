import React, { useEffect, useState } from "react";
import axios from "axios";

const FilterFeedbacks = ({ onSelect }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [cooperatives, setCooperatives] = useState([]);
    const [filters, setFilters] = useState({
        category: "",
        service: "",
        cooperative: "",
        dateFrom: "",
        dateTo: "",
    });

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/feedback/all-feedbacks/")
            .then(res => {
                const fbData = res.data.feedbacks || [];
                setFeedbacks(fbData);
                setCategories([...new Set(fbData.map(fb => fb.category).filter(Boolean))]);
                setServices([...new Set(fbData.map(fb => fb.service_name).filter(Boolean))]);
                setCooperatives([...new Set(fbData.map(fb => fb.cooperative).filter(Boolean))]);

                // Initial filter pass
                const initiallyFiltered = filterFeedbacks(fbData, filters);
                onSelect(initiallyFiltered);
            });
    }, []);

    useEffect(() => {
        const filtered = filterFeedbacks(feedbacks, filters);
        onSelect(filtered);
    }, [filters, feedbacks]); // Only trigger when filters or data change

    const filterFeedbacks = (data, filters) => {
        return data.filter(fb => {
            const matchCategory = !filters.category || fb.category === filters.category;
            const matchService = !filters.service || fb.service_name === filters.service;
            const matchCoop = !filters.cooperative || fb.cooperative === filters.cooperative;
            const matchDateFrom = !filters.dateFrom || fb.created_at >= filters.dateFrom;
            const matchDateTo = !filters.dateTo || fb.created_at <= filters.dateTo;
            return matchCategory && matchService && matchCoop && matchDateFrom && matchDateTo;
        });
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
            <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select name="category" value={filters.category} onChange={handleChange}
                    className="border rounded px-2 py-1">
                    <option value="">All</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <select name="service" value={filters.service} onChange={handleChange}
                    className="border rounded px-2 py-1">
                    <option value="">All</option>
                    {services.map(svc => (
                        <option key={svc} value={svc}>{svc}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Primary Cooperative</label>
                <select name="cooperative" value={filters.cooperative} onChange={handleChange}
                    className="border rounded px-2 py-1">
                    <option value="">All</option>
                    {cooperatives.map(coop => (
                        <option key={coop} value={coop}>{coop}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Date From</label>
                <input
                    type="date"
                    name="dateFrom"
                    value={filters.dateFrom}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Date To</label>
                <input
                    type="date"
                    name="dateTo"
                    value={filters.dateTo}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                />
            </div>
        </div>
    );
};

export default FilterFeedbacks;
