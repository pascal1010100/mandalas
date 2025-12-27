
import { createClient } from "@supabase/supabase-js";

// Hardcoded for debugging
const supabaseUrl = "https://zfbrcdwkunbvjnxmwlor.supabase.co";
const supabaseKey = "sb_publishable_UQ8GSwZicCSQsMn37ZktrA_C9qdqG3I";

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("Creating NEW test bookings...");

    const testEmail = "antigravity_test@example.com";

    // Create Booking 1
    const b1 = {
        check_in: '2025-07-01',
        check_out: '2025-07-05',
        email: testEmail,
        guest_name: 'Antigravity Test Guest',
        location: 'pueblo',
        room_type: 'Test Room A',
        status: 'confirmed',
        payment_status: 'paid',
        total_price: 100,
        currency: 'GTQ',
        guests: 1
    };

    const { data: d1, error: e1 } = await supabase.from('bookings').insert(b1).select().single();
    if (e1) {
        console.error("Error creating booking 1:", e1);
    } else {
        console.log(`Created Booking 1: ${d1.id}`);
    }

    // Create Booking 2
    const b2 = {
        check_in: '2025-08-01', // Different dates
        check_out: '2025-08-05',
        email: testEmail,
        guest_name: 'Antigravity Test Guest',
        location: 'hideout', // Different location
        room_type: 'Test Room B',
        status: 'confirmed',
        payment_status: 'pending',
        total_price: 150,
        currency: 'GTQ',
        guests: 2
    };

    const { data: d2, error: e2 } = await supabase.from('bookings').insert(b2).select().single();
    if (e2) {
        console.error("Error creating booking 2:", e2);
    } else {
        console.log(`Created Booking 2: ${d2.id}`);
    }

    if (!e1 && !e2) {
        console.log(`\nSUCCESS: Created 2 bookings for "${testEmail}".`);
        console.log("Please search for this email in the guest portal.");
    }
}

main();
