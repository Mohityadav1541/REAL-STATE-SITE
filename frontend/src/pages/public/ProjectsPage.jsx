import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, CheckCircle, ArrowRight, ChevronRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import SEO from '../../components/SEO';

export default function ProjectsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: () => publicApi.getProjects(),
  });

  const projects = data?.projects || [];

  return (
    <>
      <SEO
        title="Industrial Land Projects in Gujarat | RRR Developers"
        description="Explore master-planned industrial parks and government-approved industrial plots in Gujarat. Prime corridors in Maroli and Hojwala near the Palsana-Hazira industrial belt."
        canonical="/projects"
        keywords={[
          'Industrial land projects in Gujarat',
          'Industrial plots in Surat',
          'RRR Industrial Park 1',
          'RRR Industrial Land 3',
          'Industrial land in Maroli',
          'Industrial plots in Hojwala',
        ]}
        breadcrumbs={[{ name: 'Projects', path: '/projects' }]}
      />

      {/* Page Header */}
      <div className="page-header">
        <div className="container page-header-content">
          <span className="section-label">Our Portfolio</span>
          <h1 className="page-header-title">Industrial Land Projects</h1>
          <p className="page-header-sub">
            Government-approved industrial developments across strategic locations in Surat district.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <section className="section">
        <div className="container">
          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {[1, 2].map((i) => (
                <div key={i} className="card pl-card" style={{ minHeight: 280 }}>
                  <div className="skeleton" style={{ height: '100%', minHeight: 280, borderRadius: 'var(--radius-xl) 0 0 var(--radius-xl)' }} />
                  <div style={{ padding: 'var(--space-8)' }}>
                    <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 20 }} />
                    <div className="skeleton" style={{ height: 80 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="error-message">Failed to load projects. Please try again.</div>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title">No projects available</p>
              <p className="empty-state-text">Check back soon for new project listings.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
              {projects.map((project, idx) => (
                <ProjectListCard key={project.id} project={project} reverse={idx % 2 !== 0} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .page-header {
          position: relative;
          padding: 140px 0 60px;
          overflow: hidden;
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
        }
        .page-header-content {
          position: relative; z-index: 1;
          text-align: center;
        }
        .page-header-title {
          font-family: var(--font-heading);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 500;
          color: var(--color-text-primary);
          margin: var(--space-3) 0 var(--space-4);
          letter-spacing: -0.02em;
        }
        .page-header-sub {
          font-size: var(--text-lg);
          color: var(--color-text-secondary);
          max-width: 520px;
          margin: 0 auto;
        }
      `}</style>
    </>
  );
}

function ProjectListCard({ project, reverse }) {
  const heroImage = project.images?.find((i) => i.type === 'HERO') || project.images?.[0];
  const available = project.plotCounts?.AVAILABLE || 0;
  const total = Object.values(project.plotCounts || {}).reduce((a, b) => a + b, 0);

  return (
    <div className={`pl-card ${reverse ? 'pl-card-reverse' : ''}`}>
      <div className="pl-card-image">
        {heroImage ? (
          <img
            src={heroImage.url}
            alt={`${project.name} – Industrial land and plots in ${project.location}, Gujarat`}
            loading="lazy"
          />
        ) : (
          <div className="pl-card-placeholder">🏭</div>
        )}
        <div className="pl-status-badge">
          <span className={`badge ${available > 0 ? 'badge-available' : 'badge-sold'}`}>
            <span className={`status-dot ${available > 0 ? 'status-dot-available' : 'status-dot-sold'}`} />
            {available > 0 ? `${available} Plots Available` : 'Fully Booked'}
          </span>
        </div>
      </div>
      <div className="pl-card-body">
        <div className="pl-card-location">
          <MapPin size={14} /> {project.location}
        </div>
        <h2 className="pl-card-title">{project.name}</h2>
        {project.tagline && <p className="pl-card-tagline">{project.tagline}</p>}
        <p className="pl-card-desc">
          {project.description?.slice(0, 200)}...
        </p>
        {project.highlights && (
          <div className="pl-highlights">
            {(Array.isArray(project.highlights) ? project.highlights : []).slice(0, 4).map((h) => (
              <div key={h} className="pl-highlight-item">
                <CheckCircle size={13} />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}
        <div className="pl-card-actions">
          <Link to={`/projects/${project.slug}`} className="btn btn-primary">
            Project Details <ArrowRight size={16} />
          </Link>
          <Link to={`/projects/${project.slug}/plots`} className="btn btn-outline">
            View Plots {total > 0 && `(${total})`} <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      <style>{`
        .pl-card {
          display: grid;
          grid-template-columns: 420px 1fr;
          background: var(--color-surface);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--color-border);
          overflow: hidden;
          transition: transform var(--transition-base), border-color var(--transition-base);
        }
        .pl-card:hover { transform: translateY(-4px); border-color: var(--color-black); }
        .pl-card-reverse { direction: rtl; }
        .pl-card-reverse > * { direction: ltr; }
        .pl-card-image {
          position: relative; overflow: hidden;
          min-height: 300px;
        }
        .pl-card-image img {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }
        .pl-card:hover .pl-card-image img { transform: scale(1.04); }
        .pl-card-placeholder {
          width: 100%; height: 100%; min-height: 300px;
          background: var(--color-bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 64px;
        }
        .pl-status-badge {
          position: absolute; top: var(--space-4); left: var(--space-4);
        }
        .pl-card-body {
          padding: var(--space-8) var(--space-10);
          display: flex; flex-direction: column; justify-content: center;
          gap: var(--space-3);
        }
        .pl-card-location {
          display: flex; align-items: center; gap: 6px;
          font-size: var(--text-xs); text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--color-text-muted);
        }
        .pl-card-title {
          font-family: var(--font-heading);
          font-size: var(--text-3xl); font-weight: 500;
          color: var(--color-text-primary);
        }
        .pl-card-tagline {
          font-size: var(--text-sm); color: var(--color-text-secondary);
          font-weight: 500;
        }
        .pl-card-desc {
          font-size: var(--text-sm); color: var(--color-text-secondary);
          line-height: 1.7;
        }
        .pl-highlights {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: var(--space-2);
        }
        .pl-highlight-item {
          display: flex; align-items: center; gap: var(--space-2);
          font-size: var(--text-xs); color: var(--color-text-primary);
        }
        .pl-highlight-item svg { color: var(--color-black); flex-shrink: 0; }
        .pl-card-actions {
          display: flex; gap: var(--space-3);
          padding-top: var(--space-3);
          flex-wrap: wrap;
        }
        @media (max-width: 900px) {
          .pl-card { grid-template-columns: 1fr; }
          .pl-card-reverse { direction: ltr; }
          .pl-card-image { min-height: 240px; }
          .pl-card-body { padding: var(--space-6); }
          .pl-highlights { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
