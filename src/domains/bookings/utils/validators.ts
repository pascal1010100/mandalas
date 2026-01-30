/**
 * Validation utilities for booking operations
 */

import type { CreateBookingDTO, UpdateBookingDTO, Location, BookingStatus } from '../types/types';

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates date format (YYYY-MM-DD)
 */
export function isValidDateFormat(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
}

/**
 * Validates that checkOut is after checkIn
 */
export function isValidDateRange(checkIn: string, checkOut: string): boolean {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return end > start;
}

/**
 * Validates that checkIn is not in the past (allowing today)
 */
export function isNotPastDate(date: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    return checkDate >= today;
}

/**
 * Validates location
 */
export function isValidLocation(location: string): location is Location {
    return ['pueblo', 'hideout'].includes(location);
}

/**
 * Validates booking status
 */
export function isValidStatus(status: string): status is BookingStatus {
    return ['pending', 'confirmed', 'checked_in', 'checked_out', 'maintenance', 'cancelled', 'no_show'].includes(status);
}

/**
 * Validates payment method
 */
export function isValidPaymentMethod(method: string): boolean {
    return ['card', 'cash', 'transfer', 'other'].includes(method);
}

/**
 * Validates guests count (positive number)
 */
export function isValidGuests(guests: string | number): boolean {
    const num = typeof guests === 'string' ? parseInt(guests) : guests;
    return !isNaN(num) && num > 0 && num <= 20; // Reasonable max limit
}

/**
 * Validates price (non-negative number)
 */
export function isValidPrice(price: number): boolean {
    return !isNaN(price) && price >= 0;
}

/**
 * Validates required fields for CreateBookingDTO
 */
export function validateCreateBookingDTO(dto: CreateBookingDTO): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!dto.guestName?.trim()) {
        errors.push('El nombre del huésped es requerido');
    }
    
    if (!dto.email?.trim()) {
        errors.push('El email es requerido');
    } else if (!isValidEmail(dto.email)) {
        errors.push('El email no tiene un formato válido');
    }
    
    if (!dto.location) {
        errors.push('La ubicación es requerida');
    } else if (!isValidLocation(dto.location)) {
        errors.push('La ubicación debe ser "pueblo" o "hideout"');
    }
    
    if (!dto.roomType?.trim()) {
        errors.push('El tipo de habitación es requerido');
    }
    
    if (!dto.guests) {
        errors.push('El número de huéspedes es requerido');
    } else if (!isValidGuests(dto.guests)) {
        errors.push('El número de huéspedes debe ser un número positivo');
    }
    
    if (!dto.checkIn) {
        errors.push('La fecha de check-in es requerida');
    } else if (!isValidDateFormat(dto.checkIn)) {
        errors.push('La fecha de check-in debe tener formato YYYY-MM-DD');
    } else if (!isNotPastDate(dto.checkIn)) {
        errors.push('La fecha de check-in no puede ser en el pasado');
    }
    
    if (!dto.checkOut) {
        errors.push('La fecha de check-out es requerida');
    } else if (!isValidDateFormat(dto.checkOut)) {
        errors.push('La fecha de check-out debe tener formato YYYY-MM-DD');
    } else if (dto.checkIn && !isValidDateRange(dto.checkIn, dto.checkOut)) {
        errors.push('La fecha de check-out debe ser posterior a la de check-in');
    }

    // Optional fields validation
    if (dto.totalPrice !== undefined && !isValidPrice(dto.totalPrice)) {
        errors.push('El precio total debe ser un número no negativo');
    }
    
    if (dto.status && !isValidStatus(dto.status)) {
        errors.push('El estado de la reserva no es válido');
    }
    
    if (dto.paymentMethod && !isValidPaymentMethod(dto.paymentMethod)) {
        errors.push('El método de pago no es válido');
    }

    // Phone validation (optional but if provided, should be reasonable)
    if (dto.phone && !/^[\d\s\-\+\(\)]+$/.test(dto.phone)) {
        errors.push('El teléfono solo puede contener dígitos, espacios y caracteres +()-');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates UpdateBookingDTO
 */
export function validateUpdateBookingDTO(dto: UpdateBookingDTO): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Email validation if provided
    if (dto.email !== undefined) {
        if (!dto.email?.trim()) {
            errors.push('El email no puede estar vacío');
        } else if (!isValidEmail(dto.email)) {
            errors.push('El email no tiene un formato válido');
        }
    }

    // Location validation if provided
    // Note: location is not updatable in UpdateBookingDTO by design

    // Guests validation if provided
    if (dto.guests !== undefined && !isValidGuests(dto.guests)) {
        errors.push('El número de huéspedes debe ser un número positivo');
    }

    // Date validation if provided
    if (dto.checkIn !== undefined) {
        if (!dto.checkIn?.trim()) {
            errors.push('La fecha de check-in no puede estar vacía');
        } else if (!isValidDateFormat(dto.checkIn)) {
            errors.push('La fecha de check-in debe tener formato YYYY-MM-DD');
        }
    }

    if (dto.checkOut !== undefined) {
        if (!dto.checkOut?.trim()) {
            errors.push('La fecha de check-out no puede estar vacía');
        } else if (!isValidDateFormat(dto.checkOut)) {
            errors.push('La fecha de check-out debe tener formato YYYY-MM-DD');
        }
    }

    // Date range validation if both dates are provided
    if (dto.checkIn && dto.checkOut && !isValidDateRange(dto.checkIn, dto.checkOut)) {
        errors.push('La fecha de check-out debe ser posterior a la de check-in');
    }

    // Price validation if provided
    if (dto.totalPrice !== undefined && !isValidPrice(dto.totalPrice)) {
        errors.push('El precio total debe ser un número no negativo');
    }

    // Status validation if provided
    if (dto.status !== undefined && !isValidStatus(dto.status)) {
        errors.push('El estado de la reserva no es válido');
    }

    // Payment method validation if provided
    if (dto.paymentMethod !== undefined && !isValidPaymentMethod(dto.paymentMethod)) {
        errors.push('El método de pago no es válido');
    }

    // Phone validation if provided
    if (dto.phone !== undefined && dto.phone && !/^[\d\s\-\+\(\)]+$/.test(dto.phone)) {
        errors.push('El teléfono solo puede contener dígitos, espacios y caracteres +()-');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
