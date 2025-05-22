import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FeedbackResponse from "../../components/farmer/FeedbackResponse";

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const service = location.state?.service;
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [specificService, setSpecificService] = useState("");
    const [status, setStatus] = useState("");
    const [allowed, setAllowed] = useState(null);
    const [reason, setReason] = useState("");
    const [showResponse, setShowResponse] = useState(false);

    useEffect(() => {
        const checkAllowed = async () => {
            if (!service) return;
            try {
                const res = await axios.get(
                    `http://127.0.0.1:8000/feedback/can-give-feedback/?service_id=${service.id}`
                );
                setAllowed(res.data.allowed);
                setReason(res.data.reason || "");
            } catch {
                setAllowed(false);
                setReason("Could not verify feedback eligibility.");
            }
        };
        checkAllowed();
    }, [service]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("");
        try {
            await axios.post("http://127.0.0.1:8000/feedback/submit/", {
                service_id: service.id,
                message,
                rating,
                specific_service: specificService,
            });
            setStatus("Feedback submitted successfully!");
            setMessage("");
            setRating(5);
            setSpecificService("");
            setShowResponse(true); // Show feedback response dialog
        } catch (err) {
            setStatus("Failed to submit feedback.");
        }
    };

    if (!service) {
        return <div className="p-6">No service selected.</div>;
    }

    if (allowed === false) {
        return (
            <div className="p-6 max-w-xl mx-auto">
                <h2 className="text-2xl font-bold mb-2">Feedback for {service.name}</h2>
                <div className="mb-4 text-red-600">{reason}</div>
            </div>
        );
    }

    if (allowed === null) {
        return <div className="p-6">Checking feedback eligibility...</div>;
    }

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-2">Feedback for {service.name}</h2>
            <div className="mb-4 text-gray-600">{service.description}</div>
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4">
                <label className="block mb-2 font-semibold">Specific Service</label>
                <input
                    className="w-full border rounded p-2 mb-4"
                    value={specificService}
                    onChange={e => setSpecificService(e.target.value)}
                    placeholder="specific type or breed of the service"
                    required
                />
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
            <FeedbackResponse
                open={showResponse}
                onClose={() => {
                    setShowResponse(false);
                    setAllowed(false); // Prevent further feedback until reload
                    navigate("/farmer"); // Navigate to farmer home page
                }}
                message="Thank you for your feedback!"
            />
        </div>
    );
};

export default FeedbackPage;