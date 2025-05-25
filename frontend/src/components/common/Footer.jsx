import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                py: 4,
                textAlign: "center",
                backgroundColor: "rgba(46, 125, 50, 0.85)", // Same as Navbar
                backdropFilter: "blur(8px)", // Same as Navbar
                color: "white",
                fontFamily: '"Poppins", sans-serif',
                position: "relative",
                zIndex: 1200, // Just below Navbar
                mt: "-32px", // Matches your original negative margin
            }}
        >
            <Typography variant="body1">
                © {currentYear} CSA AFCU. All rights reserved.
            </Typography>
        </Box>
    );
}