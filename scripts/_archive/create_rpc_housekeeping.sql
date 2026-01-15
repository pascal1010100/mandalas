-- RPC Function to Mark Room Dirty (Improved Merge Logic)
CREATE OR REPLACE FUNCTION mark_room_dirty(
    p_room_id TEXT, 
    p_unit_id TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_room RECORD;
    v_new_map JSONB;
    v_new_global_status TEXT;
    v_capacity INT;
    v_current_status TEXT;
BEGIN
    -- 1. Get current room state
    SELECT * INTO v_room FROM rooms WHERE id = p_room_id;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Room not found');
    END IF;

    -- 2. Init Map if null
    v_new_map := COALESCE(v_room.units_housekeeping, '{}'::jsonb);
    v_capacity := v_room.capacity;
    
    -- 3. Update Logic
    IF p_unit_id IS NOT NULL THEN
        -- Ensure Hydration: If map missing keys, fill with current global or 'clean'
        FOR i IN 1..v_capacity LOOP
            IF NOT (v_new_map ? i::text) THEN
                v_new_map := jsonb_set(
                    v_new_map, 
                    array[i::text], 
                    to_jsonb(COALESCE(v_room.housekeeping_status, 'clean'))
                );
            END IF;
        END LOOP;

        -- Mark specific unit dirty
        v_new_map := jsonb_set(v_new_map, array[p_unit_id], '"dirty"');
        
        -- Recalculate Global Status
        -- If any unit is dirty, global is dirty (to alert housekeeping). 
        -- If all clean, global clean.
        v_new_global_status := 'clean'; -- assume clean
        FOR i IN 1..v_capacity LOOP
             v_current_status := (v_new_map ->> i::text);
             IF v_current_status = 'dirty' OR v_current_status = 'maintenance' THEN
                v_new_global_status := 'dirty';
             END IF;
        END LOOP;
        
    ELSE
        -- Mark ALL dirty (Global)
        v_new_global_status := 'dirty';
        FOR i IN 1..v_capacity LOOP
            v_new_map := jsonb_set(v_new_map, array[i::text], '"dirty"');
        END LOOP;
    END IF;

    -- 4. Perform Update
    UPDATE rooms 
    SET 
        housekeeping_status = v_new_global_status, 
        units_housekeeping = v_new_map
    WHERE id = p_room_id;

    RETURN jsonb_build_object('success', true, 'new_status', v_new_global_status, 'map', v_new_map);
END;
$$;
