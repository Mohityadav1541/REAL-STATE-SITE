import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search } from 'lucide-react';
import { publicApi } from '../../lib/api';
import { formatArea } from '../../utils/helpers';
import PlotModal from '../../components/PlotModal';
import EnquiryModal from '../../components/EnquiryModal';
import { usePlotsStream } from '../../hooks/usePlotsStream';
import SEO from '../../components/SEO';

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Available', color: '#15803d', bg: '#dcfce7', border: '#86efac' },
  HOLD: { label: 'On Hold', color: '#c2410c', bg: '#ffedd5', border: '#fdba74' },
  BOOKED: { label: 'Booked', color: '#1d4ed8', bg: '#dbeafe', border: '#93c5fd' },
  SOLD: { label: 'Sold', color: '#6b7280', bg: '#f3f4f6', border: '#d1d5db' },
};

export default function PlotAvailabilityPage() {
  const { slug } = useParams();
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [enquiryPlot, setEnquiryPlot] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['project-plots', slug],
    queryFn: () => publicApi.getProjectPlots(slug),
  });

  usePlotsStream(slug);

  const project = data?.project;
  const allPlots = data?.plots || [];

  useEffect(() => {
    if (project) document.title = `Plot Availability – ${project.name} | RRR Developers`;
  }, [project]);

  const filteredPlots = allPlots.filter((p) => {
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesSearch = search === '' || p.plotNumber.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Count by status
  const counts = allPlots.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) return (
    <div style={{ paddingTop: 100, textAlign: 'center', minHeight: '60vh' }}>
      <div className="skeleton" style={{ height: 48, width: 300, margin: '80px auto 20px' }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120 }} />)}
      </div>
    </div>
  );

  if (error || !project) {
    return (
      <div style={{ paddingTop: 120, textAlign: 'center', minHeight: '60vh' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)' }}>Project not found</h2>
        <Link to="/projects" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Projects</Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 72, minHeight: '100vh', background: 'var(--color-bg)' }}>
      <SEO
        title={`Available Industrial Plots – ${project.name} | RRR Developers`}
        description={`Check real-time available, booked, and sold industrial plots at ${project.name} in ${project.location}, Gujarat. Review dimensions, facing, road widths, and layout.`}
        canonical={`/projects/${project.slug}/plots`}
        keywords={[
          `${project.name} plot availability`,
          `Industrial plots in ${project.location}`,
          'Industrial plots for sale Gujarat',
          'RRR Developers plots',
        ]}
        breadcrumbs={[
          { name: 'Projects', path: '/projects' },
          { name: project.name, path: `/projects/${project.slug}` },
          { name: 'Plot Availability', path: `/projects/${project.slug}/plots` },
        ]}
      />

      {/* Header */}
      <div className="pa-header">
        <div className="container pa-header-inner">
          <div>
            <Link to={`/projects/${slug}`} className="proj-back">
              <ChevronLeft size={16} /> {project.name}
            </Link>
            <h1 className="pa-title">Plot Availability</h1>
            <p className="pa-sub">{project.name} · {project.location}</p>
          </div>
          <div className="pa-legend">
            {Object.entries(STATUS_CONFIG).map(([status, cfg]) => (
              <div key={status} className="pa-legend-item">
                <span style={{ width: 12, height: 12, borderRadius: 3, background: cfg.bg, border: `2px solid ${cfg.border}`, flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-xs)', color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="pa-filters">
        <div className="container pa-filters-inner">
          <div className="pa-filter-status">
            <button
              className={`pa-filter-btn ${filterStatus === 'ALL' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ALL')}
            >
              All ({allPlots.length})
            </button>
            {Object.entries(STATUS_CONFIG).map(([s, cfg]) => (
              counts[s] > 0 && (
                <button
                  key={s}
                  className={`pa-filter-btn ${filterStatus === s ? 'active' : ''}`}
                  style={filterStatus === s ? { background: cfg.bg, borderColor: cfg.border, color: cfg.color } : {}}
                  onClick={() => setFilterStatus(s === filterStatus ? 'ALL' : s)}
                >
                  {cfg.label} ({counts[s] || 0})
                </button>
              )
            ))}
          </div>
          <div className="pa-search">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search plot number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pa-search-input"
            />
          </div>
        </div>
      </div>

      {/* Plot Grid */}
      <div className="container" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-16)' }}>
        {filteredPlots.length === 0 ? (
          <div className="empty-state">
            <p className="empty-state-title">No plots match your filter</p>
            <button className="btn btn-outline" onClick={() => { setFilterStatus('ALL'); setSearch(''); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="pa-result-count">
              Showing {filteredPlots.length} of {allPlots.length} plots
              <button className="pa-refresh" onClick={() => refetch()}>↻ Refresh</button>
            </div>
            <div className="pa-grid">
              {filteredPlots.map((plot) => (
                <PlotCard
                  key={plot.id}
                  plot={plot}
                  onClick={() => setSelectedPlot(plot)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <PlotModal
        isOpen={!!selectedPlot}
        onClose={() => setSelectedPlot(null)}
        plot={selectedPlot}
        project={project}
        onEnquire={(plot) => setEnquiryPlot(plot)}
      />
      <EnquiryModal
        isOpen={!!enquiryPlot}
        onClose={() => setEnquiryPlot(null)}
        project={project}
        plot={enquiryPlot}
        source="WEBSITE"
      />

      <style>{`
        .pa-header {
          background: var(--color-bg);
          padding: var(--space-8) 0;
          border-bottom: 1px solid var(--color-border);
        }
        .pa-header-inner {
          display: flex; align-items: flex-start;
          justify-content: space-between; flex-wrap: wrap; gap: var(--space-4);
        }
        .proj-back {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: var(--text-sm); color: var(--color-text-secondary);
          margin-bottom: var(--space-3);
          transition: color var(--transition-fast);
        }
        .proj-back:hover { color: var(--color-text-primary); }
        .pa-title {
          font-family: var(--font-heading);
          font-size: var(--text-3xl);
          color: var(--color-text-primary);
          margin-bottom: 4px;
          font-weight: 500;
        }
        .pa-sub { font-size: var(--text-sm); color: var(--color-text-secondary); }
        .pa-legend {
          display: flex; gap: var(--space-4); flex-wrap: wrap;
          align-items: center;
        }
        .pa-legend-item { display: flex; align-items: center; gap: 6px; }
        .pa-filters {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-3) 0;
          position: sticky; top: 72px; z-index: 50;
        }
        .pa-filters-inner {
          display: flex; align-items: center;
          justify-content: space-between; gap: var(--space-4);
          flex-wrap: wrap;
        }
        .pa-filter-status { display: flex; gap: var(--space-2); flex-wrap: wrap; }
        .pa-filter-btn {
          padding: 0.375rem 0.875rem;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 600;
          border: 1.5px solid var(--color-border);
          color: var(--color-text-secondary);
          background: var(--color-surface);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .pa-filter-btn:hover, .pa-filter-btn.active {
          background: var(--color-black);
          border-color: var(--color-black);
          color: var(--color-white);
        }
        .pa-search {
          display: flex; align-items: center; gap: 8px;
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          padding: 0.375rem 0.875rem;
          background: var(--color-surface);
          color: var(--color-text-muted);
          min-width: 200px;
        }
        .pa-search-input {
          border: none; outline: none; background: none;
          font-size: var(--text-sm); color: var(--color-text-primary);
          width: 100%;
        }
        .pa-result-count {
          font-size: var(--text-sm); color: var(--color-text-muted);
          margin-bottom: var(--space-4);
          display: flex; align-items: center; gap: var(--space-4);
        }
        .pa-refresh {
          font-size: var(--text-xs); color: var(--color-text-secondary);
          cursor: pointer; padding: 2px 8px;
          border: 1px solid var(--color-border); border-radius: var(--radius-full);
          background: var(--color-surface); transition: all var(--transition-fast);
        }
        .pa-refresh:hover { background: var(--color-bg); }
        .pa-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-4);
        }
        @media (max-width: 640px) {
          .pa-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}

function PlotCard({ plot, onClick }) {
  const cfg = STATUS_CONFIG[plot.status] || STATUS_CONFIG.SOLD;
  const isAvailable = plot.status === 'AVAILABLE';

  return (
    <button
      className="plot-card"
      onClick={onClick}
      style={{
        '--plot-color': cfg.color,
        '--plot-bg': cfg.bg,
        '--plot-border': cfg.border,
      }}
    >
      <div className="plot-card-inner">
        <div className="plot-number">Plot {plot.plotNumber}</div>
        {plot.area && (
          <div className="plot-area">{formatArea(plot.area, plot.areaUnit)}</div>
        )}
        {plot.facing && (
          <div className="plot-facing">{plot.facing} Facing</div>
        )}
        <div className="plot-status">
          <span className="plot-status-dot" />
          {cfg.label}
        </div>
        {isAvailable && (
          <div className="plot-cta-hint">Click to enquire</div>
        )}
      </div>
      <style>{`
        .plot-card {
          background: var(--plot-bg, #f3f4f6);
          border: 2px solid var(--plot-border, #d1d5db);
          border-radius: var(--radius-xl);
          padding: var(--space-4);
          cursor: pointer;
          text-align: left;
          transition: all var(--transition-base);
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .plot-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1);
          border-color: var(--plot-color, #6b7280);
        }
        .plot-card-inner { display: flex; flex-direction: column; gap: 4px; }
        .plot-number {
          font-weight: 500; font-size: var(--text-sm);
          color: var(--plot-color, #6b7280);
          font-family: var(--font-heading);
        }
        .plot-area {
          font-size: var(--text-xs); color: var(--color-text-primary);
          font-weight: 600;
        }
        .plot-facing {
          font-size: 11px; color: var(--color-text-muted);
        }
        .plot-status {
          display: flex; align-items: center; gap: 5px;
          margin-top: var(--space-2);
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.08em;
          color: var(--plot-color, #6b7280);
        }
        .plot-status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--plot-color, #6b7280);
          flex-shrink: 0;
        }
        .plot-cta-hint {
          font-size: 10px;
          color: var(--color-text-muted);
          margin-top: var(--space-1);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        .plot-card:hover .plot-cta-hint { opacity: 1; }
      `}</style>
    </button>
  );
}
