const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Universal fetch wrapper for backend API calls.
 * Automatically attaches Authorization header if token exists.
 */
export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const fetchApi = apiFetch;
export default apiFetch;

// Authentication API
export const authApi = {
  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password, role) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    }),
  getProfile: () => apiFetch('/auth/profile'),
};

// Projects API
export const projectsApi = {
  getAll: () => apiFetch('/projects'),
  getById: (id) => apiFetch(`/projects/${id}`),
  create: (projectData) =>
    apiFetch('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),
  update: (id, projectData) =>
    apiFetch(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    }),
  delete: (id) =>
    apiFetch(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Beams API
export const beamsApi = {
  getByProject: (projectId) => apiFetch(`/projects/${projectId}/beams`),
  getById: (beamId) => apiFetch(`/beams/${beamId}`),
  create: (projectId, beamData) =>
    apiFetch(`/projects/${projectId}/beams`, {
      method: 'POST',
      body: JSON.stringify(beamData),
    }),
  update: (beamId, beamData) =>
    apiFetch(`/beams/${beamId}`, {
      method: 'PUT',
      body: JSON.stringify(beamData),
    }),
  delete: (beamId) =>
    apiFetch(`/beams/${beamId}`, {
      method: 'DELETE',
    }),
  duplicate: (beamId) =>
    apiFetch(`/beams/${beamId}/duplicate`, {
      method: 'POST',
    }),
  getSummary: (beamId) => apiFetch(`/beams/${beamId}/summary`),
};
