export type CloudbedsRoomMapping = {
    localRoomId: string
    localUnitId?: string
}

export const HIDEOUT_CLOUDBEDS_ROOM_TYPES: Record<string, string> = {
    "671948": "hideout_private_1",
    "671950": "hideout_private_2",
    "671951": "hideout_dorm_mixed",
    "671952": "hideout_dorm_female",
    "671953": "hideout_private_3",
    "671954": "hideout_private_4",
}

export const HIDEOUT_CLOUDBEDS_ROOMS: Record<string, CloudbedsRoomMapping> = {
    "671948-0": { localRoomId: "hideout_private_1" },
    "671950-0": { localRoomId: "hideout_private_2" },
    "671951-0": { localRoomId: "hideout_dorm_mixed", localUnitId: "1" },
    "671951-1": { localRoomId: "hideout_dorm_mixed", localUnitId: "2" },
    "671951-2": { localRoomId: "hideout_dorm_mixed", localUnitId: "3" },
    "671951-3": { localRoomId: "hideout_dorm_mixed", localUnitId: "4" },
    "671951-4": { localRoomId: "hideout_dorm_mixed", localUnitId: "5" },
    "671952-0": { localRoomId: "hideout_dorm_female", localUnitId: "1" },
    "671952-1": { localRoomId: "hideout_dorm_female", localUnitId: "2" },
    "671952-2": { localRoomId: "hideout_dorm_female", localUnitId: "3" },
    "671952-3": { localRoomId: "hideout_dorm_female", localUnitId: "4" },
    "671952-4": { localRoomId: "hideout_dorm_female", localUnitId: "5" },
    "671953-0": { localRoomId: "hideout_private_3" },
    "671954-0": { localRoomId: "hideout_private_4" },
}

export function mapHideoutCloudbedsRoom(roomId: string, roomTypeId?: string): CloudbedsRoomMapping | undefined {
    const exactRoom = HIDEOUT_CLOUDBEDS_ROOMS[roomId]
    if (exactRoom) return exactRoom

    if (!roomTypeId) return undefined
    const localRoomId = HIDEOUT_CLOUDBEDS_ROOM_TYPES[roomTypeId]
    return localRoomId ? { localRoomId } : undefined
}
