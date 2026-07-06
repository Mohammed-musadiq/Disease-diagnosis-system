// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from 'react';
// We no longer need useNavigate here
// import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    // const navigate = useNavigate(); // <-- REMOVE THIS LINE

    // The login function now ONLY sets the user state
    const login = (userData, token) => {
        const userToStore = { email: userData.email, role: userData.role, token: token };
        localStorage.setItem('user', JSON.stringify(userToStore));
        setUser(userToStore);
    };

    // The logout function now ONLY clears the user state
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = { user, isAuthenticated: !!user, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);