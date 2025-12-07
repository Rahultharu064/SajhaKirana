import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, LogOut, Camera,  Save } from 'lucide-react';
import toast from 'react-hot-toast';
import type { RootState, AppDispatch } from '../../Redux/store';
import { getCurrentUserAsync, logoutAsync, updateProfileAsync } from '../../Redux/slices/authSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showEditSection, setShowEditSection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch current user data if not already available
    if (!user) {
      dispatch(getCurrentUserAsync());
    }
  }, [isAuthenticated, user, navigate, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/login');
  };

  // const handleEditToggle = () => {
  //   setShowEditSection(!showEditSection);
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Please select an image smaller than 5MB');
        return;
      }

      try {
        setImageUploading(true);
        await dispatch(updateProfileAsync({ data: {}, profileImage: file })).unwrap();
        toast.success('Profile image updated successfully!');
        // Refresh user data
        dispatch(getCurrentUserAsync());
      } catch (error: any) {
        toast.error(error || 'Failed to update profile image');
      } finally {
        setImageUploading(false);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      const data: { name?: string; phone?: string; address?: string } = {};

      // Check if fields have changed
      if (formData.name !== user?.name) data.name = formData.name;
      if (formData.phone !== user?.phone) data.phone = formData.phone;
      if (formData.address !== user?.address) data.address = formData.address;

      await dispatch(updateProfileAsync({ data })).unwrap();

      setShowEditSection(false);
      toast.success('Profile updated successfully!');
      // Refresh user data
      dispatch(getCurrentUserAsync());
    } catch (error: any) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                {/* Profile Image */}
                <div className="relative">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    aria-label="Choose profile image file"
                  />
                  <div className="h-20 w-20 rounded-full overflow-hidden bg-white bg-opacity-20 flex items-center justify-center">
                    {user.profileImage ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/uploads/profiles/${user.profileImage}`}
                        alt={user.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                          const parent = e.currentTarget.parentElement;
                          const fallbackIcon = parent?.querySelector('.fallback-icon');
                          (fallbackIcon as HTMLElement)?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!user.profileImage && (
                      <User className={`h-10 w-10 fallback-icon ${user.profileImage ? 'hidden' : ''}`} />
                    )}
                  </div>
                  <button
                    onClick={handleImageUploadClick}
                    disabled={imageUploading}
                    className="absolute -bottom-1 -right-1 h-6 w-6 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white rounded-full flex items-center justify-center transition-colors"
                    type="button"
                    title="Change profile image"
                    aria-label="Upload new profile image"
                  >
                    {imageUploading ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    ) : (
                      <Camera className="h-3 w-3" />
                    )}
                  </button>
                </div>

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome, {user.name}!
                  </h1>
                  <p className="text-indigo-100">Your Account Dashboard</p>
                </div>
              </div>

              {/* <button
                onClick={handleEditToggle}
                className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>{showEditSection ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button> */}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Account Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Account Information
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>

                  {user.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">{user.phone}</p>
                      </div>
                    </div>
                  )}

                  {user.role && (
                    <div className="flex items-center space-x-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Role</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{user.address}</p>
                      </div>
                    </div>
                  )}

                  {user.lastLogin && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium text-gray-900">
                          {new Date(user.lastLogin).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                  Quick Actions
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <span className="font-medium text-gray-900">My Orders</span>
                  </button>

                  <button
                    onClick={() => navigate('/cart')}
                    className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-900">My Cart</span>
                  </button>

                  <button
                    onClick={() => navigate('/profile/edit')}
                    className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                  >
                    <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-yellow-600" />
                    </div>
                    <span className="font-medium text-gray-900">Edit Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-medium text-gray-900">Logout</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Profile Section */}
            {showEditSection && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile Information</h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="edit-name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="edit-phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        id="edit-address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors"
                        aria-label="Save profile changes"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
