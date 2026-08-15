const DEFAULT_MAX_BODY_BYTES = 16 * 1024;

export type JsonRequestFailure = {
  ok: false;
  code: "FORBIDDEN_ORIGIN" | "UNSUPPORTED_MEDIA_TYPE" | "REQUEST_TOO_LARGE" | "INVALID_REQUEST";
  message: string;
  status: 400 | 403 | 413 | 415;
};

export type JsonRequestResult =
  | { ok: true; data: unknown }
  | JsonRequestFailure;

function allowedOrigins(request: Request): Set<string> {
  const origins = new Set<string>();

  try {
    origins.add(new URL(request.url).origin);
  } catch {
    // An invalid request URL is handled by the framework before this point.
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",", 1)[0]?.trim();
  const requestHost = forwardedHost ?? request.headers.get("host")?.trim();
  if (requestHost) {
    const forwardedProtocol = request.headers.get("x-forwarded-proto")?.split(",", 1)[0]?.trim();
    const protocol = forwardedProtocol ?? (requestHost.startsWith("localhost") || requestHost.startsWith("127.0.0.1") ? "http" : "https");
    try {
      origins.add(new URL(`${protocol}://${requestHost}`).origin);
    } catch {
      // Ignore malformed proxy metadata.
    }
  }

  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl) {
    try {
      const configuredOrigin = new URL(configuredUrl).origin;
      origins.add(configuredOrigin);
      const configuredHost = new URL(configuredOrigin).hostname;
      if (configuredHost.startsWith("www.")) {
        origins.add(configuredOrigin.replace("//www.", "//"));
      } else {
        origins.add(configuredOrigin.replace("//", "//www."));
      }
    } catch {
      // Ignore a malformed optional environment value and retain request origin.
    }
  }

  return origins;
}

function validateOrigin(request: Request): JsonRequestFailure | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;

  if (!allowedOrigins(request).has(origin)) {
    return {
      ok: false,
      code: "FORBIDDEN_ORIGIN",
      message: "Cross-site API requests are not allowed.",
      status: 403
    };
  }

  return null;
}

function validateContentType(request: Request): JsonRequestFailure | null {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  if (contentType !== "application/json" && !contentType?.endsWith("+json")) {
    return {
      ok: false,
      code: "UNSUPPORTED_MEDIA_TYPE",
      message: "Content-Type must be application/json.",
      status: 415
    };
  }
  return null;
}

async function readBodyWithLimit(request: Request, maxBytes: number): Promise<Uint8Array | JsonRequestFailure> {
  const declaredLength = request.headers.get("content-length");
  if (declaredLength) {
    const parsedLength = Number(declaredLength);
    if (!Number.isFinite(parsedLength) || parsedLength < 0 || parsedLength > maxBytes) {
      return {
        ok: false,
        code: "REQUEST_TOO_LARGE",
        message: "Request body is too large.",
        status: 413
      };
    }
  }

  if (!request.body) return new Uint8Array();

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > maxBytes) {
      await reader.cancel("Request body exceeded the configured limit").catch(() => undefined);
      return {
        ok: false,
        code: "REQUEST_TOO_LARGE",
        message: "Request body is too large.",
        status: 413
      };
    }
    chunks.push(value);
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function readJsonRequest(
  request: Request,
  maxBytes = DEFAULT_MAX_BODY_BYTES
): Promise<JsonRequestResult> {
  const originFailure = validateOrigin(request);
  if (originFailure) return originFailure;

  const contentTypeFailure = validateContentType(request);
  if (contentTypeFailure) return contentTypeFailure;

  const body = await readBodyWithLimit(request, maxBytes);
  if (!(body instanceof Uint8Array)) return body;

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(body);
    return { ok: true, data: JSON.parse(text) as unknown };
  } catch {
    return {
      ok: false,
      code: "INVALID_REQUEST",
      message: "Invalid JSON body.",
      status: 400
    };
  }
}
