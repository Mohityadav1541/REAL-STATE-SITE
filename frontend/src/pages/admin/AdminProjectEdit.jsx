import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Save, ChevronLeft, Image as ImageIcon, X, Plus 
} from 'lucide-react';
import { adminApi } from '../../lib/api';

export default function AdminProjectEdit() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    name: '',
    slug: '',
    location: '',
    address: '',
    description: '',
    tagline: '',
    highlights: [],
    infrastructure: [],
    connectivity: [],
    amenities: [],
    lat: '',
    lng: '',
    isActive: true,
  });

  const [images, setImages] = useState([]);
  const [newHighlight, setNewHighlight] = useState('');
  const [newInfra, setNewInfra] = useState('');
  const [newConnect, setNewConnect] = useState('');
  const [newAmenity, setNewAmenity] = useState('');

  // Fetch project details for existing project
  const { data, isLoading } = useQuery({
    queryKey: ['admin-project', id],
    queryFn: () => adminApi.getProject(id),
    enabled: !isNew,
  });

  useEffect(() => {
    if (!isNew && data?.project) {
      const proj = data.project;
      // eslint-disable-next-line react/set-state-in-effect
      setForm({
        name: proj.name || '',
        slug: proj.slug || '',
        location: proj.location || '',
        address: proj.address || '',
        description: proj.description || '',
        tagline: proj.tagline || '',
        highlights: Array.isArray(proj.highlights) ? proj.highlights : [],
        infrastructure: Array.isArray(proj.infrastructure) ? proj.infrastructure : [],
        connectivity: Array.isArray(proj.connectivity) ? proj.connectivity : [],
        amenities: Array.isArray(proj.amenities) ? proj.amenities : [],
        lat: proj.lat !== null && proj.lat !== undefined ? proj.lat : '',
        lng: proj.lng !== null && proj.lng !== undefined ? proj.lng : '',
        isActive: proj.isActive !== undefined ? proj.isActive : true,
      });
      setImages(proj.images || []);
    }
  }, [data, isNew]);

  // ─── Mutations ───────────────────────────────────────────────

  const saveMutation = useMutation({
    mutationFn: (dataToSave) => 
      isNew ? adminApi.createProject(dataToSave) : adminApi.updateProject(id, dataToSave),
    onSuccess: (res) => {
      const savedProj = res?.project;
      toast.success(`Project ${isNew ? 'created' : 'updated'} successfully`);
      queryClient.invalidateQueries(['admin-projects']);
      queryClient.invalidateQueries(['admin-stats']);
      
      if (isNew && savedProj?.id) {
        navigate(`/admin/projects/${savedProj.id}/edit`);
      } else {
        navigate('/admin/projects');
      }
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to save project');
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', images.length === 0 ? 'HERO' : 'GALLERY');
      return adminApi.uploadProjectImage(id, formData);
    },
    onSuccess: (dataRes) => {
      toast.success('Image uploaded successfully');
      setImages((prev) => [...prev, dataRes.image]);
      queryClient.invalidateQueries(['admin-project', id]);
      queryClient.invalidateQueries(['admin-projects']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Upload failed');
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => adminApi.deleteProjectImage(id, imageId),
    onSuccess: (_, imageId) => {
      toast.success('Image deleted');
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      queryClient.invalidateQueries(['admin-project', id]);
      queryClient.invalidateQueries(['admin-projects']);
    },
    onError: () => {
      toast.error('Failed to delete image');
    },
  });

  // ─── Handlers ────────────────────────────────────────────────

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Project Name is required');
      return;
    }
    if (!form.location.trim()) {
      toast.error('Location is required');
      return;
    }

    saveMutation.mutate({
      ...form,
      lat: form.lat !== '' ? Number(form.lat) : null,
      lng: form.lng !== '' ? Number(form.lng) : null,
    });
  };

  const handleArrayAdd = (field, value, setter) => {
    if (value.trim()) {
      setForm((prev) => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));
      setter('');
    }
  };

  const handleArrayRemove = (field, index) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isNew) {
        toast.error('Please save the project first before uploading images');
        return;
      }
      uploadImageMutation.mutate(file);
    }
  };

  if (!isNew && isLoading) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <Link
            to="/admin/projects"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              color: '#64748b',
              fontSize: 14,
              marginBottom: 8,
              textDecoration: 'none',
            }}
          >
            <ChevronLeft size={16} /> Back to Projects
          </Link>
          <h1 className="admin-page-title">{isNew ? 'Create New Project' : `Edit: ${form.name}`}</h1>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? 'Saving...' : <><Save size={16} /> Save Project</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 24 }}>
        
        {/* ─── Left Column: Core Project Info ─────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12, color: '#0f172a' }}>
              Project Core Details
            </h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Project Name */}
              <div className="form-group">
                <label className="form-label required">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. SS Industrial Park 1"
                  value={form.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      name: val,
                      slug: isNew
                        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                        : prev.slug,
                    }));
                  }}
                  required
                />
              </div>

              {/* Slug */}
              <div className="form-group">
                <label className="form-label required">URL Slug</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. ss1 or ss-industrial-park-1"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  required
                />
                <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  Used in URL address: /projects/{form.slug || 'project-slug'}
                </span>
              </div>

              {/* Tagline */}
              <div className="form-group">
                <label className="form-label">Marketing Tagline</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Prime Industrial Land on Ubhrat Road"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                />
              </div>

              {/* Location & Address */}
              <div className="form-group">
                <label className="form-label required">Short Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ubhrat Road, Maroli"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ubhrat Road, Maroli, Surat District, Gujarat"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Full Project Overview</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Comprehensive description of the industrial park, zoning, approvals, and advantages..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Coordinates: Lat & Lng */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 21.1702"
                    value={form.lat}
                    onChange={(e) => setForm({ ...form, lat: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 72.8311"
                    value={form.lng}
                    onChange={(e) => setForm({ ...form, lng: e.target.value })}
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="form-group" style={{ marginTop: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    style={{ width: 18, height: 18 }}
                  />
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0f172a' }}>Active & Live on Website</span>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>When enabled, customers can view and enquire about this project</p>
                  </div>
                </label>
              </div>
            </form>
          </div>

          {/* Project Images Card */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #e2e8f0', paddingBottom: 12, color: '#0f172a' }}>
              Project Media & Gallery
            </h3>

            {isNew ? (
              <div style={{ padding: 18, background: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', borderRadius: 8, fontSize: 13 }}>
                👉 Please click <strong>"Save Project"</strong> above first. Once saved, you can immediately upload master plans and site photos here.
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                  {images.map((img) => (
                    <div
                      key={img.id}
                      style={{
                        position: 'relative',
                        width: 110,
                        height: 110,
                        borderRadius: 8,
                        overflow: 'hidden',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => deleteImageMutation.mutate(img.id)}
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'rgba(239, 68, 68, 0.85)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: 22,
                          height: 22,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Delete image"
                      >
                        <X size={13} />
                      </button>
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'rgba(15, 23, 42, 0.75)',
                          color: 'white',
                          fontSize: 10,
                          textAlign: 'center',
                          padding: '3px 0',
                          fontWeight: 600,
                        }}
                      >
                        {img.type}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                  />
                  <div className="btn btn-outline w-full" style={{ justifyContent: 'center', pointerEvents: 'none' }}>
                    {uploadImageMutation.isPending ? 'Uploading...' : <><ImageIcon size={16} /> Upload Project Photo</>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Column: Specifications & Feature Lists ────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Key Highlights */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              Key Highlights
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              Unique selling points featured in the project spotlight
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {form.highlights.map((h, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  <span>{h}</span>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('highlights', i)}
                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Direct highway connectivity"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('highlights', newHighlight, setNewHighlight))}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleArrayAdd('highlights', newHighlight, setNewHighlight)}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              Infrastructure Specifications
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              Internal roads, electricity, water supply, drainage networks
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {form.infrastructure.map((inf, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  <span>{inf}</span>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('infrastructure', i)}
                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 60-feet wide concrete internal road"
                value={newInfra}
                onChange={(e) => setNewInfra(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('infrastructure', newInfra, setNewInfra))}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleArrayAdd('infrastructure', newInfra, setNewInfra)}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Connectivity */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              Connectivity & Highway Access
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              National highways, ports, railway stations, and nearby industrial corridors
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {form.connectivity.map((c, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  <span>{c}</span>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('connectivity', i)}
                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. NH-48 access in 10 mins"
                value={newConnect}
                onChange={(e) => setNewConnect(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('connectivity', newConnect, setNewConnect))}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleArrayAdd('connectivity', newConnect, setNewConnect)}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Amenities & Security */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>
              Amenities & Gated Features
            </h3>
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 14 }}>
              Boundary wall, security cabin, truck parking, street lighting
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {form.amenities.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '8px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => handleArrayRemove('amenities', i)}
                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 24/7 Gated Security & CCTV"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleArrayAdd('amenities', newAmenity, setNewAmenity))}
              />
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => handleArrayAdd('amenities', newAmenity, setNewAmenity)}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
