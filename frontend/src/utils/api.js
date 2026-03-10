import axios from 'axios';

// Use VITE_API_URL from .env in production, empty string (Vite proxy) in dev
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default API;
