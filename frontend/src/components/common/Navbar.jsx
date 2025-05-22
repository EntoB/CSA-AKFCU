import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import Logout from '../auth/Logout';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupsIcon from '@mui/icons-material/Groups';

// Navbar component
export default function Navbar() {
    const { user } = useAuth();
    return (
        <AppBar position="static" color="success" sx={{ mb: 2 }}>
            <Toolbar>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                    CSA AFCU
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>Home</Button>
                    <Button color="inherit" component={Link} to="/about" startIcon={<InfoIcon />}>About</Button>
                    <Button color="inherit" component={Link} to="/contact" startIcon={<ContactMailIcon />}>Contact</Button>
                    {!user && <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>Login</Button>}
                    {user && <Logout />}
                </Box>
            </Toolbar>
        </AppBar>
    );
}