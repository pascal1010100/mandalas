/**
 * Bookings Domain - Type Definitions
 * 
 * Extracted from monolithic store.ts
 * Contains all types, interfaces, and DTOs for the bookings domain
 */

// --- Domain Types ---

export type BookingStatus =
    | 'pending'
    | 'confirmed'
    | 'checked_in'
    | 'checked_out'
    | 'maintenance'
    | 'cancelled'
    | 'no_show';

export type RefundStatus = 'none' | 'partial' | 'full';

export type PaymentStatus = 'pending' | 'verifying' | 'paid' | 'refunded';

export type PaymentMethod = 'card' | 'cash' | 'transfer' | 'other';

export type GuestIdType = 'passport' | 'dni' | 'license' | 'other';

export type Location = 'pueblo' | 'hideout';

// --- Domain Model ---

/**
 * Booking entity - Domain model
 * This is the internal representation used throughout the application
 */
export interface Booking {
    id: string;
    guestName: string;
    email: string;
    phone?: string;
    location: Location;
    roomType: string;
    unitId?: string; // Specific bed/room assignment (e.g., "1", "2")
    guests: string;
    checkIn: string;
    checkOut: string;
    status: BookingStatus;
    totalPrice: number;
    createdAt: string; // Changed from Date to string for consistency with DB

    // Cancellation Metadata
    cancellationReason?: string;
    refundStatus?: RefundStatus;
    refundAmount?: number;
    cancelledAt?: string;

    // Check-Out Metadata
    actualCheckOut?: string;
    paymentStatus?: PaymentStatus;

    // Guest Identity
    guestIdType?: GuestIdType;
    guestIdNumber?: string;

    // Payment Details
    paymentMethod?: PaymentMethod;
    paymentReference?: string | null;
}

// --- Database Schema (Snake Case) ---

/**
 * BookingRow - Database representation
 * Maps to the 'bookings' table in Supabase
 */
export interface BookingRow {
    id: string;
    guest_name: string;
    email: string;
    phone?: string;
    location: Location;
    room_type: string;
    guests: string;
    check_in: string;
    check_out: string;
    status: BookingStatus;
    total_price: number;
    created_at: string;
    cancellation_reason?: string;
    refund_status?: RefundStatus;
    refund_amount?: number;
    cancelled_at?: string;
    actual_check_out?: string;
    payment_status?: PaymentStatus;
    unit_id?: string;
    guest_id_type?: GuestIdType;
    guest_id_number?: string;
    payment_method?: PaymentMethod;
    payment_reference?: string;
}

// --- Data Transfer Objects (DTOs) ---

/**
 * CreateBookingDTO - Data required to create a new booking
 */
export interface CreateBookingDTO {
    guestName: string;
    email: string;
    phone?: string;
    location: Location;
    roomType: string;
    unitId?: string;
    guests: string;
    checkIn: string;
    checkOut: string;
    totalPrice?: number;
    status?: BookingStatus;
    guestIdType?: GuestIdType;
    guestIdNumber?: string;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
}

/**
 * UpdateBookingDTO - Data that can be updated in an existing booking
 */
export interface UpdateBookingDTO {
    guestName?: string;
    email?: string;
    phone?: string;
    roomType?: string;
    unitId?: string;
    guests?: string;
    checkIn?: string;
    checkOut?: string;
    status?: BookingStatus;
    totalPrice?: number;
    cancellationReason?: string;
    refundStatus?: RefundStatus;
    refundAmount?: number;
    cancelledAt?: string;
    actualCheckOut?: string;
    paymentStatus?: PaymentStatus;
    guestIdType?: GuestIdType;
    guestIdNumber?: string;
    paymentMethod?: PaymentMethod;
    paymentReference?: string;
}

/**
 * RefundData - Information for processing refunds
 */
export interface RefundData {
    status: RefundStatus;
    amount?: number;
}

// --- Query Parameters ---

/**
 * AvailabilityParams - Parameters for checking room availability
 */
export interface AvailabilityParams {
    location: Location;
    roomId: string;
    startDate: string;
    endDate: string;
    requestedGuests?: number;
    excludeBookingId?: string;
    checkUnitId?: string;
}

/**
 * CapacityParams - Parameters for calculating remaining capacity
 */
export interface CapacityParams {
    location: Location;
    roomId: string;
    startDate: string;
    endDate: string;
}

// --- Utility Types ---

/**
 * BookingFilters - Common filters for querying bookings
 */
export interface BookingFilters {
    status?: BookingStatus | BookingStatus[];
    location?: Location;
    roomType?: string;
    dateFrom?: string;
    dateTo?: string;
    guestEmail?: string;
}

/**
 * BookingSummary - Lightweight booking data for lists
 */
export interface BookingSummary {
    id: string;
    guestName: string;
    roomType: string;
    checkIn: string;
    checkOut: string;
    status: BookingStatus;
    totalPrice: number;
}

/**
 * Service operation result with optional message
 */
export interface ServiceResult<T = void> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
