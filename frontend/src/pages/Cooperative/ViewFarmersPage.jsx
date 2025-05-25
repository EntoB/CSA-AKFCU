import React, { useEffect, useState } from "react";
import axios from "axios";
import AnimatedAlert from '../../components/common/AnimatedAlert';
import ViewFarmersTable from '../../components/cooperative/ViewFarmersTable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ViewFarmersPage = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertType, setAlertType] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // For reset password dialog
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetKey, setResetKey] = useState("");
    const [resetFarmer, setResetFarmer] = useState(null);

    useEffect(() => {
        fetchFarmers();
    }, []);

    const fetchFarmers = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/accounts/coop-farmers/");
            setFarmers(response.data.farmers);
        } catch (err) {
            setAlertType("danger");
            setAlertMessage("Failed to load farmers.");
            setAlertOpen(true);
        }
        setLoading(false);
    };

    const handleToggleActive = async (farmerId, currentState) => {
        try {
            await axios.post(
                `http://127.0.0.1:8000/accounts/farmers/${farmerId}/toggle-active/`,
                { is_active: !currentState },
                { headers: { "Content-Type": "application/json" } }
            );
            setFarmers(farmers =>
                farmers.map(farmer =>
                    farmer.id === farmerId ? { ...farmer, is_active: !currentState } : farmer
                )
            );
            setAlertType("success");
            setAlertMessage("Farmer status updated.");
            setAlertOpen(true);
        } catch (err) {
            setAlertType("danger");
            setAlertMessage("Failed to update status.");
            setAlertOpen(true);
        }
    };

    const handleResetPassword = async (farmerId) => {
        try {
            const res = await axios.post(
                `http://127.0.0.1:8000/accounts/farmers/${farmerId}/reset-password/`,
                {},
                { headers: { "Content-Type": "application/json" } }
            );
            setResetKey(res.data.key);
            const farmer = farmers.find(f => f.id === farmerId);
            setResetFarmer(farmer);
            setResetDialogOpen(true);
            setAlertType("success");
            setAlertMessage("Password reset link generated.");
            setAlertOpen(true);
        } catch (err) {
            setAlertType("danger");
            setAlertMessage("Failed to Reset Password!.");
            setAlertOpen(true);
        }
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleCloseResetDialog = () => {
        setResetDialogOpen(false);
        setResetKey("");
        setResetFarmer(null);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">All Farmers</h2>
            <AnimatedAlert
                open={alertOpen}
                message={alertMessage}
                type={alertType}
                onClose={() => setAlertOpen(false)}
                duration={1500}
            />
            {loading ? (
                <div>Loading...</div>
            ) : (
                <ViewFarmersTable
                    farmers={farmers}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    handleToggleActive={handleToggleActive}
                    handleResetPassword={handleResetPassword}
                />
            )}

            <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog}>
                <DialogTitle>Password Reset Key</DialogTitle>
                <DialogContent>
                    <Typography gutterBottom>
                        {resetFarmer && (
                            <>
                                Farmer: <b>{resetFarmer.username}</b>
                                <br />
                            </>
                        )}
                        <span style={{ color: "#16a34a", wordBreak: "break-all" }}>
                            Key: <b>{resetKey}</b>
                        </span>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Give this key to the farmer to reset their password.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResetDialog} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ViewFarmersPage;