import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Protects routes that require login
export const PrivateRoute = ({ children }) => {
    const { userInfo } = useContext(AuthContext);
    return userInfo ? children : <Navigate to="/login" replace />;
};

// Protects routes that require admin role
export const AdminRoute = ({ children }) => {
    const { userInfo } = useContext(AuthContext);
    if (!userInfo) return <Navigate to="/login" replace />;
    if (!userInfo.isAdmin) return <Navigate to="/" replace />;
    return children;
};
