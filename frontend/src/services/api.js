import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }
};

export const authApi = {
  async login(payload) {
    const { data } = await api.post('/api/auth/login', payload);
    return data;
  },
  async staffLogin(payload) {
    const { data } = await api.post('/api/auth/staff-login', payload);
    return data;
  },
  async register(payload) {
    const { data } = await api.post('/api/auth/register', payload);
    return data;
  },
  async updateProfile(payload) {
    const { data } = await api.put('/api/auth/profile', payload);
    return data;
  },
  async uploadProfilePicture(formData) {
    // Create a new axios instance for file upload to avoid header conflicts
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post('/api/auth/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
};

export const packageApi = {
  async getAllPackages() {
    const { data } = await api.get('/api/packages');
    return data;
  },
  async getPackageById(id) {
    const { data } = await api.get(`/api/packages/${id}`);
    return data;
  },
  async createPackage(payload) {
    const { data } = await api.post('/api/packages', payload);
    return data;
  },
  async updatePackage(id, payload) {
    const { data } = await api.put(`/api/packages/${id}`, payload);
    return data;
  },
  async deletePackage(id) {
    const { data } = await api.delete(`/api/packages/${id}`);
    return data;
  },
  async uploadPackageImage(id, formData) {
    // Create a new axios instance for file upload to avoid header conflicts
    const uploadApi = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
    
    const { data } = await uploadApi.post(`/api/packages/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },
  async togglePackageStatus(id) {
    const { data } = await api.patch(`/api/packages/${id}/toggle-status`);
    return data;
  },
};

export const userApi = {
  async getAllUsers() {
    const { data } = await api.get('/api/users');
    return data;
  },
  async getUserStats() {
    const { data } = await api.get('/api/users/stats');
    return data;
  },
  async deleteUser(id) {
    const { data } = await api.delete(`/api/users/${id}`);
    return data;
  },
};


