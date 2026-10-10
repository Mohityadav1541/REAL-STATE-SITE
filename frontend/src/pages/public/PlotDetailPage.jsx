import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, MessageCircle, Calendar, XCircle
} from 'lucide-react';
import { publicApi } from '../../lib/api';
import { getProjectWhatsApp } from '../../utils/helpers';
import EnquiryModal from '../../components/EnquiryModal';

export default function PlotDetailPage() {
  const { id } = useParams();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['plot', id],
    queryFn: () => publicApi.getPlot(id),
  });

  if (isLoading) return <div className="page-loader"><span className="spinner spinner-lg" /></div>;
  if (error || !data?.plot) return <div className="error-message">Plot not found</div>;

  const plot = data.plot;
  const project = plot.project;
  const isAvailable = plot.status === 'AVAILABLE';

  return (
    <div className="bg-bg" style={{ minHeight: '100vh', padding: '120px 0 60px' }}>
      <div className="container">
        
        {/* Back navigation */}
        <Link 
          to={`/projects/${project.slug}/plots`} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500, marginBottom: 'var(--space-6)', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} /> Back to Master Plan & Availability
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-8)' }}>
          
          {/* Main Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span className={`badge ${isAvailable ? 'badge-available' : 'badge-sold'}`} style={{ fontSize: 13, padding: '6px 12px' }}>
                <span className={`status-dot ${isAvailable ? 'status-dot-available' : 'status-dot-sold'}`} />
                {plot.status}
              </span>
              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {project.name}
              </span>
            </div>
            
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', letterSpacing: '-0.02em' }}>
              Plot {plot.plotNumber}
            </h1>
            
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                Plot Specifications
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Area</div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{plot.area ? `${plot.area} ${plot.areaUnit}` : 'Available on request'}</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Price</div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{plot.price ? `₹${plot.price.toLocaleString('en-IN')}` : 'Available on request'}</div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr' }}>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Location</div>
                  <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{project.location}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div>
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', border: '1px solid var(--color-border)', position: 'sticky', top: 100 }}>
              
              {isAvailable ? (
                <>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
                    Secure This Plot
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 'var(--space-8)' }}>
                    This plot is currently available. Connect with our sales team to discuss details or arrange a site visit.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <button onClick={() => setEnquiryOpen(true)} className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }}>
                      Enquire Now
                    </button>
                    
                    <a href={getProjectWhatsApp(project.name, plot.plotNumber)} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-lg w-full" style={{ justifyContent: 'center', borderColor: '#25D366', color: '#25D366', padding: '14px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
                      <MessageCircle size={18} /> WhatsApp Sales
                    </a>
                    
                    <Link to={`/site-visit?project=${project.id}&plot=${plot.plotNumber}`} className="btn btn-outline btn-lg w-full" style={{ justifyContent: 'center' }}>
                      <Calendar size={18} /> Book Site Visit
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'var(--space-4)' }}>
                    <XCircle size={32} color="var(--color-text-primary)" />
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
                      SOLD OUT
                    </h3>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 15, marginBottom: 'var(--space-8)' }}>
                    This specific plot is no longer available. We have other premium plots available in this project that might suit your needs.
                  </p>
                  
                  <Link to={`/projects/${project.slug}/plots`} className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }}>
                    View Other Available Plots
                  </Link>
                </>
              )}
              
            </div>
          </div>

        </div>
      </div>

      <EnquiryModal 
        isOpen={enquiryOpen} 
        onClose={() => setEnquiryOpen(false)} 
        project={project}
        plot={plot}
        source="WEBSITE" 
      />
    </div>
  );
}
