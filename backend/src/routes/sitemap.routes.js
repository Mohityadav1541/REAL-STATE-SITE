const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');

const getSiteUrl = () => {
  const configured = process.env.SITE_URL || process.env.PUBLIC_URL || process.env.FRONTEND_URL;
  if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return configured.replace(/\/$/, '');
  }
  return 'https://real-state-site-ashen.vercel.app';
};

/**
 * GET /sitemap.xml
 * Dynamically generated XML sitemap incorporating active projects from the database.
 */
router.get('/sitemap.xml', async (req, res) => {
  const SITE_URL = getSiteUrl();
  try {
    const projects = await prisma.project.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    const staticRoutes = [
      { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'weekly' },
      { loc: `${SITE_URL}/projects`, priority: '0.9', changefreq: 'daily' },
      { loc: `${SITE_URL}/about`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${SITE_URL}/why-us`, priority: '0.7', changefreq: 'monthly' },
      { loc: `${SITE_URL}/investment`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${SITE_URL}/site-visit`, priority: '0.8', changefreq: 'weekly' },
      { loc: `${SITE_URL}/contact`, priority: '0.8', changefreq: 'monthly' },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const todayStr = new Date().toISOString().split('T')[0];

    // Static pages
    for (const route of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${route.loc}</loc>\n`;
      xml += `    <lastmod>${todayStr}</lastmod>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic project pages
    for (const project of projects) {
      const projectDate = project.updatedAt
        ? new Date(project.updatedAt).toISOString().split('T')[0]
        : todayStr;

      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/projects/${project.slug}</loc>\n`;
      xml += `    <lastmod>${projectDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      xml += `  </url>\n`;

      xml += `  <url>\n`;
      xml += `    <loc>${SITE_URL}/projects/${project.slug}/plots</loc>\n`;
      xml += `    <lastmod>${projectDate}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.header('Cache-Control', 'public, max-age=3600'); // 1 hour cache
    res.status(200).send(xml);
  } catch (error) {
    console.error('Failed to generate dynamic sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * GET /robots.txt
 * Dynamically generated robots.txt referencing the canonical sitemap.
 */
router.get('/robots.txt', (req, res) => {
  const SITE_URL = getSiteUrl();
  const robots = `# Robots.txt for RRR Developers
User-agent: *
Allow: /
Allow: /projects
Allow: /projects/*
Allow: /about
Allow: /why-us
Allow: /investment
Allow: /contact
Allow: /site-visit
Allow: /images/
Allow: /assets/

Disallow: /admin/
Disallow: /admin/*
Disallow: /c/
Disallow: /c/*
Disallow: /connect
Disallow: /api/
Disallow: /api/*

Sitemap: ${SITE_URL}/sitemap.xml
`;

  res.header('Content-Type', 'text/plain');
  res.header('Cache-Control', 'public, max-age=86400');
  res.status(200).send(robots);
});

/**
 * GET /google7a991f0da430405c.html
 * Google Search Console site verification handler
 */
router.get('/google7a991f0da430405c.html', (req, res) => {
  res.header('Content-Type', 'text/html');
  res.status(200).send('google-site-verification: google7a991f0da430405c.html');
});

module.exports = router;
