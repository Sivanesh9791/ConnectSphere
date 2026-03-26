import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Auth ────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getUserProfile = (id) => API.get(`/auth/user/${id}`);
export const updateUserProfile = (data) => API.put('/users/update', data);
export const changePassword = (data) => API.put('/users/change-password', data);

// ─── Posts ───────────────────────────────────────────
export const fetchPosts = () => API.get('/posts');
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const likePost = (id) => API.put(`/posts/${id}/like`);
export const addComment = (id, data) => API.post(`/posts/${id}/comment`, data);

export default API;
