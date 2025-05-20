import React, { useEffect, useState } from "react";
import axios from "axios";

const AddServicePage = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Fetch unique categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/feedback/categories/");
                setCategories(response.data.categories || []);
            } catch (err) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setCategory(value);
        if (value === "__new__") {
            setNewCategory("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        const finalCategory = category === "__new__" ? newCategory : category;

        if (!name || !finalCategory) {
            setError("Service name and category are required.");
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/feedback/add-service/",
                {
                    name,
                    description,
                    category: finalCategory,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (response.status === 201) {
                setMessage("Service added successfully!");
                setName("");
                setDescription("");
                setCategory("");
                setNewCategory("");
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                err.response?.data?.detail ||
                "Failed to add service."
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Add Service
                </h2>
                {message && (
                    <div className="mb-4 text-center text-green-600">{message}</div>
                )}
                {error && (
                    <div className="mb-4 text-center text-red-600">{error}</div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Service Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Category:</label>
                    <select
                        value={category}
                        onChange={handleCategoryChange}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                        <option value="__new__">Add new category...</option>
                    </select>
                    {category === "__new__" && (
                        <input
                            type="text"
                            placeholder="Enter new category"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full mt-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                            required
                        />
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                >
                    Add Service
                </button>
            </form>
        </div>
    );
};

export default AddServicePage;