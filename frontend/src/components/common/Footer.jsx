export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="text-center py-8 bg-green-800 text-white font-poppins -mt-8">
            <p>© {currentYear} CSA AFCU. All rights reserved.</p>
        </footer>
    );
}
