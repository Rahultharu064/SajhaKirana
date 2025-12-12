import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { adminLogin } from '../../services/authService';
import { setCredentials } from '../../Redux/slices/authSlice';
import Button from '../../components/ui/Button';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        console.log('🔐 [AdminLogin] Starting login process...');
        console.log('📧 Email:', identifier);
        console.log('🔑 Password length:', password.length);

        try {
            console.log('📤 Sending login request...');
            const response = await adminLogin(identifier, password);

            console.log('📥 Response received:', response);
            console.log('✅ Response status:', response.status);
            console.log('📦 Response data:', response.data);

            // Backend returns { message, user, token } - check for token and user to determine success
            if (response.data.token && response.data.user) {
                console.log('🎉 Login successful!');
                toast.success('Welcome back, Admin!');
                // Store token
                localStorage.setItem('token', response.data.token);

                // Update Redux state
                dispatch(setCredentials({ user: response.data.user, token: response.data.token }));

                // Navigate to admin dashboard
                console.log('🚀 Navigating to admin dashboard...');
                navigate('/admin/dashboard');
            } else {
                console.log('❌ Login failed:', response.data.message);
                const errorMsg = response.data.message || 'Login failed';
                toast.error(errorMsg);
                setError(errorMsg);
            }
        } catch (err: any) {
            console.error('❌ [AdminLogin] Error caught:', err);
            console.error('📊 Error details:', {
                message: err.message,
                response: err.response,
                status: err.response?.status,
                data: err.response?.data
            });

            // Handle different error scenarios
            let errorMsg = 'An error occurred during login. Please try again.';

            if (err.response?.data?.error) {
                console.log('🔴 Setting error from response.data.error:', err.response.data.error);
                errorMsg = err.response.data.error;
            } else if (err.response?.data?.message) {
                console.log('🔴 Setting error from response.data.message:', err.response.data.message);
                errorMsg = err.response.data.message;
            } else if (err.response?.status === 401) {
                console.log('🔴 401 error - Invalid credentials');
                errorMsg = 'Invalid credentials or insufficient privileges. Please check your email and password.';
            } else {
                console.log('🔴 Unknown error');
            }

            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
                    <p className="text-gray-600">Sign in to access the admin dashboard</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="identifier"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Need admin access?{' '}
                            <a href="/admin/create" className="text-primary-600 hover:text-primary-700 font-medium">
                                Create Admin Account
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Regular users should use the{' '}
                        <a href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            customer login
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
