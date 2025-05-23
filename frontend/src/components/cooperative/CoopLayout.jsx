import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Sidebar from "../common/Sidebar";
import Navbar from "../common/Navbar";

export default function CoopLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Sidebar />
            <Navbar />
            <main className="flex-1 py-8 ml-[48px] transition-all duration-200">
                <Outlet /> {/* This renders the cooperative child routes */}
            </main>
            <Footer />
        </div>
    );
}