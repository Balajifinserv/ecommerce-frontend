const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-gray-300">
              Your one-stop shop for all your shopping needs. Quality products at competitive prices.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-gray-300 hover:text-white">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="text-gray-300 hover:text-white">
                  Cart
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white">
                  My Account
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Email: support@eshop.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Shopping St, Commerce City</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
