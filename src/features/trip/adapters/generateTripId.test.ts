import { describe, expect, it } from "vitest";
import { generateTripId } from "./generateTripId";

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("generateTripId", () => {
  it("uses randomUUID when the browser offers it", () => {
    const id = generateTripId({ randomUUID: () => "11111111-1111-4111-8111-111111111111" } as Crypto);

    expect(id).toBe("11111111-1111-4111-8111-111111111111");
  });

  it("builds a v4 UUID from random bytes on plain-HTTP pages without randomUUID", () => {
    const withoutRandomUUID = {
      getRandomValues: <T extends ArrayBufferView>(array: T) => crypto.getRandomValues(array),
    } as Crypto;

    const ids = new Set(Array.from({ length: 50 }, () => generateTripId(withoutRandomUUID)));

    expect(ids.size).toBe(50);
    for (const id of ids) expect(id).toMatch(UUID_V4_PATTERN);
  });
});
