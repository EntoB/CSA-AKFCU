import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminFeedbackSettings = () => {
    const [responseLimit, setResponseLimit] = useState("5");
    const [consecutiveDays, setConsecutiveDays] = useState("1");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        setMessage("");
        axios.get("http://127.0.0.1:8000/feedback/admin-feedback-settings/")
            .then(res => {
                setResponseLimit(String(res.data.response_limit));
                setConsecutiveDays(String(res.data.consecutive_days_limit));
            })
            .catch(() => setMessage("Failed to load settings."))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        // Convert to numbers for validation
        const responseLimitNum = Number(responseLimit);
        const consecutiveDaysNum = Number(consecutiveDays);

        // Validation
        if (isNaN(responseLimitNum)) {
            setMessage("Response limit must be a valid number.");
            setSaving(false);
            return;
        }

        if (responseLimitNum < 1 || responseLimitNum > 10) {
            setMessage("Response limit must be between 1 and 10.");
            setSaving(false);
            return;
        }

        if (isNaN(consecutiveDaysNum)) {
            setMessage("Response time must be a valid number.");
            setSaving(false);
            return;
        }

        if (consecutiveDaysNum < 1 || consecutiveDaysNum > 100) {
            setMessage("Response time must be between 1 and 100 days.");
            setSaving(false);
            return;
        }

        try {
            await axios.post("http://127.0.0.1:8000/feedback/admin-feedback-settings/", {
                response_limit: responseLimitNum,
                consecutive_days_limit: consecutiveDaysNum,
            }, { headers: { "Content-Type": "application/json" } });
            setMessage("Settings updated successfully.");
        } catch {
            setMessage("Failed to update settings.");
        }
        setSaving(false);
    };

    const handleResponseLimitChange = (e) => {
        const val = e.target.value;
        // Allow empty string (for backspace) or numbers between 1-10
        if (val === '' || (/^([1-9]|10)$/.test(val))) {
            setResponseLimit(val);
        }
    };

    const handleConsecutiveDaysChange = (e) => {
        const val = e.target.value;
        // Allow empty string or numbers 1-100
        if (val === '' || (/^([1-9][0-9]?|100)$/.test(val))) {
            setConsecutiveDays(val);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 -mt:-18">
            <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900">
                            Feedback Settings
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Set the limits for feedback responses and response time
                        </p>
                    </div>
                    {message && (
                        <div className={`mb-6 p-4 rounded-md ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message}</div>
                    )}
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label htmlFor="responseLimit" className="block text-sm font-medium text-gray-700">
                                Response Limit (1-10)
                            </label>
                            <input
                                type="number"
                                id="responseLimit"
                                name="responseLimit"
                                value={responseLimit}
                                onChange={handleResponseLimitChange}
                                onBlur={() => {
                                    if (responseLimit === '') {
                                        setResponseLimit(1);
                                    }
                                }}
                                required
                                min="1"
                                max="10"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="consecutiveDays" className="block text-sm font-medium text-gray-700">
                                Consecutive Response Time Limit (days, 1-100)
                            </label>
                            <input
                                type="number"
                                id="consecutiveDays"
                                name="consecutiveDays"
                                value={consecutiveDays}
                                onChange={handleConsecutiveDaysChange}
                                onBlur={() => {
                                    if (consecutiveDays === '') {
                                        setConsecutiveDays(1);
                                    }
                                }}
                                required
                                min="1"
                                max="100"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 bg-white"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={saving || loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${saving || loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminFeedbackSettings;