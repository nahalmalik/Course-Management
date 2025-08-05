import axios from 'axios';
import { getAccessToken } from './contexts/authUtils';

const BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/';
console.log('BASE_URL:', process.env.REACT_APP_API_BASE_URL);

const API = axios.create({
  baseURL: BASE_URL,
});

// --- STUDENT CART & ENROLLMENT RELATED API CALLS ---

export const placeOrder = (orderData) =>
  API.post('user/checkout/', orderData, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

export const getEnrollments = () =>
  API.get('user/enrollments/', {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

export const getReceipt = (orderId) =>
  API.get(`user/receipt/${orderId}/`, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });

export default API;
