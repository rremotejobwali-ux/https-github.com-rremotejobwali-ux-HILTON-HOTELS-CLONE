import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import SearchForm from '../components/SearchForm';
import HotelCard from '../components/HotelCard';
import { searchHotelsWithGemini } from '../services/gemini';
import { Hotel } from '../types';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);

  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';
  const guests = parseInt(searchParams.get('guests') || '2');

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      const results = await searchHotelsWithGemini(location);
      setHotels(results);
      setLoading(false);
    };

    fetchHotels();
  }, [location]);

  // Filter and Sort Logic
  const filteredHotels = hotels
    .filter(h => h.pricePerNight >= priceRange[0] && h.pricePerNight <= priceRange[1])
    .filter(h => h.rating >= minRating)
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.pricePerNight - b.pricePerNight;
      if (sortBy === 'price_desc') return b.pricePerNight - a.pricePerNight;
      return b.rating - a.rating;
    });

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="bg-brand-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-white font-serif text-3xl font-bold mb-6">Find Your Stay</h1>
          <SearchForm 
            initialLocation={location}
            initialCheckIn={checkIn}
            initialCheckOut={checkOut}
            initialGuests={guests}
            variant="horizontal"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <button 
            className="lg:hidden flex items-center justify-center gap-2 bg-white p-3 rounded-lg border border-gray-200 font-medium text-gray-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" /> Filters & Sort
          </button>

          {/* Sidebar Filters */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5 text-brand-600" />
                <h2 className="font-bold text-gray-900">Filters</h2>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Price Range (per night)</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>${priceRange[0]}</span>
                  <span>-</span>
                  <span>${priceRange[1]}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="2000" 
                  step="50"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Star Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((star) => (
                    <label key={star} className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === star}
                        onChange={() => setMinRating(star)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-600 flex items-center">
                        {star} Stars & Up
                      </span>
                    </label>
                  ))}
                  <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="rating" 
                        checked={minRating === 0}
                        onChange={() => setMinRating(0)}
                        className="w-4 h-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                      />
                      <span className="text-sm text-gray-600 flex items-center">
                        Any
                      </span>
                    </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-bold text-gray-900">{filteredHotels.length}</span> properties
                {location && <span> in <span className="font-bold text-gray-900">{location}</span></span>}
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                 <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                 <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
                 <div className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            ) : filteredHotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHotels.map(hotel => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No hotels found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;