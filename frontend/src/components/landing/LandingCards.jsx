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
import { useLanguage } from "../../contexts/LanguageContext";

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
    const { translate } = useLanguage();

    const cardData = [
        {
            label: translate("landingCards.coopSignup"),
            icon: <GroupAddIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
            to: "/cooperative-signup",
            color: "#e6f4ea",
        },
        {
            label: translate("landingCards.farmerSignup"),
            icon: <PersonAddAlt1Icon sx={{ fontSize: 40, color: "#f59e42" }} />,
            to: "/farmer-signup",
            color: "#fdf6e3",
        },
        {
            label: translate("landingCards.coopLogin"),
            icon: <GroupIcon sx={{ fontSize: 40, color: "#1e293b" }} />,
            to: "/AdminCoop-Login",
            color: "#e0e7ef",
        },
        {
            label: translate("landingCards.farmerLogin"),
            icon: <PersonIcon sx={{ fontSize: 40, color: "#16a34a" }} />,
            to: "/Farmer-Login",
            color: "#e6f4ea",
        },
    ];

    return (
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4, fontFamily: 'Poppins, sans-serif' }}>
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
                                background: `${card.color}A3`,
                                borderRadius: 3,
                                boxShadow: 3,
                                transition: "transform 0.3s",
                                "&:hover": { transform: "scale(1.05)" },
                                minHeight: 100,
                                height: 130,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                fontFamily: 'Poppins, sans-serif', // Apply font to Card
                            }}
                        >
                            <CardActionArea
                                onClick={() => navigate(card.to)}
                                sx={{ height: "100%", fontFamily: 'Poppins, sans-serif' }}
                            >
                                <CardContent
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        py: 4,
                                        fontFamily: 'Poppins, sans-serif',
                                    }}
                                >
                                    {card.icon}
                                    <Typography
                                        variant="h6"
                                        sx={{ mt: 2, fontWeight: "bold", color: "#222", fontFamily: 'Poppins, sans-serif' }}
                                    >
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