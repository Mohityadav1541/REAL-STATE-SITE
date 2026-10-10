import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { MessageCircle, Phone, X, Send, CheckCircle } from 'lucide-react';
import { publicApi } from '../lib/api';
import { getPlotWhatsApp, getProjectWhatsApp } from '../utils/helpers';

export default function EnquiryModal({ isOpen, onClose, project, plot, source = 'WEBSITE' }) {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

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
      projectId: project?.id,
      plotId: plot?.id,
      source,
    });
  };

  const handleClose = () => {
    setForm({ name: '', mobile: '', email: '', message: '' });
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const whatsappUrl = plot
    ? getPlotWhatsApp(plot.plotNumber, project?.name)
    : getProjectWhatsApp(project?.name || 'SS Developers');

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="section-label" style={{ textAlign: 'left', marginBottom: 4 }}>
              {plot ? `Plot ${plot.plotNumber}` : project?.name || 'Enquiry'}
            </div>
            <h3 className="modal-title">Connect with SS Developers</h3>
          </div>
          <button className="btn btn-icon btn-outline" onClick={handleClose} style={{ border: 'none' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', background: 'var(--color-available-bg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)'
              }}>
                <CheckCircle size={32} color="var(--color-available)" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', marginBottom: 'var(--space-2)' }}>
                Thank You!
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)' }}>
                Our SS Developers team will contact you shortly.
              </p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                <MessageCircle size={16} />
                Also WhatsApp Us
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {project && (
                  <div style={{ padding: 'var(--space-3) var(--space-4)', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Enquiring for: </span>
                    <strong>{plot ? `Plot ${plot.plotNumber} — ` : ''}{project.name}</strong>
                  </div>
                )}
                
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

                <div className="form-group">
                  <label className="form-label">Email (Optional)</label>
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
                    placeholder="Your enquiry or questions..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={mutation.isPending}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  {mutation.isPending ? (
                    <><span className="spinner spinner-sm" /> Submitting...</>
                  ) : (
                    <><Send size={16} /> Send Enquiry</>
                  )}
                </button>
              </div>

              <div className="divider" style={{ margin: 'var(--space-4) 0' }} />

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  style={{ flex: 1 }}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href="tel:9898649979" className="btn btn-outline" style={{ flex: 1 }}>
                  <Phone size={16} /> Call Us
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
