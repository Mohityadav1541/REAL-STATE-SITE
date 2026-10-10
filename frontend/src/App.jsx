import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import ProjectsPage from './pages/public/ProjectsPage';
import ProjectDetailPage from './pages/public/ProjectDetailPage';
import PlotAvailabilityPage from './pages/public/PlotAvailabilityPage';
import PlotDetailPage from './pages/public/PlotDetailPage';
import ContactPage from './pages/public/ContactPage';
import ConnectPage from './pages/public/ConnectPage';
import SiteVisitPage from './pages/public/SiteVisitPage';
import AboutPage from './pages/public/AboutPage';
import WhyUsPage from './pages/public/WhyUsPage';
import InvestmentPage from './pages/public/InvestmentPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectEdit from './pages/admin/AdminProjectEdit';
import AdminPlots from './pages/admin/AdminPlots';
import AdminLeads from './pages/admin/AdminLeads';
import AdminLeadDetail from './pages/admin/AdminLeadDetail';
import AdminSiteVisits from './pages/admin/AdminSiteVisits';
import AdminQRGenerator from './pages/admin/AdminQRGenerator';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:slug" element={<ProjectDetailPage />} />
        <Route path="projects/:slug/plots" element={<PlotAvailabilityPage />} />
        <Route path="plots/:id" element={<PlotDetailPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="connect" element={<ConnectPage />} />
        <Route path="site-visit" element={<SiteVisitPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="why-us" element={<WhyUsPage />} />
        <Route path="investment" element={<InvestmentPage />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminProjectEdit />} />
        <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
        <Route path="plots" element={<AdminPlots />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="leads/:id" element={<AdminLeadDetail />} />
        <Route path="site-visits" element={<AdminSiteVisits />} />
        <Route path="qr" element={<AdminQRGenerator />} />
      </Route>
    </Routes>
  );
}
