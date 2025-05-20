import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Logout from "../auth/Logout";
// Navbar component
export default function Navbar() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleHomeClick = (e) => {
        if (user && user.role) {
            e.preventDefault();
            navigate(`/${user.role}`);
        }
        // else, let it go to "/"
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 bg-green-800 text-white">
            <div className="font-bold text-xl">
                <Link to="/" className="text-white no-underline">CSA AFCU</Link>
            </div>
            <div className="flex gap-6">
                <Link
                    to="/"
                    className="text-white hover:text-green-200 transition"
                    onClick={handleHomeClick}
                >
                    Home
                </Link>
                <Link to="/about" className="text-white hover:text-green-200 transition">About</Link>
                <Link to="/contact" className="text-white hover:text-green-200 transition">Contact</Link>
                <Link to="/login" className="text-white hover:text-green-200 transition">Login</Link>
                <Link to="/farmer-signup" className="text-white hover:text-green-200 transition">Sign Up as farmer</Link>
                <Link to="/cooperative-signup" className="text-white hover:text-green-200 transition">Sign Up as cooperative</Link>
            </div>
            <div>
                {user && <Logout />}
            </div>
        </nav>
    );
}