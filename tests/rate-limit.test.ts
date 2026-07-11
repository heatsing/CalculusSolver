import { describe, expect, it } from "vitest";
import { getClientKey, isRateLimited } from "@/lib/rate-limit";

describe("rate limiting", () => {
  it("limits each key independently", () => {
    const first = `first-${Date.now()}`;
    const second = `second-${Date.now()}`;
    expect(isRateLimited(first, 2, 60_000)).toBe(false);
    expect(isRateLimited(first, 2, 60_000)).toBe(false);
    expect(isRateLimited(first, 2, 60_000)).toBe(true);
    expect(isRateLimited(second, 2, 60_000)).toBe(false);
  });

  it("uses Netlify client IP before forwarded IP", () => {
    const request = new Request("https://example.com", {
      headers: {
        "x-nf-client-connection-ip": "203.0.113.4",
        "x-forwarded-for": "198.51.100.2, 198.51.100.3"
      }
    });
    expect(getClientKey(request)).toBe("203.0.113.4");
  });
});
