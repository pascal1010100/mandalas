import { describe, expect, it } from "vitest"
import {
    HIDEOUT_CLOUDBEDS_ROOMS,
    HIDEOUT_CLOUDBEDS_ROOM_TYPES,
    mapHideoutCloudbedsRoom,
} from "./room-mapping"

describe("Hideout Cloudbeds room mapping", () => {
    it("maps all 14 Cloudbeds physical rooms", () => {
        expect(Object.keys(HIDEOUT_CLOUDBEDS_ROOMS)).toHaveLength(14)
    })

    it("maps all six room types to local Hideout rooms", () => {
        expect(new Set(Object.values(HIDEOUT_CLOUDBEDS_ROOM_TYPES))).toEqual(new Set([
            "hideout_private_1",
            "hideout_private_2",
            "hideout_private_3",
            "hideout_private_4",
            "hideout_dorm_mixed",
            "hideout_dorm_female",
        ]))
    })

    it("maps dorm beds to stable local unit IDs", () => {
        expect(mapHideoutCloudbedsRoom("671951-0")).toEqual({
            localRoomId: "hideout_dorm_mixed",
            localUnitId: "1",
        })
        expect(mapHideoutCloudbedsRoom("671952-4")).toEqual({
            localRoomId: "hideout_dorm_female",
            localUnitId: "5",
        })
    })

    it("falls back to the room type when a physical room is unassigned", () => {
        expect(mapHideoutCloudbedsRoom("unassigned", "671953")).toEqual({
            localRoomId: "hideout_private_3",
        })
    })
})
