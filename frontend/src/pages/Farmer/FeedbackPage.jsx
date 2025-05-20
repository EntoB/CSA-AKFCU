import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const FeedbackPage = () => {
    const location = useLocation();
    const service = location.state?.service;
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        try {
            await axios.post("http://127.0.0.1:8000/feedback/submit/", {
                service_id: service.id,
                message,
                rating,
            });
            setStatus("Feedback submitted successfully!");
            setMessage("");
            setRating(5);
        } catch (err) {
            setStatus("Failed to submit feedback.");
        }
    };

    if (!service) {
        return <div className="p-6">No service selected.</div>;
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Feedback for {service.name}</h2>
            <div className="mb-4 text-gray-600">{service.description}</div>
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4">
                <label className="block mb-2 font-semibold">Rating</label>
                <select
                    className="w-full border rounded p-2 mb-4"
                    value={rating}
                    onChange={e => setRating(Number(e.target.value))}
                >
                    {[1, 2, 3, 4, 5].map(val => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
                <label className="block mb-2 font-semibold">Your Feedback</label>
                <textarea
                    className="w-full border rounded p-2 mb-4"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Submit Feedback
                </button>
                {status && <div className="mt-4 text-blue-600">{status}</div>}
            </form>
        </div>
    );
};

export default FeedbackPage;