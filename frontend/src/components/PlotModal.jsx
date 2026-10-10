import { X, MapPin, ArrowRight, MessageCircle, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPlotWhatsApp, getProjectWhatsApp, formatArea, formatPrice } from '../utils/helpers';

const STATUS_CONFIG = {
  AVAILABLE: { label: 'Available', colorClass: 'badge-available', dotClass: 'status-dot-available' },
  HOLD: { label: 'On Hold', colorClass: 'badge-hold', dotClass: 'status-dot-hold' },
  BOOKED: { label: 'Booked', colorClass: 'badge-booked', dotClass: 'status-dot-booked' },
  SOLD: { label: 'Sold', colorClass: 'badge-sold', dotClass: 'status-dot-sold' },
};

export default function PlotModal({ isOpen, onClose, plot, project, onEnquire }) {
  if (!isOpen || !plot) return null;

  const statusConfig = STATUS_CONFIG[plot.status] || STATUS_CONFIG.SOLD;

  const whatsappUrl = plot.status !== 'SOLD'
    ? getPlotWhatsApp(plot.plotNumber, project?.name)
    : getProjectWhatsApp(project?.name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <span className={`badge ${statusConfig.colorClass}`}>
                <span className={`status-dot ${statusConfig.dotClass}`} />
                {statusConfig.label}
              </span>
            </div>
            <h3 className="modal-title">Plot {plot.plotNumber}</h3>
            {project && (
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: 4 }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                {project.name}
              </p>
            )}
          </div>
          <button className="btn btn-icon btn-outline" onClick={onClose} style={{ border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {plot.status === 'SOLD' ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-6) 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', background: 'var(--color-sold-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-4)', fontSize: 24
              }}>🏷️</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-2)' }}>
                This plot has been sold.
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-6)' }}>
                Looking for a similar plot? Contact us for other available options.
              </p>
              {project && (
                <Link
                  to={`/projects/${project.slug}/plots`}
                  className="btn btn-primary"
                  onClick={onClose}
                >
                  View Available Plots <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ) : (
            <>
              {/* Plot Details Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-3)', marginBottom: 'var(--space-5)'
              }}>
                {[
                  { label: 'Area', value: formatArea(plot.area, plot.areaUnit) },
                  { label: 'Facing', value: plot.facing || '—' },
                  { label: 'Road Width', value: plot.roadWidth || '—' },
                  { label: 'Price', value: formatPrice(plot.price) },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    padding: 'var(--space-3) var(--space-4)',
                    background: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                  }}>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                      {label}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{value}</div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <button className="btn btn-primary w-full" onClick={() => { onClose(); onEnquire?.(plot); }}>
                  <ArrowRight size={16} /> I'm Interested — Get Details
                </button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                  <Link
                    to={`/site-visit?projectId=${project?.id || ''}&plotNumber=${plot.plotNumber}`}
                    className="btn btn-outline"
                    onClick={onClose}
                  >
                    <Calendar size={15} /> Site Visit
                  </Link>
                </div>
                <a href="tel:9898649979" className="btn btn-outline w-full">
                  <Phone size={15} /> Call: 9898649979
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
