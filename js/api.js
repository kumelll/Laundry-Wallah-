// Laundry Wallah API helper
const API_BASE = (function() {
  if (typeof window !== 'undefined' && window.LAUNDRY_API_URL) {
    return window.LAUNDRY_API_URL.replace(/\/$/, '');
  }
  const origin = typeof window !== 'undefined' && window.location && window.location.origin;
  if (origin && (origin.startsWith('http://') || origin.startsWith('https://'))) {
    return origin + '/api';
  }
  return 'http://localhost:3000/api';
})();

function getToken() {
  return localStorage.getItem('lw_token');
}

function getAdminToken() {
  return localStorage.getItem('lw_admin_token');
}

function setToken(token) {
  localStorage.setItem('lw_token', token);
}

function setAdminToken(token) {
  localStorage.setItem('lw_admin_token', token);
}

function clearToken() {
  localStorage.removeItem('lw_token');
}

function clearAdminToken() {
  localStorage.removeItem('lw_admin_token');
}

function authHeaders(admin) {
  const token = admin ? getAdminToken() : getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: 'Bearer ' + token } : {})
  };
}

async function api(path, options = {}, useAdmin) {
  const url = path.startsWith('/') ? API_BASE + path : API_BASE + '/' + path;
  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: { ...authHeaders(useAdmin), ...(options.headers || {}) },
      mode: 'cors'
    });
  } catch (err) {
    const msg = err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('network'))
      ? 'Cannot reach server. Ensure the backend is running and deployed correctly.'
      : (err.message || 'Network error');
    throw new Error(msg);
  }
  let data;
  try {
    data = await res.json();
  } catch (_) {
    data = { error: res.statusText || 'Request failed' };
  }
  if (!res.ok) {
    throw new Error(data.error || data.message || res.statusText || 'Request failed');
  }
  return data;
}
