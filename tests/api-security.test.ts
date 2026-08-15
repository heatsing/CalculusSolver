import { describe, expect, it } from "vitest";
import { readJsonRequest } from "@/lib/api-security";

describe("API request security", () => {
  it("accepts a same-origin JSON request", async () => {
    const request = new Request("https://calculussolver.net/api/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://calculussolver.net"
      },
      body: JSON.stringify({ input: "x^2" })
    });

    await expect(readJsonRequest(request)).resolves.toEqual({
      ok: true,
      data: { input: "x^2" }
    });
  });

  it("uses the forwarded request host when the framework normalizes the URL", async () => {
    const request = new Request("http://localhost:3210/api/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Host: "127.0.0.1:3210",
        Origin: "http://127.0.0.1:3210"
      },
      body: "{}"
    });

    await expect(readJsonRequest(request)).resolves.toMatchObject({ ok: true });
  });

  it("rejects cross-site browser requests", async () => {
    const request = new Request("https://calculussolver.net/api/solve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://attacker.example"
      },
      body: "{}"
    });

    const result = await readJsonRequest(request);
    expect(result).toMatchObject({ ok: false, code: "FORBIDDEN_ORIGIN", status: 403 });
  });

  it("rejects simple text/plain cross-site payloads", async () => {
    const request = new Request("https://calculussolver.net/api/solve", {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: "{}"
    });

    const result = await readJsonRequest(request);
    expect(result).toMatchObject({ ok: false, code: "UNSUPPORTED_MEDIA_TYPE", status: 415 });
  });

  it("stops reading streamed bodies after the configured limit", async () => {
    const request = new Request("https://calculussolver.net/api/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: "x".repeat(1024) })
    });

    const result = await readJsonRequest(request, 128);
    expect(result).toMatchObject({ ok: false, code: "REQUEST_TOO_LARGE", status: 413 });
  });
});
