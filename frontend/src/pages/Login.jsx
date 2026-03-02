import React, { useState } from 'react';
import { useAuth } from '../context/AuthContextState';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: 'linear-gradient(135deg, #3D52A0 0%, #7091E6 100%)' }} className="min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-center mb-6">
                        <div style={{ backgroundColor: '#EDE8F5' }} className="p-3 rounded-full">
                            <GraduationCap style={{ color: '#3D52A0' }} className="w-10 h-10" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#3D52A0' }}>Welcome Back</h2>
                    <p className="text-center mb-8" style={{ color: '#8697C4' }}>Sign in to access your portal</p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#3D52A0' }}>Email Address</label>
                            <div className="relative">
                                <Mail style={{ color: '#8697C4' }} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
                                    style={{ border: '1px solid #ADBBDA' }}
                                    placeholder="admin@school.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={(e) => { e.target.style.border = '2px solid #7091E6'; e.target.style.boxShadow = '0 0 0 3px #EDE8F5'; }}
                                    onBlur={(e) => { e.target.style.border = '1px solid #ADBBDA'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2" style={{ color: '#3D52A0' }}>Password</label>
                            <div className="relative">
                                <Lock style={{ color: '#8697C4' }} className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-10 pr-12 py-3 rounded-xl outline-none transition-all"
                                    style={{ border: '1px solid #ADBBDA' }}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={(e) => { e.target.style.border = '2px solid #7091E6'; e.target.style.boxShadow = '0 0 0 3px #EDE8F5'; }}
                                    onBlur={(e) => { e.target.style.border = '1px solid #ADBBDA'; e.target.style.boxShadow = 'none'; }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors"
                                    style={{ color: '#8697C4' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#3D52A0'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#8697C4'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ backgroundColor: '#3D52A0', boxShadow: '0 8px 25px rgba(61,82,160,0.3)' }}
                            className="w-full text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center space-x-2 hover:opacity-90"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>
                </div>
                <div style={{ backgroundColor: '#EDE8F5', borderTopColor: '#ADBBDA' }} className="p-6 text-center border-t">
                    <p className="text-sm" style={{ color: '#8697C4' }}>
                        Forgot your password? <a href="#" className="font-semibold" style={{ color: '#3D52A0' }}>Contact Admin</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
