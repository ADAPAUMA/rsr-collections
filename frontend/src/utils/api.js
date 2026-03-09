import axios from 'axios';

// In production, point directly to Render backend
// In development, Vite proxy handles it so we use relative URLs
const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://rsr-collections.onrender.com' 
    : '',
});

export default API;
