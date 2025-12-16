import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import { LanguageProvider } from './LanguageContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Sales from './pages/Sales';
import MilkTracking from './pages/MilkTracking';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Help from './pages/Help';
import Layout from './components/Layout';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout>
                        <Dashboard />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/products" element={
                <ProtectedRoute>
                    <Layout>
                        <Products />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/sales" element={
                <ProtectedRoute>
                    <Layout>
                        <Sales />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/milk-tracking" element={
                <ProtectedRoute>
                    <Layout>
                        <MilkTracking />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <Layout>
                        <Analytics />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/reports" element={
                <ProtectedRoute>
                    <Layout>
                        <Reports />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/help" element={
                <ProtectedRoute>
                    <Layout>
                        <Help />
                    </Layout>
                </ProtectedRoute>
            } />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <LanguageProvider>
                    <AppRoutes />
                </LanguageProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
