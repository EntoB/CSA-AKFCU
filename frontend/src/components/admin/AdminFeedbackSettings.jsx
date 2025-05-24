import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const AdminFeedbackSettings = () => {
    const [responseLimit, setResponseLimit] = useState(5);
    const [consecutiveDays, setConsecutiveDays] = useState("1");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        axios.get("http://127.0.0.1:8000/feedback/admin-feedback-settings/")
            .then(res => {
                setResponseLimit(res.data.response_limit);
                setConsecutiveDays(res.data.consecutive_days_limit);
            })
            .catch(() => setMessage("Failed to load settings."))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");
        try {
            await axios.post("http://127.0.0.1:8000/feedback/admin-feedback-settings/", {
                response_limit: responseLimit,
                consecutive_days_limit: consecutiveDays,
            }, { headers: { "Content-Type": "application/json" } });
            setMessage("Settings updated successfully.");
        } catch {
            setMessage("Failed to update settings.");
        }
        setSaving(false);
    };

    return (
        <Paper sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3 }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Feedback Settings
            </Typography>
            <form onSubmit={handleSave}>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Response Limit"
                        type="number"
                        value={responseLimit}
                        onChange={e => setResponseLimit(e.target.value)}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        label="Consecutive Response Time Limit (days)"
                        type="number"
                        value={consecutiveDays}
                        onChange={e => setConsecutiveDays(e.target.value)}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                    />
                </Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={saving || loading}
                    fullWidth
                >
                    {saving ? "Saving..." : "Save Settings"}
                </Button>
            </form>
            {message && (
                <Typography sx={{ mt: 2 }} color={message.includes("success") ? "green" : "red"}>
                    {message}
                </Typography>
            )}
        </Paper>
    );
};

export default AdminFeedbackSettings;