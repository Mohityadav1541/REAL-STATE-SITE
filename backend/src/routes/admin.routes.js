const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getDashboard } = require('../controllers/dashboard.controller');
const {
  adminGetAllProjects, adminGetProject, adminCreateProject,
  adminUpdateProject, adminDeleteProject, adminUploadImage, adminDeleteImage,
} = require('../controllers/project.controller');
const {
  adminGetAllPlots, adminGetPlot, adminCreatePlot, adminUpdatePlot, adminDeletePlot,
} = require('../controllers/plot.controller');
const {
  adminGetLeads, adminGetLead, adminUpdateLead,
} = require('../controllers/lead.controller');
const {
  adminGetSiteVisits, adminGetSiteVisit, adminUpdateSiteVisit,
} = require('../controllers/siteVisit.controller');
const { upload } = require('../utils/cloudinary');

// Apply auth to all admin routes
router.use(authenticate);

// ─── Dashboard ────────────────────────────────────────────────
router.get('/dashboard', getDashboard);

// ─── Admin Auth ────────────────────────────────────────────────
const { getMe } = require('../controllers/auth.controller');
router.get('/me', getMe);

// ─── Projects ─────────────────────────────────────────────────
router.get('/projects', adminGetAllProjects);
router.get('/projects/:id', adminGetProject);
router.post('/projects', adminCreateProject);
router.put('/projects/:id', adminUpdateProject);
router.delete('/projects/:id', adminDeleteProject);
router.post('/projects/:id/images', upload.single('image'), adminUploadImage);
router.delete('/projects/:id/images/:imageId', adminDeleteImage);

// ─── Plots ────────────────────────────────────────────────────
router.get('/plots', adminGetAllPlots);
router.get('/plots/:id', adminGetPlot);
router.post('/plots', adminCreatePlot);
router.put('/plots/:id', adminUpdatePlot);
router.delete('/plots/:id', adminDeletePlot);

// ─── Leads ────────────────────────────────────────────────────
router.get('/leads', adminGetLeads);
router.get('/leads/:id', adminGetLead);
router.put('/leads/:id', adminUpdateLead);

// ─── Site Visits ──────────────────────────────────────────────
router.get('/site-visits', adminGetSiteVisits);
router.get('/site-visits/:id', adminGetSiteVisit);
router.put('/site-visits/:id', adminUpdateSiteVisit);

module.exports = router;
