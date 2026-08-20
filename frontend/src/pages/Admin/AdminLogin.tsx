import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import axios from 'axios';
import { adminLogin } from '../../services/authService';
import { setCredentials } from '../../Redux/slices/authSlice';
import Button from '../../components/ui/Button';
import { Lock, Mail, ShieldCheck, Eye, EyeOff, Package } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await adminLogin(identifier, password);

            if (response.data.token && response.data.user) {
                toast.success('Welcome back, Admin!');
                localStorage.setItem('token', response.data.token);
                dispatch(setCredentials({ user: response.data.user, token: response.data.token }));
                navigate('/admin/dashboard');
            } else {
                const errorMsg = response.data.message || 'Login failed';
                toast.error(errorMsg);
                setError(errorMsg);
            }
        } catch (err) {
            let errorMsg = 'An error occurred during login. Please try again.';

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    errorMsg = 'Invalid credentials or insufficient privileges. Please check your email and password.';
                } else if (err.response?.data?.error) {
                    errorMsg = err.response.data.error;
                } else if (err.response?.data?.message) {
                    errorMsg = err.response.data.message;
                }
            }

            toast.error(errorMsg);
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-slate-950 to-slate-950" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px]" />

            <div className="max-w-md w-full relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-8">
                        <div className="bg-brand-gradient p-2.5 rounded-2xl shadow-lg">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">SajhaKirana</span>
                    </Link>
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 border border-white/10 rounded-2xl mb-4">
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Admin Portal</h1>
                    <p className="text-slate-400 font-medium">Sign in to manage your e-commerce platform</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl">
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Email Input */}
                        <div>
                            <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Admin Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="identifier"
                                    type="email"
                                    placeholder="admin@sajhakirana.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    className="input-field pl-10 pr-4"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    id="password"
                                    type={passwordVisible ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                    aria-label={passwordVisible ? 'Hide password' : 'Show password'}
                                >
                                    {passwordVisible ? (
                                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            loading={loading}
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In to Admin Panel'}
                        </Button>
                    </form>

                    {/* Additional Info */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500 font-medium">
                            Need admin access?{' '}
                            <Link to="/admin/create" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                                Create Admin Account
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-400 font-medium">
                        Regular users should use the{' '}
                        <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                            customer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
