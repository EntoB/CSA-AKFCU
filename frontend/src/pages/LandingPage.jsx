import React from "react";
import LandingCards from "../components/landing/LandingCards";
import { Box, Typography, Container, Stack, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import farmImg from "../assets/farm.jpg";
import { useLanguage } from "../contexts/LanguageContext";

// Add this in your global CSS file or create a separate CSS module
// Alternatively, you can use a <style> tag in your index.html
const styles = `
  @font-face {
    font-family: 'poppins';
    src: url('/fonts/poppins-Regular.woff2') format('woff2'),
         url('/fonts/poppins-Regular.woff') format('woff');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: 'poppins', sans-serif;
  }
`;

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
        },
    },
};

const textGlow = {
    hidden: { textShadow: "0 0 0px rgba(255,255,255,0)" },
    visible: {
        textShadow: [
            "0 0 0px rgba(255,255,255,0)",
            "0 0 10px rgba(255,255,255,0.4)",
            "0 0 0px rgba(255,255,255,0)",
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
        },
    },
};

const LandingPage = () => {
    const theme = useTheme();
    const { translate } = useLanguage();

    return (
        <>
            <style>{styles}</style>
            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    paddingTop: "64px",
                    backgroundImage: `
            linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.4)),
            url(${farmImg})
          `,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundAttachment: { xs: "scroll", sm: "fixed" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    position: "relative",
                    overflow: "auto",
                    fontFamily: '"poppins", sans-serif !important',
                }}
            >
                {/* Particles - Reduced number on mobile */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * 200 - 100,
                            y: Math.random() * 200 - 100,
                            opacity: 0,
                        }}
                        animate={{
                            x: [null, Math.random() * 300 - 150],
                            y: [null, Math.random() * 300 - 150],
                            opacity: [0, 0.3, 0],
                            rotate: 360,
                        }}
                        transition={{
                            duration: Math.random() * 10 + 8,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "linear",
                        }}
                        style={{
                            position: "absolute",
                            width: "3px",
                            height: "3px",
                            borderRadius: "50%",
                            background: "#fff",
                            zIndex: 0,
                            display: { xs: "none", sm: "block" },
                        }}
                    />
                ))}

                {/* Main Content */}
                <Container
                    maxWidth="lg"
                    component={motion.div}
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    sx={{
                        py: 4,
                        minHeight: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        px: { xs: 2, sm: 3, md: 4 },
                        fontFamily: '"poppins", sans-serif !important',
                    }}
                >
                    <Stack
                        spacing={{ xs: 1.5, sm: 2, md: 3 }}
                        alignItems="center"
                        textAlign="center"
                        sx={{ zIndex: 1, fontFamily: '"poppins", sans-serif !important' }}
                    >
                        {/* Title */}
                        <motion.div variants={itemVariants}>
                            <Typography
                                component={motion.h1}
                                variants={textGlow}
                                variant="h2"
                                fontWeight="bold"
                                sx={{
                                    fontSize: { xs: "1.8rem", sm: "3rem", md: "3.5rem" },
                                    background: "linear-gradient(90deg, #ffffff, #b2fab4)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    textTransform: "uppercase",
                                    letterSpacing: { xs: "0.5px", sm: "2px" },
                                    position: "relative",
                                    fontFamily: '"poppins", sans-serif !important',
                                    lineHeight: { xs: 1.2, sm: 1.3 },
                                    "&::after": {
                                        content: '""',
                                        position: "absolute",
                                        bottom: -8,
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: { xs: "60px", sm: "120px" },
                                        height: "2px",
                                        background:
                                            "linear-gradient(90deg, transparent, #66bb6a, transparent)",
                                    },
                                }}
                            >
                                {translate("landing.welcomeTitle")}
                            </Typography>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.div variants={itemVariants}>
                            <Typography
                                component={motion.h2}
                                variant="h5"
                                sx={{
                                    fontWeight: 300,
                                    fontStyle: "italic",
                                    letterSpacing: "1px",
                                    textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                                    fontFamily: '"poppins", sans-serif !important',
                                    fontSize: { xs: "1rem", sm: "1.5rem" },
                                    px: { xs: 1, sm: 0 },
                                    lineHeight: { xs: 1.3, sm: 1.5 },
                                }}
                            >
                                {translate("landing.subtitle")}
                            </Typography>
                        </motion.div>

                        {/* Description */}
                        <motion.div variants={itemVariants}>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    maxWidth: 650,
                                    fontSize: { xs: "0.9rem", sm: "1.15rem" },
                                    lineHeight: { xs: 1.6, sm: 1.8 },
                                    fontFamily: '"poppins", sans-serif !important',
                                    "&::first-letter": {
                                        fontSize: { xs: "1.3em", sm: "1.5em" },
                                        color: "#81c784",
                                        fontWeight: "bold",
                                    },
                                    px: { xs: 1, sm: 0 },
                                }}
                            >
                                {translate("landing.description")}
                            </Typography>
                        </motion.div>

                        {/* Cards Section */}
                        <motion.div
                            variants={itemVariants}
                            style={{
                                width: "100%",
                                maxWidth: "1200px",
                                marginBottom: "2rem",
                                padding: "0 8px",
                            }}
                        >
                            <LandingCards />
                        </motion.div>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default LandingPage;
