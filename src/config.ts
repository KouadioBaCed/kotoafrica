// Centralized runtime config for the frontend
// Use import.meta.env which Vite replaces at build time

const rawApi = (import.meta.env.VITE_API_BASE_URL as string) || 'https://shows-broader-clarke-hindu.trycloudflare.com';
// Ensure base does not end with a slash and ensure it has /api suffix
const API_BASE_URL = rawApi.replace(/\/$/, '') + (rawApi.endsWith('/api') ? '' : '/api');

const FRONTEND_BASE_URL = (import.meta.env.VITE_FRONTEND_BASE_URL as string) || 'http://localhost:5173';

export { API_BASE_URL, FRONTEND_BASE_URL };

export function api(path: string) {
  // ensures a single slash between base and path
  return `${API_BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
 