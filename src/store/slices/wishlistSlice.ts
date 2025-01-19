import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../types/Product';

interface WishlistState {
  items: Product[];
}

const initialState: WishlistState = {
  items: []
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      // Check if the product is already in the wishlist
      const existingProduct = state.items.find(
        item => item._id === action.payload._id
      );

      if (!existingProduct) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        item => item._id !== action.payload
      );
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  }
});

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
