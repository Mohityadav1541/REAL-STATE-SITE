import { useState } from 'react';

// Auth helpers
export const setToken = (token) => localStorage.setItem('admin_token', token);
export const getToken = () => localStorage.getItem('admin_token');
export const removeToken = () => localStorage.removeItem('admin_token');
export const isAuthenticated = () => !!getToken();

export const useAuth = () => {
  const [token, setTokenState] = useState(getToken());

  const login = (newToken) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return { token, login, logout };
};

// WhatsApp helpers
const WHATSAPP_NUMBER = '9898649979';

export const getWhatsAppURL = (message) => {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/91${WHATSAPP_NUMBER}?text=${encoded}`;
};

export const getProjectWhatsApp = (projectName) => {
  const msg = `Hello, I am interested in ${projectName}.\nI would like information about available industrial plots.`;
  return getWhatsAppURL(msg);
};

export const getPlotWhatsApp = (plotNumber, projectName) => {
  const msg = `Hello, I am interested in Plot ${plotNumber} at ${projectName}.\nPlease share the details.`;
  return getWhatsAppURL(msg);
};

export const getGeneralWhatsApp = () => {
  const msg = `Hello SS Developers,\nI am interested in your industrial land/plot offerings. Please contact me.`;
  return getWhatsAppURL(msg);
};

// Plot status helpers
export const PLOT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  HOLD: 'HOLD',
  BOOKED: 'BOOKED',
  SOLD: 'SOLD',
};

export const LEAD_STATUS = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  INTERESTED: 'INTERESTED',
  SITE_VISIT: 'SITE_VISIT',
  NEGOTIATION: 'NEGOTIATION',
  BOOKED: 'BOOKED',
  CONVERTED: 'CONVERTED',
  LOST: 'LOST',
};

export const LEAD_SOURCE = {
  WEBSITE: 'WEBSITE',
  WHATSAPP: 'WHATSAPP',
  PROJECT_QR: 'PROJECT_QR',
  PLOT_QR: 'PLOT_QR',
  BROCHURE_QR: 'BROCHURE_QR',
  OTHER: 'OTHER',
};

export const VISIT_STATUS = {
  REQUESTED: 'REQUESTED',
  CONFIRMED: 'CONFIRMED',
  RESCHEDULED: 'RESCHEDULED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

export const getStatusColor = (status) => {
  const map = {
    AVAILABLE: 'available',
    HOLD: 'hold',
    BOOKED: 'booked',
    SOLD: 'sold',
  };
  return map[status] || 'sold';
};

export const getLeadStatusColor = (status) => {
  const map = {
    NEW: 'new',
    CONTACTED: 'contacted',
    INTERESTED: 'interested',
    SITE_VISIT: 'site_visit',
    NEGOTIATION: 'negotiation',
    BOOKED: 'booked-lead',
    CONVERTED: 'converted',
    LOST: 'lost',
  };
  return map[status] || 'new';
};

// Date formatting
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Area formatting
export const formatArea = (area, unit = 'sqft') => {
  if (!area) return '—';
  return `${area.toLocaleString('en-IN')} ${unit}`;
};

// Price formatting
export const formatPrice = (price) => {
  if (!price) return 'Contact for price';
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

// Generate QR URL
export const getQRConnectURL = (projectSlug, plotNumber) => {
  const base = window.location.origin;
  const params = new URLSearchParams({ project: projectSlug });
  if (plotNumber) params.append('plot', plotNumber);
  return `${base}/connect?${params.toString()}`;
};
