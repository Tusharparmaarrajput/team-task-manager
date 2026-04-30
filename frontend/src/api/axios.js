import axios from 'axios';

// Base axios instance pointing to our backend
const API = axios.create({
    baseURL: 'https://team-task-manager-production-7067.up.railway.app/api',
});

// Attach JWT token to every request automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;