import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Logout from "../auth/Logout";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupsIcon from "@mui/icons-material/Groups";
import LanguageSelector from "../common/LanguageSelector"; // ✅ Import LanguageSelector

export default function Navbar() {
    const { user } = useAuth();
    const { translate } = useLanguage();

    const homeLink = user
        ? user.role === "admin"
            ? "/admin"
            : user.role === "cooperative"
                ? "/cooperative"
                : "/farmer"
        : "/";

    return (
        <AppBar position="fixed" color="success" sx={{ mb: 2, zIndex: 1201 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to={homeLink}
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        fontWeight: "bold",
                    }}
                >
                    CSA AFCU
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Button
                        color="inherit"
                        component={Link}
                        to={homeLink}
                        startIcon={<HomeIcon />}
                    >
                        {translate("common.home")}
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/about"
                        startIcon={<InfoIcon />}
                    >
                        {translate("common.about")}
                    </Button>
                    <Button
                        color="inherit"
                        component={Link}
                        to="/contact"
                        startIcon={<ContactMailIcon />}
                    >
                        {translate("common.contact")}
                    </Button>
                    {!user && (
                        <Button
                            color="inherit"
                            component={Link}
                            to="/login"
                            startIcon={<LoginIcon />}
                        >
                            {translate("common.login")}
                        </Button>
                    )}
                    {user && <Logout />}

                    <Box sx={{ ml: 2 }}>
                        <LanguageSelector />{" "}
                        {/* ✅ Add LanguageSelector inline in the navbar */}
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
