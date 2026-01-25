/**
 * Logo URL Utilities
 * 
 * Converts Clearbit Logo API URLs to Logo.dev URLs
 * and provides helper functions for logo URL handling
 */

// Get Logo.dev token from environment variable (prefixed with VITE_ for Vite)
// In Vite, only variables prefixed with VITE_ are exposed to client-side code
const LOGO_DEV_TOKEN = import.meta.env.VITE_LOGO_DEV_TOKEN || '';

// Warn if token is missing (only in development)
if (import.meta.env.DEV && !LOGO_DEV_TOKEN) {
  console.warn('VITE_LOGO_DEV_TOKEN is not set. Logo.dev logos will not work. Please set it in your .env file.');
}

/**
 * Normalizes a company name to a slug format
 * @param {string} name - Company name
 * @returns {string} Normalized slug
 */
const normalizeCompanySlug = (name) => {
  if (!name) return "";
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};

/**
 * Builds a Logo.dev URL from a company name
 * @param {string} companyName - Company name
 * @returns {string} Logo.dev URL
 */
export const buildLogoDevUrl = (companyName) => {
  if (!companyName) return "";
  const slug = normalizeCompanySlug(companyName);
  if (!slug) return "";
  // URL encode the token to handle special characters like pipe (|)
  const encodedToken = encodeURIComponent(LOGO_DEV_TOKEN);
  return `https://img.logo.dev/${slug}.com?token=${encodedToken}`;
};

/**
 * Extracts company slug from a Clearbit URL
 * @param {string} clearbitUrl - Clearbit logo URL
 * @returns {string|null} Company slug or null if not a Clearbit URL
 */
const extractSlugFromClearbitUrl = (clearbitUrl) => {
  if (!clearbitUrl || typeof clearbitUrl !== 'string') return null;
  
  // Match pattern: https://logo.clearbit.com/{slug}.com
  const match = clearbitUrl.match(/logo\.clearbit\.com\/([^\/\?]+)/);
  if (match && match[1]) {
    // Remove .com extension if present
    return match[1].replace(/\.com$/, '');
  }
  return null;
};

/**
 * Converts a Clearbit URL to Logo.dev URL
 * @param {string} clearbitUrl - Clearbit logo URL
 * @returns {string} Logo.dev URL or original URL if not a Clearbit URL
 */
const convertClearbitToLogoDev = (clearbitUrl) => {
  if (!clearbitUrl || typeof clearbitUrl !== 'string') return clearbitUrl;
  
  const slug = extractSlugFromClearbitUrl(clearbitUrl);
  if (slug) {
    // URL encode the token to handle special characters like pipe (|)
    const encodedToken = encodeURIComponent(LOGO_DEV_TOKEN);
    return `https://img.logo.dev/${slug}.com?token=${encodedToken}`;
  }
  
  return clearbitUrl;
};

/**
 * Checks if a URL is a Clearbit URL
 * @param {string} url - URL to check
 * @returns {boolean} True if it's a Clearbit URL
 */
const isClearbitUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('logo.clearbit.com');
};

/**
 * Converts a logo URL to Logo.dev format if it's a Clearbit URL
 * Otherwise returns the original URL or generates one from company name
 * @param {string} logoUrl - Logo URL from database (may be Clearbit or Logo.dev)
 * @param {string} companyName - Optional company name to generate URL if logoUrl is empty
 * @returns {string} Logo.dev URL or original URL
 */
export const getLogoUrl = (logoUrl, companyName = null) => {
  // If no logo URL provided, try to generate from company name
  if (!logoUrl && companyName) {
    return buildLogoDevUrl(companyName);
  }
  
  // If no logo URL and no company name, return empty string
  if (!logoUrl) {
    return "";
  }
  
  // If it's already a Logo.dev URL, check if it has a token
  if (logoUrl.includes('img.logo.dev')) {
    // If it already has a token parameter, return as-is
    if (logoUrl.includes('token=')) {
      return logoUrl;
    }
    // If it's a Logo.dev URL but missing token, add it
    const separator = logoUrl.includes('?') ? '&' : '?';
    const encodedToken = encodeURIComponent(LOGO_DEV_TOKEN);
    return `${logoUrl}${separator}token=${encodedToken}`;
  }
  
  // If it's a Clearbit URL, convert it
  if (isClearbitUrl(logoUrl)) {
    const converted = convertClearbitToLogoDev(logoUrl);
    // Debug logging (only in development)
    if (import.meta.env.DEV) {
      console.log('Converting Clearbit URL:', logoUrl, ' to ', converted);
    }
    return converted;
  }
  
  // Otherwise return the original URL (could be a custom URL or other service)
  return logoUrl;
};
