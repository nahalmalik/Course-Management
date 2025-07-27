// src/components/ProtectedRoute.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log("ProtectedRoute User:", user);

  if (!user) return <Navigate to="/" replace />;
  if (allowedRole && user.role !== allowedRole) {
    console.warn("🚫 Access denied for role:", user.role);
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
