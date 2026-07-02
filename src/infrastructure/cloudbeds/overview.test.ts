import { describe, expect, it } from "vitest"
import { HIDEOUT_CLOUDBEDS_ROOMS } from "./room-mapping"

describe("Cloudbeds overview inventory assumptions", () => {
    it("uses the 14 physical Hideout units returned by Cloudbeds", () => {
        expect(Object.keys(HIDEOUT_CLOUDBEDS_ROOMS)).toHaveLength(14)
    })
})
