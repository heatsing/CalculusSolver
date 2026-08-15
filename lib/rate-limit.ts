type Bucket = { timestamps: number[]; lastSeen: number };

const buckets = new Map<string, Bucket>();
const DEFAULT_LIMIT = 20;
const DEFAULT_WINDOW_MS = 60 * 1000;

export function getClientKey(request: Request): string {
  const netlifyIp = request.headers.get("x-nf-client-connection-ip")?.trim();
  if (netlifyIp && netlifyIp.length <= 64) return netlifyIp;

  // Forwarded headers are client-controlled unless a trusted proxy overwrites
  // them. Only use the fallback outside production for local development/tests.
  if (process.env.NODE_ENV !== "production") {
    const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (forwarded && forwarded.length <= 64) return forwarded;
  }

  return "anonymous";
}

export function isRateLimited(key = "anonymous", limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS): boolean {
  const now = Date.now();
  if (buckets.size > 1000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.lastSeen < now - windowMs) buckets.delete(bucketKey);
    }
  }

  const bucket = buckets.get(key) ?? { timestamps: [], lastSeen: now };
  bucket.timestamps = bucket.timestamps.filter((timestamp) => timestamp >= now - windowMs);
  bucket.lastSeen = now;
  if (bucket.timestamps.length >= limit) {
    buckets.set(key, bucket);
    return true;
  }
  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return false;
}
