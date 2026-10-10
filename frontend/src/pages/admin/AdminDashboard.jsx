import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { 
  Building2, Users, Calendar, ArrowRight, BarChart3, 
  RefreshCw, CheckCircle2, Compass 
} from 'lucide-react';
import { adminApi } from '../../lib/api';

export default function AdminDashboard() {
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
    refetchInterval: 4000, // Live real-time update every 4 seconds
    refetchIntervalInBackground: true,
  });

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    await refetch();
    setTimeout(() => setIsManualRefreshing(false), 500);
  };

  const stats = data?.stats;
  const recentLeads = data?.recentLeads || [];
  const recentSiteVisits = data?.recentSiteVisits || [];
  const recentCustomers = data?.recentCustomers || [];

  const totalProjects = stats?.totalProjects ?? stats?.projects?.total ?? 0;
  const totalPlots = stats?.totalPlots ?? stats?.plots?.total ?? 0;
  const availablePlots = stats?.availablePlots ?? stats?.plots?.AVAILABLE ?? 0;
  const holdPlots = stats?.holdPlots ?? stats?.plots?.HOLD ?? 0;
  const bookedPlots = stats?.bookedPlots ?? stats?.plots?.BOOKED ?? 0;
  const soldPlots = stats?.soldPlots ?? stats?.plots?.SOLD ?? 0;
  const totalCustomers = stats?.totalCustomers ?? stats?.customers?.total ?? recentCustomers.length ?? 0;
  const totalLeads = stats?.totalLeads ?? stats?.leads?.total ?? 0;
  const newLeads = stats?.newLeads ?? stats?.leads?.NEW ?? 0;
  const totalSiteVisits = stats?.totalSiteVisits ?? stats?.siteVisits?.total ?? 0;
  const pendingSiteVisits = stats?.pendingSiteVisits ?? stats?.siteVisits?.PENDING ?? 0;

  // Percentage calculation for plot status breakdown
  const availablePct = totalPlots > 0 ? Math.round((availablePlots / totalPlots) * 100) : 0;
  const holdPct = totalPlots > 0 ? Math.round((holdPlots / totalPlots) * 100) : 0;
  const bookedPct = totalPlots > 0 ? Math.round((bookedPlots / totalPlots) * 100) : 0;
  const soldPct = totalPlots > 0 ? Math.round((soldPlots / totalPlots) * 100) : 0;

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 12, background: '#e2e8f0' }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 350, borderRadius: 12, background: '#e2e8f0' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page" style={{ padding: 24 }}>
        <div className="admin-login-error" style={{ textAlign: 'left', padding: 20 }}>
          <strong>Error loading dashboard statistics:</strong> {error.message || 'Please verify database connection.'}
          <div style={{ marginTop: 12 }}>
            <button className="btn btn-primary btn-sm" onClick={() => refetch()}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: totalProjects,
      subtext: 'Active developments',
      icon: Building2,
      color: 'blue',
      link: '/admin/projects',
    },
    {
      title: 'Available Plots',
      value: availablePlots,
      subtext: `${totalPlots} total inventory`,
      icon: BarChart3,
      color: 'emerald',
      link: '/admin/plots',
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      subtext: 'Registered contacts',
      icon: Users,
      color: 'indigo',
      link: '/admin/leads',
    },
    {
      title: 'Total Enquiries',
      value: totalLeads,
      subtext: `${newLeads} new leads today`,
      icon: CheckCircle2,
      color: 'amber',
      link: '/admin/leads',
    },
    {
      title: 'Site Visits',
      value: totalSiteVisits,
      subtext: `${pendingSiteVisits} pending review`,
      icon: Calendar,
      color: 'purple',
      link: '/admin/site-visits',
    },
  ];

  return (
    <div className="dashboard" style={{ paddingBottom: 40 }}>
      {/* Header with Live Status Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#0f172a', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 14 }}>Real-time overview of projects, plots inventory, and customer enquiries</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Live Indicator Pill */}
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              padding: '6px 14px', 
              background: '#ecfdf5', 
              border: '1px solid #a7f3d0', 
              borderRadius: 20, 
              fontSize: 13, 
              fontWeight: 600, 
              color: '#065f46' 
            }}
          >
            <span 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%', 
                background: '#10b981', 
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.3)',
                display: 'inline-block',
                animation: 'pulse 1.8s infinite'
              }} 
            />
            Live Updates Active
          </div>

          <button 
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleManualRefresh}
            disabled={isManualRefreshing}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={14} className={isManualRefreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-card-header">
              <div>
                <div className="stat-title">{stat.title}</div>
                <div className="stat-value">{stat.value}</div>
              </div>
              <div className={`stat-icon bg-${stat.color}-100 text-${stat.color}-600`}>
                <stat.icon size={22} />
              </div>
            </div>
            <div className="stat-card-footer">
              <span className="stat-subtext">{stat.subtext}</span>
              <Link to={stat.link} className="stat-link">
                View <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Live Plots Inventory Status Bar */}
      <div className="dashboard-panel" style={{ marginTop: 24, padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#0f172a' }}>Live Plot Status Distribution</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
              Total {totalPlots} plots across all industrial projects
            </p>
          </div>
          <Link to="/admin/plots" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>Manage Inventory</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ height: 14, borderRadius: 7, overflow: 'hidden', background: '#f1f5f9', display: 'flex', width: '100%', marginBottom: 16 }}>
          <div style={{ width: `${availablePct}%`, background: '#10b981', transition: 'width 0.4s ease' }} title={`Available: ${availablePlots} (${availablePct}%)`} />
          <div style={{ width: `${holdPct}%`, background: '#f59e0b', transition: 'width 0.4s ease' }} title={`Hold: ${holdPlots} (${holdPct}%)`} />
          <div style={{ width: `${bookedPct}%`, background: '#3b82f6', transition: 'width 0.4s ease' }} title={`Booked: ${bookedPlots} (${bookedPct}%)`} />
          <div style={{ width: `${soldPct}%`, background: '#64748b', transition: 'width 0.4s ease' }} title={`Sold: ${soldPlots} (${soldPct}%)`} />
        </div>

        {/* Status Pills Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>Available</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#166534' }}>{availablePlots} <span style={{ fontSize: 12, fontWeight: 500 }}>({availablePct}%)</span></div>
          </div>

          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#92400e' }}>Hold</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#92400e' }}>{holdPlots} <span style={{ fontSize: 12, fontWeight: 500 }}>({holdPct}%)</span></div>
          </div>

          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#1e40af' }}>Booked</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1e40af' }}>{bookedPlots} <span style={{ fontSize: 12, fontWeight: 500 }}>({bookedPct}%)</span></div>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: 12, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#64748b' }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>Sold</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#334155' }}>{soldPlots} <span style={{ fontSize: 12, fontWeight: 500 }}>({soldPct}%)</span></div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Leads & Recent Site Visits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24, marginTop: 24 }}>
        
        {/* Recent Customer Inquiries / Leads */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#0f172a' }}>Live Customer Enquiries</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>Latest incoming leads</span>
            </div>
            <Link to="/admin/leads" className="btn btn-outline btn-sm">View All Leads</Link>
          </div>

          {recentLeads.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>No recent customer enquiries yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Interest</th>
                    <th>Direction/Plot</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{lead.customer?.name || 'Anonymous'}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{lead.customer?.mobile || '-'}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lead.project ? lead.project.name : 'General Inquiry'}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>via {lead.source}</div>
                      </td>
                      <td>
                        {lead.plot ? (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#f1f5f9', padding: '3px 8px', borderRadius: 4, fontSize: 12 }}>
                            <Compass size={12} color="#0284c7" />
                            <span>Plot {lead.plot.plotNumber} {lead.plot.facing ? `(${lead.plot.facing})` : ''}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 12 }}>-</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${lead.status === 'NEW' ? 'badge-hold' : lead.status === 'CONTACTED' ? 'badge-booked' : 'badge-available'}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap' }}>
                        {new Date(lead.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Site Visits */}
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#0f172a' }}>Site Visit Requests</h3>
              <span style={{ fontSize: 12, color: '#64748b' }}>Customer site inspection schedules</span>
            </div>
            <Link to="/admin/site-visits" className="btn btn-outline btn-sm">View All Visits</Link>
          </div>

          {recentSiteVisits.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#64748b' }}>No site visit requests logged.</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Project</th>
                    <th>Visit Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSiteVisits.map((visit) => (
                    <tr key={visit.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{visit.customer?.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{visit.customer?.mobile}</div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{visit.project?.name || 'Project Site'}</div>
                        {visit.plot && <div style={{ fontSize: 11, color: '#64748b' }}>Plot #{visit.plot.plotNumber}</div>}
                      </td>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#0f172a' }}>{visit.preferredDate || 'Date TBD'}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{visit.preferredTime || 'Time TBD'}</div>
                      </td>
                      <td>
                        <span className={`badge ${visit.status === 'REQUESTED' ? 'badge-hold' : visit.status === 'CONFIRMED' ? 'badge-available' : 'badge-sold'}`}>
                          {visit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        .spin {
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .stat-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
        }
        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        .stat-title {
          font-size: 13px;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 6px;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.1;
        }
        .stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-blue-100 { background: #dbeafe; } .text-blue-600 { color: #2563eb; }
        .bg-emerald-100 { background: #d1fae5; } .text-emerald-600 { color: #059669; }
        .bg-indigo-100 { background: #e0e7ff; } .text-indigo-600 { color: #4f46e5; }
        .bg-amber-100 { background: #fef3c7; } .text-amber-600 { color: #d97706; }
        .bg-purple-100 { background: #f3e8ff; } .text-purple-600 { color: #7c3aed; }
        .stat-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }
        .stat-subtext {
          font-size: 12px;
          color: #64748b;
        }
        .stat-link {
          font-size: 12px;
          font-weight: 600;
          color: #d97706;
          display: flex;
          align-items: center;
          gap: 4px;
          text-decoration: none;
        }
        .stat-link:hover {
          color: #b45309;
        }
        .dashboard-panel {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .dashboard-panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #e2e8f0;
          background: #fafafa;
        }
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
        }
        .admin-table th {
          background: #f8fafc;
          padding: 10px 16px;
          text-align: left;
          font-weight: 600;
          color: #475569;
          border-bottom: 1px solid #e2e8f0;
        }
        .admin-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #f1f5f9;
          vertical-align: middle;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 600;
        }
        .badge-available { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-hold { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
        .badge-booked { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .badge-sold { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
      `}</style>
    </div>
  );
}
