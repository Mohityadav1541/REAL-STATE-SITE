import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

/* =========================================================
   1. HERO SECTION
   ========================================================= */
function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const scale = useTransform(scrollY, [0, 1000], [1, 1.2]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
      {/* Background Image */}
      <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', y: y1 }}>
        <motion.img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070" 
          alt="Premium Industrial Real Estate" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', scale }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' }} />
      </motion.div>
      
      {/* Premium Parallax Background Text */}
      <motion.div 
        className="desktop-only"
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '100%', 
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 5,
          y: useTransform(scrollY, [0, 1000], [0, 400]) // Parallax effect
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '18vw',
          fontWeight: 800,
          color: 'transparent',
          WebkitTextStroke: '2px rgba(255, 255, 255, 0.15)',
          whiteSpace: 'nowrap',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}>
          SS DEVELOPERS
        </h2>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 20px', opacity }}
      >
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 500, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px' }}
        >
          Find Your Foundation
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.9)', maxWidth: 600, marginBottom: '40px', fontWeight: 300 }}
        >
          Premium industrial plots. Real guidance. A clear path to build what's next.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/projects" className="btn" style={{ background: '#fff', color: '#000', padding: '16px 32px', borderRadius: '40px', fontSize: '15px', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Find Properties <ArrowRight size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* =========================================================
   3. AERIAL VIDEO SECTION
   ========================================================= */
function AerialSection() {
  return (
    <section className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: 'relative', borderRadius: 'var(--radius-2xl)', overflow: 'hidden', height: '70vh' }}
        >
          <img src="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=2079" alt="Aerial Industrial" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: '#fff', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 500, letterSpacing: '-0.02em', maxWidth: 800 }}>
              This isn't just about industrial land.
            </h2>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   4. INDUSTRIAL REAL ESTATE, REWIRED
   ========================================================= */
function RewiredSection() {
  return (
    <section id="why-us" className="section" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div className="grid grid-2">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              Industrial Real Estate, Rewired.
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--color-text-secondary)', lineHeight: 1.5, fontWeight: 300 }}>
              You're not just looking for a plot. You're looking for growth. A foundation for your manufacturing and logistics. Let's build it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
          >
            <div>
              <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', marginBottom: '24px' }}>Steps:</p>
            </div>
            
            {[
              { title: 'Talk to an Expert.', desc: 'We match you with specialists who understand industrial zoning, utility requirements, and freight logistics.' },
              { title: 'Get Clarity.', desc: 'We distill exactly what you really need, not just what\'s available. Finding the perfect foundation for your operations.' },
              { title: 'Move Forward.', desc: 'We handle the complexities of government-approved paperwork so you can focus on building your business.' }
            ].map((step, i) => (
              <div key={i} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  {step.title}
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* =========================================================
   5. AGENTS / TEAM SECTION
   ========================================================= */
function TeamSection() {
  return (
    <section id="about" className="section" style={{ paddingTop: 0, background: 'var(--color-bg)' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-2" style={{ alignItems: 'center' }}
        >
          <div style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', height: '600px' }}>
            <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070" alt="Team" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              At SS DEVELOPERS, our team doesn't just sell plots—they partner in your vision.
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '40px' }}>
              Our experts are deeply invested in your success. They know every inch of the master plans, understand government regulations, and help you navigate the complexities of industrial real estate.
            </p>
            <Link to="/contact" className="btn btn-outline" style={{ borderRadius: '40px', padding: '12px 24px' }}>
              Meet the Team
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* =========================================================
   6. LARGE ACCORDION / LIST SECTION (HOW WE HELP)
   ========================================================= */
function HowWeHelpSection() {
  const items = [
    { title: 'Buy Plots', desc: 'Secure premium, government-approved industrial land tailored to your exact manufacturing or warehousing needs with transparent pricing.' },
    { title: 'Custom Built', desc: 'Partner with our construction experts to develop a built-to-suit facility on your newly acquired plot, optimized for your operations.' },
    { title: 'Leasing', desc: 'Explore long-term leasing options for pre-built industrial sheds and warehouses in prime logistical corridors.' }
  ];

  return (
    <section id="investment" className="section" style={{ background: 'var(--color-black)', color: '#fff' }}>
      <div className="container">
        <div className="grid grid-2">
          <div>
            <p style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.5)', marginBottom: '24px' }}>Services</p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 5vw, 5rem)', fontWeight: 500, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              How SS DEV<br />Can Help You
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                className="hover-trigger"
              >
                <div>
                  <h3 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontFamily: 'var(--font-heading)', fontWeight: 500, transition: 'color 0.3s ease' }} className="hover-target">
                    {item.title}
                  </h3>
                  <div className="hover-reveal" style={{ overflow: 'hidden', transition: 'all 0.4s ease', height: 0, opacity: 0 }}>
                    <p style={{ paddingTop: '16px', color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '400px' }}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ArrowRight size={32} color="rgba(255,255,255,0.3)" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .hover-trigger:hover .hover-reveal {
          height: 100px;
          opacity: 1;
        }
        .hover-trigger:hover .hover-target {
          color: var(--color-accent, #a3a3a3);
        }
        @media (max-width: 640px) {
           .hover-trigger:hover .hover-reveal { height: 150px; }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   7. SUPPORT BEYOND BUYING (CARDS)
   ========================================================= */
function SupportSection() {
  const cards = [
    { title: 'Legal & Compliance', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070', desc: 'Navigate complex industrial regulations with ease.' },
    { title: 'Infrastructure Setup', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070', desc: 'Power, water, and connectivity solutions.' },
    { title: 'Construction & Development', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071', desc: 'End-to-end building and architecture support.' },
  ];

  return (
    <section className="section" style={{ background: 'var(--color-black)', color: '#fff' }}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '600px' }}>
            Support Beyond Buying and Selling
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', marginBottom: '60px', maxWidth: '600px' }}>
            The industrial market never stands still—and neither do we. Our experts continue to assist you beyond the sale.
          </p>
        </motion.div>

        <div className="grid grid-3">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', height: '400px', cursor: 'pointer' }}
              className="support-card"
            >
              <img src={card.img} alt={card.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="support-img" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>
                  {card.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', transform: 'translateY(20px)', opacity: 0, transition: 'all 0.3s ease' }} className="support-desc">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
        <style>{`
          .support-card:hover .support-img {
            transform: scale(1.05);
          }
          .support-card:hover .support-desc {
            transform: translateY(0);
            opacity: 1;
          }
        `}</style>
      </div>
    </section>
  );
}

/* =========================================================
   8. NEWSLETTER SECTION
   ========================================================= */
function NewsletterSection() {
  return (
    <section className="section" style={{ background: 'var(--color-black)', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 500 }}>
            Subscribe to our Newsletter!
          </h2>
          <div style={{ display: 'flex', gap: '16px', maxWidth: '400px' }}>
            <input 
              type="email" 
              placeholder="Email address" 
              style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 0', outline: 'none' }} 
            />
            <button style={{ background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '12px 0', cursor: 'pointer' }}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MAIN HOMEPAGE
   ========================================================= */
export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    document.title = 'SS Developers – Find Your Foundation';
  }, []);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        // Add a slight delay to ensure the page is rendered before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
      <HeroSection />
      <AerialSection />
      <RewiredSection />
      <TeamSection />
      <HowWeHelpSection />
      <SupportSection />
      <NewsletterSection />
      {/* Footer handles the massive logo */}
    </div>
  );
}
