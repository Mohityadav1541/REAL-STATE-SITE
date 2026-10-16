import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function WhyUsPage() {
  return (
    <>
      <SEO
        title="Why Choose RRR Developers | Gujarat Industrial Land Specialists"
        description="Discover why leading manufacturers and logistics operators choose RRR Developers for transparent documentation, heavy freight connectivity, and prime Gujarat locations."
        canonical="/why-us"
        keywords={[
          'Why RRR Developers',
          'Industrial land benefits Gujarat',
          'Industrial zoning Gujarat',
          'Industrial real estate developers',
        ]}
        breadcrumbs={[{ name: 'Why Us', path: '/why-us' }]}
      />

      <div className="page-header" style={{ textAlign: 'center', padding: '140px 0 60px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <span className="section-label">Our Advantages</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-text-primary)', fontWeight: 500, letterSpacing: '-0.02em', marginTop: '0.5rem' }}>
            Why Choose RRR Developers
          </h1>
        </div>
      </div>
      
      <section style={{ padding: '80px 0', background: 'var(--color-bg)', minHeight: '60vh' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px' }}>
            
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
    </>
  );
}
