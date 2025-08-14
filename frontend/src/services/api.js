import axios from 'axios';
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE
});

// Function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Function to create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export function requestRoast(name, mode = 'Gentle') {
  return API.post('/api/roast', { name, mode }, {
    headers: getAuthHeaders()
  }).then(r => r.data);
}

export function submitFeedback(feedbackData) {
  return API.post('/api/feedback', feedbackData).then(r => r.data);
}

// Authentication API calls
export function register(userData) {
  return API.post('/api/auth/register', userData).then(r => r.data);
}

export function login(userData) {
  return API.post('/api/auth/login', userData).then(r => r.data);
}

export function getCurrentUser(token) {
  return API.get('/api/auth/user', {
    headers: { Authorization: `Bearer ${token}` }
  }).then(r => r.data);
}

// Person API calls
export function getPersons() {
  return API.get('/api/persons', {
    headers: getAuthHeaders()
  }).then(r => r.data);
}

export function createPerson(personData) {
  return API.post('/api/persons', personData, {
    headers: getAuthHeaders()
  }).then(r => r.data);
}

export function updatePerson(personId, personData) {
  return API.put(`/api/persons/${personId}`, personData, {
    headers: getAuthHeaders()
  }).then(r => r.data);
}

export function deletePerson(personId) {
  return API.delete(`/api/persons/${personId}`, {
    headers: getAuthHeaders()
  }).then(r => r.data);
}

export function getPerson(personId) {
  return API.get(`/api/persons/${personId}`, {
    headers: getAuthHeaders()
  }).then(r => r.data);
}

// Trait API calls
export function getTraits() {
  return API.get('/api/traits').then(r => r.data);
}

export function createTrait(traitData) {
  return API.post('/api/traits', traitData, {
    headers: getAuthHeaders()
  }).then(r => r.data);
}
