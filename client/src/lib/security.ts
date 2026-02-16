/**
 * Security utilities for frontend
 * Prevents XSS, injection attacks, and other common vulnerabilities
 */

// Characters that could be used for XSS attacks
const DANGEROUS_CHARS = /[<>\"'&]/g;
const DANGEROUS_PATTERNS = [
  /javascript:/gi,
  /data:/gi,
  /vbscript:/gi,
  /on\w+=/gi,  // Event handlers like onclick=
  /<script/gi,
  /<\/script/gi,
  /<iframe/gi,
  /<\/iframe/gi,
  /<object/gi,
  /<embed/gi,
  /<applet/gi,
  /eval\(/gi,
  /expression\(/gi,
];

/**
 * Sanitize HTML to prevent XSS attacks
 * Escapes dangerous characters and patterns
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  let result = input;
  
  // Escape HTML entities
  const htmlEntities: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  result = result.replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
  
  return result;
}

/**
 * Sanitize input for use in URLs
 */
export function sanitizeUrl(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return '';
    }
  }
  
  // Only allow http, https, mailto, and relative URLs
  const allowedProtocols = ['http:', 'https:', 'mailto:', '#', '/'];
  try {
    const url = new URL(input, window.location.origin);
    if (!allowedProtocols.includes(url.protocol)) {
      return '';
    }
    return input;
  } catch {
    // If URL parsing fails, check if it's a relative path
    if (input.startsWith('/') || input.startsWith('#')) {
      return input;
    }
    return '';
  }
}

/**
 * Sanitize user input for display
 * Used for names, descriptions, etc.
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') return '';
  
  let result = input.trim();
  
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    result = result.replace(pattern, '');
  }
  
  // Truncate to max length
  if (result.length > maxLength) {
    result = result.substring(0, maxLength);
  }
  
  return result;
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') return '';
  
  // Remove path separators and dangerous characters
  return filename
    .replace(/[\\/]/g, '_')
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .substring(0, 255);
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = email.trim().toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  return sanitized;
}

/**
 * Validate and sanitize slug
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') return '';
  
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

/**
 * Create safe HTML string (use with caution - prefer sanitizeHtml)
 */
export function createSafeHtml(input: string): { __html: string } {
  return { __html: sanitizeHtml(input) };
}

/**
 * Check if input contains potential XSS
 */
export function containsXss(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Validate number is within safe range
 */
export function sanitizeNumber(input: number, min: number = 0, max: number = Number.MAX_SAFE_INTEGER): number {
  if (typeof input !== 'number' || isNaN(input)) return min;
  return Math.max(min, Math.min(max, Math.floor(input)));
}

/**
 * Security headers for API requests
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Prevent XSS
    'X-XSS-Protection': '1; mode=block',
    // Prevent MIME sniffing
    'X-Content-Type-Options': 'nosniff',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };
}
