// src/contexts/authService.js
export const getAccessToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refreshToken");

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem("token", access);
  if (refresh) localStorage.setItem("refreshToken", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const response = await fetch("http://localhost:8000/api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ refresh })
    });

    const data = await response.json();
    if (response.ok && data.access) {
      setTokens({ access: data.access });
      return data.access;
    } else {
      clearTokens();
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    clearTokens();
    return null;
  }
};
