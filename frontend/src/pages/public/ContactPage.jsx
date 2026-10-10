import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '../../lib/api';
import { getGeneralWhatsApp } from '../../utils/helpers';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Contact Us – SS Developers';
  }, []);

  const mutation = useMutation({
    mutationFn: (data) => publicApi.submitLead(data),
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Thank you! We will contact you shortly.');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Submission failed. Please try again.');
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (form.mobile.replace(/\\D/g, '').length < 10) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutation.mutate({ ...form, source: 'WEBSITE' });
  };

  return (
    <>
      <div className="page-header" style={{ textAlign: 'center', padding: '140px 0 60px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-text-primary)', marginTop: '1rem', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Contact SS Developers
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginTop: '1rem' }}>
            Looking for industrial land? Our team is ready to help you find the perfect plot.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div className="contact-grid">
            
            {/* Contact Info */}
            <div className="contact-info">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-6)', fontWeight: 500 }}>
                Let's Talk Business.
              </h2>
              <div className="contact-item">
                <div className="contact-icon"><Phone size={20} /></div>
                <div>
                  <div className="contact-label">Call Us</div>
                  <a href="tel:9898649979" className="contact-value">9898649979</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><MessageCircle size={20} /></div>
                <div>
                  <div className="contact-label">WhatsApp</div>
                  <a href={getGeneralWhatsApp()} target="_blank" rel="noopener noreferrer" className="contact-value" style={{ textDecoration: 'underline' }}>
                    Message Sales Team
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-icon"><MapPin size={20} /></div>
                <div>
                  <div className="contact-label">Corporate Office</div>
                  <div className="contact-value" style={{ lineHeight: 1.6 }}>
                    Office No. 827, 8th Floor,<br />
                    Avadh Kontina, VIP Road,<br />
                    Near Luthra Circle, Vesu,<br />
                    Surat, Gujarat – 395007
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              {submitted ? (
                <div className="contact-success">
                  <CheckCircle size={48} color="var(--color-available)" style={{ margin: '0 auto var(--space-4)' }} />
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                    Thank You!
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                    Your enquiry has been received. Our sales team will contact you shortly.
                  </p>
                  <a href={getGeneralWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    <MessageCircle size={16} /> Also WhatsApp Us
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-6)', fontWeight: 500 }}>
                    Send an Enquiry
                  </h3>
                  
                  <div className="form-group">
                    <label className="form-label required">Your Name</label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="e.g. Rajesh Patel"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Mobile Number</label>
                    <input
                      type="tel"
                      className={`form-input ${errors.mobile ? 'error' : ''}`}
                      placeholder="98XXXXXXXX"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    />
                    {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address (Optional)</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message (Optional)</label>
                    <textarea
                      className="form-textarea"
                      placeholder="How can we help you?"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full btn-lg"
                    disabled={mutation.isPending}
                    style={{ marginTop: 'var(--space-2)' }}
                  >
                    {mutation.isPending ? 'Sending...' : <><Send size={18} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-16);
          align-items: start;
        }
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-8);
        }
        .contact-item {
          display: flex;
          gap: var(--space-4);
          align-items: flex-start;
        }
        .contact-icon {
          width: 48px; height: 48px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          display: flex; align-items: center; justify-content: center;
          color: var(--color-black);
          flex-shrink: 0;
        }
        .contact-label {
          font-size: var(--text-xs);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          margin-bottom: 4px;
        }
        .contact-value {
          font-size: var(--text-lg);
          font-weight: 500;
          color: var(--color-text-primary);
        }
        .contact-form-container {
          background: var(--color-surface);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--color-border);
          padding: var(--space-8);
        }
        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .contact-success {
          text-align: center;
          padding: var(--space-8) 0;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: var(--space-10); }
          .contact-form-container { padding: var(--space-6); }
        }
      `}</style>
    </>
  );
}
