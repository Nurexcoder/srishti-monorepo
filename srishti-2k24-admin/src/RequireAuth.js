import React from "react";
import { Navigate } from "react-router-dom";
import { user } from "./localStore";

function RequireAuth({ children }) {
  console.log(user)
  return user ? children : <Navigate to="/login" replace />;
}

export default RequireAuth;
