import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import {
  login,
  register,
  getCurrentUser,
  updateProfile,
  logout as logoutService,
  forgetPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail
} from '../../services/authService';

// Define user type based on backend response
interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: string;
  profileImage?: string;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

// Async thunk for logout
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutService();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Async thunks for auth operations
export const loginAsync = createAsyncThunk(
  'auth/login',
  async ({ identifier, password }: { identifier: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await login(identifier, password);
      const { user } = response.data;
      // Assuming JWT token is sent in response after backend fix
      const token = response.data.token;
      localStorage.setItem('token', token);
      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string; phone?: string }, { rejectWithValue }) => {
    try {
      const response = await register(data);
      // Registration successful, but don't auto-login
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async ({ data, profileImage }: { data: { name?: string; phone?: string; address?: string }, profileImage?: File }, { rejectWithValue }) => {
    try {
      const response = await updateProfile(data, profileImage);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed');
    }
  }
);

export const forgetPasswordAsync = createAsyncThunk(
  'auth/forgetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      await forgetPassword(email);
      return 'Reset link sent to email';
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await resetPassword(token, newPassword);
      return 'Password reset successful';
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

export const verifyEmailAsync = createAsyncThunk(
  'auth/verifyEmail',
  async (token: string, { rejectWithValue }) => {
    try {
      await verifyEmail(token);
      return 'Email verified successfully';
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
  }
);

export const sendVerificationEmailAsync = createAsyncThunk(
  'auth/sendVerificationEmail',
  async (_, { rejectWithValue }) => {
    try {
      await sendVerificationEmail();
      return 'Verification email sent';
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send verification email');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('token', action.payload.token);
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        toast.success('Logged out successfully!');
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Still perform logout even if API fails
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
        toast.success('Logged out successfully!');
      })
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        toast.success('Login successful!');
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Login failed');
      })
      // Register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false;
        toast.success('Registration successful! Please login.');
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Registration failed');
      })
      // Get current user
      .addCase(getCurrentUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Update profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        toast.success('Profile updated successfully!');
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to update profile');
      })
      // Forget password
      .addCase(forgetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
        toast.success('Reset link sent to your email!');
      })
      .addCase(forgetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to send reset email');
      })
      // Reset password
      .addCase(resetPasswordAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.loading = false;
        toast.success('Password reset successful!');
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to reset password');
      })
      // Verify email
      .addCase(verifyEmailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmailAsync.fulfilled, (state) => {
        state.loading = false;
        toast.success('Email verified successfully!');
      })
      .addCase(verifyEmailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Email verification failed');
      })
      // Send verification email
      .addCase(sendVerificationEmailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendVerificationEmailAsync.fulfilled, (state) => {
        state.loading = false;
        toast.success('Verification email sent!');
      })
      .addCase(sendVerificationEmailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string || 'Failed to send verification email');
      });
  },
});

export const { logout, clearError, setCredentials, refreshToken } = authSlice.actions;
export default authSlice.reducer;
