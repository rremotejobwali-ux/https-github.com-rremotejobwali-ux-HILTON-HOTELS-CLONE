import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Wifi, Coffee, Award } from 'lucide-react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <Link to={`/hotel/${hotel.id}`} className="group block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={hotel.image} 
          alt={hotel.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-brand-900 shadow-sm">
          {hotel.availableRooms} rooms left
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-serif text-xl font-bold text-brand-900 group-hover:text-brand-600 transition-colors">
              {hotel.name}
            </h3>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {hotel.location}
            </div>
          </div>
          <div className="flex items-center bg-brand-50 px-2 py-1 rounded">
            <Star className="h-4 w-4 text-brand-gold fill-brand-gold mr-1" />
            <span className="font-bold text-brand-900">{hotel.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({hotel.reviews})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {hotel.description}
        </p>

        <div className="flex gap-2 mb-4 text-gray-400">
          {hotel.amenities.slice(0, 3).map((amenity, idx) => (
             <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-full">{amenity}</span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">+{hotel.amenities.length - 3}</span>
          )}
        </div>

        <div className="flex justify-between items-end border-t border-gray-100 pt-4">
          <div>
            <span className="text-gray-400 text-xs uppercase tracking-wider">Price per night</span>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-brand-900">${hotel.pricePerNight}</span>
            </div>
          </div>
          <span className="text-brand-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
            View Details &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;