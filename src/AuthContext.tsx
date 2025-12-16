import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    id: string;
    username: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for stored token on mount
        const storedUser = localStorage.getItem('teashop_user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await axios.post('/api/auth/login', { username, password });
            const userData = response.data;
            setUser(userData);
            localStorage.setItem('teashop_user', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        } catch (error) {
            throw new Error('Login failed. Please check your credentials.');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('teashop_user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
