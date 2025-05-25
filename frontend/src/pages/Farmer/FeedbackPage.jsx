import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FeedbackResponse from "../../components/farmer/FeedbackResponse";
import { FaStar, FaLeaf, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FeedbackPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const service = location.state?.service;
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(null);
    const [specificService, setSpecificService] = useState("");
    const [status, setStatus] = useState("");
    const [allowed, setAllowed] = useState(null);
    const [reason, setReason] = useState("");
    const [showResponse, setShowResponse] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

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
        setIsAnalyzing(true);
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
            setTimeout(() => setShowResponse(true), 1000);
        } catch (err) {
            setStatus("Failed to submit feedback.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (!service) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <FaLeaf className="text-5xl text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        No Service Selected
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Please go back and select a service to provide feedback.
                    </p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-md mx-auto"
                    >
                        <FaChevronLeft /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (allowed === false) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-red-100 p-3 rounded-full">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                        Feedback for {service.name}
                    </h2>
                    <div className="text-center bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                        {reason}
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-md"
                    >
                        Return to Services
                    </button>
                </div>
            </div>
        );
    }

    if (allowed === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="loader mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">
                        Checking feedback eligibility...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-6 transition-colors duration-200"
                >
                    <FaChevronLeft /> Back to Services
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 text-white">
                        <h2 className="text-3xl font-bold mb-2">
                            Feedback for {service.name}
                        </h2>
                        <p className="opacity-90">{service.description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-6"
                        >
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                Specific Service
                            </label>
                            <input
                                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                value={specificService}
                                onChange={(e) => setSpecificService(e.target.value)}
                                placeholder="e.g., Organic Tomato Seeds, Jersey Cow Milking"
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mb-6"
                        >
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                Your Rating
                            </label>
                            <div className="flex items-center">
                                {[...Array(5)].map((star, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                        <label key={i} className="mr-1">
                                            <input
                                                type="radio"
                                                name="rating"
                                                value={ratingValue}
                                                onClick={() => setRating(ratingValue)}
                                                className="hidden"
                                            />
                                            <FaStar
                                                className="cursor-pointer text-3xl transition-transform duration-200 hover:scale-125"
                                                color={
                                                    ratingValue <= (hover || rating)
                                                        ? "#ffc107"
                                                        : "#000000"
                                                }
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(null)}
                                            />
                                        </label>
                                    );
                                })}
                                <span className="ml-3 text-xl font-medium text-gray-600">
                                    {rating} star{rating !== 1 ? "s" : ""}
                                </span>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="mb-8"
                        >
                            <label className="block text-lg font-semibold text-gray-700 mb-3">
                                Your Feedback
                            </label>
                            <textarea
                                className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Share your detailed experience with this service..."
                                required
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <button
                                type="submit"
                                disabled={isAnalyzing}
                                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${isAnalyzing
                                        ? "bg-green-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600 hover:shadow-md"
                                    } text-white flex items-center justify-center gap-3`}
                            >
                                {isAnalyzing ? (
                                    <>
                                        <div className="loader-small"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FaLeaf className="text-xl" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </motion.div>

                        <AnimatePresence>
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`mt-6 p-4 rounded-xl ${status.includes("success")
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {status}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </motion.div>

            <FeedbackResponse
                open={showResponse}
                onClose={() => {
                    setShowResponse(false);
                    setAllowed(false);
                    navigate("/farmer");
                }}
                message={
                    <div className="text-center p-6">
                        <h3 className="text-2xl font-bold text-green-600 mb-2">
                            Thank You!
                        </h3>
                        <p className="text-lg text-gray-700 mb-4">
                            Your feedback has been submitted successfully.
                        </p>
                        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                            <p className="text-gray-600 font-medium">
                                Your feedback is being analyzed
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                We'll use your input to improve our services
                            </p>
                        </div>
                    </div>
                }
            />

            <style jsx>{`
        .loader {
          width: 70px;
          aspect-ratio: 1;
          background:
            radial-gradient(farthest-side, #ffa516 90%, #0000) center/16px 16px,
            radial-gradient(farthest-side, green 90%, #0000) bottom/12px 12px;
          background-repeat: no-repeat;
          animation: l17 1s infinite linear;
          position: relative;
        }
        .loader::before {
          content: "";
          position: absolute;
          width: 8px;
          aspect-ratio: 1;
          inset: auto 0 16px;
          margin: auto;
          background: #ccc;
          border-radius: 50%;
          transform-origin: 50% calc(100% + 10px);
          animation: inherit;
          animation-duration: 0.5s;
        }
        .loader-small {
          width: 24px;
          height: 24px;
          background:
            radial-gradient(farthest-side, white 90%, #0000) center/6px 6px,
            radial-gradient(farthest-side, white 90%, #0000) bottom/5px 5px;
          background-repeat: no-repeat;
          animation: l17 1s infinite linear;
          position: relative;
        }
        .loader-small::before {
          content: "";
          position: absolute;
          width: 3px;
          height: 3px;
          inset: auto 0 5px;
          margin: auto;
          background: #ccc;
          border-radius: 50%;
          transform-origin: 50% calc(100% + 2px);
          animation: inherit;
          animation-duration: 0.5s;
        }
        @keyframes l17 {
          100% {
            transform: rotate(1turn);
          }
        }
      `}</style>
        </div>
    );
};

export default FeedbackPage;
