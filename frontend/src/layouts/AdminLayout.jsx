import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Map, Users, Calendar, QrCode, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../utils/helpers';

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/projects', label: 'Projects', icon: Building2 },
  { path: '/admin/plots', label: 'Plot Inventory', icon: Map },
  { path: '/admin/leads', label: 'Leads', icon: Users },
  { path: '/admin/site-visits', label: 'Site Visits', icon: Calendar },
  { path: '/admin/qr', label: 'QR Generator', icon: QrCode },
];

export default function AdminLayout() {
  const { token, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
  };

  const renderSidebar = () => (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header">
        <div className="admin-logo">SS Admin</div>
      </div>
      <nav className="admin-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact 
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <button className="admin-nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      {/* Desktop Sidebar */}
      <aside className="admin-desktop-sidebar">
        {renderSidebar()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="admin-mobile-overlay" onClick={() => setMobileMenuOpen(false)}>
          <aside className="admin-mobile-sidebar" onClick={e => e.stopPropagation()}>
            {renderSidebar()}
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <button className="admin-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="admin-header-title">
            {NAV_ITEMS.find(i => 
              i.exact ? location.pathname === i.path : location.pathname.startsWith(i.path)
            )?.label || 'Admin Panel'}
          </div>
          <div className="admin-user-badge">
            A
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f8fafc;
        }
        .admin-desktop-sidebar {
          width: 260px;
          flex-shrink: 0;
          background: #0f172a;
          color: #f1f5f9;
          display: flex;
          flex-direction: column;
        }
        .admin-sidebar {
          display: flex; flex-direction: column; height: 100%;
        }
        .admin-sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .admin-logo {
          font-family: var(--font-serif);
          font-size: 20px; font-weight: 700;
          color: var(--color-gold-400);
          letter-spacing: 0.05em;
        }
        .admin-nav {
          padding: 24px 16px;
          display: flex; flex-direction: column; gap: 8px;
          flex: 1;
        }
        .admin-nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px;
          border-radius: 8px;
          color: #cbd5e1;
          font-size: 14px; font-weight: 500;
          transition: all 0.2s;
        }
        .admin-nav-item:hover {
          background: rgba(255,255,255,0.05);
          color: #fff;
        }
        .admin-nav-item.active {
          background: var(--color-gold-500);
          color: #0f172a;
        }
        .admin-sidebar-footer {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.1);
        }
        .logout-btn {
          width: 100%; border: none; background: none; cursor: pointer;
          text-align: left;
        }
        .logout-btn:hover { color: #ef4444; background: rgba(239,68,68,0.1); }
        .admin-main {
          flex: 1;
          display: flex; flex-direction: column;
          min-width: 0; /* Important for preventing overflow in flex children */
        }
        .admin-header {
          height: 64px;
          background: #fff;
          border-bottom: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px;
        }
        .admin-menu-btn {
          display: none; border: none; background: none; cursor: pointer;
          color: #475569;
        }
        .admin-header-title {
          font-weight: 600; font-size: 18px; color: #0f172a;
        }
        .admin-user-badge {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--color-gold-100);
          color: var(--color-gold-700);
          display: flex; align-items: center; justify-content: center;
          font-weight: 600; font-size: 16px;
        }
        .admin-content {
          padding: 24px; flex: 1;
          overflow-y: auto;
        }
        
        /* Mobile handling */
        .admin-mobile-overlay {
          display: none;
        }
        @media (max-width: 1024px) {
          .admin-desktop-sidebar { display: none; }
          .admin-menu-btn { display: block; }
          .admin-header { justify-content: flex-start; gap: 16px; padding: 0 16px; }
          .admin-user-badge { margin-left: auto; }
          .admin-mobile-overlay {
            display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
            z-index: 100;
          }
          .admin-mobile-sidebar {
            width: 260px; height: 100%; background: #0f172a;
            color: #f1f5f9;
          }
          .admin-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
