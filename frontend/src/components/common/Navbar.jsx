import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { useLanguage } from "../../contexts/LanguageContext";
import Logout from "../auth/Logout";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LoginIcon from "@mui/icons-material/Login";
import LanguageSelector from "../common/LanguageSelector";
import logo from "../../assets/icon.png";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";

export default function Navbar() {
    const { user } = useAuth();
    const { translate } = useLanguage();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [closeTimeout, setCloseTimeout] = useState(null);

    const homeLink = user
        ? user.role === "admin"
            ? "/admin"
            : user.role === "cooperative"
                ? "/cooperative"
                : "/farmer"
        : "/";

    const isActive = (path) => location.pathname === path;

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setMobileOpen(false);
        }, 300);
        setCloseTimeout(timeout);
    };

    const handleMouseEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout);
            setCloseTimeout(null);
        }
    };

    const handleMobileLogout = () => {
        handleDrawerToggle();
        document.getElementById("logout-button")?.click();
    };

    const navItems = [
        {
            text: translate("common.home"),
            icon: <HomeIcon />,
            path: homeLink,
            active: isActive(homeLink),
        },
        {
            text: translate("common.about"),
            icon: <InfoIcon />,
            path: "/about",
            active: isActive("/about"),
        },
        {
            text: translate("common.contact"),
            icon: <ContactMailIcon />,
            path: "/contact",
            active: isActive("/contact"),
        },
        ...(!user
            ? [
                {
                    text: translate("common.login"),
                    icon: <LoginIcon />,
                    path: "/AdminCoop-Login",
                    active: isActive("/AdminCoop-Login"),
                },
            ]
            : []),
    ];

    return (
        <AppBar
            position="fixed"
            sx={{
                mb: 2,
                zIndex: 1201,
                backgroundColor: "rgba(46, 125, 50, 0.85)",
                backdropFilter: "blur(8px)",
                boxShadow: "none",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 24px",
                }}
            >
                {/* Logo Section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        textDecoration: "none",
                        color: "inherit",
                    }}
                    component={Link}
                    to={homeLink}
                >
                    <Box
                        component="img"
                        src={logo}
                        alt="Logo"
                        sx={{
                            height: 40,
                            width: "auto",
                            mr: 1,
                            opacity: 0.9,
                            transition: "opacity 0.3s ease",
                            "&:hover": { opacity: 1 },
                        }}
                    />
                    <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}
                    >
                        CSA AFCU
                    </Typography>
                </Box>

                {/* Desktop Navigation Buttons */}
                <Box
                    sx={{
                        display: { xs: "none", md: "flex" },
                        alignItems: "center",
                        gap: 1,
                        "& .nav-button": {
                            color: "rgba(255, 255, 255, 0.9)",
                            position: "relative",
                            padding: "8px 12px",
                            minWidth: "auto",
                            "&:hover": {
                                color: "#fff",
                                backgroundColor: "transparent",
                                "&::after": { width: "100%", opacity: 1 },
                            },
                            "&::after": {
                                content: '""',
                                position: "absolute",
                                bottom: 6,
                                left: "50%",
                                transform: "translateX(-50%)",
                                width: 0,
                                height: "2px",
                                backgroundColor: "#fff",
                                transition: "all 0.3s ease",
                                opacity: 0,
                            },
                            "&.active": {
                                color: "#fff",
                                "&::after": {
                                    width: "100%",
                                    opacity: 1,
                                },
                            },
                        },
                    }}
                >
                    {navItems.map((item) => (
                        <Button
                            key={item.path}
                            className={`nav-button ${item.active ? "active" : ""}`}
                            component={Link}
                            to={item.path}
                            startIcon={item.icon}
                        >
                            {item.text}
                        </Button>
                    ))}

                    {user && <Logout />}

                    <Box sx={{ ml: 1 }}>
                        <LanguageSelector />
                    </Box>
                </Box>

                {/* Mobile Menu Button */}
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="end"
                    onClick={handleDrawerToggle}
                    sx={{ display: { md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* Mobile Drawer */}
                <Drawer
                    anchor="right"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        "& .MuiDrawer-paper": {
                            width: 240,
                            backgroundColor: "rgba(46, 125, 50, 0.95)",
                            backdropFilter: "blur(8px)",
                            color: "white",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                        },
                    }}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                >
                    {/* Navigation Links */}
                    <Box sx={{ overflow: "auto", flex: 1 }}>
                        <List sx={{ pt: 14 }}>
                            {navItems.map((item) => (
                                <ListItem
                                    key={item.path}
                                    component={Link}
                                    to={item.path}
                                    onClick={handleDrawerToggle}
                                    sx={{
                                        "&.Mui-selected": {
                                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        },
                                        py: 1.5,
                                    }}
                                    selected={item.active}
                                >
                                    <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItem>
                            ))}
                            {user && (
                                <ListItem
                                    onClick={handleMobileLogout}
                                    sx={{ py: 1.5 }}
                                    component="div"
                                >
                                    <ListItemIcon sx={{ color: "inherit", minWidth: "40px" }}>
                                        <Logout sx={{ color: "inherit" }} />
                                    </ListItemIcon>
                                </ListItem>
                            )}
                        </List>
                    </Box>

                    {/* Language Selector */}
                    <Box
                        sx={{
                            p: 2,
                            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "rgba(46, 125, 50, 0.95)",
                        }}
                    >
                        <LanguageSelector mobile />
                    </Box>

                    {/* Hidden logout button */}
                    <div style={{ display: "none" }}>
                        {user && <Logout id="logout-button" />}
                    </div>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
}
