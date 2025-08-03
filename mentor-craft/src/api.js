import axios from 'axios';
import { getAccessToken } from './contexts/authUtils'; 

const API = axios.create({
  baseURL: 'http://localhost:8000/api/',
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
