import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAuth } from "../../contexts/authContext";

export default function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Navbar />
            <main className="min-h-screen flex-1 py-8">
                <Outlet /> {/* This renders the child routes */}
            </main>
            <Footer />
        </div>
    );
}