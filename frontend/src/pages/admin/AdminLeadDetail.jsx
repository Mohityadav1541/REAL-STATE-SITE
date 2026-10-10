import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { ChevronLeft, User, Phone, Mail, MapPin, Building2, Save } from 'lucide-react';
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

export default function AdminLeadDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-lead', id],
    queryFn: () => adminApi.getLead(id),
    onSuccess: (data) => {
      if (data?.lead && !status) {
        setStatus(data.lead.status);
        setNotes(data.lead.notes || '');
      }
    }
  });

  const updateMutation = useMutation({
    mutationFn: (updateData) => adminApi.updateLead(id, updateData),
    onSuccess: () => {
      toast.success('Lead updated successfully');
      queryClient.invalidateQueries(['admin-lead', id]);
      queryClient.invalidateQueries(['admin-leads']);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update lead');
    }
  });

  if (isLoading) return <div style={{ padding: 40, textAlign: 'center' }}><span className="spinner" /></div>;
  if (error) return <div className="error-message">Failed to load lead details.</div>;

  const lead = data?.lead;
  if (!lead) return null;

  // Initialize state if not done by onSuccess
  if (status === '' && lead.status) setStatus(lead.status);
  if (notes === '' && lead.notes) setNotes(lead.notes);

  const handleSave = () => {
    updateMutation.mutate({ status, notes });
  };

  const statusCfg = STATUS_MAP[lead.status] || STATUS_MAP.NEW;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Link to="/admin/leads" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: 14, marginBottom: 8 }}>
            <ChevronLeft size={16} /> Back to Leads
          </Link>
          <h1 className="admin-page-title">Lead Details</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: '#64748b' }}>Created: {new Date(lead.createdAt).toLocaleString()}</span>
          <span style={{ 
            fontSize: 12, fontWeight: 600, padding: '4px 10px', 
            borderRadius: 16, background: statusCfg.bg, color: statusCfg.color 
          }}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        
        {/* Customer Details */}
        <div className="admin-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
            Customer Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <User size={18} color="#94a3b8" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</div>
                <div style={{ fontWeight: 500 }}>{lead.customer?.name}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Phone size={18} color="#94a3b8" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mobile</div>
                <div style={{ fontWeight: 500 }}>
                  <a href={`tel:${lead.customer?.mobile}`} style={{ color: '#2563eb' }}>{lead.customer?.mobile}</a>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Mail size={18} color="#94a3b8" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</div>
                <div>{lead.customer?.email || '-'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Details */}
        <div className="admin-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
            Enquiry Details
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Building2 size={18} color="#94a3b8" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Interest</div>
                <div style={{ fontWeight: 500 }}>{lead.project?.name || 'General Enquiry'}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <MapPin size={18} color="#94a3b8" style={{ marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plot Interest</div>
                <div style={{ fontWeight: 500 }}>
                  {lead.plot ? `Plot ${lead.plot.plotNumber} (${lead.plot.status})` : 'Any Plot'}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 18, display: 'flex', justifyContent: 'center' }}>
                <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 700 }}>#</span>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source</div>
                <div style={{ display: 'inline-block', background: '#f1f5f9', padding: '2px 8px', borderRadius: 4, fontSize: 13, marginTop: 4 }}>
                  {lead.source}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action & Notes */}
        <div className="admin-card" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12 }}>
            Manage Lead
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <label className="form-label">Current Status</label>
              <select 
                className="form-input" 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.entries(STATUS_MAP).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Sales Notes</label>
              <textarea 
                className="form-textarea" 
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add conversation notes, follow-up reminders, etc."
              />
            </div>
          </div>

          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
