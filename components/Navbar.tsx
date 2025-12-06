import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BedDouble, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <BedDouble className="h-8 w-8 text-brand-600" />
              <span className="font-serif text-2xl font-bold text-brand-900">LuxeStay</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-900'} px-3 py-2 text-sm font-medium transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/search" 
              className={`${location.pathname === '/search' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-900'} px-3 py-2 text-sm font-medium transition-colors`}
            >
              Find a Hotel
            </Link>
            <Link 
              to="/bookings" 
              className={`${location.pathname === '/bookings' ? 'text-brand-600' : 'text-gray-600 hover:text-brand-900'} px-3 py-2 text-sm font-medium transition-colors`}
            >
              My Bookings
            </Link>
            <button className="bg-brand-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-800 transition-colors">
              Sign In
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              Find a Hotel
            </Link>
            <Link
              to="/bookings"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              onClick={() => setIsOpen(false)}
            >
              My Bookings
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;