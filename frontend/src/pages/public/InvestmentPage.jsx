import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';

export default function InvestmentPage() {
  const items = [
    { title: 'Buy Plots', desc: 'Secure premium, government-approved industrial land tailored to your exact manufacturing or warehousing needs with transparent pricing.' },
    { title: 'Custom Built', desc: 'Partner with our construction experts to develop a built-to-suit facility on your newly acquired plot, optimized for your operations.' },
    { title: 'Leasing', desc: 'Explore long-term leasing options for pre-built industrial sheds and warehouses in prime logistical corridors.' }
  ];

  const cards = [
    { title: 'Legal & Compliance', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070', alt: 'Legal compliance and clear industrial land titles in Gujarat', desc: 'Navigate complex industrial regulations with ease.' },
    { title: 'Infrastructure Setup', img: 'https://images.unsplash.com/photo-1541888086925-0c1bb678b668?q=80&w=2070', alt: 'Plug-and-play industrial infrastructure in Gujarat', desc: 'Power, water, and connectivity solutions.' },
    { title: 'Construction & Development', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071', alt: 'Industrial warehouse and factory shed construction', desc: 'End-to-end building and architecture support.' },
  ];

  return (
    <>
      <SEO
        title="Industrial Land Investment in Gujarat | RRR Developers"
        description="Strategic industrial land investment opportunities in Gujarat. High-growth industrial corridors, reliable infrastructure, and end-to-end development support with RRR Developers."
        canonical="/investment"
        keywords={[
          'Industrial land investment Gujarat',
          'Industrial plots Surat investment',
          'Commercial industrial land Gujarat',
          'RRR Developers investment',
        ]}
        breadcrumbs={[{ name: 'Investment', path: '/investment' }]}
      />

      <div className="page-header" style={{ textAlign: 'center', padding: '140px 0 60px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <span className="section-label">Strategic Growth</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
            Industrial Land Investment in Gujarat
          </h1>
        </div>
      </div>

      <section style={{ padding: '80px 0', background: 'var(--color-black)', color: '#fff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
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
      </section>

      <section style={{ padding: '120px 0', background: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 500, letterSpacing: '-0.02em', marginBottom: '24px', maxWidth: '600px' }}>
              Support Beyond Buying and Selling
            </h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', marginBottom: '60px', maxWidth: '600px' }}>
              The industrial market never stands still—and neither do we. Our experts continue to assist you beyond the sale.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
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
                <img
                  src={card.img}
                  alt={card.alt || card.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  className="support-img"
                />
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
        </div>
      </section>

      <style>{`
        .hover-trigger:hover .hover-reveal {
          height: 100px;
          opacity: 1;
        }
        .hover-trigger:hover .hover-target {
          color: var(--color-accent, #a3a3a3);
        }
        .support-card:hover .support-img {
          transform: scale(1.05);
        }
        .support-card:hover .support-desc {
          transform: translateY(0);
          opacity: 1;
        }
        @media (max-width: 640px) {
           .hover-trigger:hover .hover-reveal { height: 150px; }
        }
      `}</style>
    </>
  );
}
