import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages: HomePage eager for instant FCP
import HomePage from './pages/public/HomePage';

const ProjectsPage = lazy(() => import('./pages/public/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/public/ProjectDetailPage'));
const PlotAvailabilityPage = lazy(() => import('./pages/public/PlotAvailabilityPage'));
const PlotDetailPage = lazy(() => import('./pages/public/PlotDetailPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const ConnectPage = lazy(() => import('./pages/public/ConnectPage'));
const SiteVisitPage = lazy(() => import('./pages/public/SiteVisitPage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const WhyUsPage = lazy(() => import('./pages/public/WhyUsPage'));
const InvestmentPage = lazy(() => import('./pages/public/InvestmentPage'));

// Admin Pages
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminProjectEdit = lazy(() => import('./pages/admin/AdminProjectEdit'));
const AdminPlots = lazy(() => import('./pages/admin/AdminPlots'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminLeadDetail = lazy(() => import('./pages/admin/AdminLeadDetail'));
const AdminSiteVisits = lazy(() => import('./pages/admin/AdminSiteVisits'));
const AdminQRGenerator = lazy(() => import('./pages/admin/AdminQRGenerator'));

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner spinner-lg" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
  );
}
