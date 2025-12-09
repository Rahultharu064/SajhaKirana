import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface CartItem {
  id: number;
  userId: number;
  sku: string;
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  total: 0,
  loading: false,
  error: null,
};

// Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ sku, quantity }: { sku: string; quantity: number }, { dispatch, getState }) => {
    const state: any = getState();
    const userId = state.auth.user?.userId;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const payload = { userId, sku, quantity };
    console.log('cartSlice: Sending addToCart payload:', payload);

    const response = await api.post('/cart/add', payload);

    // Fetch cart after adding
    dispatch(fetchCart());
    return response.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId: number, { dispatch }) => {
    await api.post('/cart/remove', { cartItemId });
    dispatch(fetchCart());
  }
);

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState }) => {
    const state: any = getState();
    const userId = state.auth.user?.userId;

    if (!userId) {
      return { items: [], totals: 0 };
    }

    const response = await api.get(`/cart/${userId}`);
    return response.data;
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<{ items: CartItem[]; totals: number }>) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.totals;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
