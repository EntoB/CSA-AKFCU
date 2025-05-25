import React from "react";
import { Box, Typography, Container, Paper, Grid, Avatar } from "@mui/material";
import { EmojiObjects, Analytics, ThumbUp, Group } from "@mui/icons-material";

const About = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                position: 'relative',
                overflow: 'hidden',
                fontFamily: 'Poppins, Roboto, Arial, sans-serif',
                py: 6,
                bgcolor: '#f0fdf4', // Tailwind green-100
            }}
        >
            {/* Animated background shapes */}
            <Box sx={{
                position: 'absolute',
                top: '-80px',
                left: '-80px',
                width: 300,
                height: 300,
                bgcolor: 'primary.light',
                opacity: 0.18,
                borderRadius: '50%',
                filter: 'blur(8px)',
                animation: 'float1 8s ease-in-out infinite',
                zIndex: 0,
            }} />
            <Box sx={{
                position: 'absolute',
                bottom: '-100px',
                right: '-100px',
                width: 350,
                height: 350,
                bgcolor: 'secondary.light',
                opacity: 0.15,
                borderRadius: '50%',
                filter: 'blur(12px)',
                animation: 'float2 10s ease-in-out infinite',
                zIndex: 0,
            }} />
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box textAlign="center" mb={6}>
                    <Typography
                        variant="h3"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontFamily: 'Poppins, Roboto, Arial, sans-serif',
                            fontWeight: 800,
                            letterSpacing: 1.5,
                            color: '#2e7d32', // Material UI green[800]
                            textTransform: 'uppercase',
                            textShadow: '0 2px 8px rgba(25, 118, 210, 0.08)'
                        }}
                    >
                        Afran Qalloo Farmers' Cooperative Union (AFCU)
                    </Typography>
                    <Typography
                        variant="h6"
                        color="textSecondary"
                        sx={{
                            fontFamily: 'Poppins, Roboto, Arial, sans-serif',
                            fontWeight: 500,
                            letterSpacing: 1.2,
                            color: 'primary.main',
                        }}
                    >
                        Empowering Farmers Sentiment Analysis Through Machine Learning
                    </Typography>
                </Box>

                <Paper elevation={3} sx={{ p: 4, mb: 6, backgroundColor: "#e0f7fa", fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>
                    <Typography variant="body1" paragraph sx={{ fontSize: 18, fontWeight: 400, color: '#333', fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>
                        Afran Qalloo Farmers' Cooperative Union (AFCU) is dedicated to improving agricultural productivity and member satisfaction through <strong>Machine Learning and Data Analytics</strong>. Our mission is to enhance service quality by analyzing customer feedback and optimizing cooperative operations.
                    </Typography>
                </Paper>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif', fontWeight: 700, letterSpacing: 1.2 }}>
                        How We Use <span style={{ color: "#1976d2" }}>Machine Learning</span> to Enhance Services
                    </Typography>
                    <Grid container spacing={4} justifyContent="center">
                        {[
                            {
                                icon: <Analytics fontSize="large" color="primary" sx={{ animation: 'icon-bounce 2.5s infinite' }} />,
                                title: "Sentiment Analysis",
                                desc: "We analyze member feedback to detect satisfaction levels and identify areas for improvement.",
                            },
                            {
                                icon: <EmojiObjects fontSize="large" color="primary" sx={{ animation: 'icon-spin 3s linear infinite' }} />,
                                title: "Predictive Insights",
                                desc: "Using historical data, we predict trends to optimize resource allocation and service delivery.",
                            },
                            {
                                icon: <ThumbUp fontSize="large" color="primary" sx={{ animation: 'icon-bounce 2.2s 0.5s infinite' }} />,
                                title: "Personalized Services",
                                desc: "Tailoring support based on individual farmer needs to maximize satisfaction.",
                            },
                            {
                                icon: <Group fontSize="large" color="primary" sx={{ animation: 'icon-spin 4s linear infinite' }} />,
                                title: "Community-Driven Decisions",
                                desc: "Ensuring cooperative policies align with the real needs of our members.",
                            },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <Box textAlign="center" p={2}>
                                    <Avatar sx={{ bgcolor: "background.paper", mb: 2, width: 60, height: 60, boxShadow: 3 }}>
                                        {item.icon}
                                    </Avatar>
                                    <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif', fontWeight: 600 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif', fontWeight: 400 }}>
                                        {item.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Paper elevation={4} sx={{ p: 4, backgroundColor: "#e0f7fa", fontFamily: 'Poppins, Roboto, Arial, sans-serif' }}>
                    <Typography variant="h5" gutterBottom sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif', fontWeight: 700 }}>
                        Our Vision
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ fontFamily: 'Poppins, Roboto, Arial, sans-serif', fontWeight: 400, fontSize: 18, color: '#333' }}>
                        To enhance the services of the Afran Qalloo Farmers' Cooperative Union using machine learning based customer satisfaction analysis.
                    </Typography>
                </Paper>
            </Container>
            {/* Keyframes for icon and background animation */}
            <style>{`
        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes icon-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(30px) scale(1.08); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
      `}</style>
        </Box>
    );
};

export default About;