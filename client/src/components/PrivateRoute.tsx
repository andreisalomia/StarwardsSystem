import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ children, roles } : { children: any, roles?: string[] }){
  const auth = useAuth();
  if (!auth?.user) return <Navigate to="/login" replace />;
  if (roles && roles.length > 0 && !roles.includes(auth.user.role)) return <Navigate to="/" replace />;
  return children;
}
