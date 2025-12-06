import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, CreditCard, Trash2 } from 'lucide-react';
import { getBookings, cancelBooking } from '../services/storage';
import { Booking } from '../types';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setBookings(getBookings());
  }, [refresh]);

  const handleCancel = (id: string) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      cancelBooking(id);
      setRefresh(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-brand-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="bg-brand-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-brand-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No trips booked... yet!</h3>
            <p className="text-gray-500 mb-6">Time to dust off your bags and start planning your next adventure.</p>
            <a href="#/search" className="inline-block bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors">
              Start Searching
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto relative">
                  <img src={booking.hotelImage} alt={booking.hotelName} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{booking.hotelName}</h3>
                      <span className="text-sm text-gray-500">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-brand-500" />
                        <div>
                          <span className="block text-xs text-gray-400">CHECK-IN</span>
                          {new Date(booking.checkIn).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-brand-500" />
                        <div>
                          <span className="block text-xs text-gray-400">CHECK-OUT</span>
                          {new Date(booking.checkOut).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Users className="h-4 w-4 mr-2 text-brand-500" />
                        <div>
                          <span className="block text-xs text-gray-400">GUESTS</span>
                          {booking.guests} Adults
                        </div>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <CreditCard className="h-4 w-4 mr-2 text-brand-500" />
                        <div>
                          <span className="block text-xs text-gray-400">TOTAL PRICE</span>
                          ${booking.totalPrice}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;