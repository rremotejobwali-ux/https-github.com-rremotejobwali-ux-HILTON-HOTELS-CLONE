import { Booking } from '../types';

const STORAGE_KEY = 'luxestay_bookings';

export const saveBooking = (booking: Booking): void => {
  const existing = getBookings();
  const updated = [booking, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getBookings = (): Booking[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const cancelBooking = (bookingId: string): void => {
  const existing = getBookings();
  const updated = existing.map(b => 
    b.id === bookingId ? { ...b, status: 'cancelled' as const } : b
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};