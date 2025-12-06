import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, ShieldCheck, Globe } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import HotelCard from '../components/HotelCard';
import { searchHotelsWithGemini } from '../services/gemini';
import { Hotel } from '../types';

const HomePage: React.FC = () => {
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      // Load some initial "featured" hotels from diverse locations
      const hotels = await searchHotelsWithGemini("Luxury destinations");
      setFeaturedHotels(hotels.slice(0, 3));
      setLoading(false);
    };
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Luxury Hotel" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-900/40 mix-blend-multiply" />
        </div>
        
        <div className="relative z-10 w-full max-w-5xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 drop-shadow-lg">
              Find Your Next <span className="text-brand-100">Luxury</span> Escape
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto drop-shadow">
              Discover and book the best hotels and resorts worldwide with exclusive deals and seamless reservations.
            </p>
          </div>
          
          <SearchForm />
        </div>
      </div>

      {/* Value Props */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-brand-50 rounded-xl">
              <div className="bg-white p-3 rounded-full shadow-md mb-4">
                <ShieldCheck className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-900 mb-2">Secure Booking</h3>
              <p className="text-gray-600 text-sm">Your payment and personal information are always protected with industry-standard security.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-brand-50 rounded-xl">
              <div className="bg-white p-3 rounded-full shadow-md mb-4">
                <Star className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-900 mb-2">Best Rates Guaranteed</h3>
              <p className="text-gray-600 text-sm">We match prices so you never overpay for your dream vacation.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-brand-50 rounded-xl">
              <div className="bg-white p-3 rounded-full shadow-md mb-4">
                <Globe className="h-8 w-8 text-brand-600" />
              </div>
              <h3 className="text-lg font-serif font-bold text-brand-900 mb-2">Global Coverage</h3>
              <p className="text-gray-600 text-sm">Access to over 100,000 luxury hotels and resorts in the world's most desired locations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-900">Featured Stays</h2>
              <p className="text-gray-600 mt-2">Handpicked collections for your next stay.</p>
            </div>
            <a href="#/search" className="hidden md:flex items-center text-brand-600 font-medium hover:text-brand-800 transition-colors">
              View all hotels <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl h-96 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-20 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
             <a href="#/search" className="inline-flex items-center text-brand-600 font-medium">
              View all hotels <ArrowRight className="h-4 w-4 ml-1" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;