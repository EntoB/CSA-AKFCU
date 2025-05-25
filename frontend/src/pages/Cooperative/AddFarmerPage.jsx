import React, { useState, useEffect } from "react";
import axios from "axios";

const AddFarmerPage = () => {
    const [message, setMessage] = useState("");
    const [registrationKey, setRegistrationKey] = useState("");
    const [totalFarmers, setTotalFarmers] = useState(0);
    const [activeFarmers, setActiveFarmers] = useState(0);
    const [maxFarmers, setMaxFarmers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both farmer data and cooperative data in parallel
                const [farmersResponse, coopResponse] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/accounts/coop-farmers/", {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }),
                    axios.get("http://127.0.0.1:8000/accounts/users/me/", {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }),
                ]);

                const farmers = farmersResponse.data.farmers || [];
                setTotalFarmers(farmers.length);
                setActiveFarmers(farmers.filter((f) => f.is_active).length);
                setMaxFarmers(coopResponse.data.number_of_farmers || 0);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage("Failed to load farmer data");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleGenerateKey = async (e) => {
        e.preventDefault();
        setMessage("");
        setRegistrationKey("");
        setCopied(false);

        if (totalFarmers >= maxFarmers) {
            setMessage(
                `Cannot generate key. You have reached your maximum farmer limit of ${maxFarmers}.`
            );
            return;
        }

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/accounts/generate-registration-key/",
                {},
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setRegistrationKey(response.data.registration_key);
            setMessage("Registration key generated successfully!");
            setTotalFarmers((prev) => prev + 1); // Increment total farmers count
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setMessage("You have reached your maximum farmer limit.");
            } else {
                setMessage("Failed to generate registration key.");
            }
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(registrationKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => {
        const printContent = `
      <div style="text-align:center;padding:20px;font-family:Arial;">
        <h2 style="margin-bottom:10px;">Farmer Registration Key</h2>
        <p style="font-size:18px;margin-bottom:20px;">Please share this key with the farmer:</p>
        <div style="font-size:24px;font-weight:bold;color:#047857;margin:20px 0;padding:10px;border:1px dashed #ccc;word-break:break-all;">
          ${registrationKey}
        </div>
        <p style="font-size:14px;color:#666;">This key will expire after one-time use.</p>
      </div>
    `;

        const printWindow = window.open("", "_blank");
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 200);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleGenerateKey}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Generate Farmer Registration Key
                </h2>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Farmers:</span>
                        <span className="font-medium">
                            {totalFarmers} / {maxFarmers}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Active Farmers:</span>
                        <span className="font-medium">{activeFarmers}</span>
                    </div>
                </div>

                {message && (
                    <div
                        className={`mb-4 text-center ${message.includes("successfully")
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {message}
                    </div>
                )}
                {registrationKey && (
                    <div className="mb-4 p-4 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1 text-center">
                            Registration Key:
                        </div>
                        <div className="flex items-center justify-center gap-2">
                            <div className="font-mono text-green-700 break-all px-3 py-1 bg-white rounded">
                                {registrationKey}
                            </div>
                            <div className="relative flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    title="Copy to clipboard"
                                    className="p-2 bg-green-600 hover:bg-green-700 rounded-md text-white transition-colors duration-200 focus:outline-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <rect
                                            x="9"
                                            y="9"
                                            width="13"
                                            height="13"
                                            rx="2"
                                            ry="2"
                                        ></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    title="Print key"
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors duration-200 focus:outline-none"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                                        <rect x="6" y="14" width="12" height="8"></rect>
                                    </svg>
                                </button>
                                {copied && (
                                    <div className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                        Copied!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400"
                    disabled={totalFarmers >= maxFarmers}
                >
                    {totalFarmers >= maxFarmers ? "Farmer Limit Reached" : "Generate Key"}
                </button>
            </form>
        </div>
    );
};

export default AddFarmerPage;
