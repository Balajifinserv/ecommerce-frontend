import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../store/slices/productSlice';
import { FiSearch } from 'react-icons/fi';
import debounce from 'lodash/debounce';

const SearchBar: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search to avoid too many API calls
  const debouncedSearch = debounce((term: string) => {
    dispatch(setSearchQuery(term));
  }, 700);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  return (
    <div className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="text-black dark:text-white w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 bg-white dark:bg-gray-800"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
