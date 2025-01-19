import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating?: number;  
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  // Check if product is in wishlist
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some(item => item._id === product._id);

  const handleProductClick = () => {
    navigate(`/products/${product._id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    // Stop the event from propagating to the parent div
    e.stopPropagation();
    
    // Prevent default behavior
    e.preventDefault();

    // Check if the product is in stock
    if (product.stock > 0) {
      dispatch(addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: getProductImage(),
        quantity: 1
      }));
    } else {
      // Optional: Show a toast or alert for out of stock
      alert('Product is out of stock');
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    // Stop the event from propagating to the parent div
    e.stopPropagation();
    
    // Prevent default behavior
    e.preventDefault();

    // Toggle wishlist
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const getProductImage = () => {
    if (product.images && product.images.length > 0 && !imageError) {
      return product.images[0];
    }
    return '/placeholder-image.webp';
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const productRating = product.rating || 0;

  return (
    <div 
      onClick={handleProductClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-xl group flex flex-col max-h-[800px] h-full"
    >
      {/* Product Image */}
      <div className="relative aspect-w-4 aspect-h-3 h-48 overflow-hidden">
        <img 
          src={getProductImage()}
          alt={product.name} 
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
        />
        {product.stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-[80%]">
            {product.name}
          </h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleWishlist}
              disabled={product.stock === 0}
              className={`text-gray-400 transition-colors disabled:opacity-50 active:scale-90 ${
                isInWishlist 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'hover:text-red-500'
              }`}
            >
              <FiHeart className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50 active:scale-90"
            >
              <FiShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-grow">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <div className="flex items-center">
            {[...Array(5)].map((_, index) => (
              <span 
                key={index} 
                className={`text-lg ${
                  index < productRating 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
