-- Migration: Add Cancellation & Refund Tracking
-- Adds columns to track why a booking was cancelled and its financial resolution

DO $$ 
BEGIN 
    -- 1. Cancellation Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cancellation_reason') THEN
        ALTER TABLE bookings ADD COLUMN cancellation_reason text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'cancelled_at') THEN
        ALTER TABLE bookings ADD COLUMN cancelled_at timestamp with time zone;
    END IF;

    -- 2. Refund Fields
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'refund_status') THEN
        ALTER TABLE bookings ADD COLUMN refund_status text DEFAULT 'none' CHECK (refund_status IN ('none', 'partial', 'full'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'refund_amount') THEN
        ALTER TABLE bookings ADD COLUMN refund_amount numeric DEFAULT 0;
    END IF;

END $$;
