import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About RRR Developers | Industrial Infrastructure Experts in Gujarat"
        description="Learn about RRR Developers, your trusted partner for government-approved industrial land acquisition, warehousing solutions, and manufacturing setup in Gujarat."
        canonical="/about"
        keywords={[
          'About RRR Developers',
          'Industrial land developers Gujarat',
          'Industrial parks Surat',
          'Industrial real estate consultants Gujarat',
        ]}
        breadcrumbs={[{ name: 'About', path: '/about' }]}
      />

      <div className="page-header" style={{ textAlign: 'center', padding: '140px 0 60px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <span className="section-label">Company Profile</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
            About RRR Developers
          </h1>
        </div>
      </div>
      
      <section style={{ padding: '80px 0 120px', background: 'var(--color-bg)' }}>
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}
          >
            <div style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', height: '600px' }}>
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070"
                alt="RRR Developers executive team and industrial development consultants"
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
                Contact Our Team
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
