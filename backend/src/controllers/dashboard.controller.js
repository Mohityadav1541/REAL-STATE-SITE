const prisma = require('../utils/prisma');

const getDashboard = async (req, res) => {
  try {
    const [
      totalProjects,
      totalPlots,
      availablePlots,
      holdPlots,
      bookedPlots,
      soldPlots,
      totalCustomers,
      totalLeads,
      newLeads,
      totalSiteVisits,
      pendingSiteVisits,
      recentLeads,
      recentSiteVisits,
      recentCustomers,
    ] = await Promise.all([
      prisma.project.count({ where: { isActive: true } }),
      prisma.plot.count({ where: { isActive: true } }),
      prisma.plot.count({ where: { status: 'AVAILABLE', isActive: true } }),
      prisma.plot.count({ where: { status: 'HOLD', isActive: true } }),
      prisma.plot.count({ where: { status: 'BOOKED', isActive: true } }),
      prisma.plot.count({ where: { status: 'SOLD', isActive: true } }),
      prisma.customer.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.siteVisit.count(),
      prisma.siteVisit.count({ where: { status: 'REQUESTED' } }),
      prisma.lead.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, mobile: true, email: true } },
          project: { select: { id: true, name: true, slug: true } },
          plot: { select: { id: true, plotNumber: true, facing: true } },
        },
      }),
      prisma.siteVisit.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: { select: { id: true, name: true, mobile: true, email: true } },
          project: { select: { id: true, name: true, slug: true } },
          plot: { select: { id: true, plotNumber: true } },
        },
      }),
      prisma.customer.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          leads: { select: { id: true, status: true, source: true, createdAt: true }, take: 1, orderBy: { createdAt: 'desc' } },
        },
      }),
    ]);

    res.json({
      stats: {
        totalProjects,
        totalPlots,
        availablePlots,
        holdPlots,
        bookedPlots,
        soldPlots,
        totalCustomers,
        totalLeads,
        newLeads,
        totalSiteVisits,
        pendingSiteVisits,
        // Nested structure compatibility
        projects: { total: totalProjects },
        plots: {
          total: totalPlots,
          AVAILABLE: availablePlots,
          HOLD: holdPlots,
          BOOKED: bookedPlots,
          SOLD: soldPlots,
        },
        customers: { total: totalCustomers },
        leads: { total: totalLeads, NEW: newLeads },
        siteVisits: { total: totalSiteVisits, PENDING: pendingSiteVisits, REQUESTED: pendingSiteVisits },
      },
      recentLeads,
      recentSiteVisits,
      recentCustomers,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboard };
