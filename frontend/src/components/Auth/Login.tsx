import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn, Package, Sparkles, Truck, ShieldCheck } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../../Redux/store';
import { loginAsync } from '../../Redux/slices/authSlice';


const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  // Clear errors on successful registration/login
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Redirect based on user role after authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const validateField = (name: string, value: string) => {
    const errors: { [key: string]: string } = {};

    switch (name) {
      case 'identifier':
        if (value.trim().length === 0) errors.identifier = 'Email is required';
        else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) errors.identifier = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (value.length === 0) errors.password = 'Password is required';
        break;
    }

    setValidationErrors(prev => ({ ...prev, [name]: errors[name] || undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (name !== 'rememberMe') {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all validations
    const errors: { [key: string]: string } = {};
    if (formData.identifier.trim().length === 0) errors.identifier = 'Email is required';
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identifier)) errors.identifier = 'Please enter a valid email address';
    }

    if (formData.password.length === 0) errors.password = 'Password is required';

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Dispatch login
    const payload = {
      identifier: formData.identifier.trim().toLowerCase(),
      password: formData.password
    };
    dispatch(loginAsync(payload));
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-slate-900 to-slate-900" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px]" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-brand-gradient p-2.5 rounded-2xl shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">SajhaKirana</span>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/10 rounded-full mb-6">
              <Sparkles size={16} className="text-amber-300" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Premium Grocery</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Fresh groceries, <span className="text-gradient">delivered fast.</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Sign in to track orders, manage your wishlist, and get farm-fresh picks at wholesale rates.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <Truck size={18} className="text-emerald-400" /> 30-min delivery
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <ShieldCheck size={18} className="text-emerald-400" /> Secure checkout
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 px-6 py-8 sm:px-8 md:px-10">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-brand-gradient rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Sign in to your account to continue shopping
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="identifier" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="identifier"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleChange}
                      required
                      className="input-field pl-10 pr-4"
                      placeholder="Enter your email"
                      aria-describedby={validationErrors.identifier ? "identifier-error" : undefined}
                    />
                  </div>
                  {validationErrors.identifier && (
                    <p id="identifier-error" className="mt-1 text-sm text-rose-600" role="alert">
                      {validationErrors.identifier}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type={passwordVisible ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="input-field pl-10 pr-10"
                      placeholder="Enter your password"
                      aria-describedby={validationErrors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                      onClick={togglePasswordVisibility}
                      aria-label={passwordVisible ? "Hide password" : "Show password"}
                    >
                      {passwordVisible ? (
                        <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p id="password-error" className="mt-1 text-sm text-rose-600" role="alert">
                      {validationErrors.password}
                    </p>
                  )}
                </div>

                {/* Remember Me and Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-slate-600 font-medium">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="/forgot-password" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={Object.keys(validationErrors).some(key => validationErrors[key as keyof typeof validationErrors])}
                  startIcon={<LogIn />}
                  fullWidth
                  size="lg"
                  aria-describedby={loading ? "loading-message" : undefined}
                >
                  {loading ? (
                    <span id="loading-message">Signing In...</span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
