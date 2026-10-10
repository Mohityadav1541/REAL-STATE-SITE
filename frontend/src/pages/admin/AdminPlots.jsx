import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  Search, Save, Plus, Compass, Edit, Trash2, X, 
  AlertCircle 
} from 'lucide-react';
import { adminApi, publicApi } from '../../lib/api';
import { usePlotsStream } from '../../hooks/usePlotsStream';

const STATUS_OPTIONS = ['AVAILABLE', 'HOLD', 'BOOKED', 'SOLD'];

const FACING_OPTIONS = [
  'North Facing',
  'East Facing',
  'West Facing',
  'South Facing',
  'North-East Facing',
  'North-West Facing',
  'South-East Facing',
  'South-West Facing',
];

export default function AdminPlots() {
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterFacing, setFilterFacing] = useState('ALL');

  // Inline editing state
  const [editingPlotId, setEditingPlotId] = useState(null);
  const [inlineForm, setInlineForm] = useState({});

  // Add Plot modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    projectId: '',
    plotNumber: '',
    facing: 'North Facing',
    status: 'AVAILABLE',
    area: '',
    areaUnit: 'sqft',
    price: '',
    priceUnit: 'total',
    roadWidth: '30 ft',
    notes: '',
  });

  // Full Edit Plot modal state
  const [editingModalPlot, setEditingModalPlot] = useState(null);
  const [modalForm, setModalForm] = useState({});

  const { data: projectsData } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => adminApi.getProjects(),
  });

  const projects = projectsData?.projects || [];

  // Default to first project if none selected
  if (!selectedProject && projects.length > 0) {
    setSelectedProject(projects[0].slug);
  }

  // Find active project object
  const currentProjectObj = projects.find((p) => p.slug === selectedProject);

  const { data: plotsData, isLoading } = useQuery({
    queryKey: ['project-plots', selectedProject],
    queryFn: () => publicApi.getProjectPlots(selectedProject),
    enabled: !!selectedProject,
    refetchInterval: 4000, // Live poll every 4 seconds
  });

  usePlotsStream(selectedProject);

  const plots = plotsData?.plots || [];

  // ─── Mutations ───────────────────────────────────────────────

  const createPlotMutation = useMutation({
    mutationFn: (data) => adminApi.createPlot(data),
    onSuccess: () => {
      toast.success('Plot created successfully');
      setIsAddModalOpen(false);
      setAddForm({
        projectId: currentProjectObj?.id || '',
        plotNumber: '',
        facing: 'North Facing',
        status: 'AVAILABLE',
        area: '',
        areaUnit: 'sqft',
        price: '',
        priceUnit: 'total',
        roadWidth: '30 ft',
        notes: '',
      });
      queryClient.invalidateQueries(['project-plots', selectedProject]);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to create plot');
    },
  });

  const updatePlotMutation = useMutation({
    mutationFn: ({ id, data }) => adminApi.updatePlot(id, data),
    onSuccess: () => {
      toast.success('Plot updated successfully');
      setEditingPlotId(null);
      setEditingModalPlot(null);
      queryClient.invalidateQueries(['project-plots', selectedProject]);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to update plot');
    },
  });

  const deletePlotMutation = useMutation({
    mutationFn: (id) => adminApi.deletePlot(id),
    onSuccess: () => {
      toast.success('Plot archived successfully');
      queryClient.invalidateQueries(['project-plots', selectedProject]);
      queryClient.invalidateQueries(['admin-stats']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || 'Failed to archive plot');
    },
  });

  // ─── Handlers ────────────────────────────────────────────────

  const handleOpenAddModal = () => {
    setAddForm((prev) => ({
      ...prev,
      projectId: currentProjectObj?.id || (projects[0]?.id || ''),
    }));
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.projectId) {
      toast.error('Please select a project');
      return;
    }
    if (!addForm.plotNumber.trim()) {
      toast.error('Plot number is required');
      return;
    }

    createPlotMutation.mutate({
      ...addForm,
      area: addForm.area ? Number(addForm.area) : null,
      price: addForm.price ? Number(addForm.price) : null,
    });
  };

  const handleStartInlineEdit = (plot) => {
    setEditingPlotId(plot.id);
    setInlineForm({
      status: plot.status,
      facing: plot.facing || 'North Facing',
      price: plot.price || '',
      area: plot.area || '',
      roadWidth: plot.roadWidth || '',
    });
  };

  const handleSaveInline = (id) => {
    updatePlotMutation.mutate({
      id,
      data: {
        status: inlineForm.status,
        facing: inlineForm.facing,
        price: inlineForm.price ? Number(inlineForm.price) : null,
        area: inlineForm.area ? Number(inlineForm.area) : null,
        roadWidth: inlineForm.roadWidth,
      },
    });
  };

  const handleOpenModalEdit = (plot) => {
    setEditingModalPlot(plot);
    setModalForm({
      plotNumber: plot.plotNumber,
      status: plot.status,
      facing: plot.facing || 'North Facing',
      area: plot.area || '',
      areaUnit: plot.areaUnit || 'sqft',
      price: plot.price || '',
      priceUnit: plot.priceUnit || 'total',
      roadWidth: plot.roadWidth || '',
      notes: plot.notes || '',
    });
  };

  const handleModalSave = (e) => {
    e.preventDefault();
    if (!editingModalPlot) return;
    updatePlotMutation.mutate({
      id: editingModalPlot.id,
      data: {
        ...modalForm,
        area: modalForm.area ? Number(modalForm.area) : null,
        price: modalForm.price ? Number(modalForm.price) : null,
      },
    });
  };

  const handleDeletePlot = (plot) => {
    if (window.confirm(`Are you sure you want to archive Plot ${plot.plotNumber}?`)) {
      deletePlotMutation.mutate(plot.id);
    }
  };

  // ─── Filter Logic ────────────────────────────────────────────

  const filteredPlots = plots.filter((p) => {
    const matchesSearch =
      search === '' ||
      p.plotNumber.toLowerCase().includes(search.toLowerCase()) ||
      (p.facing && p.facing.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    const matchesFacing =
      filterFacing === 'ALL' ||
      (p.facing && p.facing.toLowerCase().includes(filterFacing.toLowerCase()));

    return matchesSearch && matchesStatus && matchesFacing;
  });

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Plot Inventory & Directions</h1>
          <p className="admin-page-sub">
            Manage plot details, orientations (North/East/West/South facing), pricing, and real-time availability
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} /> Add New Plot
        </button>
      </div>

      {/* Filter and Project Selector Bar */}
      <div className="admin-card" style={{ marginBottom: 24, padding: 18 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {/* Project Selector */}
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600 }}>Select Project</label>
            <select
              className="form-input"
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setEditingPlotId(null);
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name} ({p.location})
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div style={{ flex: '1 1 200px' }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600 }}>Search Plot / Facing</label>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="text"
                className="form-input"
                placeholder="Plot no. or facing..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div style={{ flex: '1 1 140px' }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600 }}>Filter Status</label>
            <select
              className="form-input"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Facing Filter */}
          <div style={{ flex: '1 1 160px' }}>
            <label className="form-label" style={{ fontSize: 12, fontWeight: 600 }}>Filter Facing</label>
            <select
              className="form-input"
              value={filterFacing}
              onChange={(e) => setFilterFacing(e.target.value)}
            >
              <option value="ALL">All Directions</option>
              {FACING_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Plots Table Card */}
      <div className="admin-card">
        {isLoading ? (
          <div style={{ padding: 48, textAlign: 'center' }}>
            <div className="skeleton" style={{ height: 200, borderRadius: 12 }} />
          </div>
        ) : filteredPlots.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#64748b' }}>
            <AlertCircle size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ fontWeight: 500, fontSize: 15 }}>No plots found matching your filters.</p>
            <button className="btn btn-outline btn-sm" onClick={handleOpenAddModal} style={{ marginTop: 8 }}>
              <Plus size={14} /> Add Plot to this Project
            </button>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Plot No.</th>
                  <th style={{ width: 180 }}>Direction / Facing</th>
                  <th style={{ width: 130 }}>Status</th>
                  <th style={{ width: 130 }}>Area</th>
                  <th style={{ width: 140 }}>Price (₹)</th>
                  <th style={{ width: 110 }}>Road Width</th>
                  <th style={{ textAlign: 'right', width: 180 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlots.map((plot) => {
                  const isInlineEditing = editingPlotId === plot.id;

                  return (
                    <tr key={plot.id} style={{ background: isInlineEditing ? '#f8fafc' : undefined }}>
                      {/* Plot Number */}
                      <td style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                        {plot.plotNumber}
                      </td>

                      {/* Direction / Facing */}
                      <td>
                        {isInlineEditing ? (
                          <select
                            className="form-input"
                            style={{ padding: '5px 8px', fontSize: 13 }}
                            value={inlineForm.facing}
                            onChange={(e) => setInlineForm({ ...inlineForm, facing: e.target.value })}
                          >
                            {FACING_OPTIONS.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        ) : (
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 }}>
                            <Compass size={14} />
                            <span>{plot.facing || 'Facing TBD'}</span>
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        {isInlineEditing ? (
                          <select
                            className="form-input"
                            style={{ padding: '5px 8px', fontSize: 13 }}
                            value={inlineForm.status}
                            onChange={(e) => setInlineForm({ ...inlineForm, status: e.target.value })}
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`badge badge-${plot.status.toLowerCase()}`}>
                            {plot.status}
                          </span>
                        )}
                      </td>

                      {/* Area */}
                      <td>
                        {isInlineEditing ? (
                          <input
                            type="number"
                            className="form-input"
                            style={{ padding: '5px 8px', fontSize: 13, width: 90 }}
                            value={inlineForm.area}
                            onChange={(e) => setInlineForm({ ...inlineForm, area: e.target.value })}
                            placeholder="Area"
                          />
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 500 }}>
                            {plot.area ? `${plot.area.toLocaleString()} ${plot.areaUnit || 'sqft'}` : '-'}
                          </span>
                        )}
                      </td>

                      {/* Price */}
                      <td>
                        {isInlineEditing ? (
                          <input
                            type="number"
                            className="form-input"
                            style={{ padding: '5px 8px', fontSize: 13, width: 110 }}
                            value={inlineForm.price}
                            onChange={(e) => setInlineForm({ ...inlineForm, price: e.target.value })}
                            placeholder="Price"
                          />
                        ) : (
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                            {plot.price ? `₹${plot.price.toLocaleString('en-IN')}` : '-'}
                          </span>
                        )}
                      </td>

                      {/* Road Width */}
                      <td>
                        {isInlineEditing ? (
                          <input
                            type="text"
                            className="form-input"
                            style={{ padding: '5px 8px', fontSize: 13, width: 80 }}
                            value={inlineForm.roadWidth}
                            onChange={(e) => setInlineForm({ ...inlineForm, roadWidth: e.target.value })}
                            placeholder="e.g. 40 ft"
                          />
                        ) : (
                          <span style={{ fontSize: 13, color: '#64748b' }}>
                            {plot.roadWidth || '-'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        {isInlineEditing ? (
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSaveInline(plot.id)}
                              disabled={updatePlotMutation.isPending}
                            >
                              <Save size={13} /> Save
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => setEditingPlotId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleStartInlineEdit(plot)}
                              title="Quick edit facing, status, and price"
                            >
                              Quick Edit
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleOpenModalEdit(plot)}
                              title="Edit all plot specifications"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              className="btn btn-outline btn-sm"
                              onClick={() => handleDeletePlot(plot)}
                              style={{ color: '#ef4444' }}
                              title="Archive plot"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── ADD PLOT MODAL ──────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Add New Plot</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Register a plot with full orientation details, size, and pricing
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsAddModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="modal-body">
              {/* Project Selection */}
              <div className="form-group">
                <label className="form-label required">Target Project</label>
                <select
                  className="form-input"
                  value={addForm.projectId}
                  onChange={(e) => setAddForm({ ...addForm, projectId: e.target.value })}
                  required
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.location})</option>
                  ))}
                </select>
              </div>

              {/* Grid 2-col: Plot Number & Direction/Facing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label required">Plot Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. A-101, Plot 12"
                    value={addForm.plotNumber}
                    onChange={(e) => setAddForm({ ...addForm, plotNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Direction / Facing</label>
                  <select
                    className="form-input"
                    value={addForm.facing}
                    onChange={(e) => setAddForm({ ...addForm, facing: e.target.value })}
                    required
                  >
                    {FACING_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid 2-col: Status & Road Width */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <select
                    className="form-input"
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Road Width</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 40 ft road"
                    value={addForm.roadWidth}
                    onChange={(e) => setAddForm({ ...addForm, roadWidth: e.target.value })}
                  />
                </div>
              </div>

              {/* Grid 2-col: Area & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Plot Area ({addForm.areaUnit})</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 2500"
                    value={addForm.area}
                    onChange={(e) => setAddForm({ ...addForm, area: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Total Price (₹)</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    placeholder="e.g. 4500000"
                    value={addForm.price}
                    onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Notes / Features (Optional)</label>
                <textarea
                  className="form-input"
                  rows={2}
                  placeholder="e.g. Prime corner plot, adjacent to 60-feet main spine road"
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                />
              </div>

              {/* Modal Actions */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={createPlotMutation.isPending}
                >
                  {createPlotMutation.isPending ? 'Creating Plot...' : 'Save & Add Plot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── FULL EDIT PLOT MODAL ─────────────────────────────────── */}
      {editingModalPlot && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
                  Edit Plot {editingModalPlot.plotNumber}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
                  Update orientation direction, dimensions, pricing, and availability
                </p>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingModalPlot(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="modal-body">
              {/* Plot Number & Facing */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label required">Plot Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.plotNumber}
                    onChange={(e) => setModalForm({ ...modalForm, plotNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">Direction / Facing</label>
                  <select
                    className="form-input"
                    value={modalForm.facing}
                    onChange={(e) => setModalForm({ ...modalForm, facing: e.target.value })}
                    required
                  >
                    {FACING_OPTIONS.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status & Road Width */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-input"
                    value={modalForm.status}
                    onChange={(e) => setModalForm({ ...modalForm, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Road Width</label>
                  <input
                    type="text"
                    className="form-input"
                    value={modalForm.roadWidth}
                    onChange={(e) => setModalForm({ ...modalForm, roadWidth: e.target.value })}
                  />
                </div>
              </div>

              {/* Area & Price */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Area ({modalForm.areaUnit || 'sqft'})</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={modalForm.area}
                    onChange={(e) => setModalForm({ ...modalForm, area: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="any"
                    className="form-input"
                    value={modalForm.price}
                    onChange={(e) => setModalForm({ ...modalForm, price: e.target.value })}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={modalForm.notes}
                  onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingModalPlot(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={updatePlotMutation.isPending}
                >
                  {updatePlotMutation.isPending ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal & Badge Styles */}
      <style>{`
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          padding: 20px;
        }
        .modal-card {
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 560px;
          overflow: hidden;
          animation: modalFadeIn 0.2s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }
        .modal-close-btn {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-close-btn:hover {
          color: #0f172a;
          background: #e2e8f0;
        }
        .modal-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 12px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }
        .badge-available { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .badge-hold { background: #ffedd5; color: #9a3412; border: 1px solid #fed7aa; }
        .badge-booked { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .badge-sold { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
      `}</style>
    </div>
  );
}
