// File: src/main/resources/static/js/auth.js

/**
 * Retrieves the JWT token from localStorage.
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Decodes the JWT payload (base64) and returns the parsed JSON.
 */
export function decodeToken() {
  const token = getToken();
  if (!token) return null;
  const payloadBase64 = token.split('.')[1];
  const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
  try {
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch (e) {
    console.error('Failed to decode token payload', e);
    return null;
  }
}

/**
 * Returns the username (subject) from the JWT.
 */
export function getUsername() {
  const decoded = decodeToken();
  return decoded ? decoded.sub : null;
}

/**
 * Returns array of roles from the JWT authorities claim.
 */
export function getRoles() {
  const decoded = decodeToken();
  if (!decoded || !decoded.roles) return [];
  return decoded.roles; // assumes roles stored under 'roles'
}

/**
 * Wrapper around fetch() that adds Authorization header.
 */
export async function authFetch(url, options = {}) {
  const token = getToken();
  options.headers = options.headers || {};
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  return fetch(url, options);
}

/**
 * Redirect to login if no token or invalid.
 */
export function requireAuth() {
  if (!getToken()) {
    window.location.href = '/login.html';
  }
}
