import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach admin token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      if (isAdminRoute && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Public API ───────────────────────────────────────────────
export const publicApi = {
  getProjects: () => api.get('/projects').then((r) => r.data),
  getProject: (slug) => api.get(`/projects/${slug}`).then((r) => r.data),
  getProjectPlots: (slug) => api.get(`/projects/${slug}/plots`).then((r) => r.data),
  getPlot: (id) => api.get(`/plots/${id}`).then((r) => r.data),
  submitLead: (data) => api.post('/leads', data).then((r) => r.data),
  submitSiteVisit: (data) => api.post('/site-visits', data).then((r) => r.data),
  adminLogin: (data) => api.post('/auth/login', data).then((r) => r.data),
};

// ─── Admin Auth API ───────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data).then((r) => r.data),
  adminLogin: (data) => api.post('/auth/login', data).then((r) => r.data),
  getMe: () => api.get('/admin/me').then((r) => r.data),
};

// ─── Admin API ────────────────────────────────────────────────
export const adminApi = {
  // Dashboard
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  getStats: () => api.get('/admin/dashboard').then((r) => r.data),

  // Projects
  getProjects: () => api.get('/admin/projects').then((r) => r.data),
  getProject: (id) => api.get(`/admin/projects/${id}`).then((r) => r.data),
  createProject: (data) => api.post('/admin/projects', data).then((r) => r.data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data).then((r) => r.data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`).then((r) => r.data),
  uploadProjectImage: (id, formData) =>
    api.post(`/admin/projects/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data),
  deleteProjectImage: (projectId, imageId) =>
    api.delete(`/admin/projects/${projectId}/images/${imageId}`).then((r) => r.data),

  // Plots
  getPlots: (params) => api.get('/admin/plots', { params }).then((r) => r.data),
  getPlot: (id) => api.get(`/admin/plots/${id}`).then((r) => r.data),
  createPlot: (data) => api.post('/admin/plots', data).then((r) => r.data),
  updatePlot: (id, data) => api.put(`/admin/plots/${id}`, data).then((r) => r.data),
  deletePlot: (id) => api.delete(`/admin/plots/${id}`).then((r) => r.data),

  // Leads
  getLeads: (params) => api.get('/admin/leads', { params }).then((r) => r.data),
  getLead: (id) => api.get(`/admin/leads/${id}`).then((r) => r.data),
  updateLead: (id, data) => api.put(`/admin/leads/${id}`, data).then((r) => r.data),

  // Site Visits
  getSiteVisits: (params) => api.get('/admin/site-visits', { params }).then((r) => r.data),
  getSiteVisit: (id) => api.get(`/admin/site-visits/${id}`).then((r) => r.data),
  updateSiteVisit: (id, data) => api.put(`/admin/site-visits/${id}`, data).then((r) => r.data),

  // QR Generation
  generateQR: async ({ projectId, plotId }) => {
    const projectRes = await api.get(`/admin/projects/${projectId}`);
    const project = projectRes.data?.project || projectRes.data;
    let targetUrl = `${window.location.origin}/projects/${project.slug || project.id}`;
    if (plotId) {
      const plotRes = await api.get(`/admin/plots/${plotId}`);
      const plot = plotRes.data?.plot || plotRes.data;
      targetUrl += `?plot=${plot.plotNumber || plot.id}`;
    }
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(targetUrl)}`;
    return { url: targetUrl, qrCodeUrl };
  },
};

export default api;
