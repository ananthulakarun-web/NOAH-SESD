const BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Helper to build headers with Authorization token
 */
function getHeaders(isMultipart = false) {
  const token = localStorage.getItem('token');
  const headers = {};

  if (!isMultipart) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

/**
 * Handle fetch response
 */
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = { message: await response.text() };
  }

  if (!response.ok) {
    const errorMsg = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data;
}

// Auth API
export const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (username, email, password) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse(response);
  },
};

// Resumes API
export const resumeApi = {
  uploadResume: async (formData) => {
    const response = await fetch(`${BASE_URL}/resumes/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(response);
  },

  getResumes: async () => {
    const response = await fetch(`${BASE_URL}/resumes`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getResumeById: async (id) => {
    const response = await fetch(`${BASE_URL}/resumes/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  deleteResume: async (id) => {
    const response = await fetch(`${BASE_URL}/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Analysis API
export const analysisApi = {
  analyze: async (payload, isFormData = false) => {
    const response = await fetch(`${BASE_URL}/analysis/analyze`, {
      method: 'POST',
      headers: getHeaders(isFormData),
      body: isFormData ? payload : JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  getHistory: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/analysis/history${query ? '?' + query : ''}`;
    const response = await fetch(url, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getAnalysisById: async (id) => {
    const response = await fetch(`${BASE_URL}/analysis/${id}`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  deleteAnalysis: async (id) => {
    const response = await fetch(`${BASE_URL}/analysis/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

// Admin API
export const adminApi = {
  getDashboard: async () => {
    const response = await fetch(`${BASE_URL}/admin/dashboard`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getUsers: async () => {
    const response = await fetch(`${BASE_URL}/admin/users`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  deleteUser: async (id) => {
    const response = await fetch(`${BASE_URL}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  updateUserRole: async (id, role) => {
    const response = await fetch(`${BASE_URL}/admin/users/${id}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },
};
