// src/services/api.js o api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // que termine en /
  //withCredentials: true // Solo si usas cookies/sesiones
});

export default api;
