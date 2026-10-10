const prisma = require('../utils/prisma');
const cloudinary = require('../utils/cloudinary');
const { v4: uuidv4 } = require('uuid');
const plotEmitter = require('../utils/events');

// ─── Public Controllers ───────────────────────────────────────

const getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        _count: {
          select: {
            plots: { where: { isActive: true } },
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Get plot availability counts per project
    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const parsedProject = {
          ...p,
          highlights: p.highlights ? JSON.parse(p.highlights) : [],
          connectivity: p.connectivity ? JSON.parse(p.connectivity) : [],
          infrastructure: p.infrastructure ? JSON.parse(p.infrastructure) : [],
          amenities: p.amenities ? JSON.parse(p.amenities) : [],
        };
        const counts = await prisma.plot.groupBy({
          by: ['status'],
          where: { projectId: p.id, isActive: true },
          _count: { status: true },
        });
        const statusMap = {};
        counts.forEach((c) => { statusMap[c.status] = c._count.status; });
        return { ...parsedProject, plotCounts: statusMap };
      })
    );

    res.json({ projects: projectsWithCounts });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: { order: 'asc' } },
        plots: {
          where: { isActive: true },
          orderBy: { plotNumber: 'asc' },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Plot counts
    const counts = await prisma.plot.groupBy({
      by: ['status'],
      where: { projectId: project.id, isActive: true },
      _count: { status: true },
    });
    const statusMap = {};
    counts.forEach((c) => { statusMap[c.status] = c._count.status; });

    const parsedProject = {
      ...project,
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
      connectivity: project.connectivity ? JSON.parse(project.connectivity) : [],
      infrastructure: project.infrastructure ? JSON.parse(project.infrastructure) : [],
      amenities: project.amenities ? JSON.parse(project.amenities) : [],
    };

    res.json({ project: { ...parsedProject, plotCounts: statusMap } });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

const getProjectPlots = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findUnique({
      where: { slug, isActive: true },
      select: { id: true, name: true, slug: true },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const plots = await prisma.plot.findMany({
      where: { projectId: project.id, isActive: true },
      orderBy: { plotNumber: 'asc' },
    });

    res.json({ project, plots });
  } catch (error) {
    console.error('Get plots error:', error);
    res.status(500).json({ error: 'Failed to fetch plots' });
  }
};

const streamProjectPlots = async (req, res) => {
  const { slug } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendPlots = async () => {
    try {
      const project = await prisma.project.findUnique({
        where: { slug, isActive: true },
        select: { id: true, name: true, slug: true },
      });
      if (!project) return;
      const plots = await prisma.plot.findMany({
        where: { projectId: project.id, isActive: true },
        orderBy: { plotNumber: 'asc' },
      });
      res.write(`data: ${JSON.stringify({ project, plots })}\n\n`);
    } catch (err) {
      console.error('SSE fetch error:', err);
    }
  };

  await sendPlots();

  const pingInterval = setInterval(() => res.write(': ping\n\n'), 30000);

  const updateListener = (projectId) => {
    sendPlots();
  };
  plotEmitter.on('plotUpdated', updateListener);

  req.on('close', () => {
    clearInterval(pingInterval);
    plotEmitter.off('plotUpdated', updateListener);
    res.end();
  });
};

// ─── Admin Controllers ────────────────────────────────────────

const adminGetAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        images: { orderBy: { order: 'asc' } },
        _count: { select: { plots: true, leads: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
    
    const parsedProjects = projects.map(p => ({
      ...p,
      highlights: p.highlights ? JSON.parse(p.highlights) : [],
      connectivity: p.connectivity ? JSON.parse(p.connectivity) : [],
      infrastructure: p.infrastructure ? JSON.parse(p.infrastructure) : [],
      amenities: p.amenities ? JSON.parse(p.amenities) : [],
    }));

    res.json({ projects: parsedProjects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

const adminGetProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        plots: { orderBy: { plotNumber: 'asc' } },
      },
    });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const parsedProject = {
      ...project,
      highlights: project.highlights ? JSON.parse(project.highlights) : [],
      connectivity: project.connectivity ? JSON.parse(project.connectivity) : [],
      infrastructure: project.infrastructure ? JSON.parse(project.infrastructure) : [],
      amenities: project.amenities ? JSON.parse(project.amenities) : [],
    };

    res.json({ project: parsedProject });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

const adminCreateProject = async (req, res) => {
  try {
    const {
      name, slug: customSlug, tagline, description, location, address,
      lat, lng, highlights, connectivity, infrastructure, amenities,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Project name and location are required' });
    }

    const safeParse = (val) => {
      if (!val) return null;
      if (typeof val === 'string') {
        try {
          return JSON.stringify(JSON.parse(val));
        } catch {
          return JSON.stringify([val]);
        }
      }
      return JSON.stringify(val);
    };

    const slug = (customSlug && String(customSlug).trim())
      ? String(customSlug).trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      : name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        slug,
        tagline: tagline ? tagline.trim() : null,
        description: description ? description.trim() : null,
        location: location.trim(),
        address: address ? address.trim() : null,
        lat: (lat !== undefined && lat !== '' && lat !== null) ? parseFloat(lat) : null,
        lng: (lng !== undefined && lng !== '' && lng !== null) ? parseFloat(lng) : null,
        highlights: safeParse(highlights),
        connectivity: safeParse(connectivity),
        infrastructure: safeParse(infrastructure),
        amenities: safeParse(amenities),
      },
    });

    plotEmitter.emit('dashboardUpdated');

    res.status(201).json({ project });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A project with this name or slug already exists' });
    }
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

const adminUpdateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, slug, tagline, description, location, address,
      lat, lng, highlights, connectivity, infrastructure, amenities, isActive,
    } = req.body;

    const safeSerialize = (val) => {
      if (!val) return null;
      if (typeof val === 'string') return val;
      return JSON.stringify(val);
    };

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (slug !== undefined && slug.trim()) {
      updateData.slug = slug.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
    }
    if (tagline !== undefined) updateData.tagline = tagline ? tagline.trim() : null;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (location !== undefined) updateData.location = location.trim();
    if (address !== undefined) updateData.address = address ? address.trim() : null;
    if (lat !== undefined) updateData.lat = (lat !== '' && lat !== null) ? parseFloat(lat) : null;
    if (lng !== undefined) updateData.lng = (lng !== '' && lng !== null) ? parseFloat(lng) : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (highlights !== undefined) updateData.highlights = safeSerialize(highlights);
    if (connectivity !== undefined) updateData.connectivity = safeSerialize(connectivity);
    if (infrastructure !== undefined) updateData.infrastructure = safeSerialize(infrastructure);
    if (amenities !== undefined) updateData.amenities = safeSerialize(amenities);

    const project = await prisma.project.update({ where: { id }, data: updateData });
    
    plotEmitter.emit('dashboardUpdated');

    res.json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

const adminDeleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.update({ where: { id }, data: { isActive: false } });
    
    plotEmitter.emit('dashboardUpdated');

    res.json({ message: 'Project archived successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to archive project' });
  }
};

const adminUploadImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'GALLERY', order = 0, altText } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const image = await prisma.projectImage.create({
      data: {
        projectId: id,
        url: req.file.path,
        publicId: req.file.filename,
        type,
        order: parseInt(order),
        altText,
      },
    });

    res.status(201).json({ image });
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};

const adminDeleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const image = await prisma.projectImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ error: 'Image not found' });

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId);
    }

    await prisma.projectImage.delete({ where: { id: imageId } });
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
};

module.exports = {
  getAllProjects,
  getProjectBySlug,
  getProjectPlots,
  streamProjectPlots,
  adminGetAllProjects,
  adminGetProject,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminUploadImage,
  adminDeleteImage,
};
