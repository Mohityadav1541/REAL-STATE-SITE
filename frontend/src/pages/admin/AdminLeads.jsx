import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { adminApi } from '../../lib/api';

const STATUS_MAP = {
  'NEW': { bg: '#fee2e2', color: '#991b1b', label: 'New' },
  'CONTACTED': { bg: '#fef3c7', color: '#92400e', label: 'Contacted' },
  'INTERESTED': { bg: '#dbeafe', color: '#1e40af', label: 'Interested' },
  'SITE_VISIT_SCHEDULED': { bg: '#e0e7ff', color: '#3730a3', label: 'Visit Scheduled' },
  'NEGOTIATION': { bg: '#fae8ff', color: '#86198f', label: 'Negotiation' },
  'WON': { bg: '#dcfce7', color: '#166534', label: 'Won' },
  'LOST': { bg: '#f1f5f9', color: '#475569', label: 'Lost' },
};

export default function AdminLeads() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-leads'],
    queryFn: () => adminApi.getLeads(),
    refetchInterval: 4000,
  });

  const leads = data?.leads || [];

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'ALL' || lead.status === filterStatus;
    const matchesSearch = search === '' || 
      lead.customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.customer?.mobile.includes(search);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Leads Management</h1>
          <p className="admin-page-sub">Track and manage customer enquiries</p>
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="text" 
                className="form-input" 
                placeholder="Search by name or mobile..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
          
          <div style={{ flex: '0 0 200px' }}>
            <select 
              className="form-input" 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
        ) : filteredLeads.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            No leads found matching your criteria.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Interest</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => {
                  const statusCfg = STATUS_MAP[lead.status] || STATUS_MAP.NEW;
                  
                  return (
                    <tr key={lead.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{lead.customer?.name}</div>
                      </td>
                      <td>
                        <div>{lead.customer?.mobile}</div>
                      </td>
                      <td>
                        {lead.project ? (
                          <div>
                            <span style={{ fontWeight: 500 }}>{lead.project.name}</span>
                            {lead.plot && <span style={{ color: '#64748b', fontSize: 13 }}> - Plot {lead.plot.plotNumber}</span>}
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>General Enquiry</span>
                        )}
                      </td>
                      <td>
                        <span style={{ fontSize: 12, background: '#f1f5f9', padding: '2px 8px', borderRadius: 12 }}>
                          {lead.source}
                        </span>
                      </td>
                      <td>
                        <span 
                          style={{ 
                            fontSize: 12, fontWeight: 600, padding: '4px 10px', 
                            borderRadius: 16, background: statusCfg.bg, color: statusCfg.color 
                          }}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: '#64748b' }}>
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Link to={`/admin/leads/${lead.id}`} className="btn btn-outline btn-sm">
                          <Eye size={14} /> View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
