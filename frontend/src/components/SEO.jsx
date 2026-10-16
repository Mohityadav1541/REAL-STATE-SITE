import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL, getBreadcrumbSchema } from '../utils/seoConfig';
import { trackPageView } from '../utils/analytics';

/**
 * Universal SEO component for RRR Developers.
 * Synchronizes document title, standard meta, canonical, OpenGraph,
 * Twitter cards, and Schema.org JSON-LD scripts across all routes.
 */
export default function SEO({
  title = 'RRR Developers | Industrial Land and Plots in Gujarat',
  description = 'Government-approved industrial land and plots in Gujarat with wide heavy-vehicle roads, robust utility infrastructure, and direct highway connectivity.',
  canonical,
  ogType = 'website',
  ogImage = '/images/og-banner.jpg',
  noindex = false,
  keywords,
  schema,
  breadcrumbs,
}) {
  const location = useLocation();

  // Normalize canonical URL
  const currentPath = canonical || location.pathname;
  const canonicalUrl = currentPath.startsWith('http')
    ? currentPath
    : `${SITE_URL}${currentPath.startsWith('/') ? currentPath : `/${currentPath}`}`;

  // Normalize OG image URL
  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${SITE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // Helper to get or create tag
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', description);
    if (keywords) {
      const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      setMetaTag('name', 'keywords', keywordsStr);
    }

    // 3. Robots
    const robotsContent = noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    setMetaTag('name', 'robots', robotsContent);

    // 4. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // 5. Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', absoluteOgImage);
    setMetaTag('property', 'og:site_name', 'RRR Developers');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 6. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', absoluteOgImage);

    // 7. Schema.org JSON-LD
    let scriptEl = document.getElementById('rrr-dynamic-schema');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'rrr-dynamic-schema';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    // Build schemas array
    const schemasToInject = [];
    if (breadcrumbs && breadcrumbs.length > 0) {
      schemasToInject.push(getBreadcrumbSchema(breadcrumbs));
    }
    if (schema) {
      if (Array.isArray(schema)) {
        schemasToInject.push(...schema);
      } else {
        schemasToInject.push(schema);
      }
    }

    if (schemasToInject.length > 0) {
      scriptEl.textContent = JSON.stringify(
        schemasToInject.length === 1 ? schemasToInject[0] : { '@context': 'https://schema.org', '@graph': schemasToInject }
      );
    } else {
      scriptEl.textContent = '';
    }

    // 8. Analytics page view
    trackPageView(currentPath, title);

    // Cleanup when component unmounts
    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.textContent = '';
      }
    };
  }, [title, description, canonicalUrl, absoluteOgImage, ogType, noindex, keywords, schema, breadcrumbs, currentPath]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </>
  );
}
