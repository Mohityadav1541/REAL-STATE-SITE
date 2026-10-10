const prisma = require('../utils/prisma');
const plotEmitter = require('../utils/events');

// ─── Public: Submit Lead ──────────────────────────────────────
const submitLead = async (req, res) => {
  try {
    const { name, mobile, email, message, projectId, plotId, source = 'WEBSITE' } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ error: 'Name and mobile number are required' });
    }

    // Validate mobile (10 digits)
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      return res.status(400).json({ error: 'Please provide a valid mobile number' });
    }

    // Find or create customer
    let customer = await prisma.customer.findFirst({
      where: { mobile: cleanMobile },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: name.trim(),
          mobile: cleanMobile,
          email: email ? email.trim().toLowerCase() : null,
        },
      });
    } else {
      // Update name/email if changed
      await prisma.customer.update({
        where: { id: customer.id },
        data: {
          name: name.trim(),
          email: email ? email.trim().toLowerCase() : customer.email,
        },
      });
    }

    // Validate projectId if provided
    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project) {
        return res.status(400).json({ error: 'Invalid project' });
      }
    }

    // Validate plotId if provided
    if (plotId) {
      const plot = await prisma.plot.findUnique({ where: { id: plotId } });
      if (!plot) {
        return res.status(400).json({ error: 'Invalid plot' });
      }
    }

    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        projectId: projectId || null,
        plotId: plotId || null,
        source,
        message: message ? message.trim() : null,
        status: 'NEW',
      },
      include: {
        customer: { select: { id: true, name: true, mobile: true } },
        project: { select: { id: true, name: true } },
        plot: { select: { id: true, plotNumber: true } },
      },
    });

    plotEmitter.emit('dashboardUpdated');

    res.status(201).json({
      success: true,
      message: 'Thank you. Our SS Developers team will contact you shortly.',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Submit lead error:', error);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again.' });
  }
};

// ─── Admin: Get All Leads ─────────────────────────────────────
const adminGetLeads = async (req, res) => {
  try {
    const { status, source, projectId, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (source) where.source = source;
    if (projectId) where.projectId = projectId;

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        include: {
          customer: true,
          project: { select: { id: true, name: true, slug: true } },
          plot: { select: { id: true, plotNumber: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit),
      }),
      prisma.lead.count({ where }),
    ]);

    res.json({ leads, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

const adminGetLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        customer: true,
        project: true,
        plot: true,
      },
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json({ lead });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lead' });
  }
};

const adminUpdateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, followUpAt } = req.body;

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (followUpAt !== undefined) updateData.followUpAt = followUpAt ? new Date(followUpAt) : null;

    const lead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        project: { select: { id: true, name: true } },
        plot: { select: { id: true, plotNumber: true } },
      },
    });

    plotEmitter.emit('dashboardUpdated');

    res.json({ lead });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lead' });
  }
};

module.exports = { submitLead, adminGetLeads, adminGetLead, adminUpdateLead };
