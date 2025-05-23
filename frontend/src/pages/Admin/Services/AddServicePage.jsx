import React, { useEffect, useState } from "react";
import axios from "axios";

const AddServicePage = () => {
    const [form, setForm] = useState({
        name: "",
        name_am: "",
        name_or: "",
        description: "",
        category: "",
        newCategory: "",
    });
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch unique categories from the backend
    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/feedback/categories/"
                );
                setCategories(response.data.categories || []);
                setMessage({ text: "", type: "" });
            } catch (err) {
                setMessage({
                    text: "Failed to load categories",
                    type: "error",
                });
                setCategories([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        setForm((prev) => ({
            ...prev,
            category: value,
            newCategory: value === "__new__" ? "" : prev.newCategory,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ text: "", type: "" });

        const finalCategory =
            form.category === "__new__" ? form.newCategory : form.category;

        if (!form.name || !finalCategory) {
            setMessage({
                text: "Service name and category are required",
                type: "error",
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/feedback/add-service/",
                {
                    name: form.name,
                    name_am: form.name_am,
                    name_or: form.name_or,
                    description: form.description,
                    category: finalCategory,
                },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                setMessage({
                    text: "Service added successfully!",
                    type: "success",
                });
                setForm({
                    name: "",
                    name_am: "",
                    name_or: "",
                    description: "",
                    category: "",
                    newCategory: "",
                });
                // Refresh categories if new one was added
                if (form.category === "__new__") {
                    const updatedResponse = await axios.get(
                        "http://127.0.0.1:8000/feedback/categories/"
                    );
                    setCategories(updatedResponse.data.categories || []);
                }
            }
        } catch (err) {
            setMessage({
                text:
                    err.response?.data?.error ||
                    err.response?.data?.detail ||
                    "Failed to add service",
                type: "error",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Add New Service
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Fill in the details to register a new service
                        </p>
                    </div>

                    {message.text && (
                        <div
                            className={`mb-6 p-4 rounded-md ${message.type === "success"
                                ? "bg-green-50 text-green-800"
                                : "bg-red-50 text-red-800"
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Service Name (English) *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="name_am"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Service Name (Amharic)
                            </label>
                            <input
                                type="text"
                                id="name_am"
                                name="name_am"
                                value={form.name_am}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="name_or"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Service Name (Oromic)
                            </label>
                            <input
                                type="text"
                                id="name_or"
                                name="name_or"
                                value={form.name_or}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={form.description}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Category *
                            </label>
                            {isLoading ? (
                                <div className="mt-1 p-2 bg-gray-100 rounded-md text-sm text-gray-500">
                                    Loading categories...
                                </div>
                            ) : (
                                <>
                                    <select
                                        id="category"
                                        name="category"
                                        value={form.category}
                                        onChange={handleCategoryChange}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                        <option value="__new__">+ Create new category</option>
                                    </select>

                                    {form.category === "__new__" && (
                                        <div className="mt-2">
                                            <label
                                                htmlFor="newCategory"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                New Category Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="newCategory"
                                                name="newCategory"
                                                value={form.newCategory}
                                                onChange={handleChange}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                                                required
                                            />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${isSubmitting || isLoading
                                    ? "opacity-70 cursor-not-allowed"
                                    : ""
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Adding Service...
                                    </>
                                ) : (
                                    "Add Service"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddServicePage;