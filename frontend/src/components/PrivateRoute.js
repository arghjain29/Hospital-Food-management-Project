import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from 'jwt-decode'; 

const PrivateRoute = ({ children, allowedrole }) => {
    const token = localStorage.getItem('authToken'); 
  
    if (!token) {
      return <Navigate to="/" />;
    }
  
    const decodedToken = jwtDecode(token);
    const userRoles = decodedToken.role || []; 
  
    if (!allowedrole.some(role => userRoles.includes(role))) {
      return (
        alert('You are not authorized to access this page'),
        <Navigate to="/" />
      )
    }
  
    return children;
  };

export default PrivateRoute;