/**
 * Booking Service
 * 
 * Contains all business logic for booking operations
 * Extracted from monolithic store.ts
 */

import type {
    Booking,
    CreateBookingDTO,
    UpdateBookingDTO,
    BookingStatus,
    RefundData,
    ServiceResult,
} from '../types/types';
import { TransactionCategory, PaymentMethod } from '../../finance/types/types';
import { differenceInDays } from 'date-fns';
import type { IBookingRepository } from '../repositories/booking.repository';
import { AvailabilityService } from './availability.service';
import { validateCreateBookingDTO, validateUpdateBookingDTO } from '../utils/validators';
import { handleError, ValidationError, ConflictError } from '../utils/error-handler';

export class BookingService {
    constructor(
        private repo: IBookingRepository,
        private availabilityService: AvailabilityService,
        private addCashTransaction?: (tx: {
            amount: number;
            type: 'income' | 'expense';
            category: TransactionCategory;
            description: string;
            bookingId?: string;
            paymentMethod?: PaymentMethod;
        }) => Promise<void>
    ) { }

    /**
     * Fetch all bookings
     */
    async fetchAll(): Promise<Booking[]> {
        try {
            console.log('📡 Obteniendo todas las reservas...');
            const bookings = await this.repo.findAll();
            console.log(`✅ Se obtuvieron ${bookings.length} reservas`);
            return bookings;
        } catch (error) {
            console.error('❌ Error al obtener las reservas:', error);
            throw new Error('No se pudieron cargar las reservas');
        }
    }

    /**
     * Create a new booking with availability validation
     */
    async createBooking(dto: CreateBookingDTO): Promise<ServiceResult<Booking>> {
        try {
            // 0. Validate input data
            const validation = validateCreateBookingDTO(dto);
            if (!validation.isValid) {
                throw new ValidationError(validation.errors.join(', '));
            }

            // 1. Validate availability
            const isAvailable = await this.availabilityService.checkAvailability({
                location: dto.location,
                roomId: dto.roomType,
                startDate: dto.checkIn,
                endDate: dto.checkOut,
                requestedGuests: Number(dto.guests),
                checkUnitId: dto.unitId,
            });

            if (!isAvailable) {
                throw new ConflictError('Fechas no disponibles (Overbooking)');
            }

            // 2. Set defaults
            const status = dto.status || 'pending';
            const totalPrice = dto.totalPrice || 0;

            // 3. Create booking
            const booking = await this.repo.create({
                ...dto,
                status,
                totalPrice,
            });

            // 4. Auto-log cash transaction if paid in cash
            if (
                (status === 'confirmed' || status === 'checked_in') &&
                dto.paymentMethod === 'cash' &&
                this.addCashTransaction
            ) {
                await this.addCashTransaction({
                    amount: totalPrice,
                    type: 'income',
                    category: 'reservation' as TransactionCategory,
                    description: `Reserva ${dto.guestName} - ${dto.roomType}`,
                    bookingId: booking.id,
                    paymentMethod: dto.paymentMethod as PaymentMethod
                });
            }

            return {
                success: true,
                data: booking,
                message: 'Reserva creada exitosamente'
            };
        } catch (error) {
            const bookingError = handleError(error);
            return {
                success: false,
                error: bookingError.message
            };
        }
    }

    /**
     * Create multiple bookings atomically (for group bookings)
     */
    async createGroupBooking(dtos: CreateBookingDTO[]): Promise<ServiceResult<Booking[]>> {
        try {
            // 1. Validate availability for ALL bookings
            for (const dto of dtos) {
                const isAvailable = await this.availabilityService.checkAvailability({
                    location: dto.location,
                    roomId: dto.roomType,
                    startDate: dto.checkIn,
                    endDate: dto.checkOut,
                    requestedGuests: Number(dto.guests),
                    checkUnitId: dto.unitId,
                });

                if (!isAvailable) {
                    const identifier = dto.unitId ? `Cama ${dto.unitId}` : dto.roomType;
                    return {
                        success: false,
                        error: `❌ Conflicto de disponibilidad: ${identifier}`
                    };
                }
            }

            // 2. Create all bookings atomically
            const bookings = await this.repo.createBatch(
                dtos.map(dto => ({
                    ...dto,
                    status: dto.status || 'pending',
                    totalPrice: dto.totalPrice || 0,
                }))
            );

            return {
                success: true,
                data: bookings,
                message: `${bookings.length} reservas creadas exitosamente`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al crear reservas'
            };
        }
    }

    /**
     * Update booking status
     */
    async updateBookingStatus(id: string, status: BookingStatus): Promise<ServiceResult> {
        try {
            await this.repo.update(id, { status });
            return {
                success: true,
                message: `Estado actualizado a: ${status}`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al actualizar estado'
            };
        }
    }

    /**
     * Register payment for a booking
     */
    async registerPayment(
        bookingId: string,
        amount: number,
        method: 'cash' | 'card' | 'transfer' | 'other',
        reference?: string
    ): Promise<ServiceResult> {
        try {
            const booking = await this.repo.findById(bookingId);

            if (!booking) {
                return {
                    success: false,
                    error: 'Reserva no encontrada'
                };
            }

            // 1. Log cash transaction if payment method is cash
            if (method === 'cash' && this.addCashTransaction) {
                await this.addCashTransaction({
                    amount,
                    type: 'income',
                    category: 'reservation' as TransactionCategory,
                    description: `Pago Reserva: ${booking.guestName} (${booking.roomType})`,
                    bookingId: booking.id,
                    paymentMethod: 'cash' as PaymentMethod,
                });
            }

            // 2. Update booking
            await this.repo.update(bookingId, {
                paymentStatus: 'paid',
                status: 'confirmed', // Auto-confirm on payment
                paymentMethod: method,
                paymentReference: reference,
            });

            // 3. Send confirmation email (background)
            if (booking.email) {
                fetch('/api/emails/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'confirmation',
                        to: booking.email,
                        bookingId: booking.id,
                    }),
                }).catch(err => console.error('Email send failed:', err));
            }

            return {
                success: true,
                message: 'Pago registrado correctamente'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al registrar pago'
            };
        }
    }

    /**
     * Update booking details
     */
    async updateBooking(id: string, data: UpdateBookingDTO): Promise<ServiceResult> {
        try {
            // Validate input data
            const validation = validateUpdateBookingDTO(data);
            if (!validation.isValid) {
                return {
                    success: false,
                    error: `Datos inválidos: ${validation.errors.join(', ')}`
                };
            }

            await this.repo.update(id, data);
            return {
                success: true,
                message: 'Reserva actualizada'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al actualizar reserva'
            };
        }
    }

    /**
     * Confirm all bookings for a specific email (group confirmation)
     */
    async confirmGroupBookings(email: string): Promise<ServiceResult> {
        try {
            const bookings = await this.repo.findByEmail(email);
            const pendingBookings = bookings.filter(b => b.status === 'pending');

            if (pendingBookings.length === 0) {
                return {
                    success: true,
                    message: 'No hay reservas pendientes para confirmar'
                };
            }

            // Update all pending bookings to confirmed
            await Promise.all(
                pendingBookings.map(booking =>
                    this.repo.update(booking.id, { status: 'confirmed' })
                )
            );

            return {
                success: true,
                message: `${pendingBookings.length} reservas confirmadas`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al confirmar reservas'
            };
        }
    }

    /**
     * Check out a booking
     */
    async checkOutBooking(
        id: string,
        paymentStatus: 'pending' | 'paid' | 'verifying',
        manualUnitId?: string
    ): Promise<ServiceResult> {
        try {
            const booking = await this.repo.findById(id);

            if (!booking) {
                return {
                    success: false,
                    error: 'Reserva no encontrada'
                };
            }

            const now = new Date().toISOString();

            await this.repo.update(id, {
                status: 'checked_out',
                actualCheckOut: now,
                paymentStatus,
                ...(manualUnitId && { unitId: manualUnitId }),
            });

            return {
                success: true,
                message: `Check-out completado: ${booking.guestName}`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al hacer check-out'
            };
        }
    }

    /**
     * Cancel a booking with optional refund
     */
    async cancelBooking(
        id: string,
        reason: string,
        refundData?: RefundData
    ): Promise<ServiceResult> {
        try {
            const now = new Date().toISOString();

            await this.repo.update(id, {
                status: 'cancelled',
                cancellationReason: reason,
                cancelledAt: now,
                refundStatus: refundData?.status || 'none',
                refundAmount: refundData?.amount,
            });

            return {
                success: true,
                message: 'Reserva cancelada'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al cancelar reserva'
            };
        }
    }

    /**
     * Extend booking checkout date
     */
    async extendBooking(bookingId: string, newCheckOutDate: string): Promise<ServiceResult> {
        try {
            const booking = await this.repo.findById(bookingId);

            if (!booking) {
                return {
                    success: false,
                    error: 'Reserva no encontrada'
                };
            }

            // Validate new date is after current checkout
            const currentCheckOut = new Date(booking.checkOut);
            const newCheckOut = new Date(newCheckOutDate);

            if (newCheckOut <= currentCheckOut) {
                return {
                    success: false,
                    error: 'La nueva fecha debe ser posterior al check-out actual'
                };
            }

            // Calculate extra days and cost
            const extraDays = differenceInDays(newCheckOut, currentCheckOut);
            const dailyRate = booking.totalPrice / differenceInDays(currentCheckOut, new Date(booking.checkIn));
            const extraCost = dailyRate * extraDays;
            const newTotalPrice = booking.totalPrice + extraCost;

            // Check availability for extension period
            const isAvailable = await this.availabilityService.checkAvailability({
                location: booking.location,
                roomId: booking.roomType,
                startDate: booking.checkOut,
                endDate: newCheckOutDate,
                requestedGuests: Number(booking.guests),
                excludeBookingId: bookingId,
                checkUnitId: booking.unitId,
            });

            if (!isAvailable) {
                return {
                    success: false,
                    error: 'No disponible para las fechas solicitadas'
                };
            }

            // Update booking
            await this.repo.update(bookingId, {
                checkOut: newCheckOutDate,
                totalPrice: newTotalPrice,
                paymentStatus: 'pending', // Reset to pending since they owe more
            });

            return {
                success: true,
                message: `Estadía extendida (+${extraDays} noches)`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al extender reserva'
            };
        }
    }

    /**
     * Delete a booking
     */
    async deleteBooking(id: string): Promise<ServiceResult> {
        try {
            await this.repo.delete(id);
            return {
                success: true,
                message: 'Reserva eliminada'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al eliminar reserva'
            };
        }
    }

    /**
     * Block a unit for maintenance
     */
    async blockUnit(
        roomId: string,
        location: 'pueblo' | 'hideout',
        unitId?: string,
        startDate?: string,
        endDate?: string
    ): Promise<ServiceResult> {
        try {
            const checkIn = startDate || new Date().toISOString().split('T')[0];
            const checkOut =
                endDate ||
                new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

            await this.repo.create({
                guestName: 'MANTENIMIENTO',
                email: 'mantenimiento@mandalas.com',
                location,
                roomType: roomId,
                unitId: unitId ? String(unitId) : undefined,
                guests: '1',
                checkIn,
                checkOut,
                status: 'maintenance',
                totalPrice: 0,
            });

            const identifier = unitId ? `Cama ${unitId}` : 'Habitación';
            return {
                success: true,
                message: `${identifier} bloqueada para mantenimiento`
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al bloquear unidad'
            };
        }
    }

    /**
     * Unblock a unit (cancel maintenance booking)
     */
    async unblockUnit(bookingId: string): Promise<ServiceResult> {
        try {
            await this.repo.update(bookingId, { status: 'cancelled' });
            return {
                success: true,
                message: 'Unidad desbloqueada'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Error desconocido al desbloquear unidad'
            };
        }
    }
}
