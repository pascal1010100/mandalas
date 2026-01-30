
import { start } from 'repl';

// MOCK ENTITIES
type Booking = {
    id: string;
    payment_status: 'pending' | 'verifying' | 'paid';
    status: 'checked_in' | 'checked_out';
}

type Charge = {
    id: string;
    status: 'pending' | 'paid';
}

// LOGIC TO TEST (Extracted from MyBookingPage)
function checkExitGuard(booking: Booking, charges: Charge[]) {
    // GUARD 1: Room Payment
    if (booking.payment_status !== 'paid') {
        return { success: false, reason: "Room not paid" };
    }

    // GUARD 2: Minibar Charges
    const pendingCharges = charges.filter(c => c.status === 'pending');
    if (pendingCharges.length > 0) {
        return { success: false, reason: `Has ${pendingCharges.length} pending charges` };
    }

    return { success: true };
}

function simulateOptimisticUpdate(currentCharges: Charge[], newCharge: Charge) {
    return [newCharge, ...currentCharges];
}

// MOCK SUPABASE CALL
async function checkCheckoutWithDBMock(dbCount: number) {
    // Simulate: const { count } = await supabase.from('charges')...
    const mockDBResponse = { count: dbCount, error: null };

    if (mockDBResponse.error) return { success: false, reason: "DB Error" };

    if (mockDBResponse.count && mockDBResponse.count > 0) {
        return { success: false, reason: `DB Verification Found ${mockDBResponse.count} pending charges` };
    }

    return { success: true };
}

// --- TEST RUNNER ---
(async () => {
    console.log("🚀 STARTING LOGIC SIMULATION...\n");
    console.log("--- SYNC GUARDS (Client Side) ---");

    // SCENARIO 1: Check-out with Unpaid Room
    const bookingUnpaid: Booking = { id: 'b1', payment_status: 'pending', status: 'checked_in' };
    const result1 = checkExitGuard(bookingUnpaid, []);
    console.log(`Test 1 (Unpaid Room): ${!result1.success ? 'PASS ✅' : 'FAIL ❌'} (Reason: ${result1.reason})`);

    // SCENARIO 2: Check-out with Pending Minibar
    const bookingPaid: Booking = { id: 'b2', payment_status: 'paid', status: 'checked_in' };
    const chargesPending: Charge[] = [{ id: 'c1', status: 'pending' }];
    const result2 = checkExitGuard(bookingPaid, chargesPending);
    console.log(`Test 2 (Pending Minibar): ${!result2.success ? 'PASS ✅' : 'FAIL ❌'} (Reason: ${result2.reason})`);

    // SCENARIO 3: Check-out Clean
    const chargesPaid: Charge[] = [{ id: 'c1', status: 'paid' }];
    const result3 = checkExitGuard(bookingPaid, chargesPaid);
    console.log(`Test 3 (Clean Exit): ${result3.success ? 'PASS ✅' : 'FAIL ❌'}`);

    // SCENARIO 4: Minibar Optimistic Update
    const initialCharges: Charge[] = [{ id: 'c1', status: 'paid' }];
    const newCharge: Charge = { id: 'c2', status: 'pending' };
    const updatedState = simulateOptimisticUpdate(initialCharges, newCharge);
    const isFirst = updatedState[0].id === 'c2';
    const hasCount = updatedState.length === 2;
    console.log(`Test 4 (Minibar Update): ${isFirst && hasCount ? 'PASS ✅' : 'FAIL ❌'}`);

    // SCENARIO 5: Async DB Verification (The Fix)
    console.log("\n--- ASYNC GUARD (Server Side Fix) ---");
    const resultDB = await checkCheckoutWithDBMock(3); // Simulate 3 pending charges in DB
    console.log(`Test 5 (DB Says 'Pending Charges'): ${!resultDB.success ? 'PASS ✅' : 'FAIL ❌'} (Reason: ${resultDB.reason})`);

    const resultDBClean = await checkCheckoutWithDBMock(0); // Simulate 0 pending
    console.log(`Test 6 (DB Says 'Clean'): ${resultDBClean.success ? 'PASS ✅' : 'FAIL ❌'}`);

    console.log("\n✨ SIMULATION COMPLETE.");
})();
