// XSS Protection Utilities

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Raw text input
 * @returns {string} - Escaped text safe for HTML insertion
 */
export const escapeHtml = (text) => {
  if (typeof text !== 'string') return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Sanitize URL to prevent javascript: protocol injection
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string if unsafe
 */
export const sanitizeUrl = (url) => {
  if (typeof url !== 'string') return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
  if (dangerousProtocols.some(protocol => trimmed.startsWith(protocol))) {
    return '';
  }
  
  return url;
};

/**
 * Validate and sanitize file name
 * @param {string} filename - Original filename
 * @returns {string} - Sanitized filename
 */
export const sanitizeFilename = (filename) => {
  if (typeof filename !== 'string') return 'file';
  
  // Remove path traversal attempts and invalid characters
  // Invalid chars: < > : " / \ | ? * and control chars 0-31
  return filename
    .replace(/[<>:"\\|?*]/g, '')
    .replace(/\./g, '') // Remove dots to prevent hidden files
    .replace(/^(\.\.\/|\.\\|\/)*/g, '')
    .substring(0, 255) || 'file';
};

/**
 * DOMPurify-style basic HTML sanitization
 * Removes script tags and event handlers
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  if (typeof html !== 'string') return '';
  
  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.innerHTML = html;
  
  // Remove all script tags
  const scripts = temp.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Remove event handler attributes
  const allElements = temp.querySelectorAll('*');
  allElements.forEach(el => {
    const attributes = Array.from(el.attributes);
    attributes.forEach(attr => {
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    });
  });
  
  return temp.innerHTML;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Create a safe CSS class name
 * @param {string} name - Proposed class name
 * @returns {string} - Safe CSS class name
 */
export const sanitizeClassName = (name) => {
  if (typeof name !== 'string') return '';
  
  // CSS class names can only contain letters, numbers, hyphens, underscores
  return name.replace(/[^a-zA-Z0-9_-]/g, '');
};
