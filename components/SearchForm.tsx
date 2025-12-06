import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin } from 'lucide-react';

interface SearchFormProps {
  initialLocation?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  className?: string;
  variant?: 'horizontal' | 'compact';
}

const SearchForm: React.FC<SearchFormProps> = ({
  initialLocation = '',
  initialCheckIn = '',
  initialCheckOut = '',
  initialGuests = 2,
  className = '',
  variant = 'horizontal'
}) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState(initialLocation);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (checkIn) params.append('checkIn', checkIn);
    if (checkOut) params.append('checkOut', checkOut);
    if (guests) params.append('guests', guests.toString());
    
    navigate(`/search?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${className}`}>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
          <div className="relative">
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />
          </div>
        </div>
        <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors">
          Search
        </button>
      </form>
    );
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row gap-4 items-center ${className}`}
    >
      <div className="flex-1 w-full relative">
        <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wide">Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-600" />
          <input
            type="text"
            placeholder="Where are you going?"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wide">Check In</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-600" />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-9 pr-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
        <div className="relative flex-1">
          <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wide">Check Out</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-600" />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full pl-9 pr-2 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-32">
        <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wide">Guests</label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-600" />
          <input
            type="number"
            min="1"
            max="10"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full md:w-auto h-full mt-auto md:mt-5 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-md font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Search className="h-5 w-5" />
        Search
      </button>
    </form>
  );
};

export default SearchForm;