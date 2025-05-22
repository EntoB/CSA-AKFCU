import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { motion } from "framer-motion";

const cardData = [
    {
        label: "Sign Up as Cooperative",
        icon: <GroupAddIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
        to: "/cooperative-signup",
        color: "#e6f4ea",
    },
    {
        label: "Sign Up as Farmer",
        icon: <PersonAddAlt1Icon sx={{ fontSize: 40, color: "#f59e42" }} />,
        to: "/farmer-signup",
        color: "#fdf6e3",
    },
    {
        label: "Login as Cooperative",
        icon: <GroupIcon sx={{ fontSize: 40, color: "#1e293b" }} />,
        to: "/login",
        color: "#e0e7ef",
    },
    {
        label: "Login as Farmer",
        icon: <PersonIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
        to: "/login",
        color: "#e6f4ea",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            type: "spring",
            stiffness: 80,
            damping: 12,
        },
    }),
};

const LandingCards = () => {
    const navigate = useNavigate();

    return (
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            {cardData.map((card, i) => (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                    <motion.div
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={cardVariants}
                    >
                        <Card
                            sx={{
                                background: `${card.color}A3`, // Add transparency (CC = 80% opacity)
                                borderRadius: 3,
                                boxShadow: 3,
                                transition: "transform 0.3s",
                                "&:hover": { transform: "scale(1.05)" },
                                // Adjust height here:
                                minHeight: 100, // You can change this value as needed
                                height: 130,    // Or set a fixed height
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                        >
                            <CardActionArea onClick={() => navigate(card.to)} sx={{ height: "100%" }}>
                                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4 }}>
                                    {card.icon}
                                    <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold", color: "#222" }}>
                                        {card.label}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </motion.div>
                </Grid>
            ))}
        </Grid>
    );
};

export default LandingCards;