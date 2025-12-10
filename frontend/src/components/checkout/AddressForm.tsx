import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, User, Phone, Mail, FileText, Home } from 'lucide-react';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import api from '../../services/api';
import type { AddressData } from '../../types/common';

interface AddressFormProps {
  initialData?: AddressData | null;
  onSubmit: (data: AddressData) => void;
}

const AddressForm = ({ initialData, onSubmit }: AddressFormProps) => {
  const [formData, setFormData] = useState<AddressData>(
    initialData || {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      district: '',
      landmark: '',
    }
  );

  const [errors, setErrors] = useState<Partial<AddressData>>({});

  const [districts, setDistricts] = useState<string[]>([]);
  const [districtSearch, setDistrictSearch] = useState('');
  const [showDistrictSuggestions, setShowDistrictSuggestions] = useState(false);

  // Fetch districts on mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await api.get('/districts');
        if (response.data.success) {
          setDistricts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch districts:', error);
        // Fallback with some default districts if API fails
        setDistricts([
          'Kathmandu', 'Lalitpur', 'Bhaktapur', 'Pokhara', 'Chitwan',
          'Biratnagar', 'Birgunj', 'Dharan', 'Janakpur', 'Hetauda',
          'Dhangadhi', 'Nepalgunj', 'Itahari', 'Mahendranagar', 'Bharatpur'
        ]);
      }
    };

    fetchDistricts();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<AddressData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Phone validation (Nepali phone numbers)
    const phoneRegex = /^(98|97|96)\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Invalid phone number (should start with 98, 97, or 96)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field: keyof AddressData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <Home className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Delivery Address
        </h2>
        <p className="text-muted-foreground">
          Please provide your delivery address details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.fullName ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.phone ? 'border-destructive' : 'border-border'
                }`}
                placeholder="98xxxxxxxx"
              />
            </div>
            {errors.phone && (
              <p className="text-destructive text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <p className="text-destructive text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
            Address *
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-muted-foreground w-5 h-5" />
            <textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              rows={3}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none ${
                errors.address ? 'border-destructive' : 'border-border'
              }`}
              placeholder="Enter your complete address"
            />
          </div>
          {errors.address && (
            <p className="text-destructive text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-foreground mb-2">
              City *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.city ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your city"
              />
            </div>
            {errors.city && (
              <p className="text-destructive text-sm mt-1">{errors.city}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-foreground mb-2">
              District *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                id="district"
                value={formData.district}
                onChange={(e) => {
                  handleChange('district', e.target.value);
                  setDistrictSearch(e.target.value);
                  setShowDistrictSuggestions(true);
                }}
                onFocus={() => setShowDistrictSuggestions(true)}
                onBlur={() => setTimeout(() => setShowDistrictSuggestions(false), 150)}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
                  errors.district ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your district"
                autoComplete="off"
              />
              {/* District Suggestions Dropdown */}
              {showDistrictSuggestions && districts.length > 0 && districtSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {districts
                    .filter(district =>
                      district.toLowerCase().includes(districtSearch.toLowerCase())
                    )
                    .map((district) => (
                      <button
                        key={district}
                        type="button"
                        onClick={() => {
                          handleChange('district', district);
                          setDistrictSearch(district);
                          setShowDistrictSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors"
                      >
                        {district}
                      </button>
                    ))}
                  {districts.filter(district =>
                    district.toLowerCase().includes(districtSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-muted-foreground text-sm">
                      No districts found
                    </div>
                  )}
                </div>
              )}
            </div>
            {errors.district && (
              <p className="text-destructive text-sm mt-1">{errors.district}</p>
            )}
          </div>
        </div>

        {/* Landmark */}
        <div>
          <label htmlFor="landmark" className="block text-sm font-medium text-foreground mb-2">
            Landmark (Optional)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              id="landmark"
              value={formData.landmark}
              onChange={(e) => handleChange('landmark', e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Near temple, beside school, etc."
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full py-3 text-lg font-medium"
            size="lg"
          >
            Continue to Delivery Options
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddressForm;
