import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
});

export function requestRoast(name, mode = 'Gentle') {
  return API.post('/api/roast', { name, mode }).then(r => r.data);
}
