import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchProducts, setCurrentPage } from '../store/slices/productSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFilter, FiShoppingCart, FiHeart } from 'react-icons/fi';

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const { items, loading, error, filters, pagination } = useSelector(
    (state: RootState) => state.products
  );
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const [filterMode, setFilterMode] = useState<'all' | 'wishlist'>('all');
  const [showFilters, setShowFilters] = React.useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    console.log('Fetching products', { filters, currentPage: pagination.currentPage });
    dispatch(fetchProducts());
  }, [dispatch, filters, pagination.currentPage]);

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100); // Adjust this value to control when the header becomes sticky
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWishlistFilter = () => {
    setFilterMode(prevMode => 
      prevMode === 'all' ? 'wishlist' : 'all'
    );
  };

  const displayedProducts = filterMode === 'wishlist' 
    ? wishlistItems 
    : items;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className={`bg-white shadow-sm z-20 transition-all duration-300 ${
        isSticky 
          ? 'fixed top-0 left-0 right-0 py-4 mb-4' 
          : 'relative'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 order-1 md:order-none">
              {filterMode === 'wishlist' ? 'Wishlist' : 'Our Products'}
            </h1>
            <div className="w-full md:w-96 order-2 md:order-none">
              <SearchBar />
            </div>
            <div className="flex items-center justify-between order-first md:order-none">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <FiFilter className="w-5 h-5" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {/* Add Cart and Wishlist Icons for Mobile */}
              <div className="flex items-center gap-4 md:hidden">
                <button 
                  onClick={handleWishlistFilter}
                  className={`text-gray-600 hover:text-gray-900 ${
                    filterMode === 'wishlist' 
                      ? 'text-red-500' 
                      : 'text-gray-600'
                  }`}
                >
                  <FiHeart className="w-6 h-6" />
                </button>
                <button className="text-gray-600 hover:text-gray-900">
                  <FiShoppingCart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder to prevent content from jumping when header becomes sticky */}
      {isSticky && <div className="h-24"></div>}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              {showFilters && <ProductFilters />}
            </div>
          </div>

          {/* Filters - Mobile */}
          {showFilters && (
            <div className="md:hidden">
              <ProductFilters />
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <LoadingSpinner />
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                {filterMode === 'wishlist' 
                  ? 'No items in your wishlist' 
                  : 'No products found matching your criteria.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => {
                  console.log('Rendering product:', {
                    id: product._id, 
                    name: product.name, 
                    images: product.images
                  });
                  return <ProductCard key={product._id} product={product} />;
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && displayedProducts.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      dispatch(setCurrentPage(pagination.currentPage - 1))
                    }
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 rounded-md bg-indigo-50 text-indigo-600 font-medium">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(setCurrentPage(pagination.currentPage + 1))
                    }
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
