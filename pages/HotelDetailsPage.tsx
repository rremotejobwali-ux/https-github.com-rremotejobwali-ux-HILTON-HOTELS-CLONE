import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Wifi, Check, Calendar, Users, Coffee, Waves, Dumbbell, Utensils } from 'lucide-react';
import { getHotelById } from '../services/gemini';
import { saveBooking } from '../services/storage';
import { Hotel } from '../types';

const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      if (id) {
        setLoading(true);
        const data = await getHotelById(id);
        setHotel(data || null);
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotel || !checkIn || !checkOut) return;

    setIsBooking(true);
    
    // Calculate nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) {
      alert("Please select valid dates");
      setIsBooking(false);
      return;
    }

    const totalPrice = nights * hotel.pricePerNight;

    setTimeout(() => {
      saveBooking({
        id: `bk-${Date.now()}`,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        checkIn,
        checkOut,
        guests,
        totalPrice,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      });
      navigate('/bookings');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <h2 className="text-2xl font-serif text-brand-900 mb-4">Hotel not found</h2>
        <button onClick={() => navigate('/search')} className="text-brand-600 hover:underline">Back to Search</button>
      </div>
    );
  }

  // Calculate total price for display
  const calculateTotal = () => {
      if (!checkIn || !checkOut) return 0;
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights * hotel.pricePerNight : 0;
  }
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Image */}
      <div className="h-[50vh] relative">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">{hotel.name}</h1>
          <div className="flex items-center text-white/90 gap-4">
            <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {hotel.location}</span>
            <span className="flex items-center"><Star className="h-4 w-4 text-brand-gold fill-brand-gold mr-1" /> {hotel.rating} ({hotel.reviews} reviews)</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Overview</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {hotel.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-700">
                    <div className="bg-brand-50 p-2 rounded-full text-brand-600">
                       <Check className="h-4 w-4" />
                    </div>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Mockup */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
               <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Guest Reviews</h2>
               <div className="space-y-6">
                 <div className="border-b border-gray-100 pb-6">
                   <div className="flex items-center gap-2 mb-2">
                     <div className="h-10 w-10 rounded-full bg-gray-200" />
                     <div>
                       <div className="font-semibold text-gray-900">John D.</div>
                       <div className="text-xs text-gray-500">Stayed Sep 2024</div>
                     </div>
                   </div>
                   <p className="text-gray-600 italic">"Absolutely stunning property. The views were breathtaking and the staff went above and beyond."</p>
                 </div>
                 <div>
                   <div className="flex items-center gap-2 mb-2">
                     <div className="h-10 w-10 rounded-full bg-gray-200" />
                     <div>
                       <div className="font-semibold text-gray-900">Sarah M.</div>
                       <div className="text-xs text-gray-500">Stayed Aug 2024</div>
                     </div>
                   </div>
                   <p className="text-gray-600 italic">"Great location and amenities. The pool area is fantastic."</p>
                 </div>
               </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-2xl font-bold text-brand-900">${hotel.pricePerNight}</span>
                  <span className="text-gray-500 text-sm"> / night</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="h-4 w-4 text-brand-gold fill-brand-gold mr-1" />
                  {hotel.rating}
                </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">CHECK-IN</label>
                    <input 
                      type="date" 
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">CHECK-OUT</label>
                    <input 
                      type="date" 
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">GUESTS</label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500"
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                {total > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between mb-2 text-gray-600">
                      <span>${hotel.pricePerNight} x {total/hotel.pricePerNight} nights</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-gray-600">
                      <span>Service fee</span>
                      <span>$50</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-brand-900 border-t border-gray-100 pt-4">
                      <span>Total</span>
                      <span>${total + 50}</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isBooking}
                  className="w-full bg-brand-600 text-white py-3 rounded-lg font-bold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBooking ? 'Processing...' : 'Reserve'}
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">You won't be charged yet</p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HotelDetailsPage;