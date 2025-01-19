import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchProductDetails } from '../store/slices/productSlice';

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
  specifications?: {
    [key: string]: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error } = useSelector((state: RootState) => state.products);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<boolean[]>([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedProduct) {
      setCurrentImageIndex(0);
      setImageErrors(new Array(selectedProduct.images?.length || 0).fill(false));
    }
  }, [selectedProduct]);

  const getProductImage = (index: number) => {
    if (selectedProduct && 
        selectedProduct.images && 
        selectedProduct.images.length > 0 && 
        !imageErrors[index]) {
      return selectedProduct.images[index];
    }
    return '/placeholder-image.webp';
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => {
      const newErrors = [...prev];
      newErrors[index] = true;
      return newErrors;
    });
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(addToCart({
        _id: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        images: selectedProduct.images,
        quantity: quantity
      }));
    }
  };

  const handleNextImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % selectedProduct.images.length
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProduct && selectedProduct.images) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 
          ? (selectedProduct.images?.length || 1) - 1 
          : prevIndex - 1
      );
    }
  };

  const handleQuantityChange = (change: number) => {
    if (selectedProduct) {
      const newQuantity = Math.max(1, Math.min(quantity + change, selectedProduct.stock));
      setQuantity(newQuantity);
    }
  };

  const renderRating = () => {
    const productRating = typeof selectedProduct?.rating === 'number' 
      ? Math.max(0, Math.min(5, selectedProduct.rating)) 
      : 0;
    
    const ratingDisplay = Math.round(productRating * 10) / 10;

    return (
      <div className="flex items-center mb-4">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                i < Math.floor(productRating) ? 'text-yellow-500' : 'text-gray-300'
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <span className="ml-2 text-sm text-gray-600">
          {ratingDisplay} ({productRating === 0 ? 'No' : Math.round(productRating)} reviews)
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p>Error: {error || 'Product not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image Slider */}
          <div className="w-full md:w-1/2 relative">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img 
                src={getProductImage(currentImageIndex)} 
                alt={`${selectedProduct?.name || 'Product'} - Image ${currentImageIndex + 1}`} 
                onError={() => handleImageError(currentImageIndex)}
                className="w-full h-[500px] object-cover"
              />
              
              {/* Navigation Buttons */}
              {selectedProduct && selectedProduct.images && selectedProduct.images.length > 1 && (
                <>
                  <button 
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 
                      bg-white/50 hover:bg-white/75 rounded-full p-2 
                      transition-colors duration-300"
                  >
                    ←
                  </button>
                  <button 
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 
                      bg-white/50 hover:bg-white/75 rounded-full p-2 
                      transition-colors duration-300"
                  >
                    →
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {selectedProduct && selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {selectedProduct.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentImageIndex 
                        ? 'bg-indigo-600' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {selectedProduct.name}
            </h1>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-indigo-600">
                ${selectedProduct.price.toFixed(2)}
              </span>
              <div className="flex items-center space-x-4">
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedProduct.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {renderRating()}

            <p className="text-gray-600 mb-6">
              {selectedProduct.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-l-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <input
                type="text"
                readOnly
                value={quantity}
                className="w-12 text-center border-t border-b border-gray-200 py-1"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= selectedProduct.stock}
                className="bg-gray-200 text-gray-700 px-3 py-1 rounded-r-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={selectedProduct.stock === 0}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg 
                  hover:bg-indigo-700 transition-colors duration-300 
                  flex items-center justify-center space-x-2
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                className="flex-1 border border-gray-300 text-gray-700 py-3 
                  rounded-lg hover:bg-gray-100 transition-colors duration-300 
                  flex items-center justify-center space-x-2"
              >
                <FiHeart className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Features */}
            {selectedProduct.features && selectedProduct.features.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h2>
                <ul className="list-disc list-inside text-gray-600">
                  {selectedProduct.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Specifications */}
            {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Specifications</h2>
                <table className="w-full text-gray-600">
                  <tbody>
                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b">
                        <td className="py-2 font-medium">{key}</td>
                        <td className="py-2">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
