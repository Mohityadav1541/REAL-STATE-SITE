import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { getGeneralWhatsApp } from '../utils/helpers';
import { trackPhoneClick, trackWhatsAppClick } from '../utils/analytics';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 500, color: 'var(--color-white)', marginBottom: '8px', letterSpacing: '-0.02em' }}>RRR DEVELOPERS</h2>
            <p className="footer-about">
              Government-approved industrial plots designed to drive modern manufacturing and logistics.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/projects">Our Projects</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/site-visit">Book Site Visit</Link></li>
              <li><Link to="/connect">Connect Directly</Link></li>
            </ul>
          </div>

          {/* Projects */}
          <div className="footer-section">
            <h4 className="footer-heading">Our Projects</h4>
            <ul className="footer-links">
              <li><Link to="/projects/project1">Project 1</Link></li>
              <li><Link to="/projects/project2">Project 2</Link></li>
            </ul>
            <h4 className="footer-heading" style={{ marginTop: 'var(--space-6)' }}>We Offer</h4>
            <ul className="footer-links">
              <li>Industrial Land</li>
              <li>Industrial Plots</li>
              <li>Industrial Development Projects</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">Contact Us</h4>
            <div className="footer-contact">
              <div className="footer-contact-item">
                <Phone size={15} />
                <a href="tel:9898649979" onClick={() => trackPhoneClick('footer')}>
                  9898649979
                </a>
              </div>
              <div className="footer-contact-item">
                <MapPin size={15} />
                <span>
                  Office No. 827, 8th Floor,<br />
                  Avadh Kontina, VIP Road,<br />
                  Near Luthra Circle, Vesu,<br />
                  Surat, Gujarat – 395007
                </span>
              </div>
            </div>
            <a
              href={getGeneralWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm footer-whatsapp"
              onClick={() => trackWhatsAppClick('footer')}
            >
              <MessageCircle size={15} />
              WhatsApp Us
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <p>© {currentYear} RRR Developers. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <span>www.rrrdevelopers.com</span>
          </div>
        </div>
        
        <div className="footer-massive-logo">
          RRR DEVELOPERS
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--color-black);
          color: var(--color-white);
          padding: var(--space-16) 0 0;
          overflow: hidden;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: var(--space-12);
          padding-bottom: var(--space-12);
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .footer-about {
          font-size: var(--text-sm);
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: var(--space-4);
          max-width: 300px;
        }

        .footer-heading {
          font-family: var(--font-heading);
          font-size: var(--text-sm);
          font-weight: 500;
          color: var(--color-white);
          margin-bottom: var(--space-4);
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .footer-links li,
        .footer-links a {
          font-size: var(--text-sm);
          color: rgba(255, 255, 255, 0.6);
          transition: color var(--transition-fast);
          cursor: pointer;
        }

        .footer-links a:hover {
          color: var(--color-white);
        }

        .footer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          margin-bottom: var(--space-5);
        }

        .footer-contact-item {
          display: flex;
          gap: var(--space-3);
          font-size: var(--text-sm);
          color: rgba(255, 255, 255, 0.6);
          align-items: flex-start;
        }

        .footer-contact-item svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-contact-item a {
          color: rgba(255, 255, 255, 0.6);
          transition: color var(--transition-fast);
        }

        .footer-contact-item a:hover { color: var(--color-white); }

        .footer-whatsapp {
          display: inline-flex;
          margin-top: var(--space-2);
        }

        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) 0;
          font-size: var(--text-xs);
          color: rgba(255, 255, 255, 0.4);
        }

        .footer-bottom-right {
          color: rgba(255, 255, 255, 0.6);
        }

        .footer-massive-logo {
          font-family: var(--font-heading);
          font-size: 15vw;
          font-weight: 700;
          color: var(--color-white);
          line-height: 0.8;
          text-align: center;
          letter-spacing: -0.05em;
          margin-top: var(--space-4);
          transform: translateY(20px);
          opacity: 0.9;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: var(--space-8);
          }
          .footer-brand { grid-column: 1 / -1; }
        }

        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-bottom {
            flex-direction: column;
            gap: var(--space-2);
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
