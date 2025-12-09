import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../../Redux/store';
import { loginAsync } from '../../Redux/slices/authSlice';


const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

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

  // Redirect to profile if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 sm:px-8 md:px-10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="identifier"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your email"
                    aria-describedby={validationErrors.identifier ? "identifier-error" : undefined}
                  />
                </div>
                {validationErrors.identifier && (
                  <p id="identifier-error" className="mt-1 text-sm text-red-600" role="alert">
                    {validationErrors.identifier}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your password"
                    aria-describedby={validationErrors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
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
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
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
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
