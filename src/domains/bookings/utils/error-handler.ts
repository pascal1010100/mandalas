/**
 * Centralized error handling for booking operations
 */

export class BookingError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 500,
        public details?: unknown
    ) {
        super(message);
        this.name = 'BookingError';
    }
}

export class ValidationError extends BookingError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends BookingError {
    constructor(resource: string, id?: string) {
        const message = id ? `${resource} con ID ${id} no encontrado` : `${resource} no encontrado`;
        super(message, 'NOT_FOUND', 404);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends BookingError {
    constructor(message: string, details?: unknown) {
        super(message, 'CONFLICT', 409, details);
        this.name = 'ConflictError';
    }
}

export class DatabaseError extends BookingError {
    constructor(message: string, details?: unknown) {
        super(message, 'DATABASE_ERROR', 500, details);
        this.name = 'DatabaseError';
    }
}

/**
 * Error handler utility function
 */
export function handleError(error: unknown): BookingError {
    if (error instanceof BookingError) {
        return error;
    }

    if (error instanceof Error) {
        // Handle common Supabase errors
        if (error.message.includes('PGRST116')) {
            return new NotFoundError('Reserva');
        }
        
        if (error.message.includes('duplicate key')) {
            return new ConflictError('Registro duplicado', error.message);
        }
        
        if (error.message.includes('foreign key')) {
            return new ValidationError('Referencia inválida', error.message);
        }

        // Handle validation errors
        if (error.message.includes('invalid') || error.message.includes('required')) {
            return new ValidationError(error.message);
        }

        // Default error
        return new BookingError(error.message, 'UNKNOWN_ERROR', 500, {
            stack: error.stack,
            originalError: error.name
        });
    }

    // Handle unknown errors
    return new BookingError(
        'Error desconocido',
        'UNKNOWN_ERROR',
        500,
        { originalError: String(error) }
    );
}

/**
 * Type guard to check if an error is a specific type
 */
export function isBookingError(error: unknown): error is BookingError {
    return error instanceof BookingError;
}

/**
 * Extract error message for user display
 */
export function getUserFriendlyMessage(error: BookingError): string {
    switch (error.code) {
        case 'VALIDATION_ERROR':
            return error.message;
        case 'NOT_FOUND':
            return 'El recurso solicitado no existe';
        case 'CONFLICT':
            return 'Hay un conflicto con la operación solicitada';
        case 'DATABASE_ERROR':
            return 'Error en la base de datos. Por favor, intente más tarde';
        default:
            return 'Ha ocurrido un error inesperado';
    }
}
