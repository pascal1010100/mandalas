import { describe, expect, it } from 'vitest';
import {
    isValidDateFormat,
    isValidDateRange,
    isValidEmail,
    isValidGuests,
    isValidLocation,
    isValidPaymentMethod,
    isValidPrice,
    isValidStatus,
} from './validators';

describe('booking validators', () => {
    it('validates email format', () => {
        expect(isValidEmail('guest@example.com')).toBe(true);
        expect(isValidEmail('guest@example')).toBe(false);
    });

    it('validates dates and date ranges', () => {
        expect(isValidDateFormat('2026-06-02')).toBe(true);
        expect(isValidDateFormat('2026-99-99')).toBe(false);
        expect(isValidDateRange('2026-06-02', '2026-06-03')).toBe(true);
        expect(isValidDateRange('2026-06-03', '2026-06-02')).toBe(false);
    });

    it('validates domain enums and numeric fields', () => {
        expect(isValidLocation('pueblo')).toBe(true);
        expect(isValidLocation('lake')).toBe(false);
        expect(isValidStatus('confirmed')).toBe(true);
        expect(isValidStatus('archived')).toBe(false);
        expect(isValidPaymentMethod('cash')).toBe(true);
        expect(isValidPaymentMethod('crypto')).toBe(false);
        expect(isValidGuests('2')).toBe(true);
        expect(isValidGuests('0')).toBe(false);
        expect(isValidPrice(0)).toBe(true);
        expect(isValidPrice(-1)).toBe(false);
    });
});
