import React from "react";
import LandingCards from "../components/landing/LandingCards";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import farmImg from "../assets/farm.jpg"; // Ensure this path is correct
const LandingPage = () => (
    <Box
        sx={{
            height: "100vh",
            backgroundImage: `
                linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0)),
                url(${farmImg})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            marginTop: "-50px",
        }}
    >
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ marginTop: "5vh" }} // slight top margin for breathing space
        >
            <Typography variant="h3" fontWeight="bold" gutterBottom>
                Welcome to Afran Qalloo FCU
            </Typography>
            <Typography variant="h6" gutterBottom>
                Customer Satisfaction Analysis Platform
            </Typography>
            <Typography variant="subtitle1" sx={{ maxWidth: 600, margin: "0 auto", mt: 1 }}>
                Empowering better service delivery through real-time feedback and smart insights.
            </Typography>
        </motion.div>

        <LandingCards />
    </Box>
);

export default LandingPage;
