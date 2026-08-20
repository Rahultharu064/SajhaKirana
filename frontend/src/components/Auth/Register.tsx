import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus, Package, Sparkles, Leaf, BadgePercent } from 'lucide-react';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../../Redux/store';
import { registerAsync } from '../../Redux/slices/authSlice';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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
    dispatch(registerAsync(payload)).then(() => {
      navigate('/login');
    });
  };

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 via-slate-900 to-slate-900" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/20 rounded-full blur-[100px]" />
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
              <span className="text-xs font-bold text-white uppercase tracking-widest">Join Sajha Kirana</span>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight mb-4">
              Wholesale rates, <span className="text-gradient">every day.</span>
            </h1>
            <p className="text-slate-400 font-medium">
              Create your account to unlock member pricing, save favorites, and check out in seconds.
            </p>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <Leaf size={18} className="text-emerald-400" /> Organic sourcing
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
              <BadgePercent size={18} className="text-emerald-400" /> Member deals
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
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                Create Account
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Join us today to start your shopping journey
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field pl-10 pr-4"
                      placeholder="Enter your full name"
                      aria-describedby={validationErrors.name ? "name-error" : undefined}
                    />
                  </div>
                  {validationErrors.name && (
                    <p id="name-error" className="mt-1 text-sm text-rose-600" role="alert">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field pl-10 pr-4"
                      placeholder="Enter your email"
                      aria-describedby={validationErrors.email ? "email-error" : undefined}
                    />
                  </div>
                  {validationErrors.email && (
                    <p id="email-error" className="mt-1 text-sm text-rose-600" role="alert">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="text-sm text-slate-400 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field pl-10 pr-4"
                      placeholder="+977 98XXXXXXXX"
                      aria-describedby={validationErrors.phone ? "phone-error" : undefined}
                    />
                  </div>
                  {validationErrors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-rose-600" role="alert">
                      {validationErrors.phone}
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
                      placeholder="Create a strong password"
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
                  <p className="mt-1 text-xs text-slate-400">
                    Password must be at least 8 characters long
                  </p>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  loading={loading}
                  disabled={Object.keys(validationErrors).some(key => validationErrors[key as keyof typeof validationErrors])}
                  startIcon={<UserPlus />}
                  fullWidth
                  size="lg"
                  aria-describedby={loading ? "loading-message" : undefined}
                >
                  {loading ? (
                    <span id="loading-message">Creating Account...</span>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 font-medium">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
