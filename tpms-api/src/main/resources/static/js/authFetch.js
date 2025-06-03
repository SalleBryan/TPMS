// File: static/js/authFetch.js

export async function authFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  if (!options.headers) options.headers = {};
  options.headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, options);
}
