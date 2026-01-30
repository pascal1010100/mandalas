/**
 * Availability Service
 * 
 * Handles complex availability logic for rooms and beds
 * Extracted from store.ts checkAvailability and getRemainingCapacity methods
 */

import type { RoomConfig } from '@/lib/store'; // TODO: Move RoomConfig to shared types
import type { Booking } from '../types/types';
import type { AvailabilityParams, CapacityParams } from '../types/types';
import { BookingRepository } from '../repositories/booking.repository';

export class AvailabilityService {
    constructor(
        private bookingRepo: BookingRepository,
        private getRoomConfig: (roomId: string) => RoomConfig | undefined
    ) { }

    /**
     * Check if a room/bed is available for the given date range
     */
    async checkAvailability(params: AvailabilityParams): Promise<boolean> {
        const {
            location,
            roomId,
            startDate,
            endDate,
            requestedGuests = 1,
            excludeBookingId,
            checkUnitId,
        } = params;

        // Get room configuration
        const roomConfig = this.getRoomConfig(roomId);
        const isDorm = roomId.includes('dorm');
        const capacity = roomConfig?.capacity || (isDorm ? 6 : 1);

        // Find overlapping bookings
        const overlappingBookings = await this.bookingRepo.findOverlapping(
            roomId,
            startDate,
            endDate,
            excludeBookingId
        );

        // Filter by location (double-check)
        const relevantBookings = overlappingBookings.filter(
            booking => booking.location === location
        );

        if (isDorm) {
            return this.checkDormAvailability(
                relevantBookings,
                capacity,
                requestedGuests,
                checkUnitId
            );
        } else {
            return this.checkPrivateRoomAvailability(
                relevantBookings,
                roomConfig,
                capacity,
                requestedGuests
            );
        }
    }

    /**
     * Get remaining capacity for a room in a given date range
     */
    async getRemainingCapacity(params: CapacityParams): Promise<number> {
        const { location, roomId, startDate, endDate } = params;

        // Get room configuration
        const roomConfig = this.getRoomConfig(roomId);
        const isDorm = roomId.includes('dorm');
        const capacity = roomConfig?.capacity || (isDorm ? 6 : 1);

        // Find overlapping bookings
        const overlappingBookings = await this.bookingRepo.findOverlapping(
            roomId,
            startDate,
            endDate
        );

        // Filter by location
        const relevantBookings = overlappingBookings.filter(
            booking => booking.location === location
        );

        if (isDorm) {
            const currentOccupancy = relevantBookings.reduce((sum, booking) => {
                return sum + (parseInt(booking.guests) || 1);
            }, 0);
            return Math.max(0, capacity - currentOccupancy);
        } else {
            return Math.max(0, capacity - relevantBookings.length);
        }
    }

    /**
     * Check availability for dorm rooms (bed-based)
     */
    private checkDormAvailability(
        overlappingBookings: Booking[],
        capacity: number,
        requestedGuests: number,
        checkUnitId?: string
    ): boolean {
        // 1. Specific Unit Collision Check
        if (checkUnitId) {
            const isUnitTaken = overlappingBookings.some(b => b.unitId === checkUnitId);
            if (isUnitTaken) {
                console.warn(
                    `[AvailabilityService] Unit ${checkUnitId} is ALREADY BOOKED.`
                );
                return false;
            }
        }

        // 2. Global Capacity Check
        const currentOccupancy = overlappingBookings.reduce((sum, booking) => {
            const guests = parseInt(booking.guests) || 1;
            return sum + guests;
        }, 0);

        const blocked = currentOccupancy + requestedGuests > capacity;
        return !blocked;
    }

    /**
     * Check availability for private rooms and suites
     */
    private checkPrivateRoomAvailability(
        overlappingBookings: Booking[],
        roomConfig: RoomConfig | undefined,
        capacity: number,
        requestedGuests: number
    ): boolean {
        // 1. Max Occupancy Check (Physical limit)
        if (roomConfig && requestedGuests > roomConfig.maxGuests) {
            console.warn(
                `[AvailabilityService] Requested guests (${requestedGuests}) exceeds room max (${roomConfig.maxGuests})`
            );
            return false;
        }

        // 2. Inventory Check (Capacity = Number of Rooms)
        // If we have 1 unit, and 1 overlap, it's full.
        const blocked = overlappingBookings.length >= capacity;
        return !blocked;
    }
}
