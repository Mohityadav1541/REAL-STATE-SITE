/**
 * SEO Configuration & Schema.org Structured Data Generators for RRR Developers.
 */

export const SITE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SITE_URL) ||
  'https://real-state-site-ashen.vercel.app';

export const COMPANY_INFO = {
  name: 'RRR Developers',
  legalName: 'RRR Developers',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  image: `${SITE_URL}/images/og-banner.jpg`,
  telephone: '+919898649979',
  displayPhone: '+91 98986 49979',
  email: 'info@rrrdevelopers.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Chokhi Dhani Resort, 12 Miles, Tonk Road, Via Vatika, Sitapura',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '303905',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 26.766572,
    longitude: 75.8370448,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:30',
      closes: '18:30',
    },
  ],
  areaServed: [
    'Jaipur',
    'Rajasthan',
    'Surat',
    'Gujarat',
    'India',
  ],
  priceRange: '₹₹₹',
};

/**
 * Organization / RealEstateAgent JSON-LD Schema
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'RealEstateAgent'],
    '@id': `${SITE_URL}/#organization`,
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    url: COMPANY_INFO.url,
    logo: {
      '@type': 'ImageObject',
      url: COMPANY_INFO.logo,
      caption: 'RRR Developers Logo',
    },
    image: COMPANY_INFO.image,
    description:
      'RRR Developers specializes in government-approved master-planned industrial parks and industrial plots in Gujarat, India, offering wide heavy-vehicle roads and strategic freight corridor connectivity.',
    telephone: COMPANY_INFO.telephone,
    email: COMPANY_INFO.email,
    address: COMPANY_INFO.address,
    geo: COMPANY_INFO.geo,
    openingHoursSpecification: COMPANY_INFO.openingHoursSpecification,
    priceRange: COMPANY_INFO.priceRange,
    areaServed: COMPANY_INFO.areaServed.map((area) => ({
      '@type': 'AdministrativeArea',
      name: area,
    })),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.telephone,
      contactType: 'sales',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Gujarati'],
    },
  };
}

/**
 * WebSite JSON-LD Schema
 */
export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: COMPANY_INFO.name,
    description:
      'Government-approved industrial land and plots in Gujarat by RRR Developers.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-IN',
  };
}

/**
 * BreadcrumbList Schema generator
 * @param {Array<{ name: string, path: string }>} items
 */
export function getBreadcrumbSchema(items = []) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
  ];

  items.forEach((crumb, idx) => {
    const itemUrl = crumb.path.startsWith('http')
      ? crumb.path
      : `${SITE_URL}${crumb.path.startsWith('/') ? crumb.path : `/${crumb.path}`}`;

    itemListElement.push({
      '@type': 'ListItem',
      position: idx + 2,
      name: crumb.name,
      item: itemUrl,
    });
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Place / RealEstateDevelopment Schema generator for a Project
 */
export function getProjectSchema(project) {
  if (!project) return null;

  const projectUrl = `${SITE_URL}/projects/${project.slug}`;
  const heroImage =
    project.images?.find((img) => img.type === 'HERO')?.url ||
    project.images?.[0]?.url ||
    `${SITE_URL}/images/og-banner.jpg`;

  const absoluteHeroImage = heroImage.startsWith('http')
    ? heroImage
    : `${SITE_URL}${heroImage.startsWith('/') ? heroImage : `/${heroImage}`}`;

  return {
    '@context': 'https://schema.org',
    '@type': ['Place', 'RealEstateListing'],
    '@id': `${projectUrl}#project`,
    name: project.name,
    description: project.description || project.tagline || 'Industrial land project in Gujarat.',
    url: projectUrl,
    image: absoluteHeroImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: project.address || project.location,
      addressLocality: project.location,
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: project.lat || 26.766572,
      longitude: project.lng || 75.8370448,
    },
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Jaipur, Rajasthan',
    },
  };
}
