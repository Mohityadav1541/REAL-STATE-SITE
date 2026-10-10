import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { 
  MapPin, CheckCircle,
  Download, MessageCircle, Calendar, FileText, Map
} from 'lucide-react';
import { publicApi } from '../../lib/api';
import { getProjectWhatsApp } from '../../utils/helpers';
import EnquiryModal from '../../components/EnquiryModal';
import InteractiveMasterPlan from '../../components/InteractiveMasterPlan';
import { usePlotsStream } from '../../hooks/usePlotsStream';
import 'leaflet/dist/leaflet.css';

// Fix for leaflet markers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => publicApi.getProject(slug)
  });

  const { data: plotsData } = useQuery({
    queryKey: ['project-plots', slug],
    queryFn: () => publicApi.getProjectPlots(slug),
  });

  usePlotsStream(slug);

  useEffect(() => {
    if (data?.project) {
      document.title = `${data.project.name} – SS Developers`;
    }
  }, [data]);

  if (isLoading) return <div className="page-loader"><span className="spinner spinner-lg" /></div>;
  if (!data?.project) return <div className="error-message">Project not found</div>;

  const project = data.project;
  const plots = plotsData?.plots || [];
  
  const heroImage = project.images?.find(i => i.type === 'HERO')?.url || 'https://images.unsplash.com/photo-1586528116311-ad8ed745d44c?q=80&w=2070';
  const masterPlan = project.images?.find(i => i.type === 'MASTER_PLAN')?.url || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=2070';
  const gallery = project.images?.filter(i => i.type === 'GALLERY') || [];

  const availableCount = plots.filter(p => p.status === 'AVAILABLE').length;

  return (
    <div className="project-detail">
      {/* 1. PROJECT HERO */}
      <section className="project-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="project-hero-overlay" />
        <div className="container project-hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, color: 'var(--color-cream-100)', marginBottom: 24, letterSpacing: '0.05em' }}>
            <MapPin size={14} /> {project.location}
          </div>
          <h1 className="project-hero-title">{project.name}</h1>
          <p className="project-hero-subtitle">
            {project.tagline || 'Strategically located industrial plots with direct highway connectivity.'}
          </p>
          
          <div className="project-hero-actions">
            <Link to={`/projects/${project.slug}/plots`} className="btn btn-primary btn-lg">
              View Available Plots
            </Link>
            <Link to={`/site-visit?project=${project.id}`} className="btn btn-outline-light btn-lg">
              Book Site Visit
            </Link>
            <a href={getProjectWhatsApp(project.name)} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg hidden-mobile" style={{ background: '#25D366', color: '#fff', borderColor: '#25D366' }}>
              <MessageCircle size={18} /> WhatsApp Sales
            </a>
          </div>
        </div>
      </section>

      {/* 2. PROJECT OVERVIEW & 3. HIGHLIGHTS */}
      <section className="section bg-light">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-10)' }} className="project-overview-grid">
            
            {/* Overview */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', fontWeight: 500, letterSpacing: '-0.02em' }}>
                Project Overview
              </h2>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                {project.description || 'Welcome to an officially approved industrial zone designed for seamless manufacturing and logistics operations. With excellent heavy-vehicle accessibility, continuous power supply, and robust infrastructure, this project provides a solid foundation for business growth.'}
              </div>
            </div>

            {/* Highlights Box */}
            <div>
              <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', border: '1px solid var(--color-border)', transition: 'all 0.3s ease' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-3)' }}>
                  Key Highlights
                </h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {(project.highlights?.length ? project.highlights : [
                    'Government Approved Zone',
                    'Direct Highway Connectivity',
                    'Spacious Heavy-Vehicle Roads',
                    'Underground Utility Lines',
                    'Gated Security Setup'
                  ]).map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                      <CheckCircle size={18} color="var(--color-black)" style={{ flexShrink: 0, marginTop: 2 }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MASTER PLAN */}
      <section className="section bg-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Layout & Planning</span>
            <h2 className="section-title">Project Master Plan</h2>
            <p className="section-subtitle">Detailed site layout indicating road widths, plot dimensions, and zoning.</p>
          </div>
          
          <InteractiveMasterPlan project={project} plots={plots} masterPlanUrl={masterPlan} />
        </div>
      </section>

      {/* 5. LIVE PLOT AVAILABILITY */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Live Inventory</span>
            <h2 className="section-title">Live Plot Availability</h2>
            <p className="section-subtitle">Check current availability before contacting our sales team.</p>
          </div>
          
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '4rem', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1, marginBottom: 'var(--space-2)', fontFamily: 'var(--font-heading)' }}>
              {availableCount}
            </div>
            <div style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', fontWeight: 500, marginBottom: 'var(--space-6)' }}>
              Plots Currently Available
            </div>
            <Link to={`/projects/${project.slug}/plots`} className="btn btn-primary btn-lg">
              View Detailed Availability Table
            </Link>
          </div>
        </div>
      </section>

      {/* 6. INFRASTRUCTURE */}
      <section className="section" style={{ background: 'var(--color-black)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Facilities</span>
            <h2 className="section-title text-white">Project Infrastructure</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)' }}>
            {(project.infrastructure?.length ? project.infrastructure : [
              '18m to 24m Wide Internal Roads',
              'Street Lighting Network',
              'Underground Drainage System',
              'Dedicated Power Substation',
              'Green Belt Development',
              'Secure Compound Wall'
            ]).map((infra, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(255,255,255,0.05)', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-white)', color: 'var(--color-black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={20} />
                </div>
                <div style={{ color: 'var(--color-white)', fontWeight: 500 }}>{infra}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LOCATION & CONNECTIVITY */}
      <section className="section bg-light">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Strategic Positioning</span>
            <h2 className="section-title">Location & Connectivity</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }} className="location-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ background: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 500, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>Key Distances</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {(project.connectivity?.length ? project.connectivity : [
                    'Direct access to National Highway',
                    '20 mins from major industrial hub',
                    'Easy access to freight corridors'
                  ]).map((conn, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={16} color="var(--color-gold-500)" />
                      <span>{conn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div style={{ height: 400, borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--color-border-light)', zIndex: 1 }}>
              {(project.lat && project.lng) ? (
                <MapContainer center={[project.lat, project.lng]} zoom={13} style={{ width: '100%', height: '100%' }}>
                  <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                  <Marker position={[project.lat, project.lng]} />
                </MapContainer>
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                  Map data not available
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. GALLERY */}
      {gallery.length > 0 && (
        <section className="section" style={{ background: '#fff' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Visuals</span>
              <h2 className="section-title">Project Gallery</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
              {gallery.map(img => (
                <div key={img.id} style={{ height: 250, borderRadius: 'var(--radius-lg)', overflow: 'hidden', background: '#f1f5f9' }}>
                  <img src={img.url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="hover-zoom" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. DOCUMENTS & TRANSPARENCY */}
      <section className="section bg-bg">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Transparency</span>
            <h2 className="section-title">Project Information</h2>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: 280, textAlign: 'center' }}>
              <FileText size={32} color="var(--color-text-primary)" style={{ margin: '0 auto var(--space-4)' }} />
              <h4 style={{ fontWeight: 500, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 8 }}>Project Brochure</h4>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>Complete details & specs</p>
              <button className="btn btn-outline btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => setEnquiryOpen(true)}>
                <Download size={14} /> Download
              </button>
            </div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', width: 280, textAlign: 'center' }}>
              <Map size={32} color="var(--color-text-primary)" style={{ margin: '0 auto var(--space-4)' }} />
              <h4 style={{ fontWeight: 500, fontFamily: 'var(--font-heading)', color: 'var(--color-text-primary)', marginBottom: 8 }}>Master Plan HQ</h4>
              <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>High-resolution layout</p>
              <button className="btn btn-outline btn-sm w-full" style={{ justifyContent: 'center' }} onClick={() => setEnquiryOpen(true)}>
                <Download size={14} /> Download
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="section" style={{ background: 'var(--color-black)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 500, color: 'var(--color-white)', marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
            Ready to secure your industrial space?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>
            Contact our sales team directly or schedule a site visit. No registration required.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setEnquiryOpen(true)} className="btn btn-outline-light btn-lg">
              Enquire Now
            </button>
            <Link to={`/site-visit?project=${project.id}`} className="btn btn-primary btn-lg" style={{ background: 'var(--color-white)', color: 'var(--color-black)', borderColor: 'var(--color-white)' }}>
              <Calendar size={18} /> Book A Site Visit
            </Link>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY BOTTOM BAR */}
      <div className="mobile-sticky-bar">
        <a href={getProjectWhatsApp(project.name)} target="_blank" rel="noopener noreferrer" className="mobile-sticky-btn whatsapp">
          <MessageCircle size={18} /> WHATSAPP
        </a>
        <button onClick={() => setEnquiryOpen(true)} className="mobile-sticky-btn enquire">
          ENQUIRE
        </button>
        <Link to={`/site-visit?project=${project.id}`} className="mobile-sticky-btn visit">
          SITE VISIT
        </Link>
      </div>

      <EnquiryModal 
        isOpen={enquiryOpen} 
        onClose={() => setEnquiryOpen(false)} 
        project={project} 
        source="WEBSITE" 
      />

      <style>{`
        .project-hero {
          position: relative;
          padding: 140px 0 80px;
          background-size: cover;
          background-position: center;
          min-height: 60vh;
          display: flex;
          align-items: flex-end;
        }
        .project-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%);
        }
        .project-hero-content {
          position: relative;
          z-index: 2;
        }
        .project-hero-title {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 6vw, 4rem);
          color: var(--color-white);
          font-weight: 500;
          margin-bottom: var(--space-4);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .project-hero-subtitle {
          font-size: 1.1rem;
          color: rgba(245,237,227,0.8);
          max-width: 600px;
          margin-bottom: var(--space-8);
          line-height: 1.6;
        }
        .project-hero-actions {
          display: flex;
          gap: var(--space-4);
          flex-wrap: wrap;
        }
        .hover-zoom:hover { transform: scale(1.05); }
        
        .mobile-sticky-bar {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #fff;
          box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
          z-index: 50;
        }
        .mobile-sticky-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 12px 8px;
          font-size: 11px;
          font-weight: 600;
          color: var(--color-brown-900);
          border: none;
          background: none;
          text-decoration: none;
          border-right: 1px solid var(--color-border-light);
        }
        .mobile-sticky-btn:last-child { border-right: none; }
        .mobile-sticky-btn.whatsapp { color: #16a34a; }
        .mobile-sticky-btn.enquire { background: var(--color-gold-500); color: var(--color-brown-900); }
        
        @media (max-width: 768px) {
          .project-overview-grid { grid-template-columns: 1fr !important; }
          .location-grid { grid-template-columns: 1fr !important; }
          .hidden-mobile { display: none !important; }
          .mobile-sticky-bar { display: flex; }
          .project-detail { padding-bottom: 60px; } /* Space for sticky bar */
        }
      `}</style>
    </div>
  );
}
