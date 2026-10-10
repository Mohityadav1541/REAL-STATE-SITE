import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Download, QrCode } from 'lucide-react';
import { adminApi, publicApi } from '../../lib/api';

export default function AdminQRGenerator() {
  const [projectId, setProjectId] = useState('');
  const [plotId, setPlotId] = useState('');

  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => adminApi.getProjects(),
  });

  const { data: plotsData } = useQuery({
    queryKey: ['admin-project-plots', projectsData?.projects?.find(p => p.id === projectId)?.slug],
    queryFn: () => publicApi.getProjectPlots(projectsData?.projects?.find(p => p.id === projectId)?.slug),
    enabled: !!projectId && !!projectsData?.projects,
  });

  // Need to import publicApi properly since it's used here, or use admin route.
  // Actually, we can just use adminApi for getting project plots if we expose it, or just use publicApi.
  // Let's import publicApi.
  
  const generateMutation = useMutation({
    mutationFn: (data) => adminApi.generateQR(data),
    onSuccess: () => {
      toast.success('QR Code generated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to generate QR');
    }
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!projectId) {
      toast.error('Please select a project');
      return;
    }
    generateMutation.mutate({ projectId, plotId: plotId || undefined });
  };

  const qrDataUrl = generateMutation.data?.qrCodeUrl;
  const targetUrl = generateMutation.data?.url;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">QR Code Generator</h1>
          <p className="admin-page-sub">Create tracking QR codes for physical signage</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        
        {/* Generator Form */}
        <div className="admin-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Configuration</h3>
          
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label required">Select Project</label>
              <select 
                className="form-input" 
                value={projectId}
                onChange={(e) => { setProjectId(e.target.value); setPlotId(''); }}
                required
              >
                <option value="">-- Choose Project --</option>
                {projectsData?.projects?.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Select Plot (Optional)</label>
              <select 
                className="form-input" 
                value={plotId}
                onChange={(e) => setPlotId(e.target.value)}
                disabled={!projectId || !plotsData?.plots?.length}
              >
                <option value="">-- Generate for entire project --</option>
                {plotsData?.plots?.map(p => (
                  <option key={p.id} value={p.id}>Plot {p.plotNumber} - {p.status}</option>
                ))}
              </select>
              <span style={{ fontSize: 12, color: '#64748b', marginTop: 4, display: 'block' }}>
                Leave empty to generate a QR for the whole project.
              </span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={generateMutation.isPending || !projectId}
              style={{ marginTop: 8 }}
            >
              {generateMutation.isPending ? 'Generating...' : <><QrCode size={16} /> Generate QR Code</>}
            </button>
          </form>
        </div>

        {/* Result Preview */}
        <div className="admin-card" style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
          {qrDataUrl ? (
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'inline-block', border: '1px solid #e2e8f0', marginBottom: 24 }}>
                <img src={qrDataUrl} alt="Generated QR" style={{ width: 200, height: 200 }} />
              </div>
              
              <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 12, wordBreak: 'break-all', marginBottom: 24, border: '1px solid #e2e8f0' }}>
                <strong>Target URL:</strong><br/>
                <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>
                  {targetUrl}
                </a>
              </div>

              <a 
                href={qrDataUrl} 
                download={`ss-qr-${plotId ? 'plot' : 'project'}.png`}
                className="btn btn-outline"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={16} /> Download PNG
              </a>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <QrCode size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
              <p>Select a project and click Generate<br/>to create a QR code.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
