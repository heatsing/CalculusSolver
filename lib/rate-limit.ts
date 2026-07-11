type Bucket = { timestamps: number[]; lastSeen: number };

const buckets = new Map<string, Bucket>();
const DEFAULT_LIMIT = 20;
const DEFAULT_WINDOW_MS = 60 * 1000;

export function getClientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return request.headers.get("x-nf-client-connection-ip") ?? forwarded ?? "anonymous";
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
