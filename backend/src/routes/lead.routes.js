const express = require('express');
const router = express.Router();
const { submitLead } = require('../controllers/lead.controller');

// POST /api/leads
router.post('/', submitLead);

module.exports = router;
