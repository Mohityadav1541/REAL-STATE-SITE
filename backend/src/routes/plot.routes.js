const express = require('express');
const router = express.Router();
const { getPlotById } = require('../controllers/plot.controller');

// GET /api/plots/:id
router.get('/:id', getPlotById);

module.exports = router;
