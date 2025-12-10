import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

interface CartItem {
  id: number;
  userId: number;
  sku: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  description?: string;
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
  async ({
    sku,
    quantity,
    name,
    image,
    description
  }: {
    sku: string;
    quantity: number;
    name?: string;
    image?: string;
    description?: string;
  }, { dispatch, getState }) => {
    const state: any = getState();
    const userId = state.auth.user?.userId;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const payload = { userId, sku, quantity };
    console.log('cartSlice: Sending addToCart payload:', payload);

    const response = await api.post('/cart/add', payload);

    // If we have product info, store it temporarily for display purposes
    if (name || image || description) {
      try {
        const productCache = JSON.parse(localStorage.getItem('cartProductCache') || '{}');
        productCache[sku] = { name, image, description };
        localStorage.setItem('cartProductCache', JSON.stringify(productCache));
      } catch (error) {
        console.warn('Failed to cache product info:', error);
      }
    }

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

    // Enrich cart items with product information from cache
    const cartData = response.data;
    const productCache = JSON.parse(localStorage.getItem('cartProductCache') || '{}');

    // Add product information to cart items
    if (cartData.items && Array.isArray(cartData.items)) {
      cartData.items = cartData.items.map((item: CartItem) => ({
        ...item,
        name: productCache[item.sku]?.name || `Product ${item.sku}`,
        image: productCache[item.sku]?.image || '/placeholder.jpg',
        description: productCache[item.sku]?.description || 'Product description'
      }));
    }

    return cartData;
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
