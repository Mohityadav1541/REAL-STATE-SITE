const prisma = require('../utils/prisma');
const plotEmitter = require('../utils/events');

// ─── Public: Submit Site Visit Request ───────────────────────
const submitSiteVisit = async (req, res) => {
  try {
    const { name, mobile, email, projectId, plotId, preferredDate, preferredTime, message } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile number are required' });
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({ error: 'Please provide a valid mobile number' });
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({ where: { mobile: cleanMobile } });
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: name.trim(),
          mobile: cleanMobile,
          email: email ? email.trim().toLowerCase() : null,
        },
      });
    }

    const siteVisit = await prisma.siteVisit.create({
      data: {
        customerId: customer.id,
        projectId: projectId || null,
        plotId: plotId || null,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        message: message ? message.trim() : null,
        status: 'REQUESTED',
      },
      include: {
        customer: { select: { id: true, name: true, mobile: true } },
        project: { select: { id: true, name: true } },
        plot: { select: { id: true, plotNumber: true } },
      },
    });

    // Also create a lead from site visit
    await prisma.lead.create({
      data: {
        customerId: customer.id,
        projectId: projectId || null,
        plotId: plotId || null,
        source: 'WEBSITE',
        message: `Site visit request for ${preferredDate || 'date TBD'} at ${preferredTime || 'time TBD'}`,
        status: 'SITE_VISIT',
      },
    });

    plotEmitter.emit('dashboardUpdated');

    res.status(201).json({
      success: true,
      message: 'Site visit request submitted. We will confirm your appointment shortly.',
      visitId: siteVisit.id,
    });
  } catch (error) {
    console.error('Submit site visit error:', error);
    res.status(500).json({ error: 'Failed to submit site visit request. Please try again.' });
  }
};

// ─── Admin: Get All Site Visits ───────────────────────────────
const adminGetSiteVisits = async (req, res) => {
  try {
    const { status, projectId, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (projectId) where.projectId = projectId;

    const [visits, total] = await Promise.all([
      prisma.siteVisit.findMany({
        where,
        include: {
          customer: true,
          project: { select: { id: true, name: true } },
          plot: { select: { id: true, plotNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.siteVisit.count({ where }),
    ]);

    res.json({ visits, total });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site visits' });
  }
};

const adminGetSiteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const visit = await prisma.siteVisit.findUnique({
      where: { id },
      include: { customer: true, project: true, plot: true },
    });
    if (!visit) return res.status(404).json({ error: 'Site visit not found' });
    res.json({ visit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site visit' });
  }
};

const adminUpdateSiteVisit = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes, preferredDate, preferredTime } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (preferredDate !== undefined) updateData.preferredDate = preferredDate;
    if (preferredTime !== undefined) updateData.preferredTime = preferredTime;

    const visit = await prisma.siteVisit.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        project: { select: { id: true, name: true } },
        plot: { select: { id: true, plotNumber: true } },
      },
    });

    plotEmitter.emit('dashboardUpdated');

    res.json({ visit });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update site visit' });
  }
};

module.exports = { submitSiteVisit, adminGetSiteVisits, adminGetSiteVisit, adminUpdateSiteVisit };
