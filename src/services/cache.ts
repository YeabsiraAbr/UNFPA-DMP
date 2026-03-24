type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

const store = new Map<string, CacheEntry<unknown>>();
const DEFAULT_TTL = 60_000; // 1 minute

export function getCached<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > DEFAULT_TTL) {
    store.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCache<T>(key: string, data: T): void {
  store.set(key, { data, timestamp: Date.now() });
}

export function clearCache(prefix?: string): void {
  if (!prefix) {
    store.clear();
    return;
  }
  for (const key of store.keys()) {
    if (key.startsWith(prefix)) store.delete(key);
  }
}

/**
 * Wraps an async fetcher with caching.
 * Calls are deduped: if a request for the same key is already in flight, it reuses it.
 */
const inflight = new Map<string, Promise<unknown>>();

export async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = getCached<T>(key);
  if (hit) return hit;

  const existing = inflight.get(key);
  if (existing) return existing as Promise<T>;

  const promise = fetcher().then(data => {
    setCache(key, data);
    inflight.delete(key);
    return data;
  }).catch(err => {
    inflight.delete(key);
    throw err;
  });

  inflight.set(key, promise);
  return promise;
}
