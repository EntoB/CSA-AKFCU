// Footer component
export default function Footer() {
    return (
        <footer style={{ textAlign: 'center', padding: '1rem', background: '#f5f5f5' }}>
            <p>© {new Date().getFullYear()} CSA AFCU. All rights reserved.</p>
        </footer>
    );
}
