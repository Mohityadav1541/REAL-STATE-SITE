/**
 * Privacy-focused analytics utility for RRR Developers.
 * Supports Google Analytics 4 (gtag) and Google Tag Manager dataLayer.
 * Strictly avoids capturing any PII (no names, phone numbers, or email addresses).
 */

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

/**
 * Initialize GA4 script tag dynamically if VITE_GA_MEASUREMENT_ID is configured.
 */
export function initAnalytics() {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;

  // Prevent duplicate script injection
  if (document.getElementById('ga4-script')) return;

  const script = document.createElement('script');
  script.id = 'ga4-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,
    send_page_view: false, // We trigger page_view manually on route changes
  });
}

/**
 * Track route changes as page views.
 */
export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function' && GA_MEASUREMENT_ID) {
    window.gtag('event', 'page_view', {
      page_path: path || window.location.pathname,
      page_title: title || document.title,
      page_location: window.location.href,
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'virtual_page_view',
      page_path: path || window.location.pathname,
      page_title: title || document.title,
    });
  }
}

/**
 * Track when a user views a project page.
 */
export function trackProjectView(projectSlug, projectName) {
  sendEvent('view_project', {
    project_slug: projectSlug,
    project_name: projectName,
  });
}

/**
 * Track when a user views a specific plot.
 */
export function trackPlotView(projectSlug, plotNumber, status, area) {
  sendEvent('view_plot', {
    project_slug: projectSlug,
    plot_number: plotNumber,
    plot_status: status,
    plot_area_sqft: area,
  });
}

/**
 * Track WhatsApp CTA clicks (no PII).
 */
export function trackWhatsAppClick(locationContext = 'header') {
  sendEvent('click_whatsapp', {
    click_location: locationContext,
  });
}

/**
 * Track phone call clicks (no PII).
 */
export function trackPhoneClick(locationContext = 'header') {
  sendEvent('click_phone', {
    click_location: locationContext,
  });
}

/**
 * Track enquiry submissions (no PII: strictly record non-sensitive metadata).
 */
export function trackEnquirySubmit(source = 'WEBSITE', projectSlug = '') {
  sendEvent('generate_lead', {
    lead_source: source,
    project_slug: projectSlug || undefined,
  });
}

/**
 * Track site visit booking requests (no PII).
 */
export function trackSiteVisitRequest(projectId = '') {
  sendEvent('schedule_site_visit', {
    project_id: projectId || undefined,
  });
}

function sendEvent(eventName, params = {}) {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...params,
    });
  }
}
