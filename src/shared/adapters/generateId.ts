const UUID_BYTE_COUNT = 16;

/** Formats 16 random bytes as an RFC 4122 version 4 UUID. */
function uuidFromRandomBytes(source: Crypto): string {
  const bytes = source.getRandomValues(new Uint8Array(UUID_BYTE_COUNT));
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // RFC 4122 variant
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * randomUUID exists only in secure contexts (HTTPS or localhost). getRandomValues works everywhere,
 * so opening the app over plain HTTP on a local network still works.
 */
export function generateId(source: Crypto = crypto): string {
  return typeof source.randomUUID === "function" ? source.randomUUID() : uuidFromRandomBytes(source);
}
