import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, CheckCircle, MessageCircle } from 'lucide-react';
import { publicApi } from '../../lib/api';
import { getGeneralWhatsApp } from '../../utils/helpers';
import SEO from '../../components/SEO';
import { trackSiteVisitRequest } from '../../utils/analytics';

export default function SiteVisitPage() {
  const [searchParams] = useSearchParams();
  const defaultProjectId = searchParams.get('projectId') || '';
  const defaultPlotNumber = searchParams.get('plotNumber') || '';
  
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    projectId: defaultProjectId,
    plotNumber: defaultPlotNumber,
    date: '',
    time: 'MORNING', // MORNING, AFTERNOON, EVENING
    message: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = 'Book Site Visit – RRR Developers';
  }, []);

  // Fetch projects for dropdown
  const { data } = useQuery({
    queryKey: ['projects'],
    queryFn: () => publicApi.getProjects(),
  });
  const projects = data?.projects || [];

  const mutation = useMutation({
    mutationFn: (data) => publicApi.submitSiteVisit(data),
    onSuccess: () => {
      setSubmitted(true);
      trackSiteVisitRequest(form.projectId);
      toast.success('Site visit requested successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to submit request.');
    },
  });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (form.mobile.replace(/\D/g, '').length < 10) newErrors.mobile = 'Enter a valid 10-digit mobile number';
    if (!form.date) newErrors.date = 'Preferred date is required';
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
    // Set status to PENDING implicitly in backend, or explicit here if needed.
    // The backend uses PENDING by default in prisma schema.
    mutation.mutate(form);
  };

  // Get min date (tomorrow)
  // eslint-disable-next-line react/purity
  const tomorrow = new Date();
  // eslint-disable-next-line react/purity
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <SEO
        title="Book an Industrial Land Site Visit | RRR Developers"
        description="Schedule an on-site visit to inspect industrial land, infrastructure, and available plots at RRR Developers projects in Gujarat."
        canonical="/site-visit"
        keywords={[
          'Book industrial site visit',
          'Industrial land tour Gujarat',
          'Inspect industrial plots Surat',
          'RRR Developers site visit',
        ]}
        breadcrumbs={[{ name: 'Site Visit', path: '/site-visit' }]}
      />

      <div className="page-header" style={{ textAlign: 'center', padding: '140px 0 60px', background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <span className="section-label">Site Visit</span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-text-primary)', marginTop: '1rem', fontWeight: 500, letterSpacing: '-0.02em' }}>
            Book an Industrial Land Site Visit
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginTop: '1rem' }}>
            Experience our industrial parks firsthand. Schedule a guided tour with our experts.
          </p>
        </div>
      </div>

      <div className="section bg-light" style={{ minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="sv-card">
            {submitted ? (
              <div className="sv-success">
                <CheckCircle size={56} color="var(--color-available)" style={{ margin: '0 auto var(--space-4)' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>
                  Visit Scheduled!
                </h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-lg)' }}>
                  We have received your site visit request. Our team will contact you shortly to confirm the exact time and meeting point.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center' }}>
                  <a href={getGeneralWhatsApp()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    <MessageCircle size={16} /> Contact via WhatsApp
                  </a>
                  <button className="btn btn-outline" onClick={() => {
                    setSubmitted(false);
                    setForm({ ...form, date: '', message: '' });
                  }}>
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="sv-form">
                
                <div className="sv-form-grid">
                  <div className="form-group">
                    <label className="form-label required">Your Name</label>
                    <input
                      type="text"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Rajesh Patel"
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
                </div>

                <div className="divider" style={{ margin: 'var(--space-2) 0' }} />

                <div className="form-group">
                  <label className="form-label">Project of Interest (Optional)</label>
                  <select
                    className="form-input"
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  >
                    <option value="">Select a project</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {form.projectId && (
                  <div className="form-group">
                    <label className="form-label">Specific Plot Number (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 42"
                      value={form.plotNumber}
                      onChange={(e) => setForm({ ...form, plotNumber: e.target.value })}
                    />
                  </div>
                )}

                <div className="divider" style={{ margin: 'var(--space-2) 0' }} />

                <div className="sv-form-grid">
                  <div className="form-group">
                    <label className="form-label required">Preferred Date</label>
                    <input
                      type="date"
                      className={`form-input ${errors.date ? 'error' : ''}`}
                      min={minDate}
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                    />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Preferred Time</label>
                    <div className="sv-time-group">
                      {['MORNING', 'AFTERNOON', 'EVENING'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={`sv-time-btn ${form.time === time ? 'active' : ''}`}
                          onClick={() => setForm({ ...form, time })}
                        >
                          {time.charAt(0) + time.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Additional Requirements (Optional)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any specific requirements or questions?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-full"
                  disabled={mutation.isPending}
                  style={{ marginTop: 'var(--space-4)' }}
                >
                  {mutation.isPending ? 'Submitting...' : <><CalendarIcon size={18} /> Schedule Site Visit</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .sv-card {
          background: var(--color-surface);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--color-border);
          padding: var(--space-10);
        }
        .sv-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-5);
        }
        .sv-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-5);
        }
        .sv-time-group {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .sv-time-btn {
          padding: 10px 8px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
          font-size: var(--text-xs);
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .sv-time-btn:hover { border-color: var(--color-black); }
        .sv-time-btn.active {
          background: var(--color-black);
          border-color: var(--color-black);
          color: var(--color-white);
        }
        .sv-success {
          text-align: center;
          padding: var(--space-8) 0;
        }
        @media (max-width: 640px) {
          .sv-card { padding: var(--space-6); }
          .sv-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
