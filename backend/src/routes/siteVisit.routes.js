const express = require('express');
const router = express.Router();
const { submitSiteVisit } = require('../controllers/siteVisit.controller');

// POST /api/site-visits
router.post('/', submitSiteVisit);

module.exports = router;
