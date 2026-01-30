/**
 * Bookings Domain - Public API
 * 
 * Barrel export for clean imports
 * Components should only import from this file
 */

// Main Hook (Primary API)
export { useBookings } from './hooks/useBookings';

// Types (for TypeScript)
export type {
    Booking,
    BookingStatus,
    BookingRow,
    CreateBookingDTO,
    UpdateBookingDTO,
    RefundData,
    RefundStatus,
    PaymentStatus,
    PaymentMethod,
    GuestIdType,
    Location,
    AvailabilityParams,
    CapacityParams,
    BookingFilters,
    BookingSummary,
} from './types/types';

// Services (for advanced use cases)
export { BookingService } from './services/booking.service';
export { AvailabilityService } from './services/availability.service';

// Repository (rarely needed, but available)
export { BookingRepository } from './repositories/booking.repository';

// Store (for direct access if needed)
export { useBookingsStore } from './store/bookings.store';
