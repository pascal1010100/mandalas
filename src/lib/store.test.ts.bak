import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore, Booking, RoomConfig, BookingStatus } from './store'

// Mock Data
const mockRooms: RoomConfig[] = [
    { id: 'pueblo_dorm', location: 'pueblo', type: 'dorm', label: 'Dorm Pueblo', capacity: 8, maxGuests: 8, basePrice: 20 },
    { id: 'pueblo_private', location: 'pueblo', type: 'private', label: 'Privada Pueblo', capacity: 1, maxGuests: 2, basePrice: 50 },
]

const baseBooking: Booking = {
    id: '1',
    guestName: 'Test',
    email: 'test@test.com',
    location: 'pueblo',
    guests: '1',
    roomType: 'pueblo_dorm',
    checkIn: '2025-01-01',
    checkOut: '2025-01-05',
    status: 'confirmed',
    totalPrice: 100,
    createdAt: new Date()
}

describe('Reservation Logic Store', () => {
    beforeEach(() => {
        useAppStore.setState({ bookings: [], rooms: mockRooms, events: [] })
    })

    describe('checkAvailability', () => {
        it('should return true when no bookings exist', () => {
            const result = useAppStore.getState().checkAvailability('pueblo', 'pueblo_dorm', '2025-01-01', '2025-01-05')
            expect(result).toBe(true)
        })

        it('should return false if requested guests exceed physical room limit (Private)', () => {
            // Private room maxGuests is 2
            const result = useAppStore.getState().checkAvailability('pueblo', 'pueblo_private', '2025-01-01', '2025-01-05', 3)
            expect(result).toBe(false)
        })

        it('should detect overlap in Private Room (Activity Check)', () => {
            // Book the only private room
            useAppStore.setState({
                bookings: [{ ...baseBooking, id: 'b1', roomType: 'pueblo_private', checkIn: '2025-01-10', checkOut: '2025-01-15' }]
            })

            // Try to book overlapping dates
            const overlapping = useAppStore.getState().checkAvailability('pueblo', 'pueblo_private', '2025-01-12', '2025-01-14')
            expect(overlapping).toBe(false) // Should be blocked

            // Try to book non-overlapping dates
            const nonOverlapping = useAppStore.getState().checkAvailability('pueblo', 'pueblo_private', '2025-01-15', '2025-01-20')
            expect(nonOverlapping).toBe(true) // Should be allowed (check-out day is available for check-in)
        })

        it('should manage Dorm capacity correctly', () => {
            // Capacity is 8. Let's create 7 bookings.
            const bookings: Booking[] = Array.from({ length: 7 }, (_, i) => ({
                ...baseBooking,
                id: `b${i}`,
                roomType: 'pueblo_dorm',
                checkIn: '2025-02-01',
                checkOut: '2025-02-05'
            }))
            useAppStore.setState({ bookings })

            // 8th guest should be allowed
            const result8 = useAppStore.getState().checkAvailability('pueblo', 'pueblo_dorm', '2025-02-01', '2025-02-05', 1)
            expect(result8).toBe(true)

            // 9th guest should be blocked (7 + 1 existing < 8? No, 7 exists. 8th request is valid. 7+1=8 <= 8. 
            // Wait, if we add the 8th to store, then 9th fails.)

            // Let's add the 8th
            useAppStore.setState({ bookings: [...bookings, { ...baseBooking, id: 'b8', roomType: 'pueblo_dorm', checkIn: '2025-02-01', checkOut: '2025-02-05' }] })

            // Now 8/8 occupied. 9th should fail.
            const result9 = useAppStore.getState().checkAvailability('pueblo', 'pueblo_dorm', '2025-02-01', '2025-02-05', 1)
            expect(result9).toBe(false)
        })

        it('should respect Maintenance blocks', () => {
            // Maintenance block is just a booking with unitId sometimes, or just reduces capacity
            // Logic currently treats maintenance status as occupied
            useAppStore.setState({
                bookings: [{
                    ...baseBooking,
                    id: 'm1',
                    roomType: 'pueblo_private',
                    status: 'maintenance' as BookingStatus,
                    checkIn: '2025-03-01',
                    checkOut: '2025-03-05'
                }]
            })

            const result = useAppStore.getState().checkAvailability('pueblo', 'pueblo_private', '2025-03-02', '2025-03-04')
            expect(result).toBe(false)
        })
    })

    describe('getRemainingCapacity', () => {
        it('should calculate correct remaining beds in Dorm', () => {
            // Capacity 8. 3 bookings.
            const bookings: Booking[] = Array.from({ length: 3 }, (_, i) => ({
                ...baseBooking,
                id: `b${i}`,
                roomType: 'pueblo_dorm',
                checkIn: '2025-04-01',
                checkOut: '2025-04-05'
            }))
            useAppStore.setState({ bookings })

            const remaining = useAppStore.getState().getRemainingCapacity('pueblo', 'pueblo_dorm', '2025-04-01', '2025-04-05')
            expect(remaining).toBe(5) // 8 - 3 = 5
        })

        it('should return 0 if overbooked (safety check)', () => {
            // Capacity 8. 10 bookings.
            const bookings: Booking[] = Array.from({ length: 10 }, (_, i) => ({
                ...baseBooking,
                id: `b${i}`,
                roomType: 'pueblo_dorm',
                checkIn: '2025-04-01',
                checkOut: '2025-04-05'
            }))
            useAppStore.setState({ bookings })

            const remaining = useAppStore.getState().getRemainingCapacity('pueblo', 'pueblo_dorm', '2025-04-01', '2025-04-05')
            expect(remaining).toBe(0) // Should not be negative
        })
    })
})
