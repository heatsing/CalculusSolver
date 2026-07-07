const requestTimestamps: number[] = [];
const MAX_REQUESTS = 20;
const WINDOW_MS = 60 * 1000;

export function isRateLimited(): boolean {
  const now = Date.now();
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - WINDOW_MS) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS) {
    return true;
  }
  requestTimestamps.push(now);
  return false;
}
