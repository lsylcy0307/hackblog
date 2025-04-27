import axios from 'axios';

// You can change this to your production API URL when deploying
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      const { status } = error.response;
      
      // If token is expired or invalid, logout user
      if (status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service methods
const apiService = {
  // Auth endpoints
  auth: {
    register: (userData) => api.post('/users/register', userData),
    login: (credentials) => api.post('/users/login', credentials),
    getProfile: () => api.get('/users/me'),
    updateProfile: (userData) => api.put('/users/me', userData),
  },
  
  // Users endpoints
  users: {
    getAll: () => api.get('/users'),
    getById: (id) => api.get(`/users/${id}`),
    updateRole: (id, role) => api.put(`/users/${id}/role`, { admin_status: role }),
    getArticles: (id) => api.get(`/users/${id}/articles`),
    getMyArticles: () => api.get('/users/me/articles'),
  },
  
  // Articles endpoints
  articles: {
    getAll: (params) => api.get('/articles', { params }),
    getById: (id) => api.get(`/articles/${id}`),
    create: (articleData) => {
      // Check if articleData is FormData (for file uploads)
      const isFormData = articleData instanceof FormData;
      return api.post('/articles', articleData, 
        isFormData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );
    },
    update: (id, articleData) => {
      // Check if articleData is FormData (for file uploads)
      const isFormData = articleData instanceof FormData;
      return api.put(`/articles/${id}`, articleData,
        isFormData ? {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        } : {}
      );
    },
    delete: (id) => api.delete(`/articles/${id}`),
    pin: (id, pinned) => api.patch(`/articles/${id}/pin`, { pinned }),
    getByAuthor: (authorId) => api.get(`/articles?authors=${authorId}`),
    getMine: () => api.get('/articles/mine'),
  },
};

export default apiService; 