const prisma = require('../utils/prisma');
const plotEmitter = require('../utils/events');

// ─── Public ───────────────────────────────────────────────────

const getPlotById = async (req, res) => {
  try {
    const { id } = req.params;
    const plot = await prisma.plot.findFirst({
      where: { id, isActive: true },
      include: {
        project: {
          select: { id: true, name: true, slug: true, location: true },
        },
      },
    });
    if (!plot) return res.status(404).json({ error: 'Plot not found' });
    res.json({ plot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plot' });
  }
};

// ─── Admin ────────────────────────────────────────────────────

const adminGetAllPlots = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    const where = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;

    const plots = await prisma.plot.findMany({
      where,
      include: { project: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ project: { name: 'asc' } }, { plotNumber: 'asc' }],
    });
    res.json({ plots });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plots' });
  }
};

const adminGetPlot = async (req, res) => {
  try {
    const { id } = req.params;
    const plot = await prisma.plot.findUnique({
      where: { id },
      include: {
        project: { select: { id: true, name: true, slug: true } },
        leads: { include: { customer: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!plot) return res.status(404).json({ error: 'Plot not found' });
    res.json({ plot });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch plot' });
  }
};

const adminCreatePlot = async (req, res) => {
  try {
    const { projectId, plotNumber, area, areaUnit, price, priceUnit, facing, roadWidth, status, notes } = req.body;

    if (!projectId || !plotNumber) {
      return res.status(400).json({ error: 'Project and Plot number are required' });
    }

    const plot = await prisma.plot.create({
      data: {
        projectId,
        plotNumber: String(plotNumber).trim(),
        area: area !== undefined && area !== '' && area !== null ? parseFloat(area) : null,
        areaUnit: areaUnit || 'sqft',
        price: price !== undefined && price !== '' && price !== null ? parseFloat(price) : null,
        priceUnit: priceUnit || 'total',
        facing: facing ? String(facing).trim() : null,
        roadWidth: roadWidth ? String(roadWidth).trim() : null,
        status: status || 'AVAILABLE',
        notes: notes ? String(notes).trim() : null,
      },
      include: {
        project: { select: { id: true, name: true, slug: true } },
      },
    });
    
    plotEmitter.emit('plotUpdated', projectId);
    plotEmitter.emit('dashboardUpdated');
    
    res.status(201).json({ plot });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Plot number already exists in this project' });
    }
    console.error('Create plot error:', error);
    res.status(500).json({ error: 'Failed to create plot' });
  }
};

const adminUpdatePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { plotNumber, area, areaUnit, price, priceUnit, facing, roadWidth, status, notes, isActive } = req.body;

    const updateData = {};
    if (plotNumber !== undefined) updateData.plotNumber = String(plotNumber).trim();
    if (area !== undefined) updateData.area = (area !== '' && area !== null) ? parseFloat(area) : null;
    if (areaUnit !== undefined) updateData.areaUnit = areaUnit;
    if (price !== undefined) updateData.price = (price !== '' && price !== null) ? parseFloat(price) : null;
    if (priceUnit !== undefined) updateData.priceUnit = priceUnit;
    if (facing !== undefined) updateData.facing = facing ? String(facing).trim() : null;
    if (roadWidth !== undefined) updateData.roadWidth = roadWidth ? String(roadWidth).trim() : null;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes ? String(notes).trim() : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const plot = await prisma.plot.update({
      where: { id },
      data: updateData,
      include: {
        project: { select: { id: true, name: true, slug: true } },
      },
    });
    
    plotEmitter.emit('plotUpdated', plot.projectId);
    plotEmitter.emit('dashboardUpdated');
    
    res.json({ plot });
  } catch (error) {
    console.error('Update plot error:', error);
    res.status(500).json({ error: 'Failed to update plot' });
  }
};

const adminDeletePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const plot = await prisma.plot.update({ where: { id }, data: { isActive: false } });
    
    plotEmitter.emit('plotUpdated', plot.projectId);
    plotEmitter.emit('dashboardUpdated');
    
    res.json({ message: 'Plot archived successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive plot' });
  }
};

module.exports = {
  getPlotById,
  adminGetAllPlots,
  adminGetPlot,
  adminCreatePlot,
  adminUpdatePlot,
  adminDeletePlot,
};
