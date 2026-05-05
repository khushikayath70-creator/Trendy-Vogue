// admin/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://trendy-vogue.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

export default API;