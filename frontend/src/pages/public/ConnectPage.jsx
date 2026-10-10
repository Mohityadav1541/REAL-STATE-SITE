import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Phone, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { publicApi } from '../../lib/api';
import { getProjectWhatsApp } from '../../utils/helpers';

export default function ConnectPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || 'WEBSITE';
  const projectId = searchParams.get('projectId') || '';
  const plotId = searchParams.get('plotId') || '';

  const [form, setForm] = useState({ name: '', mobile: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Connect – SS Developers';
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
    else if (form.mobile.replace(/\D/g, '').length < 10) newErrors.mobile = 'Enter a valid 10-digit mobile number';
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
    mutation.mutate({
      ...form,
      projectId: projectId || undefined,
      plotId: plotId || undefined,
      source: source,
    });
  };

  const isQR = source === 'PROJECT_QR' || source === 'PLOT_QR';
  const whatsappUrl = isQR ? getProjectWhatsApp('SS Developers QR Lead') : getProjectWhatsApp('SS Developers');

  return (
    <div className="connect-wrapper">
      <div className="connect-bg" />
      <div className="container" style={{ position: 'relative', zIndex: 1, padding: '40px 20px', maxWidth: 480 }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div className="connect-logo">
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-white)' }}>SS</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', color: 'var(--color-text-primary)', marginBottom: 8, fontWeight: 500, letterSpacing: '-0.02em' }}>
            SS Developers
          </h1>
          {isQR ? (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', letterSpacing: '0.05em' }}>
              {source === 'PLOT_QR' ? 'Scan successful. Enquire about this plot.' : 'Scan successful. Enquire about this project.'}
            </p>
          ) : (
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', letterSpacing: '0.05em' }}>
              Connect with our team
            </p>
          )}
        </div>

        {/* Card */}
        <div className="connect-card">
          {submitted ? (
            <div className="connect-success">
              <CheckCircle size={64} color="var(--color-available)" style={{ margin: '0 auto var(--space-4)' }} />
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                Thank You!
              </h2>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                Our team has received your details and will contact you immediately.
              </p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp w-full">
                <MessageCircle size={16} /> Continue on WhatsApp
              </a>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="connect-form">
                <div className="form-group">
                  <label className="form-label required">Your Name</label>
                  <input
                    type="text"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter your name"
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
                    placeholder="Enter 10-digit mobile"
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  />
                  {errors.mobile && <span className="form-error">{errors.mobile}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Message (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any specific questions?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={2}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={mutation.isPending}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  {mutation.isPending ? 'Connecting...' : <><ArrowRight size={18} /> Request Callback</>}
                </button>
              </form>

              <div className="connect-divider">
                <span>OR</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-3)' }}>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                  <MessageCircle size={18} /> Chat on WhatsApp
                </a>
                <a href="tel:9898649979" className="btn btn-outline btn-lg">
                  <Phone size={18} /> Call Us Direct
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .connect-wrapper {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
        }
        .connect-bg {
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, rgba(0,0,0,0.03) 0%, transparent 60%);
        }
        .connect-logo {
          width: 64px; height: 64px;
          border-radius: var(--radius-xl);
          background: var(--color-black);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto var(--space-4);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .connect-card {
          background: var(--color-surface);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          border: 1px solid var(--color-border);
        }
        .connect-form {
          display: flex; flex-direction: column; gap: var(--space-4);
        }
        .connect-divider {
          text-align: center; margin: var(--space-6) 0; position: relative;
        }
        .connect-divider::before {
          content: ''; position: absolute; top: 50%; left: 0; right: 0;
          height: 1px; background: var(--color-border);
        }
        .connect-divider span {
          position: relative; background: var(--color-surface);
          padding: 0 var(--space-4); font-size: var(--text-xs);
          color: var(--color-text-muted); font-weight: 600;
        }
        .connect-success {
          text-align: center;
          padding: var(--space-4) 0;
        }
        @media (max-width: 640px) {
          .connect-card { padding: var(--space-6); }
        }
      `}</style>
    </div>
  );
}
