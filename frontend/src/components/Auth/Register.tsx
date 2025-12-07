import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../../Redux/store';
import { registerAsync } from '../../Redux/slices/authSlice';
import clsx from 'clsx';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  }>({});

  // Clear errors on successful registration (you might need to adjust based on your auth logic)
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const validateField = (name: string, value: string) => {
    const errors: { [key: string]: string } = {};

    switch (name) {
      case 'name':
        if (value.trim().length < 2) errors.name = 'Name must be at least 2 characters long';
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) errors.email = 'Please enter a valid email address';
        break;
      case 'password':
        if (value.length < 8) errors.password = 'Password must be at least 8 characters long';
        // Add more password requirements if needed
        break;
      case 'phone':
        if (value && !/^\+?[1-9]\d{9,14}$/.test(value.replace(/\s|-/g, ''))) {
          errors.phone = 'Please enter a valid phone number';
        }
        break;
    }

    setValidationErrors(prev => ({ ...prev, [name]: errors[name] || undefined }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all validations
    const errors: { [key: string]: string } = {};
    if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters long';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = 'Please enter a valid email address';
    if (formData.password.length < 8) errors.password = 'Password must be at least 8 characters long';
    if (formData.phone && !/^\+?[1-9]\d{9,14}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Filter out empty phone field to avoid validation errors
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      ...(formData.phone.trim() && { phone: formData.phone.trim() })
    };
    dispatch(registerAsync(payload));
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg px-6 py-8 sm:px-8 md:px-10">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <UserPlus className="h-8 w-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-sm text-gray-600">
              Join us today to start your shopping journey
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your full name"
                    aria-describedby={validationErrors.name ? "name-error" : undefined}
                  />
                </div>
                {validationErrors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 focus:bg-white transition-colors duration-200"
                    placeholder="Enter your email"
                    aria-describedby={validationErrors.email ? "email-error" : undefined}
                  />
                </div>
                {validationErrors.email && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-sm text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50 focus:bg-white transition-colors duration-200"
                    placeholder="+977 98XXXXXXXX"
                    aria-describedby={validationErrors.phone ? "phone-error" : undefined}
                  />
                </div>
                {validationErrors.phone && (
                  <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                    {validationErrors.phone}
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
                    placeholder="Create a strong password"
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
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || Object.keys(validationErrors).some(key => validationErrors[key as keyof typeof validationErrors])}
                className={clsx(
                  "w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200",
                  loading || Object.keys(validationErrors).some(key => validationErrors[key as keyof typeof validationErrors])
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 active:scale-95"
                )}
                aria-describedby={loading ? "loading-message" : undefined}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span id="loading-message">Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
