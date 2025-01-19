import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Our E-Commerce Store
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Discover amazing products at great prices
        </p>
        <Link
          to="/products"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Shop Now
        </Link>
      </div>

      {/* Featured Categories */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Electronics', 'Fashion', 'Home & Living'].map((category) => (
            <div
              key={category}
              className="relative rounded-lg overflow-hidden group"
            >
              <div className="aspect-w-3 aspect-h-2">
                <div className="bg-gray-200 w-full h-full"></div>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <h3 className="text-xl font-semibold text-white">{category}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-w-1 aspect-h-1">
                <div className="bg-gray-200 w-full h-full"></div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Product Name
                </h3>
                <p className="mt-1 text-sm text-gray-500">Product description</p>
                <p className="mt-2 text-lg font-semibold text-indigo-600">
                  $99.99
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to dive in?</span>
            <span className="block text-indigo-200">
              Start shopping today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
