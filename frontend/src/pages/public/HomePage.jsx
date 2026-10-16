import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';
import { getOrganizationSchema, getWebSiteSchema } from '../../utils/seoConfig';

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
          alt="RRR Developers – Government-approved industrial land and plots in Gujarat" 
          fetchPriority="high"
          style={{ width: '100%', height: '100%', objectFit: 'cover', scale }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' }} />
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
   2. TRANSITION ZOOM TEXT WITH ATOM DISINTEGRATION
   ========================================================= */
function ZoomTransition() {
  const canvasRef = useRef(null);
  const { scrollY } = useScroll();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  // Smooth zoom scale as user begins scrolling (from dab3b04)
  const zoomScale = useTransform(scrollY, [0, 200], [1, 1.45]);
  // Hide completely before colliding with the second image section
  const display = useTransform(scrollY, (v) => (v > 520 ? 'none' : 'block'));

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (dimensions.width === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = dimensions.width;
    const height = dimensions.height;
    canvas.width = width;
    canvas.height = height;

    const text = 'RRR DEVELOPERS';
    const fontSize = Math.max(36, Math.min(width * 0.08, 110));

    let particles = [];

    const initParticles = () => {
      particles = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.font = `700 ${fontSize}px "Outfit", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillStyle = '#ffffff';

      const centerX = width / 2;
      const centerY = height / 2;
      offCtx.fillText(text, centerX, centerY);

      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;

      const step = 3;

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 90) {
            particles.push({
              baseX: x,
              baseY: y,
              radius: 1.0 + Math.random() * 1.5,
              fallSpeed: 420 + Math.random() * 580,
              scatterX: (Math.random() - 0.5) * 120,
              delay: Math.random() * 0.3,
              jitterPhase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(initParticles);
    } else {
      initParticles();
    }

    let animationFrameId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.05;

      const currentScroll = scrollY.get();

      // If user has scrolled well past the hero into subsequent sections, skip heavy rendering
      if (currentScroll > 550) {
        ctx.clearRect(0, 0, width, height);
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Starts breaking into atoms at 120px scroll, fully fallen down and gone by 480px scroll
      const breakStart = 120;
      const breakEnd = 480;

      let pProgress = 0;
      if (currentScroll > breakStart) {
        pProgress = Math.min(1, (currentScroll - breakStart) / (breakEnd - breakStart));
      }

      if (pProgress === 0) {
        // Crisp solid text with exact styling from dab3b04
        ctx.save();
        ctx.font = `700 ${fontSize}px "Outfit", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 4;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(text, width / 2, height / 2);
        ctx.restore();
      } else {
        // Disintegrate into atom particles falling downside
        const total = particles.length;
        for (let i = 0; i < total; i++) {
          const pt = particles[i];
          const localP = Math.max(0, Math.min(1, (pProgress - pt.delay) / (1 - pt.delay + 0.0001)));
          const ease = localP * localP * (3 - 2 * localP);

          // Atomic thermal jitter
          const jitter = Math.sin(localP * Math.PI) * 8;
          const jX = Math.cos(time * 3 + pt.jitterPhase) * jitter;
          const jY = Math.sin(time * 3 + pt.jitterPhase) * jitter;

          const curX = pt.baseX + pt.scatterX * ease + jX;
          const curY = pt.baseY + pt.fallSpeed * (ease * 1.3) + jY;

          const opacity = Math.max(0, 1 - localP * 1.15);
          if (opacity <= 0.01) continue;

          ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
          ctx.beginPath();
          ctx.arc(curX, curY, pt.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [dimensions, scrollY]);

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        display,
        pointerEvents: 'none',
        zIndex: 5,
        scale: zoomScale,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </motion.div>
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
          <img 
            src="https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?q=80&w=2079" 
            alt="Aerial view of master-planned industrial development in Gujarat with heavy vehicle roads" 
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
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
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070" 
              alt="RRR Developers advisory and industrial real estate team in Gujarat" 
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 500, color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: '24px', letterSpacing: '-0.02em' }}>
              At RRR DEVELOPERS, our team doesn't just sell plots—they partner in your vision.
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
              How RRR DEV<br />Can Help You
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
    { title: 'Legal & Compliance', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070', alt: 'Industrial land legal approval and regulatory compliance guidance in Gujarat', desc: 'Navigate complex industrial regulations with ease.' },
    { title: 'Infrastructure Setup', img: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070', alt: 'Industrial utility connections, power substations, and wide internal roads', desc: 'Power, water, and connectivity solutions.' },
    { title: 'Construction & Development', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071', alt: 'Turnkey industrial warehouse construction and factory architecture', desc: 'End-to-end building and architecture support.' },
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
              <img src={card.img} alt={card.alt || card.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="support-img" />
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
      <SEO
        title="RRR Developers | Industrial Land and Plots in Gujarat"
        description="RRR Developers offers government-approved industrial land and plots in Gujarat with wide heavy-vehicle roads, robust utility infrastructure, and highway connectivity."
        canonical="/"
        keywords={[
          'Industrial plots for sale in Surat',
          'Industrial land in Maroli',
          'Industrial plots in Hojwala',
          'Industrial land in Gujarat',
          'Industrial land near the Palsana-Hazira belt',
          'Industrial plots with highway connectivity',
          'RRR Developers industrial projects',
        ]}
        schema={[getOrganizationSchema(), getWebSiteSchema()]}
      />
      <ZoomTransition />
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
