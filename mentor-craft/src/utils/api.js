// src/utils/api.js
import { getAccessToken, refreshAccessToken } from "../contexts/authService";

export const authorizedFetch = async (url, options = {}) => {
  let token = getAccessToken();

  const addAuthHeader = (token) => ({
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  });

  // First attempt
  let response = await fetch(url, addAuthHeader(token));

  // If token is invalid, try refreshing
  if (response.status === 401 || response.status === 403) {
    const newToken = await refreshAccessToken();
    if (!newToken) return response; // Return original failed response if refresh fails
    response = await fetch(url, addAuthHeader(newToken)); // Retry
  }

  return response;
};
