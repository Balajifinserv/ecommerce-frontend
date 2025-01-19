import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating?: number;
  details?: {
    material?: string;
    dimensions?: string;
    weight?: string;
  };
  features?: string[];
  specifications?: Record<string, string>;
  ratings?: Array<{
    rating: number;
    review: string;
    user: string;
    date: string;
  }>;
  averageRating?: number;
}

interface ProductsState {
  items: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: {
    category: string;
    priceRange: {
      min: number;
      max: number;
    };
    searchQuery: string;
    sortBy: string;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

const initialState: ProductsState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  filters: {
    category: 'all',
    priceRange: {
      min: 0,
      max: 10000,
    },
    searchQuery: '',
    sortBy: 'name_asc',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  },
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { products } = getState() as { products: ProductsState };
      const { category, searchQuery, sortBy } = products.filters;
      const { currentPage, limit } = products.pagination;

      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', limit.toString());
      
      if (category !== 'all') {
        params.append('category', category);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      if (sortBy) {
        params.append('sort', sortBy);
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products?${params}`);
      
      // Detailed logging of the entire response
      console.log('Full Fetch Products Response:', response);
      console.log('Response Data:', response.data);
      console.log('Response Keys:', Object.keys(response.data));

      // If the response structure is different, adjust accordingly
      const productsData = response.data.products || response.data;
      
      // Log the products data for verification
      console.log('Products Data:', productsData);

      return productsData;
    } catch (error: any) {
      console.error('Fetch Products Error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/${productId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCategory: (state, action) => {
      state.filters.category = action.payload;
      state.pagination.currentPage = 1;
    },
    setPriceRange: (state, action) => {
      state.filters.priceRange = action.payload;
      state.pagination.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
      state.pagination.currentPage = 1;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.pagination.currentPage = 1;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.limit);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.selectedProduct = null;
      });
  },
});

export const {
  setCategory,
  setPriceRange,
  setSearchQuery,
  setSortBy,
  setCurrentPage,
  clearFilters,
} = productSlice.actions;

export default productSlice.reducer;
