import React, { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    token: string | null;
    username: string | null;
    login: (jwtToken: string, userIdentifier: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('jwtToken'));
    const [username, setUsername] = useState<string | null>(localStorage.getItem('username'));
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem('jwtToken', token);
        } else {
            localStorage.removeItem('jwtToken');
        }
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
    }, [token, username]);

    const login = (jwtToken: string, userIdentifier: string) => {
        setToken(jwtToken);
        setUsername(userIdentifier);
        navigate('/djelatnici');
    };

    const logout = () => {
        setToken(null);
        setUsername(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        navigate('/login');
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, username, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};