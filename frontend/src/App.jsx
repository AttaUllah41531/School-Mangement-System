import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContextState';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Academic from './pages/Academic';
import Attendance from './pages/Attendance';
import Exams from './pages/Exams';
import Library from './pages/Library';
import Fees from './pages/Fees';
import PaymentStatus from './pages/PaymentStatus';
import Settings from './pages/Settings';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route 
                            path="/dashboard" 
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/students" 
                            element={
                                <PrivateRoute>
                                    <Students />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/teachers" 
                            element={
                                <PrivateRoute>
                                    <Teachers />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/academic" 
                            element={
                                <PrivateRoute>
                                    <Academic />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/attendance" 
                            element={
                                <PrivateRoute>
                                    <Attendance />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/exams" 
                            element={
                                <PrivateRoute>
                                    <Exams />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/library" 
                            element={
                                <PrivateRoute>
                                    <Library />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/fees" 
                            element={
                                <PrivateRoute>
                                    <Fees />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/payment-status" 
                            element={
                                <PrivateRoute>
                                    <PaymentStatus />
                                </PrivateRoute>
                            } 
                        />
                        <Route 
                            path="/settings" 
                            element={
                                <PrivateRoute>
                                    <Settings />
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
