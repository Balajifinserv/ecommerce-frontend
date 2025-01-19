import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  setCategory,
  setPriceRange,
  setSortBy,
  clearFilters,
} from '../store/slices/productSlice';
import { FiX } from 'react-icons/fi';

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'books', name: 'Books' },
  { id: 'home', name: 'Home & Living' },
  { id: 'sports', name: 'Sports & Outdoors' },
];

const sortOptions = [
  { id: 'name_asc', name: 'Name (A-Z)' },
  { id: 'name_desc', name: 'Name (Z-A)' },
  { id: 'price_asc', name: 'Price (Low to High)' },
  { id: 'price_desc', name: 'Price (High to Low)' },
  { id: 'rating_desc', name: 'Highest Rated' },
];

const ProductFilters: React.FC = () => {
  const dispatch = useDispatch();
  const { category, priceRange, sortBy } = useSelector(
    (state: RootState) => state.products.filters
  );

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? 0 : Number(value);
    dispatch(
      setPriceRange({
        ...priceRange,
        [type]: numValue,
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <button
          onClick={handleClearFilters}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <FiX className="w-4 h-4" />
          Clear all
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={category === cat.id}
                onChange={(e) => dispatch(setCategory(e.target.value))}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-600">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="flex gap-4">
          <div>
            <label className="text-xs text-gray-500">Min ($)</label>
            <input
              type="number"
              value={priceRange.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Max ($)</label>
            <input
              type="number"
              value={priceRange.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {sortOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductFilters;
