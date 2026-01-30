/**
 * Bookings Repository
 * 
 * Handles all data access operations for bookings
 * Responsible for:
 * - CRUD operations on the bookings table
 * - Mapping between database schema (snake_case) and domain model (camelCase)
 * - Specialized queries (findByEmail, findOverlapping, etc.)
 */

import { SupabaseClient } from '@supabase/supabase-js';
import type {
    Booking,
    BookingRow,
    CreateBookingDTO,
    UpdateBookingDTO,
    BookingFilters
} from '../types/types';

export interface IBookingRepository {
    findAll(): Promise<Booking[]>;
    findById(id: string): Promise<Booking | null>;
    findByEmail(email: string): Promise<Booking[]>;
    create(dto: CreateBookingDTO): Promise<Booking>;
    createBatch(dtos: CreateBookingDTO[]): Promise<Booking[]>;
    update(id: string, dto: UpdateBookingDTO): Promise<Booking>;
    delete(id: string): Promise<void>;
    findOverlapping(
        roomId: string,
        startDate: string,
        endDate: string,
        excludeBookingId?: string
    ): Promise<Booking[]>;
}

export class BookingRepository implements IBookingRepository {
    constructor(private supabase: SupabaseClient) { 
        console.log('🔵 BookingRepository inicializado');
    }

    /**
     * Obtiene una reserva por su ID
     * @param id ID de la reserva a buscar
     * @returns Promise<Booking | null> La reserva encontrada o null si no existe
     */
    async findById(id: string): Promise<Booking | null> {
        console.log(`🔍 Buscando reserva con ID: ${id}`);
        
        if (!id) {
            console.error('❌ Se requiere un ID de reserva válido');
            throw new Error('ID de reserva no proporcionado');
        }

        try {
            // 1. Buscar la reserva en la base de datos
            const { data, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq('id', id)
                .single();

            // 2. Manejar errores de la consulta
            if (error) {
                // Si no se encuentra la reserva, devolver null
                if (error.code === 'PGRST116') {
                    console.log(`ℹ️ No se encontró la reserva con ID: ${id}`);
                    return null;
                }
                
                // Para otros errores, lanzar excepción
                console.error('❌ Error al buscar la reserva:', {
                    id,
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    timestamp: new Date().toISOString()
                });
                
                throw new Error(`Error al buscar la reserva: ${error.message}`);
            }

            // 3. Si no hay datos, devolver null
            if (!data) {
                console.log(`ℹ️ No se encontró la reserva con ID: ${id}`);
                return null;
            }

            // 4. Mapear los datos al dominio
            const mapped = this.mapToDomain(data as BookingRow);
            if (!mapped) {
                throw new Error('Error al mapear los datos de la reserva');
            }

            console.log(`✅ Reserva encontrada: ${mapped.id}`);
            return mapped;

        } catch (error) {
            // Definir el tipo extendido para el error
            type ExtendedError = Error & {
                code?: string;
                details?: any;
                hint?: string;
            };

            // Hacer type assertion seguro
            const errorObj = error as ExtendedError;
            
            // Crear contexto de error
            const errorContext = {
                id,
                name: errorObj.name || 'ErrorDesconocido',
                message: errorObj.message || 'Error sin mensaje',
                code: errorObj.code || 'CODIGO_DESCONOCIDO',
                details: errorObj.details,
                hint: errorObj.hint,
                stack: errorObj.stack,
                timestamp: new Date().toISOString(),
                operation: 'find_booking_by_id'
            };

            console.error('🔥 Error en BookingRepository.findById:', errorContext);
            
            // Lanzar un error mejorado
            const errorMessage = errorObj.message || 'Error desconocido al buscar la reserva';
            const errorCode = errorObj.code || 'ERROR_DESCONOCIDO';
            const enhancedError = new Error(`[${errorCode}] ${errorMessage}`);
            
            // Preservar el stack trace si está disponible
            if (errorObj.stack) {
                enhancedError.stack = errorObj.stack;
            }
            
            // Añadir propiedades adicionales al error
            (enhancedError as any).code = errorCode;
            if (errorObj.details) {
                (enhancedError as any).details = errorObj.details;
            }
            
            throw enhancedError;
        }
    }

    /**
     * Obtiene todas las reservas de la base de datos
     * @returns Promise<Booking[]> Lista de reservas
     */
    async findAll(): Promise<Booking[]> {
        console.log('🔍 Buscando todas las reservas...');
        
        try {
            const { data, error } = await this.supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error al obtener las reservas:', {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint
                });
                throw new Error(`Error al obtener las reservas: ${error.message}`);
            }

            if (!data || data.length === 0) {
                console.log('ℹ️ No se encontraron reservas');
                return [];
            }

            // Mapear cada fila al dominio
            const bookings: Booking[] = [];
            for (const row of data) {
                try {
                    const mapped = this.mapToDomain(row);
                    if (mapped) {
                        bookings.push(mapped);
                    }
                } catch (error) {
                    // Manejo seguro del error de tipo 'unknown'
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    const stack = error instanceof Error ? error.stack : undefined;
                    
                    console.error('⚠️ Error al mapear una reserva:', {
                        rowId: row?.id || 'desconocido',
                        error: {
                            message: errorMessage,
                            stack: stack
                        },
                        timestamp: new Date().toISOString()
                    });
                    // Continuar con las demás reservas en lugar de fallar completamente
                }
            }

            console.log(`✅ Se encontraron ${bookings.length} reservas`);
            return bookings;

        } catch (error) {
            // Definir el tipo extendido para el error
            type ExtendedError = Error & {
                code?: string;
                details?: any;
                hint?: string;
            };

            // Hacer type assertion seguro
            const errorObj = error as ExtendedError;
            
            // Crear contexto de error seguro
            const errorContext = {
                name: errorObj.name || 'ErrorDesconocido',
                message: errorObj.message || 'Error sin mensaje',
                code: errorObj.code || 'CODIGO_DESCONOCIDO',
                details: errorObj.details,
                hint: errorObj.hint,
                stack: errorObj.stack,
                timestamp: new Date().toISOString(),
                operation: 'findAll_bookings'
            };

            console.error('🔥 Error en BookingRepository.findAll:', errorContext);
            
            // Lanzar un error mejorado con más información
            const errorMessage = errorObj.message || 'Error desconocido al obtener las reservas';
            const errorCode = errorObj.code || 'ERROR_DESCONOCIDO';
            const enhancedError = new Error(`[${errorCode}] ${errorMessage}`);
            
            // Preservar el stack trace si está disponible
            if (errorObj.stack) {
                enhancedError.stack = errorObj.stack;
            }
            
            // Añadir propiedades adicionales al error
            (enhancedError as any).code = errorCode;
            if (errorObj.details) {
                (enhancedError as any).details = errorObj.details;
            }
            
            throw enhancedError;
        }
    }

    /**
     * Actualiza una reserva existente con manejo mejorado de errores
     */
    async update(id: string, dto: UpdateBookingDTO): Promise<Booking> {
        console.log('🔄 Iniciando actualización de reserva...');
        console.log('📌 ID de reserva:', id);
        console.log('📦 Datos recibidos:', JSON.stringify(dto, null, 2));

        try {
            // 1. Validar entrada
            if (!id) {
                const error = new Error('❌ Se requiere un ID de reserva válido');
                console.error('Error de validación:', error.message);
                throw error;
            }

            // 2. Verificar que la reserva existe
            console.log('🔍 Verificando existencia de la reserva...');
            const { data: existing, error: fetchError } = await this.supabase
                .from('bookings')
                .select('id')
                .eq('id', id)
                .single();

            if (fetchError) {
                console.error('❌ Error al verificar la reserva:', {
                    code: fetchError.code,
                    message: fetchError.message,
                    details: fetchError.details,
                    hint: fetchError.hint
                });
                throw new Error(`Error al verificar la reserva: ${fetchError.message}`);
            }

            if (!existing) {
                const error = new Error(`No se encontró la reserva con ID: ${id}`);
                console.error('Error de validación:', error.message);
                throw error;
            }

            // 3. Mapear datos
            console.log('🔄 Mapeando datos...');
            const row = this.mapToDatabase(dto);
            console.log('📊 Datos a actualizar:', JSON.stringify(row, null, 2));

            // 4. Ejecutar actualización
            console.log('⚡ Ejecutando actualización...');
            const { data, error } = await this.supabase
                .from('bookings')
                .update(row)
                .eq('id', id)
                .select()
                .single();

            // 5. Manejar errores
            if (error) {
                const errorContext = {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    // No incluimos rowData en el log por seguridad
                    operation: 'update_booking',
                    timestamp: new Date().toISOString()
                };
                
                console.error('❌ Error de Supabase al actualizar reserva:', errorContext);
                
                // Manejar específicamente el error de permisos
                if (error.code === 'P0001' && error.message.includes('cannot change the booking price')) {
                    throw new Error('No tienes permisos para modificar el precio de la reserva. Por favor, contacta con el administrador.');
                }
                
                // Lanzar un error con un mensaje más amigable
                throw new Error(`Error al actualizar la reserva: ${error.message || 'Error desconocido'}`);
            }

            if (!data) {
                const error = new Error('No se recibieron datos al actualizar la reserva');
                console.error('Error de datos:', error.message);
                throw error;
            }

            console.log('✅ Reserva actualizada exitosamente');
            const mappedData = this.mapToDomain(data as BookingRow);
            if (!mappedData) {
                throw new Error('Error al mapear los datos de la reserva actualizada');
            }
            return mappedData;

        } catch (error) {
            // Definir el tipo extendido para el error
            type ExtendedError = Error & {
                code?: string;
                details?: any;
                hint?: string;
            };

            // Hacer type assertion seguro
            const errorObj = error as ExtendedError;
            
            // Crear contexto de error seguro
            const errorContext = {
                name: errorObj.name || 'ErrorDesconocido',
                message: errorObj.message || 'Error sin mensaje',
                code: errorObj.code || 'CODIGO_DESCONOCIDO',
                details: errorObj.details,
                hint: errorObj.hint,
                stack: errorObj.stack,
                timestamp: new Date().toISOString()
            };

            console.error('🔥 Error en BookingRepository.update:', errorContext);
            
            // Crear un error mejorado con más información
            const errorMessage = errorObj.message || 'Error desconocido al actualizar la reserva';
            const errorCode = errorObj.code || 'ERROR_DESCONOCIDO';
            const enhancedError = new Error(`[${errorCode}] ${errorMessage}`);
            
            // Preservar el stack trace si está disponible
            if (errorObj.stack) {
                enhancedError.stack = errorObj.stack;
            }
            
            // Añadir propiedades adicionales al error
            (enhancedError as any).code = errorCode;
            if (errorObj.details) {
                (enhancedError as any).details = errorObj.details;
            }
            
            throw enhancedError;
        }
    }

    /**
     * Mapea un objeto del modelo de dominio o DTO (camelCase) a una fila de la base de datos (snake_case)
     */
    private mapToDatabase(data: CreateBookingDTO | UpdateBookingDTO): Partial<BookingRow> {
        const row: Partial<BookingRow> = {};

        // Mapeo de campos básicos
        if ('guestName' in data && data.guestName !== undefined) row.guest_name = data.guestName;
        if ('email' in data && data.email !== undefined) row.email = data.email;
        if ('phone' in data) row.phone = data.phone;
        if ('location' in data) row.location = data.location;
        if ('roomType' in data) row.room_type = data.roomType;
        if ('guests' in data) row.guests = data.guests;
        if ('checkIn' in data) row.check_in = data.checkIn;
        if ('checkOut' in data) row.check_out = data.checkOut;
        if ('status' in data) row.status = data.status;
        if ('totalPrice' in data) row.total_price = data.totalPrice;
        if ('unitId' in data) row.unit_id = data.unitId;
        if ('guestIdType' in data) row.guest_id_type = data.guestIdType;
        if ('guestIdNumber' in data) row.guest_id_number = data.guestIdNumber;
        if ('paymentMethod' in data) row.payment_method = data.paymentMethod;
        if ('paymentReference' in data) row.payment_reference = data.paymentReference;
        if ('cancellationReason' in data) row.cancellation_reason = data.cancellationReason;
        if ('refundStatus' in data) row.refund_status = data.refundStatus;
        if ('refundAmount' in data) row.refund_amount = data.refundAmount;
        if ('cancelledAt' in data) row.cancelled_at = data.cancelledAt;
        if ('actualCheckOut' in data) row.actual_check_out = data.actualCheckOut;
        if ('paymentStatus' in data) row.payment_status = data.paymentStatus;

        console.log('🔄 Datos mapeados a formato de BD:', row);
        return row;
    }

    /**
     * Mapea una fila de la base de datos (snake_case) al modelo de dominio (camelCase)
     */
    private mapToDomain(row: BookingRow | null): Booking | null {
        if (!row) {
            console.error('❌ Error: Se intentó mapear una fila nula o indefinida');
            return null;
        }
        
        const isMaintenance = row.guest_name === 'MANTENIMIENTO' || row.status === 'maintenance';

        // Mapeo de propiedades con manejo de valores nulos/undefined
        return {
            // Propiedades requeridas
            id: row.id,
            guestName: row.guest_name,
            email: row.email,
            phone: row.phone ?? undefined, // Usar undefined en lugar de null para propiedades opcionales
            location: row.location,
            roomType: row.room_type,
            guests: row.guests,
            checkIn: row.check_in,
            checkOut: row.check_out,
            status: isMaintenance ? 'maintenance' : row.status,
            totalPrice: row.total_price,
            createdAt: row.created_at, // Keep as string for consistency
            
            // Propiedades opcionales con valores por defecto
            cancellationReason: row.cancellation_reason ?? undefined,
            refundStatus: row.refund_status ?? undefined,
            refundAmount: row.refund_amount ?? undefined,
            cancelledAt: row.cancelled_at ?? undefined,
            actualCheckOut: row.actual_check_out ?? undefined,
            paymentStatus: row.payment_status ?? 'pending',
            unitId: row.unit_id,
            guestIdType: row.guest_id_type ?? undefined,
            guestIdNumber: row.guest_id_number ?? undefined,
            paymentMethod: row.payment_method ?? undefined,
            paymentReference: row.payment_reference ?? undefined
        };
    }

    /**
     * Crea una nueva reserva
     */
    async create(dto: CreateBookingDTO): Promise<Booking> {
        console.log('🆕 Creando nueva reserva...');
        
        try {
            // 1. Validar datos de entrada
            if (!dto.guestName || !dto.email || !dto.checkIn || !dto.checkOut) {
                throw new Error('Faltan campos requeridos para crear la reserva');
            }

            // 2. Mapear a formato de base de datos
            const row = this.mapToDatabase(dto);
            
            // 3. Insertar en la base de datos
            const { data, error } = await this.supabase
                .from('bookings')
                .insert(row)
                .select()
                .single();

            if (error) {
                console.error('❌ Error al crear reserva:', error);
                throw new Error(`Error al crear reserva: ${error.message}`);
            }

            if (!data) {
                throw new Error('No se recibieron datos al crear la reserva');
            }

            // 4. Mapear a dominio
            const mapped = this.mapToDomain(data as BookingRow);
            if (!mapped) {
                throw new Error('Error al mapear la reserva creada');
            }

            console.log(`✅ Reserva creada: ${mapped.id}`);
            return mapped;

        } catch (error) {
            console.error('🔥 Error en BookingRepository.create:', error);
            throw error;
        }
    }

    /**
     * Crea múltiples reservas en batch
     */
    async createBatch(dtos: CreateBookingDTO[]): Promise<Booking[]> {
        console.log(`🆕 Creando batch de ${dtos.length} reservas...`);
        
        try {
            if (dtos.length === 0) {
                return [];
            }

            // 1. Mapear todas las filas
            const rows = dtos.map(dto => this.mapToDatabase(dto));

            // 2. Insertar en batch
            const { data, error } = await this.supabase
                .from('bookings')
                .insert(rows)
                .select();

            if (error) {
                console.error('❌ Error al crear batch:', error);
                throw new Error(`Error al crear reservas: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No se recibieron datos al crear las reservas');
            }

            // 3. Mapear a dominio
            const bookings: Booking[] = [];
            for (const row of data) {
                const mapped = this.mapToDomain(row as BookingRow);
                if (mapped) {
                    bookings.push(mapped);
                }
            }

            console.log(`✅ Batch creado: ${bookings.length} reservas`);
            return bookings;

        } catch (error) {
            console.error('🔥 Error en BookingRepository.createBatch:', error);
            throw error;
        }
    }

    /**
     * Busca reservas por email
     */
    async findByEmail(email: string): Promise<Booking[]> {
        console.log(`🔍 Buscando reservas para email: ${email}`);
        
        try {
            if (!email) {
                throw new Error('Email es requerido');
            }

            const { data, error } = await this.supabase
                .from('bookings')
                .select('*')
                .eq('email', email)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error al buscar por email:', error);
                throw new Error(`Error al buscar reservas: ${error.message}`);
            }

            if (!data || data.length === 0) {
                console.log(`ℹ️ No se encontraron reservas para: ${email}`);
                return [];
            }

            // Mapear a dominio
            const bookings: Booking[] = [];
            for (const row of data) {
                const mapped = this.mapToDomain(row as BookingRow);
                if (mapped) {
                    bookings.push(mapped);
                }
            }

            console.log(`✅ Se encontraron ${bookings.length} reservas para: ${email}`);
            return bookings;

        } catch (error) {
            console.error('🔥 Error en BookingRepository.findByEmail:', error);
            throw error;
        }
    }

    /**
     * Elimina una reserva
     */
    async delete(id: string): Promise<void> {
        console.log(`🗑️ Eliminando reserva: ${id}`);
        
        try {
            if (!id) {
                throw new Error('ID de reserva es requerido');
            }

            const { error } = await this.supabase
                .from('bookings')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('❌ Error al eliminar reserva:', error);
                throw new Error(`Error al eliminar reserva: ${error.message}`);
            }

            console.log(`✅ Reserva eliminada: ${id}`);

        } catch (error) {
            console.error('🔥 Error en BookingRepository.delete:', error);
            throw error;
        }
    }

    /**
     * Busca reservas que se solapan con un rango de fechas
     */
    async findOverlapping(
        roomId: string,
        startDate: string,
        endDate: string,
        excludeBookingId?: string
    ): Promise<Booking[]> {
        console.log(`🔍 Buscando solapamientos para ${roomId} del ${startDate} al ${endDate}`);
        
        try {
            if (!roomId || !startDate || !endDate) {
                throw new Error('roomId, startDate y endDate son requeridos');
            }

            let query = this.supabase
                .from('bookings')
                .select('*')
                .eq('room_type', roomId)
                .or(`check_in.lte.${endDate},check_out.gte.${startDate}`)
                .in('status', ['pending', 'confirmed', 'checked_in']);

            // Excluir booking específico si se proporciona
            if (excludeBookingId) {
                query = query.neq('id', excludeBookingId);
            }

            const { data, error } = await query;

            if (error) {
                console.error('❌ Error al buscar solapamientos:', error);
                throw new Error(`Error al buscar solapamientos: ${error.message}`);
            }

            if (!data || data.length === 0) {
                console.log(`ℹ️ No se encontraron solapamientos para ${roomId}`);
                return [];
            }

            // Mapear a dominio
            const bookings: Booking[] = [];
            for (const row of data) {
                const mapped = this.mapToDomain(row as BookingRow);
                if (mapped) {
                    bookings.push(mapped);
                }
            }

            console.log(`✅ Se encontraron ${bookings.length} solapamientos para ${roomId}`);
            return bookings;

        } catch (error) {
            console.error('🔥 Error en BookingRepository.findOverlapping:', error);
            throw error;
        }
    }
}