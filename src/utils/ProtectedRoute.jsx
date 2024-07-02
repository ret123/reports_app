import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import {  selectCurrentToken } from '../services/auth/authSlice';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ path, exact, children }) => {
  // let user = localStorage.getItem("user");
 let token = localStorage.getItem("token");
 
 
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
