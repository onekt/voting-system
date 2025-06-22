tsx
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the import path if necessary
import { Navigate } from 'react-router-dom'; // Assuming you are using react-router-dom

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, allowedRoles }) => {
  const { user, isLoading, role } = useAuth();

  if (isLoading) {
    // You can replace this with your actual loading indicator component
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/student-login" replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to a forbidden page if the role is not allowed
    // You should create a ForbiddenPage component
    return <Navigate to="/unauthorized" replace />;
  }

  // Render the protected component if authenticated and authorized
  return <Component />;
};

export default ProtectedRoute;