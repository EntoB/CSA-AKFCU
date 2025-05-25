import { Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Layout from "./components/common/Layout";
import NotFound from "./components/common/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
// Farmer
import FarmerHome from "./pages/Farmer/FarmerHome";
import FeedbackPage from "./pages/Farmer/FeedbackPage";
import FarmerSignUpForm from "./components/auth/FarmerSignUpForm";
// Cooperative
import CoopHome from "./pages/Cooperative/CoopHome";
import AddFarmerPage from "./pages/Cooperative/AddFarmerPage";
import ViewFarmersPage from "./pages/Cooperative/ViewFarmersPage";
import EnableServicesFarmer from "./pages/Cooperative/EnableServicesFarmer";
import AnnouncementsPage from "./pages/Cooperative/AnnouncementsPage";
import CooperativeSignUpForm from "./components/auth/CooperativeSignUpForm";
// Admin
import AdminHome from "./pages/Admin/AdminHome";
import VisualsPage from "./pages/Admin/Insights/VisualsPage";
import RecommendationsPage from "./pages/Admin/Insights/RecommendationsPage";
import ReportsPage from "./pages/Admin/Insights/ReportsPage";
import AddServicePage from "./pages/Admin/Services/AddServicePage";
import ViewServicesPage from "./pages/Admin/Services/ViewServicesPage";
import EnableServicesPc from "./pages/Admin/Services/EnableServicesPc";
import AddPCPage from "./pages/Admin/PC/AddPCPage";
import EditPCPage from "./pages/Admin/PC/EditPCPage";
import ViewPCPage from "./pages/Admin/PC/ViewPCPage";
import AdminLayout from "./components/admin/AdminLayout";
import CoopLayout from "./components/cooperative/CoopLayout";
import LoginForm from "./components/auth/LoginForm";
import ResetPassword from "./components/auth/ResetPassword";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="cooperative-signup" element={<CooperativeSignUpForm />} />
        <Route path="farmer-signup" element={<FarmerSignUpForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="forgot-password" element={<ResetPassword />} />"
      </Route>

      {/* Farmer Routes */}
      <Route
        path="farmer"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FarmerHome />} />
        <Route path="feedback" element={<FeedbackPage />} />
      </Route>

      {/* Cooperative Routes */}
      <Route
        path="cooperative"
        element={
          <ProtectedRoute allowedRoles={["cooperative"]}>
            <CoopLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CoopHome />} />
        <Route path="add-farmer" element={<AddFarmerPage />} />
        <Route path="view-farmers" element={<ViewFarmersPage />} />
        <Route path="enable-services" element={<EnableServicesFarmer />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="insights/visuals" element={<VisualsPage />} />
        <Route
          path="insights/recommendations"
          element={<RecommendationsPage />}
        />
        <Route path="insights/reports" element={<ReportsPage />} />
        <Route path="services/add" element={<AddServicePage />} />
        <Route path="services/view" element={<ViewServicesPage />} />
        <Route path="services/enable" element={<EnableServicesPc />} />
        <Route path="pc/add" element={<AddPCPage />} />
        <Route path="pc/edit" element={<EditPCPage />} />
        <Route path="pc/view" element={<ViewPCPage />} />
      </Route>

      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppRoutes />
    </LanguageProvider>
  );
}
