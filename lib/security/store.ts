import { KEY_PREFIX } from "./config";

export type Counter = {
  count: number;
  resetAt: number;
};

export type StoreKind = "redis" | "memory";

export type AbuseStore = {
  kind: StoreKind;
  /**
   * Increments a fixed-window counter. The expiry is set when the window is
   * created and never extended, so a client that keeps hammering after being
   * limited cannot push its own reset time further away.
   */
  increment(key: string, windowMs: number): Promise<Counter>;
  /** Returns true only for the first caller inside the TTL. */
  claimOnce(key: string, ttlMs: number): Promise<boolean>;
  setFlag(key: string, ttlMs: number): Promise<void>;
  /** Remaining TTL of a flag in ms, or 0 when it is not set. */
  flagTtl(key: string): Promise<number>;
};

const namespaced = (key: string) => `${KEY_PREFIX}:${key}`;

type MemoryEntry = {
  count: number;
  resetAt: number;
};

const MEMORY_MAX_ENTRIES = 20_000;

type MemoryState = { entries: Map<string, MemoryEntry> };

const globalStore = globalThis as typeof globalThis & {
  __contactAbuseMemory?: MemoryState;
};

const memoryState: MemoryState = (globalStore.__contactAbuseMemory ??= {
  entries: new Map(),
});

const prune = (now: number) => {
  for (const [key, entry] of memoryState.entries) {
    if (entry.resetAt <= now) {
      memoryState.entries.delete(key);
    }
  }

  if (memoryState.entries.size <= MEMORY_MAX_ENTRIES) {
    return;
  }

  const sorted = [...memoryState.entries.entries()].sort(
    (a, b) => a[1].resetAt - b[1].resetAt
  );

  for (const [key] of sorted.slice(0, sorted.length - MEMORY_MAX_ENTRIES)) {
    memoryState.entries.delete(key);
  }
};

/**
 * Per-instance fallback. It still blunts a flood from a single attacker, but on
 * serverless the counters are not shared between instances or across cold
 * starts, so a Redis/KV backend should be configured in production.
 */
export const memoryStore: AbuseStore = {
  kind: "memory",
  async increment(key, windowMs) {
    const now = Date.now();
    prune(now);

    const fullKey = namespaced(key);
    const existing = memoryState.entries.get(fullKey);

    if (existing && existing.resetAt > now) {
      existing.count += 1;
      return { count: existing.count, resetAt: existing.resetAt };
    }

    const entry: MemoryEntry = { count: 1, resetAt: now + windowMs };
    memoryState.entries.set(fullKey, entry);

    return { ...entry };
  },
  async claimOnce(key, ttlMs) {
    const now = Date.now();
    const fullKey = namespaced(key);
    const existing = memoryState.entries.get(fullKey);

    if (existing && existing.resetAt > now) {
      return false;
    }

    memoryState.entries.set(fullKey, { count: 1, resetAt: now + ttlMs });

    return true;
  },
  async setFlag(key, ttlMs) {
    memoryState.entries.set(namespaced(key), {
      count: 1,
      resetAt: Date.now() + ttlMs,
    });
  },
  async flagTtl(key) {
    const entry = memoryState.entries.get(namespaced(key));

    if (!entry) {
      return 0;
    }

    return Math.max(0, entry.resetAt - Date.now());
  },
};

const redisUrl =
  process.env.CONTACT_REDIS_REST_URL ??
  process.env.KV_REST_API_URL ??
  process.env.UPSTASH_REDIS_REST_URL;

const redisToken =
  process.env.CONTACT_REDIS_REST_TOKEN ??
  process.env.KV_REST_API_TOKEN ??
  process.env.UPSTASH_REDIS_REST_TOKEN;

type PipelineResult = { result?: unknown; error?: string };

const runPipeline = async (commands: unknown[][]): Promise<unknown[]> => {
  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commands),
    cache: "no-store",
    signal: AbortSignal.timeout(2000),
  });

  if (!response.ok) {
    throw new Error(`Redis REST responded with ${response.status}`);
  }

  const payload = (await response.json()) as PipelineResult[];
  const failure = payload.find((item) => item.error);

  if (failure) {
    throw new Error(failure.error);
  }

  return payload.map((item) => item.result);
};

const redisStore: AbuseStore = {
  kind: "redis",
  async increment(key, windowMs) {
    const fullKey = namespaced(key);
    const [, count, ttl] = await runPipeline([
      ["SET", fullKey, 0, "PX", windowMs, "NX"],
      ["INCR", fullKey],
      ["PTTL", fullKey],
    ]);

    const remaining = typeof ttl === "number" && ttl > 0 ? ttl : windowMs;

    return {
      count: Number(count) || 1,
      resetAt: Date.now() + remaining,
    };
  },
  async claimOnce(key, ttlMs) {
    const [result] = await runPipeline([
      ["SET", namespaced(key), 1, "PX", ttlMs, "NX"],
    ]);

    return result !== null;
  },
  async setFlag(key, ttlMs) {
    await runPipeline([["SET", namespaced(key), 1, "PX", ttlMs]]);
  },
  async flagTtl(key) {
    const [ttl] = await runPipeline([["PTTL", namespaced(key)]]);

    return typeof ttl === "number" && ttl > 0 ? ttl : 0;
  },
};

export const isDurableStoreConfigured = Boolean(redisUrl && redisToken);

let redisFailureLoggedAt = 0;

const noteRedisFailure = (operation: string, error: unknown) => {
  const now = Date.now();

  if (now - redisFailureLoggedAt < 60_000) {
    return;
  }

  redisFailureLoggedAt = now;
  console.error(
    JSON.stringify({
      scope: "contact-security",
      event: "store_fallback",
      operation,
      message: error instanceof Error ? error.message : String(error),
    })
  );
};

/**
 * Redis-backed when credentials exist, otherwise in-memory. Redis errors fall
 * back to the memory store instead of failing the request, so an outage in the
 * limiter backend degrades protection rather than taking the form down.
 */
export const abuseStore: AbuseStore = {
  get kind() {
    return isDurableStoreConfigured ? redisStore.kind : memoryStore.kind;
  },
  async increment(key, windowMs) {
    if (!isDurableStoreConfigured) {
      return memoryStore.increment(key, windowMs);
    }

    try {
      return await redisStore.increment(key, windowMs);
    } catch (error) {
      noteRedisFailure("increment", error);
      return memoryStore.increment(key, windowMs);
    }
  },
  async claimOnce(key, ttlMs) {
    if (!isDurableStoreConfigured) {
      return memoryStore.claimOnce(key, ttlMs);
    }

    try {
      return await redisStore.claimOnce(key, ttlMs);
    } catch (error) {
      noteRedisFailure("claimOnce", error);
      return memoryStore.claimOnce(key, ttlMs);
    }
  },
  async setFlag(key, ttlMs) {
    if (!isDurableStoreConfigured) {
      return memoryStore.setFlag(key, ttlMs);
    }

    try {
      await redisStore.setFlag(key, ttlMs);
    } catch (error) {
      noteRedisFailure("setFlag", error);
      await memoryStore.setFlag(key, ttlMs);
    }
  },
  async flagTtl(key) {
    if (!isDurableStoreConfigured) {
      return memoryStore.flagTtl(key);
    }

    try {
      return await redisStore.flagTtl(key);
    } catch (error) {
      noteRedisFailure("flagTtl", error);
      return memoryStore.flagTtl(key);
    }
  },
};
