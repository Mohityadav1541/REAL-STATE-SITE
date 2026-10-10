import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/why-us', label: 'Why SS Developers' },
  { href: '/investment', label: 'Investment Advantage' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react/set-state-in-effect
    setIsOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';

  return (
    <header className={`navbar ${scrolled || !isHome ? 'navbar-solid' : 'navbar-transparent'}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-mark">SS</div>
          <div className="logo-text">
            <span className="logo-name">SS DEVELOPERS</span>
            <span className="logo-tagline">Premium Industrial Land</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${location.pathname === link.href ? 'nav-link-active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div className="navbar-cta">
          <a
            href={`tel:9898649979`}
            className="navbar-phone"
            aria-label="Call SS Developers"
          >
            <Phone size={14} />
            <span>9898649979</span>
          </a>
          <Link to="/site-visit" className="btn btn-primary btn-sm">
            Book Site Visit
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-mobile">
          <div className="container">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="mobile-nav-link"
              >
                {link.label}
              </Link>
            ))}
            <div className="mobile-nav-cta">
              <a href="tel:9898649979" className="btn btn-outline w-full">
                <Phone size={16} /> 9898649979
              </a>
              <Link to="/site-visit" className="btn btn-primary w-full">
                Book a Site Visit
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: var(--z-sticky);
          transition: all var(--transition-base);
        }

        .navbar-transparent {
          background: transparent;
        }

        .navbar-solid {
          background: var(--color-surface);
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          border-bottom: 1px solid var(--color-border);
        }

        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          gap: var(--space-6);
        }

        .navbar-logo {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          text-decoration: none;
          flex-shrink: 0;
        }

        .logo-mark {
          width: 40px;
          height: 40px;
          background: var(--color-black);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 16px;
          font-weight: 500;
          color: var(--color-white);
          letter-spacing: -0.02em;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-name {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 500;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
        }

        .logo-tagline {
          font-size: 10px;
          color: var(--color-text-secondary);
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .navbar-links {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
          justify-content: center;
        }

        .nav-link {
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-secondary);
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .nav-link:hover,
        .nav-link-active {
          color: var(--color-text-primary);
        }

        .navbar-cta {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          flex-shrink: 0;
        }

        .navbar-phone {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 500;
          color: var(--color-text-primary);
          transition: color var(--transition-fast);
        }

        .navbar-phone:hover { color: var(--color-text-muted); }

        .navbar-toggle {
          display: none;
          color: var(--color-text-primary);
          padding: var(--space-2);
          border-radius: var(--radius-sm);
          background: transparent;
        }

        .navbar-mobile {
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-4) 0 var(--space-6);
        }

        .mobile-nav-link {
          display: block;
          font-size: var(--text-base);
          font-weight: 500;
          color: var(--color-text-primary);
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
          transition: color var(--transition-fast);
        }

        .mobile-nav-link:hover { color: var(--color-text-muted); }

        .mobile-nav-cta {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-top: var(--space-6);
        }

        @media (max-width: 1024px) {
          .navbar-links { display: none; }
          .navbar-phone { display: none; }
          .navbar-toggle { display: flex; }
          .navbar-cta .btn { display: none; }
        }
      `}</style>
    </header>
  );
}
