const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectBySlug,
  getProjectPlots,
  streamProjectPlots,
} = require('../controllers/project.controller');

// GET /api/projects
router.get('/', getAllProjects);

// GET /api/projects/:slug
router.get('/:slug', getProjectBySlug);

// GET /api/projects/:slug/plots
router.get('/:slug/plots', getProjectPlots);

// GET /api/projects/:slug/plots/stream
router.get('/:slug/plots/stream', streamProjectPlots);

module.exports = router;
