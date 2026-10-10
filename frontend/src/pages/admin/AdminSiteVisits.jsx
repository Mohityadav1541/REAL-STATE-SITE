import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../lib/api';

const STATUS_MAP = {
  'PENDING': { bg: '#ffedd5', color: '#9a3412', label: 'Pending' },
  'CONFIRMED': { bg: '#dbeafe', color: '#1e40af', label: 'Confirmed' },
  'COMPLETED': { bg: '#dcfce7', color: '#166534', label: 'Completed' },
  'CANCELLED': { bg: '#f1f5f9', color: '#475569', label: 'Cancelled' },
};

export default function AdminSiteVisits() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('ALL');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-site-visits'],
    queryFn: () => adminApi.getSiteVisits(),
    refetchInterval: 4000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updateSiteVisit(id, data),
    onSuccess: () => {
      toast.success('Visit status updated');
      queryClient.invalidateQueries(['admin-site-visits']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update visit');
    },
  });

  const handleStatusChange = (id, newStatus) => {
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const visits = data?.siteVisits || [];
  
  const filteredVisits = visits.filter(v => filterStatus === 'ALL' || v.status === filterStatus);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Site Visits</h1>
          <p className="admin-page-sub">Manage customer site visit requests</p>
        </div>
        <select 
          className="form-input" 
          style={{ width: 200 }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Visits</option>
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>
        ) : filteredVisits.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            No site visits found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Interest</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.map((visit) => {
                  const statusCfg = STATUS_MAP[visit.status] || STATUS_MAP.PENDING;
                  return (
                    <tr key={visit.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>
                          {new Date(visit.scheduledDate).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: 13, color: '#64748b' }}>
                          {visit.scheduledTime}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{visit.customer?.name}</div>
                        <div style={{ fontSize: 13 }}>{visit.customer?.mobile}</div>
                      </td>
                      <td>
                        {visit.project ? (
                          <div>
                            <span style={{ fontWeight: 500 }}>{visit.project.name}</span>
                            {visit.plotNumber && <span style={{ color: '#64748b', fontSize: 13 }}> - Plot {visit.plotNumber}</span>}
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>General</span>
                        )}
                      </td>
                      <td>
                        <select 
                          className="form-input" 
                          style={{ 
                            padding: '4px 8px', height: 'auto', fontSize: 12, 
                            fontWeight: 600, background: statusCfg.bg, color: statusCfg.color,
                            border: 'none', borderRadius: 16
                          }}
                          value={visit.status}
                          onChange={(e) => handleStatusChange(visit.id, e.target.value)}
                          disabled={updateMutation.isPending}
                        >
                          {Object.entries(STATUS_MAP).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <div style={{ fontSize: 13, color: '#64748b', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {visit.notes || '-'}
                        </div>
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
