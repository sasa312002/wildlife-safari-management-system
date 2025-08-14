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


