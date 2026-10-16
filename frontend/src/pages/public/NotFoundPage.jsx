import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass, PhoneCall, Calendar } from 'lucide-react';
import SEO from '../../components/SEO';

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found (404) | RRR Developers"
        description="The page you are looking for does not exist or has been moved. Explore our industrial land projects and plot availability in Gujarat."
        noindex={true}
      />

      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '160px 24px 100px',
          background: 'var(--color-bg)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-accent, #c5a880)',
              background: 'rgba(197, 168, 128, 0.1)',
              marginBottom: 20,
            }}
          >
            404 Error
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: 20,
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            The link you followed may be broken or the page may have been removed. Use the navigation links below to discover industrial land and plots in Gujarat.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              justifyContent: 'center',
              marginBottom: 48,
            }}
          >
            <Link
              to="/"
              className="btn btn-primary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Home size={18} /> Return Home
            </Link>
            <Link
              to="/projects"
              className="btn btn-outline btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Compass size={18} /> View Projects
            </Link>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 32,
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              flexWrap: 'wrap',
              fontSize: 14,
              color: 'var(--color-text-secondary)',
            }}
          >
            <Link
              to="/contact"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'inherit' }}
            >
              <PhoneCall size={15} /> Contact Sales
            </Link>
            <span>•</span>
            <Link
              to="/site-visit"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'inherit' }}
            >
              <Calendar size={15} /> Schedule Site Visit
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
